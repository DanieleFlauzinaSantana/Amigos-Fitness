// src/app/(app)/surveys/page.tsx
"use client";

import Link from 'next/link';
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FileText, Edit3, BarChart3, Send } from 'lucide-react';
import { MOCK_SURVEY } from '@/lib/constants'; // A pesquisa de exemplo
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SurveysPage() {
  const survey = MOCK_SURVEY; // Por enquanto, trabalhamos apenas com uma pesquisa mockada

  if (!survey) {
    return (
      <div>
        <PageHeader title="Pesquisas" description="Nenhuma pesquisa ativa encontrada." />
        <Alert variant="destructive">
          <FileText className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Não foi possível carregar os dados da pesquisa.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const surveyId = survey.id; // Para usar nos links

  return (
    <div>
      <PageHeader 
        title="Gerenciamento de Pesquisas" 
        description="Visualize e gerencie as pesquisas de satisfação da sua academia."
      />
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center text-2xl">
                <FileText className="mr-3 h-7 w-7 text-primary" />
                {survey.title}
              </CardTitle>
              <CardDescription className="mt-1">{survey.description}</CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" disabled className="cursor-not-allowed opacity-50">
                    <Edit3 className="h-4 w-4" />
                    <span className="sr-only">Editar Perguntas</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edição de perguntas é feita no código (constants.ts)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Esta é a pesquisa de satisfação padrão do sistema. As perguntas podem ser ajustadas no código-fonte.
          </p>
          
          <div className="text-sm">
            <p className="font-medium">Número de Perguntas:</p>
            <p className="text-muted-foreground">{survey.questions.length}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/surveys/${surveyId}/results`}>
                <BarChart3 className="mr-2 h-4 w-4" /> Ver Respostas (Simulado)
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href={`/surveys/${surveyId}/submit`}>
                <Send className="mr-2 h-4 w-4" /> Responder Pesquisa / Abrir Formulário
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Alert variant="default" className="mt-8">
        <FileText className="h-4 w-4" />
        <AlertTitle>Observação sobre Edição e Múltiplas Pesquisas</AlertTitle>
        <AlertDescription>
          Atualmente, o sistema trabalha com uma única pesquisa de exemplo definida no código.
          Para editar perguntas ou criar múltiplas pesquisas com armazenamento dinâmico,
          seria necessário evoluir o sistema com um banco de dados para gerenciar
          as estruturas das pesquisas e suas respostas de forma mais flexível.
        </AlertDescription>
      </Alert>
    </div>
  );
}