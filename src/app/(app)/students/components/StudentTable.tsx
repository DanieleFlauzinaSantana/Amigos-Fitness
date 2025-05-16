"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Student } from "@/lib/types";

interface StudentTableProps {
  students: Student[];
}

export function StudentTable({ students }: StudentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Imagem</span>
          </TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="hidden md:table-cell">Plano</TableHead>
          <TableHead className="hidden md:table-cell">Data de Início</TableHead>
          <TableHead>
            <span className="sr-only">Ações</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell className="hidden sm:table-cell">
              <Image
                alt="Avatar do Aluno"
                className="aspect-square rounded-md object-cover"
                height="64"
                src={student.profilePictureUrl || "https://placehold.co/64x64.png"}
                data-ai-hint="profile avatar"
                width="64"
              />
            </TableCell>
            <TableCell className="font-medium">
              <Link href={`/students/${student.id}`} className="hover:underline text-primary">
                {student.name}
              </Link>
            </TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell className="hidden md:table-cell">
              <Badge variant={student.membershipType === 'Premium' ? 'default' : 'secondary'}>
                {student.membershipType}
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {new Date(student.joinDate).toLocaleDateString('pt-BR')}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Alternar menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                     <Link href={`/students/${student.id}`} className="flex items-center">
                        <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                     </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
