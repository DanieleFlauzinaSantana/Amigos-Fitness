
// src/app/(app)/surveys/[id]/submit/page.tsx
"use client";

import { useParams, useSearchParams } from 'next/navigation';
import { SurveySubmissionForm } from '@/app/(app)/surveys/components/SurveySubmissionForm';
import { MOCK_SURVEY } from '@/lib/constants'; 
import { PageHeader } from '@/components/layout/PageHeader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frown } from 'lucide-react';

export default function SurveySubmitPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const surveyId = params.id as string;
  const studentId = searchParams.get('studentId');

  const surveyToSubmit = surveyId === MOCK_SURVEY.id ? MOCK_SURVEY : null;

  if (!surveyToSubmit) {
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
        </div>
    );
  }

  return (
    <div className="container mx-auto">
      <SurveySubmissionForm survey={surveyToSubmit} studentId={studentId} />
    </div>
  );
}
