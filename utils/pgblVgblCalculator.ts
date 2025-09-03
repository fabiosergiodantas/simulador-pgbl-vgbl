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
  { limiteRendimento: 2428.80, aliquota: 0, parcelaDeduzir: 0 },
  { limiteRendimento: 2826.65, aliquota: 0.075, parcelaDeduzir: 182.95 },
  { limiteRendimento: 3751.05, aliquota: 0.15, parcelaDeduzir: 370.40 },
  { limiteRendimento: 4664.68, aliquota: 0.225, parcelaDeduzir: 651.73 },
  { limiteRendimento: Infinity, aliquota: 0.275, parcelaDeduzir: 884.96 }
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
  const baseCalculoMensal = baseCalculoAnual / 12;
  let impostoTotalMensal = 0;
  let baseCalculoAcumulada = 0;

  for (const faixa of tabelaProgressivaIR) {
    if (baseCalculoMensal > baseCalculoAcumulada) {
      const limiteFaixa = faixa.limiteRendimento === Infinity ? baseCalculoMensal : faixa.limiteRendimento;
      const valorNaFaixa = Math.min(baseCalculoMensal, limiteFaixa) - baseCalculoAcumulada;
      impostoTotalMensal += valorNaFaixa * faixa.aliquota;
      baseCalculoAcumulada += valorNaFaixa;
    }
  }
  return Math.max(0, impostoTotalMensal * 12); // Retorna o imposto anual, garantindo que não seja negativo
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
  
  // Economia fiscal anual do PGBL (baseada na alíquota marginal)
  const aliquotaMarginal = calcularAliquotaMarginal(rendaBrutaAnual);
  const economiaFiscalAnual = deducaoEfetiva * aliquotaMarginal;
  const economiaFiscalTotal = economiaFiscalAnual * prazoAnos;

  // Valor acumulado bruto (mesmo para PGBL e VGBL)
  const valorAcumuladoBruto = calcularValorFuturoSerie(contribuicaoAnual, rentabilidadeAnual, prazoAnos);
  
  // Cálculo do PGBL
  let impostoTotalPGBL: number;
  if (regimeTributacao === 'progressivo') {
    // Para PGBL, o imposto é sobre o valor total acumulado, mas a alíquota é da renda marginal
    // A economia fiscal é calculada com base na alíquota marginal da renda bruta anual do usuário
    // O imposto sobre o resgate do PGBL é sobre o valor total, mas a alíquota aplicada é a da faixa de renda do usuário
    impostoTotalPGBL = valorAcumuladoBruto * calcularAliquotaMarginal(rendaBrutaAnual);
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
    impostoTotalVGBL = rendimentos * calcularAliquotaMarginal(rendaBrutaAnual);
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

// Calcula a alíquota marginal do IR para uma renda anual
function calcularAliquotaMarginal(rendaAnual: number): number {
  const rendaMensal = rendaAnual / 12;
  let aliquotaMarginal = 0;
  for (const faixa of tabelaProgressivaIR) {
    if (rendaMensal > faixa.limiteRendimento) {
      aliquotaMarginal = faixa.aliquota;
    } else {
      break;
    }
  }
  return aliquotaMarginal;
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
  const economiaFiscalAnual = Math.min(input.contribuicaoAnual, input.rendaBrutaAnual * 0.12) * 
                              calcularAliquotaMarginal(input.rendaBrutaAnual);

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

