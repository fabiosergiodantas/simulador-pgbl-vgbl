'use client';

import { useState } from 'react';

import {
  Box,
  Container,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core';
import { IconCalculator, IconPigMoney } from '@tabler/icons-react';

import { ComparisonTable } from '@/components/ComparisonTable/ComparisonTable';
import { EvolutionChart } from '@/components/EvolutionChart/EvolutionChart';
import { FinancialIndicators } from '@/components/FinancialIndicators/FinancialIndicators';
import { SimulationResults } from '@/components/SimulationResults/SimulationResults';
import { SimulatorForm } from '@/components/SimulatorForm/SimulatorForm';
import { TaxationExplanation } from '@/components/TaxationExplanation/TaxationExplanation';
import { 
  SimulationInput, 
  SimulationResult, 
  simularPGBLvsVGBL 
} from '@/utils/pgblVgblCalculator';

export default function HomePage() {
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [currentInput, setCurrentInput] = useState<SimulationInput | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async (input: SimulationInput) => {
    setLoading(true);
    
    // Simular um pequeno delay para melhor UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const result = simularPGBLvsVGBL(input);
      setSimulationResult(result);
      setCurrentInput(input);
    } catch (error) {
      console.error('Erro na simulação:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Simulador PGBL vs VGBL - Previdência Privada</title>
      <meta
        name="description"
        content="Simulador para comparar PGBL e VGBL e descobrir qual modalidade de previdência privada é mais vantajosa para o seu perfil"
      />
      
      <Container size="xl" py="xl">
        <Stack gap="xl">
          {/* Header */}
          <Box ta="center">
            <Group justify="center" gap="md" mb="md">
              <ThemeIcon size="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                <IconPigMoney size={32} />
              </ThemeIcon>
              <Title order={1} size="h1">
                Simulador PGBL vs VGBL
              </Title>
            </Group>
            
            <Text size="lg" c="dimmed" maw={600} mx="auto">
              Descubra qual modalidade de previdência privada é mais vantajosa para o seu perfil. 
              Compare PGBL e VGBL considerando sua renda, contribuições e regime de tributação.
            </Text>
          </Box>

          <Divider />

          {/* Formulário */}
          <SimulatorForm onSimulate={handleSimulate} loading={loading} />

          {/* Resultados */}
          {simulationResult && currentInput && (
            <>
              <Divider />
              <Box>
                <Group gap="sm" mb="lg">
                  <IconCalculator size={24} />
                  <Title order={2}>Resultados da Simulação</Title>
                </Group>
                
                <Grid gutter="xl">
                  <Grid.Col span={12}>
                    <SimulationResults 
                      result={simulationResult} 
                      input={currentInput}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={12}>
                    <EvolutionChart input={currentInput} />
                  </Grid.Col>
                </Grid>
              </Box>
            </>
          )}

          <Divider />

          {/* Tabela Comparativa */}
          <ComparisonTable />

          <Divider my="xl" />
          
          <TaxationExplanation />

          <Divider my="xl" />
          
          <FinancialIndicators />
        </Stack>
      </Container>
    </>
  );
}

