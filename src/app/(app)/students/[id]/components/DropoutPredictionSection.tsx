
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { predictDropout, type PredictDropoutInput, type PredictDropoutOutput } from '@/ai/flows/predict-dropout';
import type { Student, DropoutPredictionResult, SurveyFeedbackForAI } from '@/lib/types';
import { TrendingUp, TrendingDown, AlertTriangle, Sparkles, Lightbulb, ListChecks } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { MOCK_SURVEY } from '@/lib/constants'; // Para mapear IDs de perguntas

interface DropoutPredictionSectionProps {
  student: Student;
}

// Helper para extrair feedback relevante da pesquisa para a IA
const extractSurveyFeedbackForAI = (student: Student): SurveyFeedbackForAI | undefined => {
  if (!student.latestSurveyResponse) {
    return undefined;
  }
  const { answers } = student.latestSurveyResponse;
  const feedback: SurveyFeedbackForAI = {};

  // Mapeie as respostas para os campos esperados pela IA
  // Estes IDs ('q1', 'q4', 'q5') são baseados na MOCK_SURVEY.
  // Se a estrutura da pesquisa mudar, isso precisará ser ajustado.
  const satisfactionAnswer = answers.find(a => a.questionId === 'q1'); // Nível de satisfação
  if (satisfactionAnswer && typeof satisfactionAnswer.value === 'number') {
    feedback.overallSatisfaction = satisfactionAnswer.value;
  }

  const recommendAnswer = answers.find(a => a.questionId === 'q4'); // Indicaria
  if (recommendAnswer && typeof recommendAnswer.value === 'string') {
    feedback.likelihoodToRecommend = recommendAnswer.value;
  }

  const commentsAnswer = answers.find(a => a.questionId === 'q5'); // Comentários
  if (commentsAnswer && typeof commentsAnswer.value === 'string') {
    feedback.comments = commentsAnswer.value;
    // Você pode querer separar comentários positivos/negativos aqui se a IA for treinada para isso.
  }
  
  return Object.keys(feedback).length > 0 ? feedback : undefined;
};


export function DropoutPredictionSection({ student }: DropoutPredictionSectionProps) {
  const [prediction, setPrediction] = useState<DropoutPredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredictDropout = async () => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    const surveyFeedback = extractSurveyFeedbackForAI(student);

    const input: PredictDropoutInput = {
      attendanceRecords: student.attendance.map(att => ({
        date: att.date,
        attended: att.attended,
      })),
      profileData: {
        age: student.dateOfBirth ? new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear() : 30, 
        fitnessGoals: student.mainGoal || "Não especificado", // Usando mainGoal
        membershipType: student.membershipType,
      },
      surveyFeedback: surveyFeedback, // Adicionando o feedback da pesquisa
    };

    try {
      const result: PredictDropoutOutput = await predictDropout(input);
      setPrediction(result);
    } catch (e) {
      console.error("Erro na predição de desistência:", e);
      setError("Falha ao obter a predição. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevel = (risk: number): { text: string; color: string; icon: JSX.Element } => {
    if (risk < 0.3) return { text: "Baixo Risco", color: "text-green-600 dark:text-green-400", icon: <TrendingDown className="h-5 w-5" /> };
    if (risk < 0.7) return { text: "Médio Risco", color: "text-yellow-600 dark:text-yellow-400", icon: <AlertTriangle className="h-5 w-5" /> };
    return { text: "Alto Risco", color: "text-red-600 dark:text-red-400", icon: <TrendingUp className="h-5 w-5" /> };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><Sparkles className="mr-2 h-6 w-6 text-primary" /> Previsão de Desistência (IA)</CardTitle>
        <CardDescription>Analise o risco de desistência do aluno com base em seus dados, frequência e feedback da pesquisa.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handlePredictDropout} disabled={isLoading}>
          {isLoading ? "Analisando..." : "Analisar Risco de Desistência"}
        </Button>

        {isLoading && <p>Processando predição, por favor aguarde...</p>}
        {error && <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
        
        {prediction && (
          <Card className="bg-background shadow-inner">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className={`flex items-center gap-2 ${getRiskLevel(prediction.dropoutRisk).color}`}>
                        {getRiskLevel(prediction.dropoutRisk).icon}
                        Risco de Desistência: {getRiskLevel(prediction.dropoutRisk).text} ({(prediction.dropoutRisk * 100).toFixed(0)}%)
                    </CardTitle>
                </div>
                <Progress value={prediction.dropoutRisk * 100} className="w-full h-3 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-2 flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />Motivos Potenciais:</h4>
                {prediction.reasons.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {prediction.reasons.map((reason, index) => <li key={index}>{reason}</li>)}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum motivo específico identificado.</p>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 flex items-center"><ListChecks className="mr-2 h-5 w-5 text-green-500" />Recomendações:</h4>
                 {prediction.recommendations.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {prediction.recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma recomendação específica no momento.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
