// src/app/(app)/students/[id]/components/QRCodeSection.tsx
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Student } from '@/lib/types';
import { QrCode } from 'lucide-react';

interface QRCodeSectionProps {
  student: Student;
}

export function QRCodeSection({ student }: QRCodeSectionProps) {
  // Em uma aplicação real, você usaria uma biblioteca para gerar o QR Code
  // Aqui, estamos simulando com uma imagem placeholder e exibindo o ID.
  const qrCodeImageUrl = `https://placehold.co/200x200.png?text=ID:${student.id}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="mr-2 h-6 w-6 text-primary" /> QR Code do Aluno
        </CardTitle>
        <CardDescription>Use este QR Code para check-in rápido.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Image
          src={qrCodeImageUrl}
          alt={`QR Code para ${student.name}`}
          data-ai-hint="QR code"
          width={200}
          height={200}
          className="rounded-lg border shadow-md"
        />
        <p className="text-sm text-muted-foreground">ID do Aluno: <strong className="text-foreground">{student.id}</strong></p>
        <p className="text-xs text-center text-muted-foreground max-w-xs">
          Em um aplicativo real, esta imagem seria um QR Code funcional.
          O aluno pode apresentá-lo para um check-in rápido na recepção.
        </p>
      </CardContent>
    </Card>
  );
}
