import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { AttendanceRecord } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calcula o número máximo de faltas consecutivas de um aluno.
 * @param attendanceRecords - Lista de registros de frequência, idealmente ordenada da mais recente para a mais antiga.
 * @returns O número máximo de faltas consecutivas.
 */
export function calculateConsecutiveAbsences(attendanceRecords: AttendanceRecord[]): number {
  if (!attendanceRecords || attendanceRecords.length === 0) {
    return 0;
  }

  // Garante que os registros estejam ordenados da mais antiga para a mais recente para a lógica de contagem.
  const sortedRecords = [...attendanceRecords].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let maxConsecutiveAbsences = 0;
  let currentConsecutiveAbsences = 0;

  for (const record of sortedRecords) {
    if (!record.attended) {
      currentConsecutiveAbsences++;
    } else {
      if (currentConsecutiveAbsences > maxConsecutiveAbsences) {
        maxConsecutiveAbsences = currentConsecutiveAbsences;
      }
      currentConsecutiveAbsences = 0; // Reseta ao encontrar uma presença
    }
  }
  // Verifica uma última vez caso a sequência de faltas seja no final da lista
  if (currentConsecutiveAbsences > maxConsecutiveAbsences) {
    maxConsecutiveAbsences = currentConsecutiveAbsences;
  }

  return maxConsecutiveAbsences;
}
