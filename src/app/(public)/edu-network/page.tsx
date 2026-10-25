import { redirect } from 'next/navigation';

export default function EduNetworkPage() {
  // 301 Permanent Redirect to /schools
  redirect('/schools');
}
