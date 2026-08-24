import type { Metadata } from 'next';
import CitySchoolDirectoryClient from './[slug]/Client';

export const metadata: Metadata = {
  title: 'Top Schools in India 2026-27 | Fees, CBSE/ICSE/IB Boards, STEM Labs | CSEEL UniApply',
  description: 'Explore 100+ top schools in India. Compare verified monthly fees, student-faculty ratios, board affiliations (CBSE, ICSE, IB), and live experiential STEM science laboratory infrastructure.',
  keywords: 'top schools in India, best CBSE schools Delhi, top schools Mumbai, schools in Bengaluru, school fees compare, admission open 2026-27, STEM science labs in schools, UniApply school directory, CSEEL EduNetwork',
  alternates: {
    canonical: 'https://www.cseel.org/edu-network/organisation/school',
  },
  openGraph: {
    title: 'Top Schools in India 2026-27 | Fees, CBSE/ICSE/IB Boards, STEM Labs | CSEEL UniApply',
    description: 'Explore 100+ top schools in India. Compare verified monthly fees, student-faculty ratios, board affiliations (CBSE, ICSE, IB), and live experiential STEM science laboratory infrastructure.',
    url: 'https://www.cseel.org/edu-network/organisation/school',
    siteName: 'CSEEL',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function SchoolOrganisationMainPage() {
  return (
    <CitySchoolDirectoryClient
      slug="top-schools-in-india"
      cityName="All India"
      categoryTitle="Top 100+ Schools in India (2026-27 Directory)"
      categoryDesc="Explore India's premier verified directory of CBSE, ICSE, IB, and Cambridge schools equipped with live experiential science laboratories, fee structures, and active admission windows."
    />
  );
}
