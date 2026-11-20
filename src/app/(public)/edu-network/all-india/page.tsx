import type { Metadata } from 'next';
import AllIndiaSchoolsView from '@/components/schools/AllIndiaSchoolsView';

export const metadata: Metadata = {
  title: "All India Private Schools Directory (4.4+ Lakh Schools) - Find Best Schools Near Me | Fees Structure, Admissions & Results | CSEEL",
  description:
    "Search 4.4+ Lakh verified private schools across all 35 States and 871 Districts in India. Find best schools near me with GPS location, landmarks, fee structure, 2026-27 admission criteria, 10th & 12th board exam results, CBSE/ICSE affiliations, and UDISE codes on CSEEL.",
  keywords: [
    "best schools near me",
    "top private schools near me",
    "schools near my location GPS",
    "find nearby private schools",
    "school fee structure and admission 2026",
    "know about school fee structure",
    "school admission results and reviews",
    "CBSE private schools near me",
    "ICSE private schools near me",
    "landmarks near school",
    "UDISE private schools database",
    "All India private schools database directory",
    "All India's largest school collections",
    "CSEEL Education Network"
  ],
  other: {
    'geo.region': 'IN',
    'geo.placename': 'India',
    'Classification': 'Education / School Directory / Best Schools Near Me',
    'target': 'all',
    'audience': 'Parents, Students, Educators, Teachers',
    'coverage': 'All India',
    'subject': 'Find top private schools near me, fee structure, admissions, and results in India',
  },
  openGraph: {
    title: "All India Private Schools Directory (4.4+ Lakh Schools) - Best Schools Near Me | CSEEL",
    description:
      "All India's largest verified database of 4.4+ Lakh private schools. Search by GPS location, State, District, Block, Cluster, and Board to find schools near you with fee structure, admission criteria, and results.",
    url: 'https://www.cseel.org/edu-network/all-india',
    siteName: 'CSEEL Education Network',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "All India Private Schools Directory (4.4+ Lakh Schools) - Best Schools Near Me | CSEEL",
    description: "Search 4.4+ Lakh private schools across all states and districts in India by GPS coordinates, landmarks, fees, and admissions.",
  },
  alternates: {
    canonical: 'https://www.cseel.org/edu-network/all-india',
  },
};

export default function EduNetworkAllIndiaSchoolsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://www.cseel.org/edu-network/all-india#webpage',
        url: 'https://www.cseel.org/edu-network/all-india',
        name: "All India Private Schools Directory & Collections",
        description:
          "Comprehensive nationwide directory of over 4.4 Lakh verified private schools across India, covering CBSE, ICSE, State Boards, and International Boards.",
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://www.cseel.org/#website',
          url: 'https://www.cseel.org',
          name: 'CSEEL Education Network',
        },
        about: {
          '@type': 'EducationalOrganization',
          name: 'Private Schools across India',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.cseel.org/edu-network/all-india#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.cseel.org',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Education Network',
            item: 'https://www.cseel.org/edu-network',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'All India Private Schools Directory',
            item: 'https://www.cseel.org/edu-network/all-india',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AllIndiaSchoolsView
        verifiedOnly={false}
        pageTitle="All India Private Schools Directory"
        pageSubtitle="India's largest verified database of over 4.4 Lakh private schools across 35 States, 871 Districts, 7,800+ Blocks, and 61,000+ Clusters to discover your nearby educational institutions."
      />
    </>
  );
}
