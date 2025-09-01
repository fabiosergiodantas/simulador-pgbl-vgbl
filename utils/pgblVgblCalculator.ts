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

// Tabela progressiva do IR (2024)
const tabelaProgressiva = [
  { min: 0, max: 24511.92, aliquota: 0 },
  { min: 24511.93, max: 33919.80, aliquota: 0.075 },
  { min: 33919.81, max: 45012.60, aliquota: 0.15 },
  { min: 45012.61, max: 55976.16, aliquota: 0.225 },
  { min: 55976.17, max: Infinity, aliquota: 0.275 }
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
function calcularImpostoProgressivo(valor: number): number {
  let imposto = 0;
  
  for (const faixa of tabelaProgressiva) {
    if (valor > faixa.min) {
      const baseCalculo = Math.min(valor, faixa.max) - faixa.min;
      imposto += baseCalculo * faixa.aliquota;
    }
  }
  
  return imposto;
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

// Calcula a alíquota marginal do IR para uma renda
function calcularAliquotaMarginal(renda: number): number {
  for (const faixa of tabelaProgressiva) {
    if (renda >= faixa.min && renda <= faixa.max) {
      return faixa.aliquota;
    }
  }
  return 0.275; // alíquota máxima
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

