// Tipos para os cálculos de PGBL/VGBL
export interface SimulationInput {
  rendaBrutaAnual: number;
  contribuicaoAnual: number;
  rentabilidadeAnual: number; // em decimal (ex: 0.08 para 8%)
  prazoAnos: number;
  regimeTributacao: 'progressivo' | 'regressivo';
}

export interface SimulationResult {
  pgbl: {
    valorAcumuladoBruto: number;
    valorAcumuladoLiquido: number;
    impostoTotal: number;
    economiaFiscalAnual: number;
    economiaFiscalTotal: number;
  };
  vgbl: {
    valorAcumuladoBruto: number;
    valorAcumuladoLiquido: number;
    impostoTotal: number;
  };
  recomendacao: 'PGBL' | 'VGBL';
  vantagem: number; // diferença em reais
}

// Tabela progressiva do IR (2024) - Baseado em rendimento mensal
const tabelaProgressivaIR = [
  { limiteRendimento: 26963.20, aliquota: 0, parcelaDeduzir: 0 },
  { limiteRendimento: 33919.80, aliquota: 0.075, parcelaDeduzir: 2022.24 },
  { limiteRendimento: 45012.60, aliquota: 0.15, parcelaDeduzir: 4566.23 },
  { limiteRendimento: 55976.16, aliquota: 0.225, parcelaDeduzir: 7942.17 },
  { limiteRendimento: Infinity, aliquota: 0.275, parcelaDeduzir: 10740.98 }
];

// Tabela regressiva para previdência
const tabelaRegressiva = [
  { anos: 0, aliquota: 0.35 },
  { anos: 2, aliquota: 0.30 },
  { anos: 4, aliquota: 0.25 },
  { anos: 6, aliquota: 0.20 },
  { anos: 8, aliquota: 0.15 },
  { anos: 10, aliquota: 0.10 }
];

// Calcula o imposto pela tabela progressiva
function calcularImpostoProgressivo(baseCalculoAnual: number): number {
  let impostoAnual = 0;
  let aliquotaAplicavel = 0;
  let parcelaDeduzirAplicavel = 0;

  for (const faixa of tabelaProgressivaIR) {
    if (baseCalculoAnual <= faixa.limiteRendimento) {
      aliquotaAplicavel = faixa.aliquota;
      parcelaDeduzirAplicavel = faixa.parcelaDeduzir;
      break;
    }
  }

  impostoAnual = (baseCalculoAnual * aliquotaAplicavel) - parcelaDeduzirAplicavel;
  return Math.max(0, impostoAnual); // Retorna o imposto anual, garantindo que não seja negativo
}

// Calcula o imposto pela tabela regressiva
function calcularImpostoRegressivo(valor: number, anos: number): number {
  let aliquota = 0.35; // padrão para menos de 2 anos
  
  for (let i = tabelaRegressiva.length - 1; i >= 0; i--) {
    if (anos >= tabelaRegressiva[i].anos) {
      aliquota = tabelaRegressiva[i].aliquota;
      break;
    }
  }
  
  return valor * aliquota;
}

// Calcula o valor futuro com juros compostos
function calcularValorFuturo(valorPresente: number, taxa: number, periodos: number): number {
  return valorPresente * Math.pow(1 + taxa, periodos);
}

// Calcula o valor futuro de uma série de pagamentos (anuidade)
function calcularValorFuturoSerie(pagamento: number, taxa: number, periodos: number): number {
  if (taxa === 0) return pagamento * periodos;
  return pagamento * ((Math.pow(1 + taxa, periodos) - 1) / taxa);
}

// Função principal de simulação
export function simularPGBLvsVGBL(input: SimulationInput): SimulationResult {
  const {
    rendaBrutaAnual,
    contribuicaoAnual,
    rentabilidadeAnual,
    prazoAnos,
    regimeTributacao
  } = input;

  // Limite de dedução PGBL (12% da renda bruta)
  const limiteDedução = rendaBrutaAnual * 0.12;
  const deducaoEfetiva = Math.min(contribuicaoAnual, limiteDedução);
  
  // Economia fiscal anual do PGBL (baseada no novo cálculo de benefício fiscal)
  const { beneficioFiscal: economiaFiscalAnual, aliquotaEfetiva: aliquotaEfetivaPGBL } = calcularBeneficioFiscal(rendaBrutaAnual, contribuicaoAnual);
  console.log('Economia Fiscal Anual:', economiaFiscalAnual);
  console.log('Alíquota Efetiva PGBL:', aliquotaEfetivaPGBL);
  const economiaFiscalTotal = economiaFiscalAnual * prazoAnos;

  // Valor acumulado bruto (mesmo para PGBL e VGBL)
  const valorAcumuladoBruto = calcularValorFuturoSerie(contribuicaoAnual, rentabilidadeAnual, prazoAnos);
  
  // Cálculo do PGBL
  let impostoTotalPGBL: number;
  if (regimeTributacao === 'progressivo') {
    // Para PGBL, o imposto é sobre o valor total acumulado, mas a alíquota é da renda marginal
    // A economia fiscal é calculada com base na alíquota marginal da renda bruta anual do usuário
    // O imposto sobre o resgate do PGBL é sobre o valor total, mas a alíquota aplicada é a da faixa de renda do usuário
    impostoTotalPGBL = calcularImpostoProgressivo(valorAcumuladoBruto);
  } else {
    impostoTotalPGBL = calcularImpostoRegressivo(valorAcumuladoBruto, prazoAnos);
  }
  
  const valorLiquidoPGBL = valorAcumuladoBruto - impostoTotalPGBL;

  // Cálculo do VGBL
  const totalContribuicoes = contribuicaoAnual * prazoAnos;
  const rendimentos = valorAcumuladoBruto - totalContribuicoes;
  
  let impostoTotalVGBL: number;
  if (regimeTributacao === 'progressivo') {
    // Para VGBL, o imposto é sobre os rendimentos, e a alíquota aplicada é a da faixa de renda do usuário
    impostoTotalVGBL = calcularImpostoProgressivo(rendimentos);
  } else {
    impostoTotalVGBL = calcularImpostoRegressivo(rendimentos, prazoAnos);
  }
  
  const valorLiquidoVGBL = valorAcumuladoBruto - impostoTotalVGBL;

  // Determinar recomendação
  const valorLiquidoPGBLComEconomia = valorLiquidoPGBL + economiaFiscalTotal;
  const recomendacao = valorLiquidoPGBLComEconomia > valorLiquidoVGBL ? 'PGBL' : 'VGBL';
  const vantagem = Math.abs(valorLiquidoPGBLComEconomia - valorLiquidoVGBL);

  return {
    pgbl: {
      valorAcumuladoBruto,
      valorAcumuladoLiquido: valorLiquidoPGBL,
      impostoTotal: impostoTotalPGBL,
      economiaFiscalAnual,
      economiaFiscalTotal
    },
    vgbl: {
      valorAcumuladoBruto,
      valorAcumuladoLiquido: valorLiquidoVGBL,
      impostoTotal: impostoTotalVGBL
    },
    recomendacao,
    vantagem
  };
}

