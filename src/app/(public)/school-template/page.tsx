import React from 'react';
import { Metadata } from 'next';
import SchoolProfileView from '@/app/school/[state]/[district]/[village]/[schoolSlug]/SchoolProfileView';

export const metadata: Metadata = {
  title: 'School Profile Master Template & AI Content Guide | CSEEL',
  description:
    'Interactive blueprint and AI analysis guidelines for school administrators to list their school on the CSEEL platform with 100% verified compliance.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function SchoolTemplatePage() {
  return (
    <SchoolProfileView
      isTemplate={true}
      schoolName="Write Your School Name Here"
      schoolSlug="school-template"
      state="State Name (e.g. Haryana)"
      district="District Name (e.g. Rewari)"
      blockName="Zone / Block Name"
      village="Locality / Sector / Village"
      pincode="123401"
      udiseCode="06170100101 (11-Digit UDISE+ Code)"
      board="CBSE (Central Board of Secondary Education)"
      medium="English & Hindi Medium"
      management="Private Unaided / Government / Aided"
      establishedYear="2008"
      schoolCategory="Senior Secondary (Class Nursery to 12th)"
      classFrom="Nursery"
      classTo="12th"
      genderType="Co-Educational"
      ruralUrban="Urban"
      totalStudents={1480}
      totalBoys={780}
      totalGirls={700}
      totalTeachers={72}
      maleTeachers={24}
      femaleTeachers={48}
      classroomsCount={52}
      workingSmartBoards={28}
      computerIctLab="Yes"
      atalStemLab="Yes"
      playgroundAvailable="Yes"
      principalName="Write Principal / Headmaster Name Here"
      rawPhone="+91 98XXXXXXXX / Official School Helpline"
      rawEmail="admissions@yourschoolname.edu.in"
      website="https://www.yourschoolname.edu.in"
      rawAddress="Plot No. 12, Knowledge Park / Institutional Area, Your City - PIN Code"
      imageUrl="/images/schools/delhi-public-school.jpg"
      lat={28.1885}
      lng={76.6215}
      clusterSchools={[]}
      districtSchools={[]}
    />
  );
}
