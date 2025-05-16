"use client";

// This page structure assumes survey ID might be used to fetch survey details in a real app.
// For now, it uses the MOCK_SURVEY.
import { useParams, useRouter } from 'next/navigation';
import { SurveySubmissionForm } from '../../components/SurveySubmissionForm'; // Adjusted path
import { MOCK_SURVEY } from '@/lib/constants';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Survey } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


export default function SubmitSurveyPage() {
  const router = useRouter();
  const params = useParams();
  const surveyId = params.id as string;
  
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching survey data
    setIsLoading(true);
    setTimeout(() => {
      if (surveyId === MOCK_SURVEY.id) {
        setSurvey(MOCK_SURVEY);
      } else {
        // Handle survey not found
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
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-10 w-full mt-8" />
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
      <Button onClick={() => router.back()} variant="outline" className="mb-6 print:hidden">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>
      <SurveySubmissionForm survey={survey} />
    </div>
  );
}
