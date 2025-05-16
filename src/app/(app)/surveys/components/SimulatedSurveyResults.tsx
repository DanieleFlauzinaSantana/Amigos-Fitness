
// src/app/(app)/surveys/components/SimulatedSurveyResults.tsx
"use client";

import type { Survey, SurveyQuestion, SurveyAnswer } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Star, MessageCircle, CheckCircle, XCircle } from 'lucide-react';

interface SimulatedSurveyResultsProps {
  survey: Survey;
}

// Função para gerar dados fictícios de resposta
const generateMockAnswers = (questions: SurveyQuestion[]): SurveyAnswer[][] => {
  const responses: SurveyAnswer[][] = [];
  const numResponses = Math.floor(Math.random() * 30) + 20; // Entre 20 e 50 respostas

  for (let i = 0; i < numResponses; i++) {
    const singleResponse: SurveyAnswer[] = [];
    questions.forEach(q => {
      let value: string | number = '';
      switch (q.type) {
        case 'rating':
          value = Math.floor(Math.random() * 5) + 1;
          break;
        case 'text':
          const comments = ["Muito bom!", "Precisa melhorar.", "Adorei a aula de spinning.", "Equipamentos novos são ótimos.", "Poderia ter mais horários."];
          value = comments[Math.floor(Math.random() * comments.length)];
          break;
        case 'yes-no':
          value = Math.random() > 0.5 ? 'sim' : 'nao';
          break;
        case 'multiple-choice':
          if (q.options && q.options.length > 0) {
            value = q.options[Math.floor(Math.random() * q.options.length)];
          }
          break;
      }
      singleResponse.push({ questionId: q.id, value });
    });
    responses.push(singleResponse);
  }
  return responses;
};


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function SimulatedSurveyResults({ survey }: SimulatedSurveyResultsProps) {
  // Gerar respostas mockadas apenas uma vez no mount, para consistência na visualização
  const mockResponses = React.useMemo(() => generateMockAnswers(survey.questions), [survey.questions]);

  const processResults = (question: SurveyQuestion) => {
    const questionAnswers = mockResponses.map(responseSet => responseSet.find(ans => ans.questionId === question.id)?.value);

    if (question.type === 'rating') {
      const ratings = questionAnswers.filter(a => typeof a === 'number') as number[];
      const average = ratings.reduce((acc, val) => acc + val, 0) / ratings.length || 0;
      const counts = [1, 2, 3, 4, 5].map(star => ({
        name: `${star} Estrela${star > 1 ? 's' : ''}`,
        count: ratings.filter(r => r === star).length,
      }));
      return { type: 'rating', average: average.toFixed(1), counts, display: <Star className="h-4 w-4 text-yellow-400 inline-block mr-1"/> };
    }

    if (question.type === 'yes-no') {
      const yesCount = questionAnswers.filter(a => a === 'sim').length;
      const noCount = questionAnswers.filter(a => a === 'nao').length;
      const data = [
        { name: 'Sim', value: yesCount, icon: <CheckCircle className="h-4 w-4 text-green-500 inline-block mr-1"/> },
        { name: 'Não', value: noCount, icon: <XCircle className="h-4 w-4 text-red-500 inline-block mr-1"/> },
      ];
      return { type: 'pie', data, display: "Sim/Não" };
    }
    
    if (question.type === 'multiple-choice' && question.options) {
        const counts = question.options.map(option => ({
            name: option,
            count: questionAnswers.filter(ans => ans === option).length,
        }));
        return { type: 'bar', data: counts, display: "Múltipla Escolha" };
    }

    if (question.type === 'text') {
      const comments = questionAnswers.filter(a => typeof a === 'string' && a.trim() !== '') as string[];
      return { type: 'text', comments, display: <MessageCircle className="h-4 w-4 text-blue-500 inline-block mr-1" /> };
    }
    return { type: 'unknown', display: "Desconhecido" };
  };

  return (
    <div className="space-y-6">
      {survey.questions.map(question => {
        const result = processResults(question);
        return (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-lg">{question.text}</CardTitle>
              <CardDescription>Tipo: {result.display}</CardDescription>
            </CardHeader>
            <CardContent>
              {result.type === 'rating' && (
                <div>
                  <p className="mb-2">Média de Avaliação: <strong>{result.average} / 5</strong></p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={result.counts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis allowDecimals={false} />
                      <RechartsTooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              {result.type === 'bar' && result.data && (
                <ResponsiveContainer width="100%" height={200 + result.data.length * 20}>
                    <BarChart data={result.data} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis dataKey="name" type="category" width={150} fontSize={12} />
                        <RechartsTooltip />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
              )}
              {result.type === 'pie' && result.data && (
                 <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                    <Pie data={result.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {result.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                    </PieChart>
                </ResponsiveContainer>
              )}
              {result.type === 'text' && result.comments && (
                <ul className="list-disc pl-5 space-y-1 max-h-60 overflow-y-auto">
                  {result.comments.slice(0, 10).map((comment, i) => ( // Limita a 10 comentários para exibição
                    <li key={i} className="text-sm text-muted-foreground italic">"{comment}"</li>
                  ))}
                  {result.comments.length === 0 && <p className="text-sm text-muted-foreground">Nenhum comentário para esta pergunta.</p>}
                   {result.comments.length > 10 && <p className="text-sm text-muted-foreground">... e mais {result.comments.length - 10} comentários.</p>}
                </ul>
              )}
            </CardContent>
          </Card>
        );
      })}
      <p className="text-xs text-center text-muted-foreground">Total de Respostas Simuladas: {mockResponses.length}</p>
    </div>
  );
}
