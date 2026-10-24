import { redirect } from 'next/navigation';

export default function JobRedirectPage({ params }: { params: { id: string } }) {
  redirect(`/edu-network/teachers/job/${params.id}`);
}
