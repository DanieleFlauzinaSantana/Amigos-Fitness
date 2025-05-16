
// src/app/(app)/surveys/[id]/results/page.tsx
"use client";

import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Frown } from 'lucide-react';
import { MOCK_SURVEY } from '@/lib/constants'; // Assumindo uma única survey por enquanto
import { SimulatedSurveyResults } from '@/app/(app)/surveys/components/SimulatedSurveyResults';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SurveyResultsPage() {
  const router = useRouter();
  const params = useParams();
  const surveyId = params.id as string;

  // Em uma aplicação real, você buscaria a survey pelo ID.
  // Aqui, estamos usando a MOCK_SURVEY se o ID corresponder.
  const survey = surveyId === MOCK_SURVEY.id ? MOCK_SURVEY : null;

  if (!survey) {
    return (
      <div className="container mx-auto py-8 px-4">
        <PageHeader title="Pesquisa Não Encontrada" />
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <Frown className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            A pesquisa que você está tentando acessar não foi encontrada. Verifique o link ou contate o administrador.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button onClick={() => router.push('/surveys')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Pesquisas
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <PageHeader 
            title={`Resultados (Simulados): ${survey.title}`}
            description="Visualização de exemplo das respostas da pesquisa."
        />
        <Button onClick={() => router.push('/surveys')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Pesquisas
        </Button>
      </div>
      <SimulatedSurveyResults survey={survey} />
    </div>
  );
}
