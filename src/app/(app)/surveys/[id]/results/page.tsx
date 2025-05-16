
// src/app/(app)/surveys/[id]/results/page.tsx
"use client";

import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3 } from 'lucide-react'; // Importado BarChart3
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MOCK_SURVEY, MOCK_STUDENTS } from '@/lib/constants';
import { SimulatedSurveyResults } from '../components/SimulatedSurveyResults'; // Importado o componente

export default function SurveyResultsPage() {
  const router = useRouter();
  const params = useParams();
  const surveyId = params.id as string;
  const survey = surveyId === MOCK_SURVEY.id ? MOCK_SURVEY : null;

  if (!survey) {
    return (
      <div className="container mx-auto py-8 px-4">
        <PageHeader 
            title={"Resultados da Pesquisa"}
            description="Pesquisa não encontrada."
        />
        <Button onClick={() => router.push('/surveys')} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Pesquisas
        </Button>
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            A pesquisa para a qual você está tentando ver os resultados não foi encontrada.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Nota: As respostas individuais reais (se implementadas com backend)
  // seriam acessadas através do perfil do aluno.
  // A SimulatedSurveyResults abaixo usa dados totalmente fictícios para fins de demonstração.

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <PageHeader 
            title={`Resultados (Simulados): ${survey.title}`}
            description="Esta é uma visualização com dados de exemplo para ilustrar como os resultados poderiam ser apresentados."
        />
        <Button onClick={() => router.push('/surveys')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Pesquisas
        </Button>
      </div>
      
      <Alert className="mb-6">
        <BarChart3 className="h-4 w-4" />
        <AlertTitle>Dados Simulados</AlertTitle>
        <AlertDescription>
          Os gráficos e dados abaixo são gerados aleatoriamente para fins de demonstração. Em uma aplicação real, eles refletiriam as respostas reais dos seus alunos.
          Para ver a resposta de um aluno específico (se ele tiver respondido e os dados de exemplo estiverem configurados), acesse o perfil dele.
        </AlertDescription>
      </Alert>

      <SimulatedSurveyResults survey={survey} />
    </div>
  );
}
