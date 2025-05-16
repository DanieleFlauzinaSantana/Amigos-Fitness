"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { StudentForm } from "./StudentForm";
import type { Student } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

interface AddStudentDialogProps {
  onStudentAdded: (newStudent: Student) => void;
}

export function AddStudentDialog({ onStudentAdded }: AddStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: Omit<Student, 'id' | 'attendance' | 'missedClassesCount' | 'profilePictureUrl'>) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newStudent: Student = {
      ...data,
      id: Math.random().toString(36).substr(2, 9), // mock ID
      profilePictureUrl: 'https://placehold.co/100x100.png',
      attendance: [],
      missedClassesCount: 0,
    };
    
    onStudentAdded(newStudent);
    setIsSubmitting(false);
    setOpen(false);
    toast({
      title: "Aluno Adicionado!",
      description: `${newStudent.name} foi adicionado com sucesso.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Aluno
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Aluno</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para cadastrar um novo aluno.
          </DialogDescription>
        </DialogHeader>
        <StudentForm 
          onSubmit={handleSubmit} 
          onCancel={() => setOpen(false)}
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
}
