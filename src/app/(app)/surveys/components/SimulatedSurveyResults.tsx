
// src/app/(app)/surveys/components/SimulatedSurveyResults.tsx
"use client";

import type { Survey, SurveyQuestion } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Star } from 'lucide-react';
import * as React from 'react';

interface SimulatedSurveyResultsProps {
  survey: Survey;
}

// Dados de exemplo para simulação (mais respostas)
const SIMULATED_RESPONSES_COUNT = 25; // Número de respostas simuladas

const generateSimulatedData = (question: SurveyQuestion) => {
  const data = [];
  if (question.type === 'rating') {
    const counts: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    let sum = 0;
    for (let i = 0; i < SIMULATED_RESPONSES_COUNT; i++) {
      const rating = Math.floor(Math.random() * 5) + 1;
      counts[rating.toString()]++;
      sum += rating;
    }
    for (const rating in counts) {
      data.push({ name: `${rating} Estrela(s)`, value: counts[rating] });
    }
    const average = sum / SIMULATED_RESPONSES_COUNT;
    return { data, average: average.toFixed(1) };
  } else if (question.type === 'yes-no') {
    const yesCount = Math.floor(Math.random() * (SIMULATED_RESPONSES_COUNT / 2)) + Math.floor(SIMULATED_RESPONSES_COUNT / 3) ; // Biased towards 'yes'
    const noCount = SIMULATED_RESPONSES_COUNT - yesCount;
    data.push({ name: 'Sim', value: yesCount });
    data.push({ name: 'Não', value: noCount });
    return { data };
  } else if (question.type === 'multiple-choice' && question.options) {
    const counts: Record<string, number> = {};
    question.options.forEach(opt => counts[opt] = 0);
    for (let i = 0; i < SIMULATED_RESPONSES_COUNT; i++) {
      const choice = question.options[Math.floor(Math.random() * question.options.length)];
      counts[choice]++;
    }
    for (const option in counts) {
      data.push({ name: option, value: counts[option] });
    }
    return { data };
  } else if (question.type === 'text') {
    const comments = [
      "Muito bom!", "Poderia melhorar a limpeza.", "Adorei os equipamentos novos.",
      "Instrutores atenciosos.", "Horário das aulas de spinning é ruim.", "Excelente custo-benefício.",
      "Gostaria de mais variedade de aulas.", "Nada a reclamar.", "Ambiente agradável.", "Ótimo!"
    ];
    for (let i = 0; i < Math.min(SIMULATED_RESPONSES_COUNT, 5) ; i++) { // Limitar a 5 comentários de exemplo
      data.push({ comment: comments[Math.floor(Math.random() * comments.length)] });
    }
    return { data };
  }
  return { data: [] };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82Ca9D'];

export function SimulatedSurveyResults({ survey }: SimulatedSurveyResultsProps) {
  return (
    <div className="space-y-6">
      {survey.questions.map(question => {
        const { data, average } = generateSimulatedData(question);
        
        return (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle>{question.text}</CardTitle>
              {average && <CardDescription>Média de Avaliação: {average} <Star className="inline-block h-4 w-4 text-yellow-400 fill-yellow-400 mb-1" /></CardDescription>}
            </CardHeader>
            <CardContent>
              {question.type === 'rating' && data.length > 0 && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Respostas" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {(question.type === 'yes-no' || (question.type === 'multiple-choice' && question.options)) && data.length > 0 && (
                 <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                    </PieChart>
                </ResponsiveContainer>
              )}
              {question.type === 'text' && data.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Alguns Comentários (Exemplos):</h4>
                  <ul className="list-disc list-inside pl-4 space-y-1 text-xs text-muted-foreground">
                    {(data as { comment: string }[]).map((item, index) => (
                      <li key={index}>{item.comment}</li>
                    ))}
                  </ul>
                </div>
              )}
               {data.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma resposta simulada para esta pergunta.</p>}
            </CardContent>
          </Card>
        );
      })}
       <p className="text-xs text-center text-muted-foreground pt-4">
        Total de respostas simuladas para esta visualização: {SIMULATED_RESPONSES_COUNT}.
      </p>
    </div>
  );
}
