import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Media Archive | CSEEL",
  description: "Website Under Development, This Page Coming Soon",
};

export default function Page() {
  return <Client />;
}
