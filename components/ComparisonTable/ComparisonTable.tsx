'use client';

import {
  Paper,
  Title,
  Table,
  Text,
  Badge,
  Stack,
  Group,
  ThemeIcon,
  Box,
  Divider
} from '@mantine/core';
import {
  IconCheck,
  IconX,
  IconInfoCircle,
  IconCalculator,
  IconCoin,
  IconTrendingUp,
  IconFileText,
  IconClock,
  IconShield
} from '@tabler/icons-react';

interface ComparisonTableProps {
  className?: string;
}

export function ComparisonTable({ className }: ComparisonTableProps) {
  const comparisonData = [
    {
      category: 'Dedução no Imposto de Renda',
      icon: <IconFileText size={16} />,
      pgbl: {
        value: 'Até 12% da renda bruta anual',
        positive: true,
        description: 'Reduz a base de cálculo do IR'
      },
      vgbl: {
        value: 'Não permite dedução',
        positive: false,
        description: 'Sem benefício fiscal na contribuição'
      }
    },
    {
      category: 'Tributação no Resgate',
      icon: <IconCoin size={16} />,
      pgbl: {
        value: 'Sobre o valor total acumulado',
        positive: false,
        description: 'IR incide sobre contribuições + rendimentos'
      },
      vgbl: {
        value: 'Apenas sobre os rendimentos',
        positive: true,
        description: 'IR incide somente nos ganhos'
      }
    },
    {
      category: 'Perfil Ideal',
      icon: <IconTrendingUp size={16} />,
      pgbl: {
        value: 'Quem faz declaração completa',
        positive: true,
        description: 'Aproveita a dedução fiscal'
      },
      vgbl: {
        value: 'Declaração simplificada ou isento',
        positive: true,
        description: 'Não precisa de dedução fiscal'
      }
    },
    {
      category: 'Limite de Contribuição',
      icon: <IconShield size={16} />,
      pgbl: {
        value: 'Não há limite de contribuição, mas o benefício fiscal é limitado',
        positive: true,
        description: 'Você pode contribuir qualquer valor, mas apenas até 12% da sua renda bruta anual é dedutível do IR. O excedente não gera benefício fiscal.',
      },
      vgbl: {
        value: 'Sem limite',
        positive: true,
        description: 'Pode contribuir qualquer valor'
      }
    },
    {
      category: 'Prazo Recomendado',
      icon: <IconClock size={16} />,
      pgbl: {
        value: 'Longo prazo (10+ anos)',
        positive: true,
        description: 'Maximiza o benefício da dedução'
      },
      vgbl: {
        value: 'Qualquer prazo',
        positive: true,
        description: 'Flexível para diferentes objetivos'
      }
    },
    {
      category: 'Sucessão/Herança',
      icon: <IconInfoCircle size={16} />,
      pgbl: {
        value: 'Não entra no inventário',
        positive: true,
        description: 'Transmissão mais ágil aos beneficiários'
      },
      vgbl: {
        value: 'Não entra no inventário',
        positive: true,
        description: 'Transmissão mais ágil aos beneficiários'
      }
    }
  ];

  return (
    <Paper p="xl" radius="md" withBorder className={className}>
      <Stack gap="lg">
        <Group gap="sm">
          <IconCalculator size={24} />
          <Title order={2}>Comparativo PGBL vs VGBL</Title>
        </Group>

        <Text size="sm" c="dimmed">
          Entenda as principais diferenças entre as modalidades de previdência privada
        </Text>

        <Divider />

        <Box style={{ overflowX: 'auto' }}>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ minWidth: 200 }}>
                  <Text fw={600}>Características</Text>
                </Table.Th>
                <Table.Th style={{ minWidth: 250 }}>
                  <Group gap="xs">
                    <Badge color="blue" variant="filled">PGBL</Badge>
                    <Text fw={600} size="sm">Plano Gerador de Benefício Livre</Text>
                  </Group>
                </Table.Th>
                <Table.Th style={{ minWidth: 250 }}>
                  <Group gap="xs">
                    <Badge color="indigo" variant="filled">VGBL</Badge>
                    <Text fw={600} size="sm">Vida Gerador de Benefício Livre</Text>
                  </Group>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {comparisonData.map((item, index) => (
                <Table.Tr key={index}>
                  <Table.Td>
                    <Group gap="xs">
                      <ThemeIcon size="sm" variant="light" color="gray">
                        {item.icon}
                      </ThemeIcon>
                      <Text fw={500} size="sm">{item.category}</Text>
                    </Group>
                  </Table.Td>
                  
                  <Table.Td>
                    <Stack gap="xs">
                      <Group gap="xs">
                        <ThemeIcon 
                          size="xs" 
                          color={item.pgbl.positive ? 'green' : 'red'} 
                          variant="light"
                        >
                          {item.pgbl.positive ? <IconCheck size={12} /> : <IconX size={12} />}
                        </ThemeIcon>
                        <Text size="sm" fw={500}>{item.pgbl.value}</Text>
                      </Group>
                      <Text size="xs" c="dimmed">{item.pgbl.description}</Text>
                    </Stack>
                  </Table.Td>
                  
                  <Table.Td>
                    <Stack gap="xs">
                      <Group gap="xs">
                        <ThemeIcon 
                          size="xs" 
                          color={item.vgbl.positive ? 'green' : 'red'} 
                          variant="light"
                        >
                          {item.vgbl.positive ? <IconCheck size={12} /> : <IconX size={12} />}
                        </ThemeIcon>
                        <Text size="sm" fw={500}>{item.vgbl.value}</Text>
                      </Group>
                      <Text size="xs" c="dimmed">{item.vgbl.description}</Text>
                    </Stack>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>

        <Box>
          <Title order={4} mb="sm">Resumo das Recomendações</Title>
          <Stack gap="sm">
            <Group gap="xs" align="flex-start">
              <Badge color="blue" variant="light">PGBL</Badge>
              <Text size="sm">
                <strong>Ideal para:</strong> Quem faz declaração completa do IR, tem renda alta, 
                contribui regularmente e planeja investir por longo prazo (10+ anos).
              </Text>
            </Group>
            
            <Group gap="xs" align="flex-start">
              <Badge color="indigo" variant="light">VGBL</Badge>
              <Text size="sm">
                <strong>Ideal para:</strong> Quem faz declaração simplificada, é isento do IR, 
                quer flexibilidade nas contribuições ou planeja deixar herança.
              </Text>
            </Group>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

