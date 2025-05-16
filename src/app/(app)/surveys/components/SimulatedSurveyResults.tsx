// src/app/(app)/surveys/[id]/results/page.tsx
"use client";

// Esta página não será mais usada diretamente, pois os resultados estarão no Google Forms.
// Manteremos o arquivo para referência futura, mas a navegação para ele foi removida.

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SurveyResultsPage_DEPRECATED() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <PageHeader 
            title="Resultados da Pesquisa (Agora no Google Forms)"
            description="Os resultados detalhados da pesquisa agora são visualizados diretamente na plataforma Google Forms."
        />
        <Button onClick={() => router.push('/surveys')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Pesquisas
        </Button>
      </div>
      <div className="p-6 border rounded-lg bg-muted">
        <p className="text-lg text-center">
          Para visualizar os resultados desta pesquisa, por favor, acesse sua conta do Google Forms onde o formulário foi criado.
        </p>
      </div>
    </div>
  );
}