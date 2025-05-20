"use client";

import type { Student, SurveyAnswer } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Star, Copy, Send, AlertTriangle } from 'lucide-react';
import { MOCK_SURVEY } from '@/lib/constants'; // Para buscar os textos das perguntas
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import React from 'react';

interface StudentSurveyResponseSectionProps {
  student: Student;
}

const getQuestionText = (questionId: string) => {
  const question = MOCK_SURVEY.questions.find(q => q.id === questionId);
  return question?.text || questionId;
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
  if (question?.type === 'yes-no') {
    return String(answer.value).toLowerCase() === 'sim' ? 'Sim' : 'Não';
  }
  return String(answer.value);
};

export function StudentSurveyResponseSection({ student }: StudentSurveyResponseSectionProps) {
  const { latestSurveyResponse } = student;
  const { toast } = useToast();
  const [surveyLinkForStudent, setSurveyLinkForStudent] = React.useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined' && student && student.id && MOCK_SURVEY && MOCK_SURVEY.id) {
      setSurveyLinkForStudent(`${window.location.origin}/surveys/${MOCK_SURVEY.id}/submit?studentId=${student.id}`);
    }
  }, [student]);


  const handleCopyLink = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(surveyLinkForStudent)
        .then(() => {
          toast({
            title: 'Link Copiado!',
            description: 'O link da pesquisa para este aluno foi copiado para a área de transferência.',
          });
        })
        .catch(err => {
          console.error('Falha ao copiar o link: ', err);
          toast({
            variant: 'destructive',
            title: 'Falha ao Copiar',
            description: 'Não foi possível copiar o link automaticamente. Por favor, copie manualmente.',
          });
        });
    } else {
      console.warn('API da área de transferência não suportada ou contexto inseguro.');
      toast({
        variant: 'destructive',
        title: 'Cópia Automática Indisponível',
        description: 'Seu navegador não suporta a cópia automática neste contexto. Por favor, copie o link manualmente.',
      });
    }
  };

  if (!latestSurveyResponse) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-6 w-6 text-primary" /> Pesquisa de Satisfação
          </CardTitle>
          <CardDescription>O aluno ainda não respondeu a esta pesquisa.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
           <p className="text-sm text-muted-foreground">
            Para o aluno responder, você pode enviar o link abaixo ou clicar para abrir o formulário:
           </p>
           {surveyLinkForStudent ? (
            <>
              <div className="p-3 border rounded-md bg-muted/20 break-all shadow-inner">
                <Link
                    href={surveyLinkForStudent}
                    className="text-sm text-primary hover:underline font-mono"
                    prefetch={false}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Link para a pesquisa ${MOCK_SURVEY.title} para ${student.name}`}
                >
                    {surveyLinkForStudent}
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={handleCopyLink} className="flex-grow">
                    <Copy className="mr-2 h-4 w-4" /> Copiar Link
                </Button>
                <Button asChild size="sm" variant="default" className="flex-grow">
                    <Link href={surveyLinkForStudent} prefetch={false} target="_blank" rel="noopener noreferrer">
                        <Send className="mr-2 h-4 w-4" /> Abrir Formulário
                    </Link>
                </Button>
              </div>
            </>
           ) : (
            <p className="text-xs text-muted-foreground">Gerando link da pesquisa...</p>
           )}
        </CardContent>
      </Card>
    );
  }

  // Se o aluno já respondeu
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-6 w-6 text-primary" /> Última Pesquisa Respondida
        </CardTitle>
        <CardDescription>
          Feedback de {student.name} para a pesquisa "{MOCK_SURVEY.title}" em {new Date(latestSurveyResponse.submittedAt).toLocaleDateString('pt-BR')}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestSurveyResponse.answers.map((answer) => (
          <div key={answer.questionId} className="p-3 border rounded-md bg-muted/20 shadow-sm">
            <p className="text-sm font-semibold text-foreground">{getQuestionText(answer.questionId)}</p>
            <div className="text-sm text-muted-foreground mt-1">{formatAnswerValue(answer)}</div>
          </div>
        ))}
         {surveyLinkForStudent && ( 
            <Button asChild variant="link" className="p-0 h-auto text-sm mt-3">
                <Link href={surveyLinkForStudent} passHref prefetch={false} target="_blank" rel="noopener noreferrer">
                    Responder novamente ou Ver formulário
                </Link>
            </Button>
         )}
      </CardContent>
    </Card>
  );
}
