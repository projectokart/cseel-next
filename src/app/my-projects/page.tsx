import { redirect } from 'next/navigation';

export default function MyProjectsRedirect() {
  redirect('/user/projects');
}
