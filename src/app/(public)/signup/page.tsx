import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "Create Account | CSEEL Educator & Student Portal",
  description: "Join CSEEL to discover teaching opportunities, manage classes, or access scientific exploration tools across India.",
  alternates: {
    canonical: "https://www.cseel.org/signup",
  },
};

export default function SignupPage() {
  return <Client />;
}
