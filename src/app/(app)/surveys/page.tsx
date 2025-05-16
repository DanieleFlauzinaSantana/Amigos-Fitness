
"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Edit, Send, BarChart3 } from "lucide-react"; // BarChart3 importado
import { MOCK_SURVEY } from "@/lib/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { useEffect, useState } from 'react';


export default function SurveysPage() {
  const survey = MOCK_SURVEY; 
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const surveySubmitLink = origin ? `${origin}/surveys/${survey.id}/submit` : `/surveys/${survey.id}/submit`;
  const surveyResultsLink = `/surveys/${survey.id}/results`;


  return (
    <div>
      <PageHeader title="Pesquisas de Satisfação" description="Gerencie e analise o feedback dos seus alunos." />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center"><FileText className="mr-2 h-5 w-5 text-primary"/>{survey.title}</CardTitle>
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" disabled> 
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edição das perguntas é feita no código (src/lib/constants.ts)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button variant="outline" size="icon" asChild>
                  <Link href={surveyResultsLink}>
                    <BarChart3 className="h-4 w-4" />
                    <span className="sr-only">Ver Respostas (Simulado)</span>
                  </Link>
                </Button>
              </div>
            </div>
            <CardDescription>
              {survey.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
                <h3 className="font-semibold mb-1">Link para Responder:</h3>
                <p className="text-sm text-muted-foreground">
                    Use o link abaixo para que os alunos respondam à pesquisa. Para associar a resposta a um aluno específico (e usar na IA), adicione `?studentId=ID_DO_ALUNO` ao final do link.
                </p>
                <Link href={surveySubmitLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all mt-1 block">
                    {surveySubmitLink}
                </Link>
                 <p className="text-xs text-muted-foreground mt-2">Exemplo com ID do aluno: {`${surveySubmitLink}?studentId=ALUNO_ID_AQUI`}</p>
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
              <Link href={surveySubmitLink} target="_blank" rel="noopener noreferrer">
                <Send className="mr-2 h-4 w-4" /> Abrir Formulário da Pesquisa
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
