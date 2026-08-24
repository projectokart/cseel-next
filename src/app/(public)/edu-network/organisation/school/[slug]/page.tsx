import type { Metadata } from 'next';
import CitySchoolDirectoryClient from './Client';
import { ALL_ORGANIZATIONS } from '@/lib/eduNetworkData';

// City mapping dictionary (UniApply pattern)
const CITY_SLUG_MAP: Record<string, { name: string; title: string; desc: string }> = {
  'schools-in-delhi': {
    name: 'Delhi',
    title: 'Top Schools in Delhi NCR | Fees, CBSE/ICSE/IB, STEM Labs & Admissions',
    desc: 'Explore top schools in Delhi, New Delhi & Noida. Compare verified fees, student-faculty ratios, NEP 2020 experiential STEM laboratories, and admission criteria.',
  },
  'top-school-in-delhi': {
    name: 'Delhi',
    title: 'Top Schools in Delhi NCR | Fees, CBSE/ICSE/IB, STEM Labs & Admissions',
    desc: 'Explore top schools in Delhi, New Delhi & Noida. Compare verified fees, student-faculty ratios, NEP 2020 experiential STEM laboratories, and admission criteria.',
  },
  'schools-in-mumbai': {
    name: 'Mumbai',
    title: 'Best Schools in Mumbai 2026-27 | Fees, Reviews & Lab Facilities',
    desc: 'Find top CBSE, ICSE & IB schools in Mumbai. Verified fee structures, practical science infrastructure, and online admission registration.',
  },
  'top-school-in-mumbai': {
    name: 'Mumbai',
    title: 'Best Schools in Mumbai 2026-27 | Fees, Reviews & Lab Facilities',
    desc: 'Find top CBSE, ICSE & IB schools in Mumbai. Verified fee structures, practical science infrastructure, and online admission registration.',
  },
  'schools-in-bengaluru': {
    name: 'Bengaluru',
    title: 'Top Schools in Bengaluru | Science Labs, Fees & Ratings',
    desc: 'List of top schools in Bangalore/Bengaluru with state-of-the-art robotics & STEM laboratories, fees comparison, and board affiliations.',
  },
  'top-school-in-bengaluru': {
    name: 'Bengaluru',
    title: 'Top Schools in Bengaluru | Science Labs, Fees & Ratings',
    desc: 'List of top schools in Bangalore/Bengaluru with state-of-the-art robotics & STEM laboratories, fees comparison, and board affiliations.',
  },
  'schools-in-pune': {
    name: 'Pune',
    title: 'Best Schools in Pune | Fees, Admissions & STEM Practical Labs',
    desc: 'Compare top schools in Pune across CBSE, ICSE, and IB boards with verified experiential science learning facilities.',
  },
  'schools-in-bhubaneswar': {
    name: 'Bhubaneswar',
    title: 'Top Schools in Bhubaneswar & Odisha | Fees, Ratings & Science Labs',
    desc: 'Find verified CBSE and ICSE schools in Bhubaneswar & Cuttack with modern hands-on science lab infrastructure.',
  },
  'schools-in-lucknow': {
    name: 'Lucknow',
    title: 'Best Schools in Lucknow | Fees, Reviews & Admission Directory',
    desc: 'Discover top schools in Lucknow. Compare monthly fees, boards, student strength, and practical lab infrastructure.',
  },
  'schools-in-jaipur': {
    name: 'Jaipur',
    title: 'Top Schools in Jaipur, Rajasthan | Fees, CBSE/ICSE & STEM Labs',
    desc: 'Find the best schools in Jaipur with verified science practical labs, student-teacher ratios, and fee structures.',
  },
  'schools-in-hyderabad': {
    name: 'Hyderabad',
    title: 'Top Schools in Hyderabad & Telangana | Fees, Boards & Admissions',
    desc: 'Explore leading CBSE and Cambridge schools in Hyderabad with modern STEM infrastructure and active admission status.',
  },
  'schools-in-chennai': {
    name: 'Chennai',
    title: 'Best Schools in Chennai, Tamil Nadu | Fees & Science Labs',
    desc: 'Comprehensive directory of verified CBSE and Matriculation schools in Chennai with experiential learning facilities.',
  },
  'schools-in-kolkata': {
    name: 'Kolkata',
    title: 'Top Schools in Kolkata, West Bengal | Fees, ICSE/CBSE & Lab Reviews',
    desc: 'Compare top heritage and modern STEM schools in Kolkata with verified fees and laboratory infrastructure.',
  },
  'schools-in-ahmedabad': {
    name: 'Ahmedabad',
    title: 'Best Schools in Ahmedabad, Gujarat | Fees & Admissions',
    desc: 'Discover top schools in Ahmedabad with experiential STEM labs and interactive science practical facilities.',
  },
  'schools-in-dehradun': {
    name: 'Dehradun',
    title: 'Top Boarding & Day Schools in Dehradun | Fees & STEM Facilities',
    desc: 'Find the best residential and day schools in Dehradun with world-class science laboratory infrastructure.',
  },
  'schools-in-patna': {
    name: 'Patna',
    title: 'Best Schools in Patna, Bihar | Fees, CBSE & Admissions',
    desc: 'Top CBSE and ICSE schools in Patna with verified laboratory practical infrastructure and fee details.',
  },
  'schools-in-bhopal': {
    name: 'Bhopal',
    title: 'Top Schools in Bhopal, Madhya Pradesh | Fees & Science Labs',
    desc: 'Explore the best schools in Bhopal with experiential learning kits and verified science practical labs.',
  },
  'schools-in-kochi': {
    name: 'Kochi',
    title: 'Top Schools in Kochi & Kerala | Fees & Science Labs',
    desc: 'Explore top CBSE and ICSE schools in Kochi with verified experiential science laboratories and fee details.',
  },
  'schools-in-guwahati': {
    name: 'Guwahati',
    title: 'Top Schools in Guwahati & Assam | Fees & STEM Labs',
    desc: 'Explore top CBSE schools in Guwahati with verified science laboratories and admission guidance.',
  },
  'top-schools-in-india': {
    name: 'All India',
    title: 'Top 100+ Schools in India 2026-27 | Verified Fees, Boards & STEM Labs',
    desc: 'Explore India\'s national verified directory of top schools and institutes. Compare fees, student-teacher ratios, and live experiential science laboratory facilities.',
  },
  'india-top-school': {
    name: 'All India',
    title: 'Top 100+ Schools in India 2026-27 | Verified Fees, Boards & STEM Labs',
    desc: 'Explore India\'s national verified directory of top schools and institutes. Compare fees, student-teacher ratios, and live experiential science laboratory facilities.',
  },
  'cbse-schools-in-india': {
    name: 'All India',
    title: 'Top CBSE Schools in India | Fees, Curriculum & Practical Labs',
    desc: 'Find top CBSE affiliated schools across India with verified STEM laboratory infrastructure and NEP 2020 practical science pedagogy.',
  },
  'icse-schools-in-india': {
    name: 'All India',
    title: 'Best ICSE Schools in India | Fees, Ratings & Science Infrastructure',
    desc: 'Directory of top ICSE schools in India offering hands-on science experiments and high-fidelity laboratory facilities.',
  },
  'ib-schools-in-india': {
    name: 'All India',
    title: 'Top IB World Schools in India | Fees, International Curriculum & Labs',
    desc: 'Discover top International Baccalaureate (IB) schools in India with world-class experiential science and inquiry-based STEM labs.',
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug.toLowerCase();
  
  // Check if it's an individual school profile
  const matchedOrg = ALL_ORGANIZATIONS.find(
    (o) => o.id === slug || (o.slug && o.slug === slug)
  );

  if (matchedOrg) {
    return {
      title: `${matchedOrg.name} (${matchedOrg.city}) | Fees, STEM Labs & Admissions | CSEEL`,
      description: `${matchedOrg.name} in ${matchedOrg.city}, ${matchedOrg.state}. Verified ${matchedOrg.board} school with ${matchedOrg.stemLabsCount} experiential science laboratories. Fees: ${matchedOrg.monthlyFees || 'Check details'}.`,
      alternates: {
        canonical: `https://www.cseel.org/edu-network/organisation/school/${slug}`,
      },
    };
  }

  const info = CITY_SLUG_MAP[slug] || {
    name: slug.replace(/^(schools-in-|top-schools-in-|top-school-in-)/, '').replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    title: `Top Schools in ${slug.replace(/^(schools-in-|top-schools-in-|top-school-in-)/, '').replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())} | CSEEL UniApply Directory`,
    desc: `Explore top verified schools and institutions for ${slug.replace(/-/g, ' ')} with fees, ratings, and live laboratory infrastructure.`,
  };

  return {
    title: `${info.title} | CSEEL UniApply`,
    description: info.desc,
    alternates: {
      canonical: `https://www.cseel.org/edu-network/organisation/school/${slug}`,
    },
    openGraph: {
      title: `${info.title} | CSEEL UniApply`,
      description: info.desc,
      url: `https://www.cseel.org/edu-network/organisation/school/${slug}`,
      siteName: 'CSEEL',
      locale: 'en_IN',
      type: 'website',
    },
  };
}

export default function CitySchoolDirectoryPage({ params }: { params: { slug: string } }) {
  const slug = params.slug.toLowerCase();
  
  // Clean city name resolution from slug
  let detectedCity = 'All India';
  if (CITY_SLUG_MAP[slug]) {
    detectedCity = CITY_SLUG_MAP[slug].name;
  } else if (slug.includes('delhi')) {
    detectedCity = 'Delhi';
  } else if (slug.includes('mumbai')) {
    detectedCity = 'Mumbai';
  } else if (slug.includes('bengaluru') || slug.includes('bangalore')) {
    detectedCity = 'Bengaluru';
  } else if (slug.includes('pune')) {
    detectedCity = 'Pune';
  } else if (slug.includes('bhubaneswar')) {
    detectedCity = 'Bhubaneswar';
  } else if (slug.includes('lucknow')) {
    detectedCity = 'Lucknow';
  } else if (slug.includes('jaipur')) {
    detectedCity = 'Jaipur';
  } else if (slug.includes('hyderabad')) {
    detectedCity = 'Hyderabad';
  } else if (slug.includes('chennai')) {
    detectedCity = 'Chennai';
  } else if (slug.includes('kolkata')) {
    detectedCity = 'Kolkata';
  } else if (slug.includes('ahmedabad')) {
    detectedCity = 'Ahmedabad';
  } else if (slug.includes('dehradun')) {
    detectedCity = 'Dehradun';
  } else if (slug.includes('patna')) {
    detectedCity = 'Patna';
  } else if (slug.includes('bhopal')) {
    detectedCity = 'Bhopal';
  } else if (slug.includes('kochi')) {
    detectedCity = 'Kochi';
  } else if (slug.includes('guwahati')) {
    detectedCity = 'Guwahati';
  }

  const info = CITY_SLUG_MAP[slug] || {
    name: detectedCity,
    title: `Top Schools in ${detectedCity}`,
    desc: `Compare top verified schools and institutions in ${detectedCity} across boards, fees, and STEM labs.`,
  };

  return (
    <CitySchoolDirectoryClient
      slug={slug}
      cityName={info.name}
      categoryTitle={info.title}
      categoryDesc={info.desc}
    />
  );
}
