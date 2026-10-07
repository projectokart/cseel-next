'use client';

import React from 'react';
import { SchoolTemplateProvider } from '@/components/schools/template/SchoolTemplateContext';
import SchoolProfileView from '@/app/school/[state]/[district]/[village]/[schoolSlug]/SchoolProfileView';

export default function SchoolTemplateClient() {
  return (
    <SchoolTemplateProvider>
      <SchoolProfileView
        isTemplate={true}
        schoolName="Write Your School Name Here"
        schoolSlug="school-template"
        state="State Name (e.g. Haryana)"
        district="District Name (e.g. Rewari)"
        blockName="Zone / Block Name"
        village="Locality / Sector / Village"
        pincode="123401"
        udiseCode="06170100101"
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
        imageUrl="/images/schools/hero-school-1.png"
        lat={28.1885}
        lng={76.6215}
        clusterSchools={[]}
        districtSchools={[]}
      />
    </SchoolTemplateProvider>
  );
}
