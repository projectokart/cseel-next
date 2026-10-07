import { redirect } from 'next/navigation';

export default function MyProjectRedirect() {
  redirect('/user/projects');
}
