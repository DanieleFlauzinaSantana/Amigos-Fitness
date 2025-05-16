
"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";
import Image from "next/image";

// Link de exemplo para um Google Form. Substitua pelo seu link real.
const GOOGLE_FORM_LINK = "https://forms.gle/exemploDeFormulario"; // Substitua este link!

export default function SurveysPage() {
  return (
    <div>
      <PageHeader title="Pesquisas de Satisfação" description="Colete feedback valioso dos seus alunos utilizando o Google Forms." />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center"><FileText className="mr-2 h-5 w-5 text-primary"/>Pesquisa de Satisfação da Academia</CardTitle>
            </div>
            <CardDescription>
              Utilizamos o Google Forms para coletar feedback. Clique no botão abaixo para acessar ou compartilhar o formulário.
              As respostas e a edição das perguntas são gerenciadas diretamente no Google Forms.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Link da Pesquisa:</h3>
              <Link href={GOOGLE_FORM_LINK} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">
                {GOOGLE_FORM_LINK}
              </Link>
              <p className="text-sm text-muted-foreground mt-2">
                Crie sua pesquisa no Google Forms e cole o link compartilhável aqui no código (no arquivo `src/app/(app)/surveys/page.tsx`, substitua a constante `GOOGLE_FORM_LINK`).
              </p>
            </div>
            <Image 
              src="https://placehold.co/200x150.png" 
              alt="Ilustração de pesquisa" 
              data-ai-hint="survey feedback" 
              width={200} 
              height={150} 
              className="rounded-lg object-cover"
            />
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full md:w-auto">
              <Link href={GOOGLE_FORM_LINK} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Abrir Pesquisa no Google Forms
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
