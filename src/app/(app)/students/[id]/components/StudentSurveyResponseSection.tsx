
"use client";

import type { Student, SurveyAnswer } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Star, MessageSquare } from 'lucide-react';
import { MOCK_SURVEY } from '@/lib/constants'; // Para buscar os textos das perguntas
import Link from 'next/link';

interface StudentSurveyResponseSectionProps {
  student: Student;
}

const getQuestionText = (questionId: string) => {
  return MOCK_SURVEY.questions.find(q => q.id === questionId)?.text || questionId;
};

const formatAnswerValue = (answer: SurveyAnswer): string | React.ReactNode => {
  const question = MOCK_SURVEY.questions.find(q => q.id === answer.questionId);
  if (question?.type === 'rating') {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${Number(answer.value) > i ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
          />
        ))}
        <span className="ml-2">({answer.value}/5)</span>
      </div>
    );
  }
  return String(answer.value);
};

export function StudentSurveyResponseSection({ student }: StudentSurveyResponseSectionProps) {
  const { latestSurveyResponse } = student;

  if (!latestSurveyResponse) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-6 w-6 text-primary" /> Última Pesquisa Respondida
          </CardTitle>
          <CardDescription>O aluno ainda não respondeu nenhuma pesquisa.</CardDescription>
        </CardHeader>
        <CardContent>
           <Link href={`/surveys/${MOCK_SURVEY.id}/submit?studentId=${student.id}`} passHref>
             <span className="text-sm text-primary hover:underline">
                Enviar link da pesquisa para este aluno (simulado)
             </span>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const survey = MOCK_SURVEY; // Assumindo que só temos uma pesquisa por enquanto

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-6 w-6 text-primary" /> Última Pesquisa Respondida
        </CardTitle>
        <CardDescription>
          Feedback de {student.name} para a pesquisa "{survey.title}" em {new Date(latestSurveyResponse.submittedAt).toLocaleDateString('pt-BR')}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestSurveyResponse.answers.map((answer) => (
          <div key={answer.questionId} className="p-3 border rounded-md bg-muted/20">
            <p className="text-sm font-semibold text-foreground">{getQuestionText(answer.questionId)}</p>
            <div className="text-sm text-muted-foreground mt-1">{formatAnswerValue(answer)}</div>
          </div>
        ))}
         <Link href={`/surveys/${survey.id}/submit?studentId=${student.id}`} passHref>
             <span className="text-sm text-primary hover:underline">
                Ver/Editar resposta (simulado) ou Enviar novamente
             </span>
          </Link>
      </CardContent>
    </Card>
  );
}
