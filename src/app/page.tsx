import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/login'); // Redireciona para a página de login
  return null; 
}
