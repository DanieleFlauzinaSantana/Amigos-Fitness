"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StudentForm } from '../../components/StudentForm'; // Adjusted path
import type { Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Edit3, User, Mail, Phone, Cake, Shield, هدف, Users as UsersIcon, CalendarDays } from 'lucide-react'; // هدف is placeholder for Goal, using UsersIcon for membership

interface ProfileDetailsSectionProps {
  student: Student;
  onUpdateStudent: (updatedStudent: Student) => void;
}

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string }) => (
  <div className="flex items-start space-x-3">
    <Icon className="h-5 w-5 text-primary mt-1" />
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base text-foreground">{value || 'Não informado'}</p>
    </div>
  </div>
);

export function ProfileDetailsSection({ student, onUpdateStudent }: ProfileDetailsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data: Omit<Student, 'id' | 'attendance' | 'missedClassesCount' | 'profilePictureUrl'>) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedStudentData = { ...student, ...data };
    onUpdateStudent(updatedStudentData);
    setIsSubmitting(false);
    setIsEditing(false);
    toast({
      title: "Perfil Atualizado!",
      description: `Os dados de ${student.name} foram atualizados.`,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Perfil do Aluno</CardTitle>
          <CardDescription>Informações detalhadas e metas.</CardDescription>
        </div>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Edit3 className="h-4 w-4" />
              <span className="sr-only">Editar Perfil</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Editar Perfil de {student.name}</DialogTitle>
            </DialogHeader>
            <StudentForm 
              student={student} 
              onSubmit={handleFormSubmit} 
              onCancel={() => setIsEditing(false)}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Image
            src={student.profilePictureUrl || "https://placehold.co/128x128.png"}
            alt={`Foto de ${student.name}`}
            data-ai-hint="profile avatar"
            width={128}
            height={128}
            className="rounded-full border-4 border-primary shadow-md"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-primary">{student.name}</h2>
            <p className="text-muted-foreground">{student.email}</p>
            {student.phone && <p className="text-muted-foreground">{student.phone}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
          <DetailItem icon={Cake} label="Data de Nascimento" value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('pt-BR') : undefined} />
          <DetailItem icon={CalendarDays} label="Data de Início" value={new Date(student.joinDate).toLocaleDateString('pt-BR')} />
          <DetailItem icon={UsersIcon} label="Tipo de Plano" value={student.membershipType} />
          <DetailItem icon={Shield} label="Contato de Emergência" value={`${student.emergencyContactName || ''} ${student.emergencyContactPhone || ''}`.trim() || undefined} />
        </div>

        {student.fitnessGoals && (
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-2 text-primary flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 12L12 22"></path><path d="M19 12H5"></path><path d="M12 12L18 6"></path><path d="M12 12L6 6"></path><path d="M12 2L12 12"></path></svg>
                Metas de Fitness
            </h3>
            <p className="text-foreground whitespace-pre-wrap">{student.fitnessGoals}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
