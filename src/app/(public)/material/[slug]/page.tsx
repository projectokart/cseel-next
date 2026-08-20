import { redirect } from 'next/navigation';

export default function MaterialRedirectPage({ params }: { params: { slug: string } }) {
  redirect(`/materials/${params.slug}`);
}
