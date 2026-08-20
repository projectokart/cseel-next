import { MetadataRoute } from 'next';
import { ALL_PROJECTS } from '@/lib/projectsData';
import { ALL_MATERIALS } from '@/lib/materialsData';
import { ALL_EXPERIMENTS } from '@/lib/experimentsData';
import { ALL_BLOGS } from '@/lib/blogsData';
import { ALL_ORGANIZATIONS, ALL_JOBS, ALL_TEACHERS, ALL_STUDENTS } from '@/lib/eduNetworkData';
import { ALL_SEMINARS } from '@/lib/seminarsData';
import { events } from '@/lib/eventsData';
import { slugify } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.cseel.org';
  const lastModified = new Date();

  // Core Static Landing & Foundation Pages
  const staticRoutes = [
    { url: '', priority: 1.0, changeFrequency: 'daily' as const },
    { url: '/about-us', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/our-story', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/team', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/simulations', priority: 0.95, changeFrequency: 'weekly' as const },
    { url: '/hands-on-experiments', priority: 0.95, changeFrequency: 'weekly' as const },
    { url: '/edu-network', priority: 0.95, changeFrequency: 'daily' as const },
    { url: '/edu-network/jobs', priority: 0.95, changeFrequency: 'daily' as const },
    { url: '/projects', priority: 0.95, changeFrequency: 'weekly' as const },
    { url: '/materials', priority: 0.95, changeFrequency: 'weekly' as const },
    { url: '/cart', priority: 0.7, changeFrequency: 'weekly' as const },
    { url: '/blog', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/events/upcoming', priority: 0.85, changeFrequency: 'weekly' as const },
    { url: '/seminars', priority: 0.95, changeFrequency: 'weekly' as const },
    { url: '/events/past', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/exhibitions', priority: 0.85, changeFrequency: 'monthly' as const },
    { url: '/why-cseel', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/for-educators', priority: 0.85, changeFrequency: 'monthly' as const },
    { url: '/for-students', priority: 0.85, changeFrequency: 'monthly' as const },
    { url: '/for-institutions', priority: 0.85, changeFrequency: 'monthly' as const },
    { url: '/compare-plans', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/demo', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/teacher-training', priority: 0.85, changeFrequency: 'monthly' as const },
    { url: '/workshops', priority: 0.85, changeFrequency: 'monthly' as const },
    { url: '/research', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/feed', priority: 0.85, changeFrequency: 'hourly' as const },
    { url: '/channels', priority: 0.85, changeFrequency: 'daily' as const },
    { url: '/contact-us', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/get-support', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/help', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/careers', priority: 0.75, changeFrequency: 'weekly' as const },
    { url: '/art', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/safety', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/media-archive', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/terms', priority: 0.5, changeFrequency: 'yearly' as const },
    { url: '/privacy', priority: 0.5, changeFrequency: 'yearly' as const },
  ];

  // Dynamic Projects Pages
  const projectRoutes = ALL_PROJECTS.map((p) => ({
    url: `/project/${p.slug || slugify(p.title) || p.id}`,
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  }));

  // Dynamic Materials / Store Product Pages
  const materialRoutes = ALL_MATERIALS.map((m) => ({
    url: `/materials/${m.slug || slugify(m.name) || m.id}`,
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  }));

  // Dynamic Experiments / Simulation Pages
  const experimentRoutes = ALL_EXPERIMENTS.map((e) => ({
    url: `/experiment/${e.slug || slugify(e.title) || e.id}`,
    priority: 0.9,
    changeFrequency: 'weekly' as const,
  }));

  // Dynamic Blog Article Pages
  const blogRoutes = ALL_BLOGS.map((b) => ({
    url: `/blog/${b.slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  }));

  // Dynamic Seminars / Flagship Conclave Pages
  const seminarRoutes = ALL_SEMINARS.map((s) => ({
    url: `/seminars/${s.id}`,
    priority: 0.9,
    changeFrequency: 'weekly' as const,
  }));

  // Dynamic Event Pages
  const eventRoutes = events.map((ev) => ({
    url: `/events/${ev.id}`,
    priority: 0.75,
    changeFrequency: 'monthly' as const,
  }));

  // Dynamic EduNetwork Organization Profile Pages
  const orgRoutes = ALL_ORGANIZATIONS.map((org) => ({
    url: `/edu-network/org/${org.slug || org.id}`,
    priority: 0.85,
    changeFrequency: 'daily' as const,
  }));

  // Dynamic EduNetwork Job Opening Pages
  const jobRoutes = ALL_JOBS.map((job) => ({
    url: `/edu-network/jobs/${job.slug || job.id}`,
    priority: 0.9,
    changeFrequency: 'daily' as const,
  }));

  // Dynamic EduNetwork Verified Teacher Profile Pages
  const teacherRoutes = ALL_TEACHERS.map((teacher) => ({
    url: `/edu-network/teachers/${teacher.slug || teacher.id}`,
    priority: 0.85,
    changeFrequency: 'daily' as const,
  }));

  // Dynamic EduNetwork Student Innovator Project Pages
  const studentRoutes = ALL_STUDENTS.map((student) => ({
    url: `/edu-network/students/${student.slug || student.id}`,
    priority: 0.85,
    changeFrequency: 'daily' as const,
  }));

  const allRoutes = [
    ...staticRoutes,
    ...projectRoutes,
    ...materialRoutes,
    ...experimentRoutes,
    ...blogRoutes,
    ...seminarRoutes,
    ...eventRoutes,
    ...orgRoutes,
    ...jobRoutes,
    ...teacherRoutes,
    ...studentRoutes,
  ];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
