
// src/app/(app)/surveys/[id]/results/page.tsx
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MOCK_SURVEY } from '@/lib/constants';
import type { Survey } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { SimulatedSurveyResults } from '../../components/SimulatedSurveyResults'; // Novo componente

export default function SurveyResultsPage() {
  const router = useRouter();
  const params = useParams();
  const surveyId = params.id as string;
  
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (surveyId === MOCK_SURVEY.id) {
        setSurvey(MOCK_SURVEY);
      } else {
        router.push('/surveys');
      }
      setIsLoading(false);
    }, 300);
  }, [surveyId, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button onClick={() => router.back()} variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <Skeleton className="h-12 w-3/4 mb-2" />
        <Skeleton className="h-8 w-full mb-8" />
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!survey) {
     return (
      <div className="container mx-auto py-8 px-4">
        <PageHeader title="Pesquisa não encontrada" />
        <p>A pesquisa que você está tentando acessar não foi encontrada.</p>
        <Button onClick={() => router.push('/surveys')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Pesquisas
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <PageHeader 
            title={`Resultados Simulados: ${survey.title}`}
            description="Visualização de como os dados da pesquisa poderiam ser agregados."
        />
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>
      <SimulatedSurveyResults survey={survey} />
    </div>
  );
}
