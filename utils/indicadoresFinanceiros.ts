// Dados históricos dos principais indicadores financeiros brasileiros (2015-2024)
// Fonte: Banco Central, B3, IBGE

export interface IndicadorFinanceiro {
  nome: string;
  sigla: string;
  tipo: 'taxa' | 'indice' | 'inflacao';
  descricao: string;
  dadosHistoricos: {
    ano: number;
    valor: number; // em percentual ao ano
  }[];
}

export const indicadoresFinanceiros: IndicadorFinanceiro[] = [
  {
    nome: 'Certificado de Depósito Interbancário',
    sigla: 'CDI',
    tipo: 'taxa',
    descricao: 'Taxa de referência para investimentos de renda fixa no Brasil',
    dadosHistoricos: [
      { ano: 2015, valor: 13.26 },
      { ano: 2016, valor: 14.00 },
      { ano: 2017, valor: 9.93 },
      { ano: 2018, valor: 6.42 },
      { ano: 2019, valor: 5.96 },
      { ano: 2020, valor: 2.75 },
      { ano: 2021, valor: 4.40 },
      { ano: 2022, valor: 12.39 },
      { ano: 2023, valor: 12.25 },
      { ano: 2024, valor: 10.88 },
      { ano: 2025, valor: 9.15 } // Acumulado até agosto/2025
    ]
  },
  {
    nome: 'Índice Nacional de Preços ao Consumidor Amplo',
    sigla: 'IPCA',
    tipo: 'inflacao',
    descricao: 'Índice oficial de inflação do Brasil',
    dadosHistoricos: [
      { ano: 2015, valor: 10.67 },
      { ano: 2016, valor: 6.29 },
      { ano: 2017, valor: 2.95 },
      { ano: 2018, valor: 3.75 },
      { ano: 2019, valor: 4.31 },
      { ano: 2020, valor: 4.52 },
      { ano: 2021, valor: 10.06 },
      { ano: 2022, valor: 5.79 },
      { ano: 2023, valor: 4.62 },
      { ano: 2024, valor: 4.83 },
      { ano: 2025, valor: 3.26 } // Acumulado até julho/2025
    ]
  },
  {
    nome: 'Índice Geral de Preços do Mercado',
    sigla: 'IGP-M',
    tipo: 'inflacao',
    descricao: 'Índice de inflação calculado pela FGV',
    dadosHistoricos: [
      { ano: 2015, valor: 10.54 },
      { ano: 2016, valor: 7.17 },
      { ano: 2017, valor: -0.52 },
      { ano: 2018, valor: 7.54 },
      { ano: 2019, valor: 7.31 },
      { ano: 2020, valor: 23.14 },
      { ano: 2021, valor: 17.78 },
      { ano: 2022, valor: 11.64 },
      { ano: 2023, valor: -4.57 },
      { ano: 2024, valor: 4.11 },
      { ano: 2025, valor: -1.35 } // Acumulado até agosto/2025
    ]
  },
  {
    nome: 'Poupança',
    sigla: 'POUPANÇA',
    tipo: 'taxa',
    descricao: 'Rendimento da caderneta de poupança',
    dadosHistoricos: [
      { ano: 2015, valor: 8.07 },
      { ano: 2016, valor: 8.30 },
      { ano: 2017, valor: 6.61 },
      { ano: 2018, valor: 4.62 },
      { ano: 2019, valor: 4.26 },
      { ano: 2020, valor: 2.11 },
      { ano: 2021, valor: 2.92 },
      { ano: 2022, valor: 7.90 },
      { ano: 2023, valor: 8.20 },
      { ano: 2024, valor: 7.40 },
      { ano: 2025, valor: 8.07 } // Estimativa baseada na média dos primeiros 8 meses
    ]
  },
  {
    nome: 'Índice Bovespa',
    sigla: 'IBOVESPA',
    tipo: 'indice',
    descricao: 'Principal índice de ações da bolsa brasileira',
    dadosHistoricos: [
      { ano: 2015, valor: -13.31 },
      { ano: 2016, valor: 38.93 },
      { ano: 2017, valor: 26.86 },
      { ano: 2018, valor: 15.03 },
      { ano: 2019, valor: 31.58 },
      { ano: 2020, valor: 2.92 },
      { ano: 2021, valor: -11.93 },
      { ano: 2022, valor: 4.69 },
      { ano: 2023, valor: 21.17 },
      { ano: 2024, valor: -10.36 },
      { ano: 2025, valor: 7.85 } // Estimativa baseada na performance até agosto/2025
    ]
  }
];

// Função para obter dados de um indicador específico
export function obterDadosIndicador(sigla: string): IndicadorFinanceiro | undefined {
  return indicadoresFinanceiros.find(indicador => indicador.sigla === sigla);
}

// Função para calcular a média de um indicador em um período
export function calcularMediaIndicador(sigla: string, anoInicio: number, anoFim: number): number {
  const indicador = obterDadosIndicador(sigla);
  if (!indicador) return 0;

  const dadosPeriodo = indicador.dadosHistoricos.filter(
    dado => dado.ano >= anoInicio && dado.ano <= anoFim
  );

  if (dadosPeriodo.length === 0) return 0;

  const soma = dadosPeriodo.reduce((acc, dado) => acc + dado.valor, 0);
  return soma / dadosPeriodo.length;
}

// Função para obter sugestões de rentabilidade baseadas nos indicadores
export function obterSugestoesRentabilidade(): {
  conservador: number;
  moderado: number;
  arrojado: number;
} {
  const mediaCDI = calcularMediaIndicador('CDI', 2020, 2024); // Últimos 5 anos
  const mediaIPCA = calcularMediaIndicador('IPCA', 2020, 2024);
  
  return {
    conservador: Math.round((mediaCDI * 0.8) * 100) / 100, // 80% do CDI
    moderado: Math.round((mediaCDI * 1.1) * 100) / 100, // 110% do CDI
    arrojado: Math.round((mediaCDI * 1.5) * 100) / 100, // 150% do CDI
  };
}

