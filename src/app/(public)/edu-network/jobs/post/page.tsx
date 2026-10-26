import type { Metadata } from 'next';
import PostJobClient from './Client';

export const metadata: Metadata = {
  title: 'Post a School Vacancy | CSEEL EduNetwork',
  description: 'Post teaching and non-teaching school vacancies to recruit verified educators, laboratory instructors, and academic coordinators across India.',
};

export default function PostJobPage() {
  return <PostJobClient />;
}
