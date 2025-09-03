'use client';

import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Table,
  Badge,
  Divider,
  Tabs,
  Box,
  ThemeIcon
} from '@mantine/core';
import {
  IconInfoCircle,
  IconTrendingUp,
  IconClock
} from '@tabler/icons-react';

interface TaxationExplanationProps {
  className?: string;
}

export function TaxationExplanation({ className }: TaxationExplanationProps) {
  const tabelaProgressiva = [
    { baseCalculo: 'Até R$ 26.963,20', aliquota: 'Isento', deducao: 'R$ 0,00' },
    { baseCalculo: 'De R$ 26.963,21 a R$ 33.919,80', aliquota: '7,5%', deducao: 'R$ 2.022,24' },
    { baseCalculo: 'De R$ 33.919,81 a R$ 45.012,60', aliquota: '15%', deducao: 'R$ 4.566,23' },
    { baseCalculo: 'De R$ 45.012,61 a R$ 55.976,16', aliquota: '22,5%', deducao: 'R$ 7.942,17' },
    { baseCalculo: 'Acima de R$ 55.976,16', aliquota: '27,5%', deducao: 'R$ 10.740,98' }
  ];

  const tabelaRegressiva = [
    { prazo: 'Até 2 anos', aliquota: '35%' },
    { prazo: 'De 2 a 4 anos', aliquota: '30%' },
    { prazo: 'De 4 a 6 anos', aliquota: '25%' },
    { prazo: 'De 6 a 8 anos', aliquota: '20%' },
    { prazo: 'De 8 a 10 anos', aliquota: '15%' },
    { prazo: 'Acima de 10 anos', aliquota: '10%' }
  ];

  return (
    <Paper p="xl" radius="md" withBorder className={className}>
      <Stack gap="lg">
        <Group gap="sm">
          <IconInfoCircle size={24} />
          <Title order={2}>Entenda a Tributação da Previdência Privada</Title>
        </Group>

        <Text size="sm" c="dimmed">
          Conheça as duas modalidades de tributação disponíveis e escolha a mais adequada para seu perfil
        </Text>

        <Divider />

        <Tabs defaultValue="progressiva" variant="outline">
          <Tabs.List>
            <Tabs.Tab value="progressiva" leftSection={<IconTrendingUp size={16} />}>
              Tabela Progressiva
            </Tabs.Tab>
            <Tabs.Tab value="regressiva" leftSection={<IconClock size={16} />}>
              Tabela Regressiva
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="progressiva" pt="md">
            <Stack gap="md">
              <Box>
                <Title order={4} mb="sm">Tabela Progressiva do Imposto de Renda</Title>
                <Text size="sm" c="dimmed" mb="md">
                  A alíquota varia conforme a renda anual. Ideal para quem tem renda menor ou faz declaração completa do IR.
                </Text>
              </Box>

              <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Base de Cálculo (Anual)</Table.Th>
                    <Table.Th>Alíquota</Table.Th>
                    <Table.Th>Parcela a Deduzir</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {tabelaProgressiva.map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>
                        <Text size="sm" fw={500}>{item.baseCalculo}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge 
                          color={item.aliquota === 'Isento' ? 'green' : 'blue'} 
                          variant="light"
                        >
                          {item.aliquota}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{item.deducao}</Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              <Box>
                <Text size="sm" fw={500} mb="xs">Características da Tabela Progressiva:</Text>
                <Stack gap="xs">
                  <Text size="sm">• Alíquota varia de 0% a 27,5% conforme a renda</Text>
                  <Text size="sm">• Permite compensação com outras rendas tributáveis</Text>
                  <Text size="sm">• Ideal para rendas menores ou quem faz declaração completa</Text>
                  <Text size="sm">• Pode ser mais vantajosa para resgates menores</Text>
                </Stack>
              </Box>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="regressiva" pt="md">
            <Stack gap="md">
              <Box>
                <Title order={4} mb="sm">Tabela Regressiva da Previdência</Title>
                <Text size="sm" c="dimmed" mb="md">
                  A alíquota diminui conforme o tempo de permanência. Ideal para investimentos de longo prazo.
                </Text>
              </Box>

              <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Prazo de Permanência</Table.Th>
                    <Table.Th>Alíquota</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {tabelaRegressiva.map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>
                        <Text size="sm" fw={500}>{item.prazo}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge 
                          color={
                            item.aliquota === '10%' ? 'green' :
                            item.aliquota === '15%' ? 'teal' :
                            item.aliquota === '20%' ? 'blue' :
                            item.aliquota === '25%' ? 'yellow' :
                            item.aliquota === '30%' ? 'orange' : 'red'
                          } 
                          variant="light"
                        >
                          {item.aliquota}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              <Box>
                <Text size="sm" fw={500} mb="xs">Características da Tabela Regressiva:</Text>
                <Stack gap="xs">
                  <Text size="sm">• Alíquota diminui com o tempo, de 35% para 10%</Text>
                  <Text size="sm">• Não permite compensação com outras rendas</Text>
                  <Text size="sm">• Ideal para investimentos de longo prazo (10+ anos)</Text>
                  <Text size="sm">• Tributação definitiva na fonte</Text>
                  <Text size="sm">• Mais vantajosa para rendas maiores e prazos longos</Text>
                </Stack>
              </Box>
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <Box>
          <Title order={4} mb="sm">Como Escolher?</Title>
          <Stack gap="sm">
            <Group gap="xs" align="flex-start">
              <ThemeIcon size="sm" color="blue" variant="light">
                <IconTrendingUp size={12} />
              </ThemeIcon>
              <Text size="sm">
                <strong>Tabela Progressiva:</strong> Melhor para quem tem renda menor, 
                faz declaração completa do IR ou planeja resgates menores.
              </Text>
            </Group>
            
            <Group gap="xs" align="flex-start">
              <ThemeIcon size="sm" color="green" variant="light">
                <IconClock size={12} />
              </ThemeIcon>
              <Text size="sm">
                <strong>Tabela Regressiva:</strong> Ideal para investimentos de longo prazo, 
                rendas maiores ou quem quer tributação definitiva na fonte.
              </Text>
            </Group>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

