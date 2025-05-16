
// src/app/(app)/surveys/components/SurveySubmissionForm.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter }      from 'next/navigation';
import type { Survey, SurveyAnswer, SurveyQuestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';
import { MOCK_STUDENTS } from '@/lib/constants'; // Para simular a associação ao estudante

interface SurveySubmissionFormProps {
  survey: Survey;
  studentId?: string | null; // studentId from query param
}

export function SurveySubmissionForm({ survey, studentId }: SurveySubmissionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [studentName, setStudentName] = useState<string | null>(null);

  useEffect(() => {
    if (studentId) {
      const student = MOCK_STUDENTS.find(s => s.id === studentId);
      if (student) {
        setStudentName(student.name);
      }
    }
  }, [studentId]);


  const handleInputChange = (questionId: string, value: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const surveyAnswers: SurveyAnswer[] = Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value,
    }));

    const submissionData = {
      surveyId: survey.id,
      studentId: studentId || undefined,
      submittedAt: new Date().toISOString(),
      answers: surveyAnswers,
    };
    
    console.log("Submitting survey:", submissionData);

    // Simulação: Se studentId existir, tentar atualizar o MOCK_STUDENTS (isso não persistirá na realidade sem backend)
    if (studentId) {
        const studentIndex = MOCK_STUDENTS.findIndex(s => s.id === studentId);
        if (studentIndex !== -1) {
            MOCK_STUDENTS[studentIndex].latestSurveyResponse = submissionData;
            console.log(`Simulação: Resposta da pesquisa associada ao aluno ${MOCK_STUDENTS[studentIndex].name}`);
        }
    }


    await new Promise(resolve => setTimeout(resolve, 1000)); 

    toast({
      title: "Pesquisa Enviada!",
      description: "Obrigado pelo seu feedback.",
    });
    setIsLoading(false);
    
    router.push(studentId ? `/students/${studentId}` : '/surveys');
  };

  const renderQuestionInput = (question: SurveyQuestion) => {
    const currentValue = answers[question.id];
    switch (question.type) {
      case 'rating':
        return (
          <div className="flex space-x-1 py-1">
            {[1, 2, 3, 4, 5].map(rate => (
              <Button
                key={rate}
                type="button"
                variant={currentValue === rate ? 'default' : 'outline'}
                size="icon"
                onClick={() => handleInputChange(question.id, rate)}
                className="rounded-full h-8 w-8 sm:h-10 sm:w-10" // Tamanho ajustado
                aria-label={`Avaliação ${rate} de 5`}
              >
                <Star className={`h-4 w-4 sm:h-5 sm:w-5 ${currentValue === rate || (typeof currentValue === 'number' && currentValue >= rate) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
              </Button>
            ))}
          </div>
        );
      case 'text':
        return (
          <Textarea
            id={question.id}
            value={(currentValue as string) || ''}
            onChange={e => handleInputChange(question.id, e.target.value)}
            rows={3}
            placeholder="Sua resposta aqui..."
          />
        );
      case 'yes-no':
        return (
          <RadioGroup
            value={(currentValue as string) || ''}
            onValueChange={value => handleInputChange(question.id, value)}
            className="flex space-x-4 pt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id={`${question.id}-sim`} />
              <Label htmlFor={`${question.id}-sim`}>Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id={`${question.id}-nao`} />
              <Label htmlFor={`${question.id}-nao`}>Não</Label>
            </div>
          </RadioGroup>
        );
      case 'multiple-choice':
         return (
          <RadioGroup
            value={(currentValue as string) || ''}
            onValueChange={value => handleInputChange(question.id, value)}
            className="space-y-1 pt-1"
          >
            {question.options?.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-8 shadow-lg">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-2xl">{survey.title}</CardTitle>
        <CardDescription className="text-md">{survey.description}</CardDescription>
        {studentName && <CardDescription className="text-sm text-primary pt-1">Respondendo como: {studentName} (ID: {studentId})</CardDescription>}
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8 py-6">
          {survey.questions.map(question => (
            <div key={question.id} className="space-y-2 p-4 border rounded-lg bg-background shadow-sm">
              <Label htmlFor={question.id} className="text-base font-medium block">{question.text}</Label>
              {renderQuestionInput(question)}
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full text-lg py-3" size="lg" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar Respostas"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
