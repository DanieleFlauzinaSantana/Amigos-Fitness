
// src/app/(app)/surveys/[id]/submit/page.tsx
"use client";

import { useParams, useSearchParams } from 'next/navigation';
import { SurveySubmissionForm } from '@/app/(app)/surveys/components/SurveySubmissionForm';
import { MOCK_SURVEY } from '@/lib/constants'; 
import { PageHeader } from '@/components/layout/PageHeader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frown } from 'lucide-react';
import { getStudentsFromLocalStorage, saveStudentsToLocalStorage } from '@/lib/localStorageUtils';
import type { Student, SurveyResponse } from '@/lib/types';

export default function SurveySubmitPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const surveyId = params.id as string;
  const studentId = searchParams.get('studentId');

  const surveyToSubmit = surveyId === MOCK_SURVEY.id ? MOCK_SURVEY : null;

  const handleSurveySubmitted = (surveyResponse: SurveyResponse) => {
    if (studentId) {
      const students = getStudentsFromLocalStorage();
      const studentIndex = students.findIndex(s => s.id === studentId);
      if (studentIndex !== -1) {
        students[studentIndex].latestSurveyResponse = surveyResponse;
        saveStudentsToLocalStorage(students);
        console.log(`Simulação: Resposta da pesquisa associada ao aluno ${students[studentIndex].name} e salva no localStorage.`);
      }
    }
  };

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
      <SurveySubmissionForm 
        survey={surveyToSubmit} 
        studentId={studentId} 
        onSurveySubmitted={handleSurveySubmitted} 
      />
    </div>
  );
}
