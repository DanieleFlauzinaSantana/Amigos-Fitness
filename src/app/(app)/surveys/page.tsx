
"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Edit, BarChart2, Send } from "lucide-react";
import { MOCK_SURVEY } from "@/lib/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";


export default function SurveysPage() {
  const survey = MOCK_SURVEY; // Usando a pesquisa mockada

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
                      {/* Botão de editar desabilitado, edição é feita no código */}
                      <Button variant="outline" size="icon" disabled> 
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edição no código (constants.ts)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/surveys/${survey.id}/results`}>
                    <BarChart2 className="h-4 w-4" />
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
                    Use o link abaixo para que os alunos respondam à pesquisa. Você pode adicionar o ID do aluno ao final do link para pré-identificação (ex: `?studentId=ALUNO_ID`).
                </p>
                <Link href={`/surveys/${survey.id}/submit`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all mt-1 block">
                    {`${window.location.origin}/surveys/${survey.id}/submit`}
                </Link>
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
              <Link href={`/surveys/${survey.id}/submit`} target="_blank" rel="noopener noreferrer">
                <Send className="mr-2 h-4 w-4" /> Abrir Formulário da Pesquisa
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
