
// src/app/(app)/surveys/[id]/results/page.tsx
"use client";

import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MOCK_SURVEY } from '@/lib/constants';

export default function SurveyResultsPage() {
  const router = useRouter();
  const params = useParams();
  const surveyId = params.id as string;
  const survey = surveyId === MOCK_SURVEY.id ? MOCK_SURVEY : null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <PageHeader 
            title={survey ? `Resultados: ${survey.title}` : "Resultados da Pesquisa"}
            description="Informações sobre as respostas da pesquisa."
        />
        <Button onClick={() => router.push('/surveys')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Pesquisas
        </Button>
      </div>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Visualização de Resultados</AlertTitle>
        <AlertDescription>
          Atualmente, as respostas da pesquisa são usadas internamente para alimentar a IA de previsão de desistência e podem ser visualizadas no perfil individual do aluno (se ele tiver respondido).
          Uma visualização agregada e detalhada de todas as respostas não está implementada nesta versão.
          Para ver a resposta de um aluno específico, acesse o perfil dele.
        </AlertDescription>
      </Alert>
    </div>
  );
}