// Calcula o benefício fiscal do PGBL
function calcularBeneficioFiscal(rendaBrutaAnual: number, aporteAnual: number): {
  beneficioFiscal: number;
  aliquotaEfetiva: number;
} {
  let beneficioFiscal = 0;
  const limiteDeducao = rendaBrutaAnual * 0.12;
  const aporteEfetivo = Math.min(aporteAnual, limiteDeducao);

  // Se não há aporte efetivo, não há benefício fiscal
  if (aporteEfetivo <= 0) {
    return {
      beneficioFiscal: 0,
      aliquotaEfetiva: 0
    };
  }

  // Encontrar a faixa de IR da renda bruta anual
  let indiceFaixaRenda = -1;
  for (let i = 0; i < tabelaProgressivaIR.length; i++) {
    if (rendaBrutaAnual <= tabelaProgressivaIR[i].limiteRendimento) {
      indiceFaixaRenda = i;
      break;
    }
  }

  // Se a renda bruta anual está abaixo da primeira faixa tributável, não há benefício fiscal
  if (indiceFaixaRenda === 0 && tabelaProgressivaIR[0].aliquota === 0) {
    return {
      beneficioFiscal: 0,
      aliquotaEfetiva: 0
    };
  }

  let aporteRestante = aporteEfetivo;
  for (let i = indiceFaixaRenda; i >= 0 && aporteRestante > 0; i--) {
    const faixaAtual = tabelaProgressivaIR[i];
    const limiteInferiorFaixa = i > 0 ? tabelaProgressivaIR[i - 1].limiteRendimento : 0;

    // Base de cálculo na faixa atual antes da dedução
    const baseNaFaixa = Math.max(0, Math.min(rendaBrutaAnual, faixaAtual.limiteRendimento) - limiteInferiorFaixa);

    // Quanto do aporte efetivo pode ser deduzido nesta faixa
    const deducaoNestaFaixa = Math.min(aporteRestante, baseNaFaixa);

    beneficioFiscal += deducaoNestaFaixa * faixaAtual.aliquota;
    aporteRestante -= deducaoNestaFaixa;
  }

  const aliquotaEfetiva = beneficioFiscal / aporteEfetivo;

  return {
    beneficioFiscal,
    aliquotaEfetiva
  };
}

// Função para gerar dados para gráfico de evolução
export function gerarDadosEvolucao(input: SimulationInput): Array<{
  ano: number;
  pgblBruto: number;
  pgblLiquido: number;
  vgblBruto: number;
  vgblLiquido: number;
  economiaFiscalAcumulada: number;
}> {
  const dados = [];
  const { beneficioFiscal: economiaFiscalAnual } = calcularBeneficioFiscal(input.rendaBrutaAnual, input.contribuicaoAnual);

  for (let ano = 1; ano <= input.prazoAnos; ano++) {
    const valorBruto = calcularValorFuturoSerie(input.contribuicaoAnual, input.rentabilidadeAnual, ano);
    
    // PGBL
    let impostoPGBL: number;
    if (input.regimeTributacao === 'progressivo') {
      impostoPGBL = calcularImpostoProgressivo(valorBruto);
    } else {
      impostoPGBL = calcularImpostoRegressivo(valorBruto, ano);
    }
    
    // VGBL
    const totalContribuicoes = input.contribuicaoAnual * ano;
    const rendimentos = valorBruto - totalContribuicoes;
    let impostoVGBL: number;
    if (input.regimeTributacao === 'progressivo') {
      impostoVGBL = calcularImpostoProgressivo(rendimentos);
    } else {
      impostoVGBL = calcularImpostoRegressivo(rendimentos, ano);
    }

    dados.push({
      ano,
      pgblBruto: valorBruto,
      pgblLiquido: valorBruto - impostoPGBL,
      vgblBruto: valorBruto,
      vgblLiquido: valorBruto - impostoVGBL,
      economiaFiscalAcumulada: economiaFiscalAnual * ano
    });
  }

  return dados;
}

// Função para formatar valores em reais
export function formatarReal(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

// Função para formatar percentual
export function formatarPercentual(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

