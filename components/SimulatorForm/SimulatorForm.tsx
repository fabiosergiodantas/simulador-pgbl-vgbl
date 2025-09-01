'use client';

import { useState } from 'react';
import {
  Paper,
  Title,
  Grid,
  NumberInput,
  Select,
  Button,
  Group,
  Text,
  Stack,
  Divider,
  Alert,
  Box
} from '@mantine/core';
import { IconCalculator, IconInfoCircle } from '@tabler/icons-react';
import { SimulationInput } from '../../utils/pgblVgblCalculator';

interface SimulatorFormProps {
  onSimulate: (input: SimulationInput) => void;
  loading?: boolean;
}

export function SimulatorForm({ onSimulate, loading = false }: SimulatorFormProps) {
  const [formData, setFormData] = useState({
    rendaBrutaAnual: 120000,
    contribuicaoAnual: 12000,
    rentabilidadeAnual: 8,
    prazoAnos: 20,
    regimeTributacao: 'regressivo' as 'progressivo' | 'regressivo'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.rendaBrutaAnual || formData.rendaBrutaAnual <= 0) {
      newErrors.rendaBrutaAnual = 'Renda bruta anual deve ser maior que zero';
    }

    if (!formData.contribuicaoAnual || formData.contribuicaoAnual <= 0) {
      newErrors.contribuicaoAnual = 'Contribuição anual deve ser maior que zero';
    }

    if (formData.contribuicaoAnual > formData.rendaBrutaAnual) {
      newErrors.contribuicaoAnual = 'Contribuição não pode ser maior que a renda bruta';
    }

    if (!formData.rentabilidadeAnual || formData.rentabilidadeAnual < 0) {
      newErrors.rentabilidadeAnual = 'Rentabilidade deve ser maior ou igual a zero';
    }

    if (!formData.prazoAnos || formData.prazoAnos <= 0) {
      newErrors.prazoAnos = 'Prazo deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const input: SimulationInput = {
        ...formData,
        rentabilidadeAnual: formData.rentabilidadeAnual / 100 // converter para decimal
      };
      onSimulate(input);
    }
  };

  const percentualContribuicao = formData.rendaBrutaAnual > 0 
    ? (formData.contribuicaoAnual / formData.rendaBrutaAnual) * 100 
    : 0;

  const limiteDedução = formData.rendaBrutaAnual * 0.12;
  const podeDeduzirlntegralmente = formData.contribuicaoAnual <= limiteDedução;

  return (
    <Paper p="xl" radius="md" withBorder>
      <Stack gap="lg">
        <Group gap="sm">
          <IconCalculator size={24} />
          <Title order={2}>Simulador PGBL vs VGBL</Title>
        </Group>

        <Text size="sm" c="dimmed">
          Preencha os dados abaixo para comparar qual modalidade de previdência privada é mais vantajosa para o seu perfil.
        </Text>

        <Divider />

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Renda Bruta Anual"
              placeholder="120.000"
              value={formData.rendaBrutaAnual}
              onChange={(value) => setFormData(prev => ({ ...prev, rendaBrutaAnual: Number(value) || 0 }))}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              error={errors.rendaBrutaAnual}
              required
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Contribuição Anual"
              placeholder="12.000"
              value={formData.contribuicaoAnual}
              onChange={(value) => setFormData(prev => ({ ...prev, contribuicaoAnual: Number(value) || 0 }))}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              error={errors.contribuicaoAnual}
              required
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Rentabilidade Esperada (% ao ano)"
              placeholder="8"
              value={formData.rentabilidadeAnual}
              onChange={(value) => setFormData(prev => ({ ...prev, rentabilidadeAnual: Number(value) || 0 }))}
              suffix="%"
              decimalScale={2}
              error={errors.rentabilidadeAnual}
              required
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Prazo de Investimento (anos)"
              placeholder="20"
              value={formData.prazoAnos}
              onChange={(value) => setFormData(prev => ({ ...prev, prazoAnos: Number(value) || 0 }))}
              min={1}
              max={50}
              error={errors.prazoAnos}
              required
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Select
              label="Regime de Tributação"
              value={formData.regimeTributacao}
              onChange={(value) => setFormData(prev => ({ 
                ...prev, 
                regimeTributacao: value as 'progressivo' | 'regressivo' 
              }))}
              data={[
                { value: 'regressivo', label: 'Tabela Regressiva (recomendado para prazos longos)' },
                { value: 'progressivo', label: 'Tabela Progressiva (baseada na renda)' }
              ]}
              required
            />
          </Grid.Col>
        </Grid>

        {formData.rendaBrutaAnual > 0 && formData.contribuicaoAnual > 0 && (
          <Box>
            <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
              <Stack gap="xs">
                <Text size="sm">
                  <strong>Percentual de contribuição:</strong> {percentualContribuicao.toFixed(1)}% da renda bruta
                </Text>
                <Text size="sm">
                  <strong>Limite de dedução PGBL:</strong> R$ {limiteDedução.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (12% da renda)
                </Text>
                {!podeDeduzirlntegralmente && (
                  <Text size="sm" c="orange">
                    ⚠️ Sua contribuição excede o limite de dedução. Apenas R$ {limiteDedução.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} poderão ser deduzidos no PGBL.
                  </Text>
                )}
              </Stack>
            </Alert>
          </Box>
        )}

        <Group justify="center" mt="md">
          <Button
            size="lg"
            onClick={handleSubmit}
            loading={loading}
            leftSection={<IconCalculator size={20} />}
          >
            Simular Investimento
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}

