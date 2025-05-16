
// src/app/(app)/surveys/components/SimulatedSurveyResults.tsx
"use client";

import type { Survey, SurveyQuestion } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Star } from 'lucide-react';

interface SimulatedSurveyResultsProps {
  survey: Survey;
}

// Gerador de dados simulados simples
const generateSimulatedData = (questions: SurveyQuestion[]) => {
  const results: Record<string, any> = {};
  const totalRespondents = 50 + Math.floor(Math.random() * 50); // Entre 50 e 99 respondentes

  questions.forEach(q => {
    if (q.type === 'rating') {
      // Simula uma distribuição de notas para rating
      const ratings = [0, 0, 0, 0, 0];
      let sum = 0;
      for (let i = 0; i < totalRespondents; i++) {
        const rating = Math.floor(Math.random() * 3) + 3; // Tendência para notas mais altas (3, 4, 5)
        ratings[rating - 1]++;
        sum += rating;
      }
      results[q.id] = {
        average: (sum / totalRespondents).toFixed(1),
        distribution: ratings.map((count, index) => ({ name: `${index + 1} Estrela${index > 0 ? 's' : ''}`, count })),
        total: totalRespondents
      };
    } else if (q.type === 'multiple-choice' && q.options) {
      const counts: Record<string, number> = {};
      q.options.forEach(opt => counts[opt] = 0);
      for (let i = 0; i < totalRespondents; i++) {
        const choice = q.options[Math.floor(Math.random() * q.options.length)];
        counts[choice]++;
      }
      results[q.id] = Object.entries(counts).map(([name, count]) => ({ name, count }));
    } else if (q.type === 'text') {
      results[q.id] = [
        "Ótima academia, adoro os instrutores!",
        "Poderia ter mais equipamentos de cardio.",
        "Os vestiários estão sempre limpos.",
        "Sugiro aulas de yoga aos sábados.",
        "Tudo perfeito, continuem assim!",
        "Alguns armários estão com defeito.",
        "Adoraria um bebedouro com água gelada mais perto da área de musculação.",
        "Preço justo pela qualidade oferecida."
      ].slice(0, Math.floor(Math.random() * 5) + 3); // Entre 3 e 7 comentários
    }
  });
  return results;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82Ca9D'];

export function SimulatedSurveyResults({ survey }: SimulatedSurveyResultsProps) {
  const simulatedData = generateSimulatedData(survey.questions);

  return (
    <div className="space-y-6">
      {survey.questions.map(question => (
        <Card key={question.id}>
          <CardHeader>
            <CardTitle>{question.text}</CardTitle>
            <CardDescription>Resultados simulados para esta pergunta.</CardDescription>
          </CardHeader>
          <CardContent>
            {question.type === 'rating' && simulatedData[question.id] && (
              <div className="space-y-4">
                <p className="text-lg font-semibold">
                  Média de Avaliação: {simulatedData[question.id].average} <Star className="inline-block h-5 w-5 text-yellow-400 fill-yellow-400 mb-1" />
                  <span className="text-sm text-muted-foreground"> (de {simulatedData[question.id].total} respostas)</span>
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={simulatedData[question.id].distribution} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Número de Respostas" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {question.type === 'multiple-choice' && simulatedData[question.id] && (
               <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={simulatedData[question.id]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="name"
                  >
                    {simulatedData[question.id].map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
            {question.type === 'text' && simulatedData[question.id] && (
              <ul className="space-y-2 list-disc list-inside max-h-60 overflow-y-auto">
                {simulatedData[question.id].map((comment: string, index: number) => (
                  <li key={index} className="text-sm p-2 border-b last:border-b-0">{comment}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
