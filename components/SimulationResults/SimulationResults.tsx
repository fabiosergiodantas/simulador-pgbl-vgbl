'use client';

import {
  Paper,
  Title,
  Grid,
  Text,
  Badge,
  Group,
  Stack,
  Divider,
  Alert,
  Card,
  ThemeIcon,
  Box,
  SimpleGrid
} from '@mantine/core';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconCheck,
  IconX,
  IconInfoCircle,
  IconPigMoney,
  IconCalculator
} from '@tabler/icons-react';
import { SimulationResult, formatarReal, formatarPercentual } from '../../utils/pgblVgblCalculator';

interface SimulationResultsProps {
  result: SimulationResult;
  input: {
    rendaBrutaAnual: number;
    contribuicaoAnual: number;
    rentabilidadeAnual: number;
    prazoAnos: number;
    regimeTributacao: 'progressivo' | 'regressivo';
  };
}

export function SimulationResults({ result, input }: SimulationResultsProps) {
  const valorTotalContribuicoes = input.contribuicaoAnual * input.prazoAnos;
  const pgblComEconomia = result.pgbl.valorAcumuladoLiquido + result.pgbl.economiaFiscalTotal;
  
  return (
    <Stack gap="lg">
      {/* Recomendação Principal */}
      <Alert
        icon={<IconCheck size={20} />}
        color={result.recomendacao === 'PGBL' ? 'green' : 'blue'}
        variant="filled"
        radius="md"
      >
        <Group justify="space-between" align="center">
          <Box>
            <Text size="lg" fw={700}>
              Recomendação: {result.recomendacao}
            </Text>
            <Text size="sm" opacity={0.9}>
              Vantagem de {formatarReal(result.vantagem)} em relação à outra opção
            </Text>
          </Box>
          <ThemeIcon size="xl" variant="white" color={result.recomendacao === 'PGBL' ? 'green' : 'blue'}>
            <IconTrendingUp size={24} />
          </ThemeIcon>
        </Group>
      </Alert>

      {/* Comparativo Principal */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {/* PGBL */}
        <Card
          padding="lg"
          radius="md"
          withBorder
          style={{
            borderColor: result.recomendacao === 'PGBL' ? 'var(--mantine-color-green-6)' : undefined,
            borderWidth: result.recomendacao === 'PGBL' ? 2 : 1
          }}
        >
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Title order={3} c="blue">PGBL</Title>
              {result.recomendacao === 'PGBL' && (
                <Badge color="green" variant="filled">Recomendado</Badge>
              )}
            </Group>

            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Valor Acumulado Bruto:</Text>
                <Text size="sm" fw={500}>{formatarReal(result.pgbl.valorAcumuladoBruto)}</Text>
              </Group>
              
              <Group justify="space-between">
                <Text size="sm" c="dimmed">(-) Imposto no Resgate:</Text>
                <Text size="sm" c="red">{formatarReal(result.pgbl.impostoTotal)}</Text>
              </Group>
              
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Valor Líquido:</Text>
                <Text size="sm" fw={500}>{formatarReal(result.pgbl.valorAcumuladoLiquido)}</Text>
              </Group>
              
              <Group justify="space-between">
                <Text size="sm" c="dimmed">(+) Economia Fiscal Total:</Text>
                <Text size="sm" c="green" fw={500}>{formatarReal(result.pgbl.economiaFiscalTotal)}</Text>
              </Group>
              
              <Divider />
              
              <Group justify="space-between">
                <Text fw={700}>Total Final:</Text>
                <Text fw={700} size="lg" c="blue">
                  {formatarReal(pgblComEconomia)}
                </Text>
              </Group>
            </Stack>
          </Stack>
        </Card>

        {/* VGBL */}
        <Card
          padding="lg"
          radius="md"
          withBorder
          style={{
            borderColor: result.recomendacao === 'VGBL' ? 'var(--mantine-color-blue-6)' : undefined,
            borderWidth: result.recomendacao === 'VGBL' ? 2 : 1
          }}
        >
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Title order={3} c="indigo">VGBL</Title>
              {result.recomendacao === 'VGBL' && (
                <Badge color="blue" variant="filled">Recomendado</Badge>
              )}
            </Group>

            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Valor Acumulado Bruto:</Text>
                <Text size="sm" fw={500}>{formatarReal(result.vgbl.valorAcumuladoBruto)}</Text>
              </Group>
              
              <Group justify="space-between">
                <Text size="sm" c="dimmed">(-) Imposto sobre Rendimentos:</Text>
                <Text size="sm" c="red">{formatarReal(result.vgbl.impostoTotal)}</Text>
              </Group>
              
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Economia Fiscal:</Text>
                <Text size="sm" c="gray">Não aplicável</Text>
              </Group>
              
              <Group justify="space-between">
                <Text size="sm" c="dimmed"></Text>
                <Text size="sm"></Text>
              </Group>
              
              <Divider />
              
              <Group justify="space-between">
                <Text fw={700}>Total Final:</Text>
                <Text fw={700} size="lg" c="indigo">
                  {formatarReal(result.vgbl.valorAcumuladoLiquido)}
                </Text>
              </Group>
            </Stack>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Detalhes Adicionais */}
      <Paper p="md" radius="md" withBorder>
        <Title order={4} mb="md">Detalhes da Simulação</Title>
        
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          <Box>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Total Investido</Text>
            <Text size="lg" fw={500}>{formatarReal(valorTotalContribuicoes)}</Text>
          </Box>
          
          <Box>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Rentabilidade Total</Text>
            <Text size="lg" fw={500} c="green">
              {formatarPercentual(((result.pgbl.valorAcumuladoBruto / valorTotalContribuicoes) - 1))}
            </Text>
          </Box>
          
          <Box>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Economia Fiscal Anual (PGBL)</Text>
            <Text size="lg" fw={500} c="green">{formatarReal(result.pgbl.economiaFiscalAnual)}</Text>
          </Box>
          
          <Box>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Regime de Tributação</Text>
            <Text size="lg" fw={500}>{input.regimeTributacao === 'progressivo' ? 'Progressivo' : 'Regressivo'}</Text>
          </Box>
        </SimpleGrid>
      </Paper>

      {/* Explicação */}
      <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
        <Stack gap="xs">
          <Text size="sm" fw={500}>Por que {result.recomendacao} é mais vantajoso?</Text>
          
          {result.recomendacao === 'PGBL' ? (
            <Stack gap="xs">
              <Text size="sm">
                • <strong>Dedução fiscal:</strong> Você pode deduzir até 12% da sua renda bruta anual, 
                gerando uma economia de {formatarReal(result.pgbl.economiaFiscalAnual)} por ano.
              </Text>
              <Text size="sm">
                • <strong>Economia total:</strong> Ao longo de {input.prazoAnos} anos, a economia fiscal 
                acumulada será de {formatarReal(result.pgbl.economiaFiscalTotal)}.
              </Text>
              <Text size="sm">
                • <strong>Resultado:</strong> Mesmo pagando imposto sobre o valor total no resgate, 
                o benefício fiscal compensa a diferença tributária.
              </Text>
            </Stack>
          ) : (
            <Stack gap="xs">
              <Text size="sm">
                • <strong>Tributação menor:</strong> No VGBL, o imposto incide apenas sobre os rendimentos, 
                não sobre o valor total acumulado.
              </Text>
              <Text size="sm">
                • <strong>Flexibilidade:</strong> Não há limite de contribuição para dedução, 
                pois não há benefício fiscal no IR.
              </Text>
              <Text size="sm">
                • <strong>Resultado:</strong> Para o seu perfil, a menor tributação no resgate 
                supera o benefício da dedução fiscal do PGBL.
              </Text>
            </Stack>
          )}
        </Stack>
      </Alert>
    </Stack>
  );
}

