import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JobsClient from '../Client';
import { getJobById, ALL_JOBS, getJobSlug } from '@/lib/eduNetworkData';

export function generateStaticParams() {
  const ids = new Set<string>();
  ALL_JOBS.forEach((job) => {
    if (job.id) ids.add(job.id);
    if (job.slug) ids.add(job.slug);
  });
  return Array.from(ids).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const job = getJobById(params.id);
  if (!job) {
    return {
      title: 'Job Opening Not Found | CSEEL EduNetwork Jobs',
      description: 'The requested faculty or lab instructor job opening could not be found.',
    };
  }

  const slug = job.slug || getJobSlug(job);
  const pageUrl = `https://www.cseel.org/edu-network/jobs/${slug}`;

  return {
    title: `${job.title} Job in ${job.city} | ${job.orgName} | ${job.salary} | CSEEL Jobs`,
    description: `Hiring ${job.title} in ${job.city}, ${job.state} (${job.pincode}) at ${job.orgName}. Monthly Salary: ${job.salary}. Experience: ${job.experienceRequired}. Role: ${job.roleType} (${job.jobShift}). Apply online with CSEEL verified profile.`,
    keywords: [
      `${job.title} in ${job.city}`,
      `${job.subject} teacher job in ${job.city}`,
      `${job.orgName} careers`,
      `${job.subject} faculty vacancy ${job.state}`,
      `${job.city} teaching jobs`,
      'STEM educator recruitment India 2026',
      'Atal Tinkering Lab mentor job',
      'CSEEL EduNetwork Jobs',
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${job.title} at ${job.orgName} (${job.city}) - ${job.salary}`,
      description: `Urgent opening for ${job.title} at ${job.orgName}, ${job.city}. Salary: ${job.salary}. Verified on CSEEL EduNetwork. 1-Click apply.`,
      url: pageUrl,
      siteName: 'CSEEL EduNetwork',
      images: [
        {
          url: job.orgLogo || '/images/og-cover.jpg',
          width: 1200,
          height: 630,
          alt: `${job.title} at ${job.orgName}`,
        },
      ],
      locale: 'en_IN',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${job.title} in ${job.city} - ${job.salary} | CSEEL`,
      description: `Urgent opening for ${job.title} at ${job.orgName}, ${job.city}. Salary: ${job.salary}. Apply directly.`,
      images: [job.orgLogo || '/images/og-cover.jpg'],
    },
  };
}

export default function SingleJobPage({ params }: { params: { id: string } }) {
  const job = getJobById(params.id);
  if (!job) {
    notFound();
  }

  const slug = job.slug || getJobSlug(job);
  const pageUrl = `https://www.cseel.org/edu-network/jobs/${slug}`;

  // ── Schema.org JobPosting Structured Data for Google Jobs SEO ───────────────
  const jobSchema = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: `<h3>Job Summary</h3><p>${job.description}</p><h3>Responsibilities</h3><ul>${job.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul><h3>Qualifications</h3><p>${job.qualifications}</p>`,
    identifier: {
      '@type': 'PropertyValue',
      name: 'CSEEL EduNetwork',
      value: job.id,
    },
    datePosted: '2026-08-01',
    validThrough: '2026-12-31T23:59:59+05:30',
    employmentType: job.roleType === 'Full-Time' ? 'FULL_TIME' : job.roleType === 'Part-Time' ? 'PART_TIME' : 'CONTRACTOR',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.orgName,
      sameAs: `https://www.cseel.org/edu-network/org/${job.orgId}`,
      logo: job.orgLogo,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: job.address,
        addressLocality: job.city,
        addressRegion: job.state,
        postalCode: job.pincode,
        addressCountry: 'IN',
      },
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salaryNumMin,
        maxValue: job.salaryNumMax,
        unitText: 'MONTH',
      },
    },
    experienceRequirements: job.experienceRequired,
    qualifications: job.qualifications,
    directApply: true,
    url: pageUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />
      <JobsClient initialJobId={job.id} isSingleJobPage={true} />
    </>
  );
}
