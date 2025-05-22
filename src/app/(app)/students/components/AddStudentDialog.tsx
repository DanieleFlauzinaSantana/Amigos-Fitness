"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger, // Adicionado para controlar a abertura pelo botão
} from "@/components/ui/dialog";
import { StudentForm } from "./StudentForm";
import type { Student } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

interface AddStudentDialogProps {
  onStudentAdded: (
    data: Omit<Student, 'id' | 'attendance' | 'missedClassesCount' | 'profilePictureUrl' | 'latestSurveyResponse'>
  ) => Promise<void>; // A função agora é async para alinhar com o studentService
}

export function AddStudentDialog({ onStudentAdded }: AddStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (
    data: Omit<Student, 'id' | 'attendance' | 'missedClassesCount' | 'profilePictureUrl' | 'latestSurveyResponse'>
  ) => {
    setIsSubmitting(true);
    try {
      await onStudentAdded(data); // Chama a função passada, que agora usa o studentService
      setOpen(false); // Fecha o diálogo após a adição bem-sucedida
      toast({
        title: "Aluno Adicionado!",
        description: `${data.name} foi cadastrado com sucesso. A lista será atualizada.`,
      });
    } catch (error) {
      console.error("Erro ao processar adição de aluno:", error);
      toast({
        variant: "destructive",
        title: "Erro ao Adicionar",
        description: "Não foi possível adicionar o aluno. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Aluno
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Aluno</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para cadastrar um novo aluno.
          </DialogDescription>
        </DialogHeader>
        <StudentForm 
          onSubmit={handleSubmit} 
          onCancel={() => setOpen(false)} // Adicionado para fechar o diálogo ao cancelar
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
}