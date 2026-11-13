'use client';

import React, { useMemo } from 'react';
import EditorialMarkupRenderer from '@/components/schools/profile/EditorialMarkupRenderer';
import EditorialMarkupEditor from '@/components/schools/profile/EditorialMarkupEditor';
import SchoolBoardResultsSection from '@/components/schools/template/SchoolBoardResultsSection';

export interface SchoolAcademicsTabProps {
  displayName: string;
  displayClassFrom: string;
  displayClassTo: string;
  board: string;
  isEditMode: boolean;
  templateData: any;
  initialProfileData?: any;
  templateCtx?: any;
}

interface StreamCategory {
  name: string;
  subjects: string[];
}

function formatGradeLabel(raw: string): string {
  const trimmed = String(raw || '').trim();
  if (!trimmed) return 'Class 1';
  return trimmed.toLowerCase().startsWith('class') ? trimmed : `Class ${trimmed}`;
}

function buildDefaultAcademicChapter(
  displayName: string,
  classFrom: string,
  classTo: string,
  board: string,
  streams: StreamCategory[]
): string {
  const fromLabel = formatGradeLabel(classFrom).toLowerCase();
  const toLabel = formatGradeLabel(classTo).toLowerCase();
  const boardTag = board?.trim() ? `[${board.trim()}] ` : '';

  const lines: string[] = [
    `** Our Classes Offering`,
    `At ${displayName}, we offer classes from ==${fromLabel} to ${toLabel}==${boardTag ? ` (${boardTag.trim()})` : ''}, building strong foundations in languages, mathematics, scientific inquiry, and analytical problem-solving through continuous assessment and attentive classroom mentorship.`,
    ``,
    `** Streams and Subject Offerings`,
  ];

  for (const stream of streams) {
    const subjects = Array.isArray(stream.subjects) ? stream.subjects.filter(Boolean) : [];
    const formattedSubjects = subjects.map((sub) => {
      const lowerSub = sub.toLowerCase();
      return lowerSub.includes('english') ? '**English core**' : `**${lowerSub}**`;
    });
    const subjectProse =
      formattedSubjects.length > 1
        ? `${formattedSubjects.slice(0, -1).join(', ')}, and ${formattedSubjects[formattedSubjects.length - 1]}`
        : formattedSubjects.join(', ');

    const lower = stream.name.toLowerCase();
    let intro = `In ${lower}, students gain focused conceptual depth and real-world readiness`;
    if (lower.includes('medical') && !lower.includes('non-medical')) {
      intro = `In the medical science stream, aspiring healthcare and life-sciences students study scientific principles and laboratory practice`;
    } else if (lower.includes('non-medical') || lower.includes('pcm')) {
      intro = `In the non-medical science stream, learners preparing for engineering, technology, and pure sciences explore quantitative concepts`;
    } else if (lower.includes('commerce')) {
      intro = `In the commerce section, students develop financial literacy, commercial reasoning, and analytical decision-making`;
    } else if (lower.includes('humanities') || lower.includes('arts')) {
      intro = `In humanities and arts, learners examine human society, governance, culture, and behavioral perspectives`;
    }

    lines.push(`## ${stream.name}`);
    lines.push(
      subjectProse
        ? `${intro} with subjects including ${subjectProse}.`
        : `${intro} through structured coursework and guided faculty support.`
    );
  }

  return lines.join('\n');
}

export default function SchoolAcademicsTab({
  displayName,
  displayClassFrom,
  displayClassTo,
  board,
  isEditMode,
  templateData,
  initialProfileData,
  templateCtx,
}: SchoolAcademicsTabProps) {
  const streams: StreamCategory[] = useMemo(() => {
    const existing = initialProfileData?.streamCategories || templateData?.streamCategories;
    if (Array.isArray(existing) && existing.length > 0) {
      return existing;
    }
    return [
      { name: 'Science (Medical)', subjects: ['Physics', 'Chemistry', 'Biology', 'English Core'] },
      { name: 'Science (Non-Medical)', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'] },
      { name: 'Commerce', subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics'] },
      { name: 'Humanities / Arts', subjects: ['History', 'Geography', 'Political Science', 'Psychology'] },
    ];
  }, [initialProfileData?.streamCategories, templateData?.streamCategories]);

  const defaultChapter = useMemo(
    () => buildDefaultAcademicChapter(displayName, displayClassFrom, displayClassTo, board, streams),
    [displayName, displayClassFrom, displayClassTo, board, streams]
  );

  const savedOverride =
    templateCtx?.getContent?.('academics_chapter_content', '') ||
    templateData?.contentOverrides?.academics_chapter_content ||
    initialProfileData?.contentOverrides?.academics_chapter_content ||
    '';

  const effectiveContent = savedOverride.trim() ? savedOverride : defaultChapter;

  return (
    <section id="academics" className="py-6 sm:py-10 bg-[#EEF2F6] border-b border-[#DCE2E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Header (Light Blue Section Theme matching other alternating tabs) */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#006FCC] bg-white border border-[#D0E4F5] px-2.5 py-1 rounded-full mb-2.5 shadow-2xs font-['Montserrat',sans-serif]">
            <span className="w-1.5 h-1.5 bg-[#006FCC] rounded-full inline-block animate-pulse" />
            <span>ACADEMIC EXCELLENCE &amp; CURRICULUM</span>
          </div>

          <h2 className="text-[20px] sm:text-2xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight leading-snug">
            Academic Excellence and
            <span className="text-[#006FCC] block mt-0.5">Curriculum Overview</span>
          </h2>

          <p className="mt-2 text-[#5F6368] font-['Lato',var(--font-roboto),Roboto,sans-serif] font-normal max-w-2xl mx-auto !text-[15px] !leading-[1.68] m-0">
            Explore recognized grade spans, specialized academic streams, and verified board outcomes at {displayName}.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white border border-[#DCE2E8] rounded-2xl p-4 sm:p-7 shadow-2xs mb-7 sm:mb-9">
          {isEditMode ? (
            <EditorialMarkupEditor
              title="Academics Chapter Editor"
              initialValue={effectiveContent}
              defaultValue={defaultChapter}
              rows={14}
              onSave={(nextContent) => {
                if (templateCtx?.updateContentOverride) {
                  templateCtx.updateContentOverride('academics_chapter_content', nextContent);
                }
              }}
            />
          ) : (
            <EditorialMarkupRenderer content={effectiveContent} />
          )}
        </div>

        {/* Official Board Examination Records Section */}
        <div className="pt-2">
          <SchoolBoardResultsSection
            boardResults={
              templateData?.boardResults ||
              initialProfileData?.boardResults ||
              (initialProfileData?.class10Results?.length > 0 || initialProfileData?.class12Results?.length > 0
                ? {
                    class10Results: initialProfileData?.class10Results || [],
                    class12Results: initialProfileData?.class12Results || [],
                  }
                : undefined)
            }
            classTo={displayClassTo}
            boardName={board}
            schoolName={displayName}
            isEditMode={isEditMode}
            onSaveResults={(newResults) => {
              if (templateData) {
                templateData.boardResults = newResults;
              }
              if (templateCtx?.updateBoardResults) {
                templateCtx.updateBoardResults(newResults);
              }
            }}
          />
        </div>
      </div>
    </section>
  );
}
