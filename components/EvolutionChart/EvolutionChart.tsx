'use client';

import { useState } from 'react';
import {
  Paper,
  Title,
  Group,
  Stack,
  Text,
  Badge,
  Box,
  Switch
} from '@mantine/core';
import { IconTrendingUp, IconChartLine } from '@tabler/icons-react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { 
  SimulationInput, 
  gerarDadosEvolucao, 
  formatarReal 
} from '@/utils/pgblVgblCalculator';

interface EvolutionChartProps {
  input: SimulationInput;
  className?: string;
}

export function EvolutionChart({ input, className }: EvolutionChartProps) {
  const [showGrossValues, setShowGrossValues] = useState(false);
  
  const dadosEvolucao = gerarDadosEvolucao(input);
  
  const [state] = useState({
    options: {
      chart: {
        redrawOnParentResize: true,
        type: 'line' as const,
        height: 400,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false
          }
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      stroke: {
        curve: 'smooth' as const,
        width: 3
      },
      colors: ['#228be6', '#7c3aed', '#15aabf', '#fd7e14'],
      xaxis: {
        categories: dadosEvolucao.map(d => `Ano ${d.ano}`),
        title: {
          text: 'Período (Anos)'
        }
      },
      yaxis: {
        title: {
          text: 'Valor Acumulado (R$)'
        },
        labels: {
          formatter: (value: number) => {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(value);
          }
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (value: number) => formatarReal(value)
        }
      },
      legend: {
        position: 'top' as const,
        horizontalAlign: 'center' as const
      },
      grid: {
        borderColor: '#e0e6ed',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      markers: {
        size: 4,
        hover: {
          size: 6
        }
      }
    } as ApexOptions
  });

  const getSeries = () => {
    if (showGrossValues) {
      return [
        {
          name: 'PGBL (Bruto)',
          data: dadosEvolucao.map(d => d.pgblBruto)
        },
        {
          name: 'VGBL (Bruto)',
          data: dadosEvolucao.map(d => d.vgblBruto)
        }
      ];
    } else {
      return [
        {
          name: 'PGBL (Líquido)',
          data: dadosEvolucao.map(d => d.pgblLiquido)
        },
        {
          name: 'VGBL (Líquido)',
          data: dadosEvolucao.map(d => d.vgblLiquido)
        },
        {
          name: 'PGBL + Economia Fiscal',
          data: dadosEvolucao.map(d => d.pgblLiquido + d.economiaFiscalAcumulada)
        }
      ];
    }
  };

  const valorFinalPGBL = dadosEvolucao[dadosEvolucao.length - 1];
  const pgblComEconomia = valorFinalPGBL.pgblLiquido + valorFinalPGBL.economiaFiscalAcumulada;
  const melhorOpcao = pgblComEconomia > valorFinalPGBL.vgblLiquido ? 'PGBL' : 'VGBL';

  return (
    <Paper p="xl" radius="md" withBorder className={className}>
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Group gap="sm">
            <IconChartLine size={24} />
            <Box>
              <Title order={2}>Evolução do Patrimônio</Title>
              <Text size="sm" c="dimmed">
                Comparação da evolução dos valores ao longo do tempo
              </Text>
            </Box>
          </Group>
          
          <Switch
            label="Mostrar valores brutos"
            checked={showGrossValues}
            onChange={(event) => setShowGrossValues(event.currentTarget.checked)}
          />
        </Group>

        <Box>
          <Chart
            options={state.options}
            series={getSeries()}
            type="line"
            height={400}
          />
        </Box>

        {!showGrossValues && (
          <Group justify="center" gap="xl">
            <Box ta="center">
              <Badge 
                size="lg" 
                color={melhorOpcao === 'PGBL' ? 'green' : 'gray'} 
                variant={melhorOpcao === 'PGBL' ? 'filled' : 'light'}
              >
                PGBL + Economia Fiscal
              </Badge>
              <Text size="lg" fw={700} mt="xs">
                {formatarReal(pgblComEconomia)}
              </Text>
            </Box>
            
            <Box ta="center">
              <Badge 
                size="lg" 
                color={melhorOpcao === 'VGBL' ? 'blue' : 'gray'} 
                variant={melhorOpcao === 'VGBL' ? 'filled' : 'light'}
              >
                VGBL Líquido
              </Badge>
              <Text size="lg" fw={700} mt="xs">
                {formatarReal(valorFinalPGBL.vgblLiquido)}
              </Text>
            </Box>
          </Group>
        )}

        <Box>
          <Text size="sm" c="dimmed" ta="center">
            {showGrossValues 
              ? 'Valores brutos não consideram impostos no resgate nem economia fiscal'
              : 'Valores líquidos já descontam os impostos. A linha "PGBL + Economia Fiscal" inclui o benefício da dedução no IR.'
            }
          </Text>
        </Box>
      </Stack>
    </Paper>
  );
}

