
"use client";

import type { Student, SurveyAnswer } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Star, MessageSquare, Copy, Send } from 'lucide-react';
import { MOCK_SURVEY } from '@/lib/constants'; // Para buscar os textos das perguntas
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const surveyLinkForStudent = `${window.location.origin}/surveys/${MOCK_SURVEY.id}/submit?studentId=${student.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyLinkForStudent);
    toast({
      title: 'Link Copiado!',
      description: 'O link da pesquisa para este aluno foi copiado para a área de transferência.',
    });
  };

  if (!latestSurveyResponse) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-6 w-6 text-primary" /> Última Pesquisa Respondida
          </CardTitle>
          <CardDescription>O aluno ainda não respondeu nenhuma pesquisa.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
           <p className="text-sm text-muted-foreground">
            Envie o link abaixo para o aluno responder:
           </p>
           <div className="flex items-center space-x-2">
            <Link href={surveyLinkForStudent} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate flex-grow">
                {surveyLinkForStudent}
            </Link>
            <Button variant="outline" size="icon" onClick={handleCopyLink} title="Copiar link">
                <Copy className="h-4 w-4" />
            </Button>
           </div>
            <Button onClick={() => window.open(surveyLinkForStudent, '_blank')} size="sm" className="w-full">
                <Send className="mr-2 h-4 w-4" /> Abrir Link da Pesquisa (Simular Envio)
            </Button>
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
             <Button variant="link" className="p-0 h-auto text-sm">
                Ver/Editar resposta (simulado) ou Enviar novamente
             </Button>
          </Link>
      </CardContent>
    </Card>
  );
}
