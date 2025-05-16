"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_SURVEY } from "@/lib/constants";
import { FileText, Edit, BarChart2 } from "lucide-react";
import Image from "next/image";

export default function SurveysPage() {
  return (
    <div>
      <PageHeader title="Pesquisas de Satisfação" description="Colete feedback valioso dos seus alunos." />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center"><FileText className="mr-2 h-5 w-5 text-primary"/>{MOCK_SURVEY.title}</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm"><Edit className="mr-1 h-3 w-3" /> Editar</Button>
                <Button variant="outline" size="sm"><BarChart2 className="mr-1 h-3 w-3" /> Ver Respostas</Button>
              </div>
            </div>
            <CardDescription>{MOCK_SURVEY.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Detalhes da Pesquisa:</h3>
              <p className="text-sm text-muted-foreground">ID: {MOCK_SURVEY.id}</p>
              <p className="text-sm text-muted-foreground">Número de Questões: {MOCK_SURVEY.questions.length}</p>
              <p className="text-sm text-muted-foreground mt-2">Esta pesquisa ajuda a entender a satisfação geral dos alunos com os serviços e instalações da Amigos Fitness.</p> {/* Atualizado aqui */}
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
            <Link href={`/surveys/${MOCK_SURVEY.id}/submit`} passHref>
              <Button className="w-full md:w-auto">Responder Pesquisa (Visão do Aluno)</Button>
            </Link>
          </CardFooter>
        </Card>
        {/* Future surveys could be listed here */}
      </div>
    </div>
  );
}
