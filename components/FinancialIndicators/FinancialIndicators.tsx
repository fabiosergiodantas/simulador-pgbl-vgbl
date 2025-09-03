'use client';

import { useState } from 'react';
import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Table,
  Badge,
  Divider,
  Select,
  Box,
  ThemeIcon,
  Grid,
  Card
} from '@mantine/core';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
  IconChartLine,
  IconInfoCircle
} from '@tabler/icons-react';

import { 
  indicadoresFinanceiros, 
  calcularMediaIndicador
} from '@/utils/indicadoresFinanceiros';

interface FinancialIndicatorsProps {
  className?: string;
}

export function FinancialIndicators({ className }: FinancialIndicatorsProps) {
  const [periodoSelecionado, setPeriodoSelecionado] = useState<string>('5');
  
  const anoAtual = 2025;
  const anoInicio = anoAtual - parseInt(periodoSelecionado) + 1;

  const getTrendIcon = (valor: number) => {
    if (valor > 0) return <IconTrendingUp size={14} color="green" />;
    if (valor < 0) return <IconTrendingDown size={14} color="red" />;
    return <IconMinus size={14} color="gray" />;
  };

  const getTrendColor = (valor: number) => {
    if (valor > 0) return 'green';
    if (valor < 0) return 'red';
    return 'gray';
  };

  return (
    <Paper p="xl" radius="md" withBorder className={className}>
      <Stack gap="lg">
        <Group gap="sm">
          <IconChartLine size={24} />
          <Title order={2}>Indicadores Financeiros Históricos</Title>
        </Group>

        <Text size="sm" c="dimmed">
          Compare a rentabilidade esperada da sua previdência com os principais indicadores do mercado
        </Text>

        <Divider />

        <Group justify="space-between" align="center">
          <Text fw={500}>Período de análise:</Text>
          <Select
            value={periodoSelecionado}
            onChange={(value) => setPeriodoSelecionado(value || '5')}
            data={[
              { value: '5', label: 'Últimos 5 anos (2021-2025)' },
              { value: '10', label: 'Últimos 10 anos (2016-2025)' }
            ]}
            w={250}
          />
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, md: 12 }}>
            <Box style={{ overflowX: 'auto' }}>
              <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Indicador</Table.Th>
                    <Table.Th>Tipo</Table.Th>
                    <Table.Th>Média do Período</Table.Th>
                    <Table.Th>2025</Table.Th>
                    <Table.Th>2024</Table.Th>
                    <Table.Th>2023</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {indicadoresFinanceiros.map((indicador) => {
                    const media = calcularMediaIndicador(indicador.sigla, anoInicio, anoAtual);
                    const dados2025 = indicador.dadosHistoricos.find(d => d.ano === 2025)?.valor || 0;
                    const dados2024 = indicador.dadosHistoricos.find(d => d.ano === 2024)?.valor || 0;
                    const dados2023 = indicador.dadosHistoricos.find(d => d.ano === 2023)?.valor || 0;

                    return (
                      <Table.Tr key={indicador.sigla}>
                        <Table.Td>
                          <Stack gap="xs">
                            <Text size="sm" fw={500}>{indicador.sigla}</Text>
                            <Text size="xs" c="dimmed">{indicador.nome}</Text>
                          </Stack>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={
                              indicador.tipo === 'taxa' ? 'blue' :
                              indicador.tipo === 'indice' ? 'green' : 'orange'
                            } 
                            variant="light"
                          >
                            {indicador.tipo === 'taxa' ? 'Taxa' :
                             indicador.tipo === 'indice' ? 'Índice' : 'Inflação'}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            {getTrendIcon(media)}
                            <Text size="sm" fw={500} c={getTrendColor(media)}>
                              {media.toFixed(2)}%
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            {getTrendIcon(dados2025)}
                            <Text size="sm" c={getTrendColor(dados2025)}>
                              {dados2025.toFixed(2)}%
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            {getTrendIcon(dados2024)}
                            <Text size="sm" c={getTrendColor(dados2024)}>
                              {dados2024.toFixed(2)}%
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            {getTrendIcon(dados2023)}
                            <Text size="sm" c={getTrendColor(dados2023)}>
                              {dados2023.toFixed(2)}%
                            </Text>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Box>
          </Grid.Col>
        </Grid>

        <Box>
          <Title order={4} mb="sm">Sobre os Indicadores</Title>
          <Stack gap="xs">
            <Text size="sm">
              <strong>CDI:</strong> Taxa de referência para investimentos de renda fixa
            </Text>
            <Text size="sm">
              <strong>IPCA/IGP-M:</strong> Índices de inflação que impactam o poder de compra
            </Text>
            <Text size="sm">
              <strong>Poupança:</strong> Investimento mais tradicional e conservador
            </Text>
            <Text size="sm">
              <strong>Ibovespa:</strong> Representa o desempenho das principais ações brasileiras
            </Text>
          </Stack>
          
          <Divider my="md" />
          
          <Box>
            <Title order={5} mb="xs">Fontes Oficiais</Title>
            <Text size="xs" c="dimmed">
              <strong>CDI e Poupança:</strong> Banco Central do Brasil (Bacen) | 
              <strong> IPCA:</strong> Instituto Brasileiro de Geografia e Estatística (IBGE) | 
              <strong> IGP-M:</strong> Fundação Getúlio Vargas (FGV) | 
              <strong> Ibovespa:</strong> B3 S.A. - Brasil, Bolsa, Balcão
            </Text>
            <Text size="xs" c="dimmed" mt="xs">
              Dados atualizados até agosto/2025. Os valores de 2025 representam dados acumulados ou estimativas baseadas nos meses disponíveis.
            </Text>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}

