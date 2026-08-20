'use client';

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
}
