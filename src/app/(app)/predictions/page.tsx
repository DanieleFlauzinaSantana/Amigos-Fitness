
// src/app/(app)/predictions/page.tsx
"use client";

import Link from 'next/link';
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { AlertTriangle, Users, Sparkles } from 'lucide-react';

export default function PredictionsPage() {
  return (
    <div>
      <PageHeader 
        title="Previsão de Desistência (IA)" 
        description="Entenda como a inteligência artificial ajuda a identificar alunos em risco."
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-6 w-6 text-primary" />
            Como Funciona a Previsão de Desistência
          </CardTitle>
          <CardDescription>
            A análise de risco de desistência é uma ferramenta poderosa para ajudar na retenção de alunos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            A inteligência artificial analisa diversos fatores do perfil e histórico do aluno para calcular uma probabilidade de ele deixar a academia. Esses fatores incluem:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-4">
            <li>Padrões de frequência (faltas recentes, faltas consecutivas, diminuição da frequência).</li>
            <li>Dados do perfil do aluno (idade, tipo de plano, objetivos).</li>
            <li>Feedback fornecido em pesquisas de satisfação (se disponível e respondido).</li>
          </ul>
          <p className="text-muted-foreground">
            Com base nessa análise, a IA fornece um nível de risco (baixo, médio ou alto), os motivos potenciais para esse risco e recomendações de ações que você pode tomar.
          </p>
          <div className="bg-accent/10 p-4 rounded-lg">
            <h4 className="font-semibold text-lg text-accent-foreground mb-2 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" /> Onde Encontrar a Análise?
            </h4>
            <p className="text-accent-foreground/90">
              A funcionalidade de "Previsão de Desistência" é acessada individualmente para cada aluno.
            </p>
            <p className="text-accent-foreground/90 mt-1">
              Para analisar um aluno específico:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-accent-foreground/90 pl-4 mt-2">
              <li>Navegue até a seção "Alunos".</li>
              <li>Clique no nome do aluno desejado para ver seus detalhes.</li>
              <li>Na página de detalhes do aluno, você encontrará a seção "Previsão de Desistência (IA)".</li>
              <li>Clique no botão "Analisar Risco de Desistência" para obter a previsão.</li>
            </ol>
          </div>
          <Button asChild className="mt-4">
            <Link href="/students">
              <Users className="mr-2 h-4 w-4" /> Ver Lista de Alunos
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

    