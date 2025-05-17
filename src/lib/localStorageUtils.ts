
// src/lib/localStorageUtils.ts
import type { Student } from './types';
import { MOCK_STUDENTS } from './constants'; // Para usar como valor inicial

const STUDENTS_STORAGE_KEY = 'amigosFitness_students';

export function getStudentsFromLocalStorage(): Student[] {
  if (typeof window !== 'undefined') {
    const storedStudents = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (storedStudents) {
      try {
        return JSON.parse(storedStudents);
      } catch (error) {
        console.error("Erro ao parsear alunos do localStorage:", error);
        // Se houver erro, retorna MOCK_STUDENTS como fallback e salva.
        saveStudentsToLocalStorage(MOCK_STUDENTS);
        return MOCK_STUDENTS;
      }
    } else {
      // Se não houver nada, inicializa com MOCK_STUDENTS e salva.
      saveStudentsToLocalStorage(MOCK_STUDENTS);
      return MOCK_STUDENTS;
    }
  }
  // Fallback para SSR ou ambientes sem window
  return MOCK_STUDENTS;
}

export function saveStudentsToLocalStorage(students: Student[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
    } catch (error) {
      console.error("Erro ao salvar alunos no localStorage:", error);
    }
  }
}
