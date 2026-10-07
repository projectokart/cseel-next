import { Metadata } from 'next';
import AboutClient from './Client';

export const metadata: Metadata = {
  title: 'About Us | CSEEL - Next-Gen STEM & Virtual Laboratories',
  description: 'Learn about CSEEL mission, vision, journey, and the educational leadership powering India’s premier hands-on experiential STEM learning platform.',
};

export default function AboutPage() {
  return <AboutClient />;
}
