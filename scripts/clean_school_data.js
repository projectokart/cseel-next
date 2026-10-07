const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'data', 'schoolFinderData.ts');
let code = fs.readFileSync(targetPath, 'utf8');

const replacements = [
  [/'2-Urban'/g, "'Urban'"],
  [/'1-Rural'/g, "'Rural'"],
  [/'3-Co-educational'/g, "'Co-educational'"],
  [/'1-Boys Only'/g, "'Boys'"],
  [/'2-Girls Only'/g, "'Girls'"],
  [/'04-Hindi'/g, "'Hindi'"],
  [/'19-English'/g, "'English'"],
  [/'12-Oriya'/g, "'Oriya'"],
  [/'10-Marathi'/g, "'Marathi'"],
  [/'3-Gujarati'/g, "'Gujarati'"],
  [/'18-Urdu'/g, "'Urdu'"],
  [/'5-Kannada'/g, "'Kannada'"],
  [/'6-Pr. Up Pr. and Secondary with Sr. Sec'/g, "'Primary, Upper Primary and Secondary with Senior Secondary'"],
  [/'3-Pr. Up Pr. and Secondary'/g, "'Primary, Upper Primary and Secondary'"],
  [/'3-Non Residential'/g, "'Non Residential'"],
  [/'1-Pucca Government Building'/g, "'Pucca Government Building'"],
  [/'1-Pucca Boundary Wall'/g, "'Pucca Boundary Wall'"],
  [/'1-Pucca'/g, "'Pucca'"],
  [/'1-Yes'/g, "'Yes'"],
  [/'2-No'/g, "'No'"],
  [/school_type: '3-Co-educational' \| '1-Boys Only' \| '2-Girls Only' \| 'Co-ed' \| 'Boys' \| 'Girls'/g, "school_type: 'Co-educational' | 'Boys' | 'Girls' | 'Co-ed'"],
  [/rural_urban: '1-Rural' \| '2-Urban' \| 'Rural' \| 'Urban'/g, "rural_urban: 'Rural' | 'Urban'"],
  [/tinkering_lab_atl: '1-Yes' \| '2-No' \| 'Yes' \| 'No' \| boolean/g, "tinkering_lab_atl: 'Yes' | 'No' | boolean"],
  [/ict_lab: '1-Yes' \| '2-No' \| 'Yes' \| 'No' \| boolean/g, "ict_lab: 'Yes' | 'No' | boolean"],
  [/integrated_science_lab: '1-Yes' \| '2-No' \| 'Yes' \| 'No' \| boolean/g, "integrated_science_lab: 'Yes' | 'No' | boolean"],
  [/library\?: '1-Yes' \| '2-No' \| 'Yes' \| 'No' \| boolean/g, "library?: 'Yes' | 'No' | boolean"],
  [/playground: '1-Yes' \| '2-No' \| 'Yes' \| 'No' \| boolean/g, "playground: 'Yes' | 'No' | boolean"],
  [/dth_tv_access\?: '1-Yes' \| '2-No' \| 'Yes' \| 'No' \| boolean/g, "dth_tv_access?: 'Yes' | 'No' | boolean"],
  [/internet_available\?: '1-Yes' \| '2-No' \| 'Yes' \| 'No' \| boolean/g, "internet_available?: 'Yes' | 'No' | boolean"],
  [/drinking_water\?: '1-Yes' \| '2-No' \| 'Yes' \| 'No' \| boolean/g, "drinking_water?: 'Yes' | 'No' | boolean"],
  [/electricity\?: '1-Yes' \| '2-No' \| 'Yes' \| 'No' \| boolean/g, "electricity?: 'Yes' | 'No' | boolean"],
  [/solar_panel\?: '1-Yes' \| '2-No' \| 'Yes' \| 'No' \| boolean/g, "solar_panel?: 'Yes' | 'No' | boolean"],
  [/rainwater_harvesting\?: '1-Yes' \| '2-No' \| 'Yes' \| 'No' \| boolean/g, "rainwater_harvesting?: 'Yes' | 'No' | boolean"],
  [/medical_checkup\?: '1-Yes' \| '2-No' \| 'Yes' \| 'No' \| boolean/g, "medical_checkup?: 'Yes' | 'No' | boolean"],
  [/ramps_accessible\?: '1-Yes' \| '2-No' \| 'Yes' \| 'No' \| boolean/g, "ramps_accessible?: 'Yes' | 'No' | boolean"],
  [/handrails\?: '1-Yes' \| '2-No' \| 'Yes' \| 'No' \| boolean/g, "handrails?: 'Yes' | 'No' | boolean"],
  [/handwash_available\?: '1-Yes' \| '2-No' \| 'Yes' \| 'No' \| boolean/g, "handwash_available?: 'Yes' | 'No' | boolean"],
  [/meal_handwash_available\?: '1-Yes' \| '2-No' \| 'Yes' \| 'No' \| boolean/g, "meal_handwash_available?: 'Yes' | 'No' | boolean"]
];

for (const [pattern, repl] of replacements) {
  code = code.replace(pattern, repl);
}

fs.writeFileSync(targetPath, code, 'utf8');
console.log('Successfully cleaned src/data/schoolFinderData.ts');
