export type SubjectSlug =
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'mathematics'
  | 'technology'
  | 'engineering'
  | 'art'
  | string;

export type GradeLevel =
  | 'Primary (1-5)'
  | 'Middle (6-8)'
  | 'Secondary (9-10)'
  | 'Senior Sec (11-12)'
  | 'Higher Ed'
  | 'All Grades';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type SafetyLevel = 'Safe for Home' | 'Adult Supervision' | 'Lab Environment Required';

export type GalleryDisplayMode = 'single' | 'grid' | 'slider';

export interface TableColumn {
  id: string;
  key: string;
  label: string;
  width?: string;
  type?: 'text' | 'image' | 'link' | 'number';
}

export interface MaterialRow {
  id: string;
  name: string;
  image?: string;
  buyLink?: string;
  quantity: string;
  spec?: string;
  [key: string]: string | undefined;
}

export interface WarningItem {
  id: string;
  type: 'caution' | 'danger' | 'info' | 'disposal';
  title: string;
  text: string;
}

export interface FormulaItem {
  id: string;
  label: string;
  latex: string;
  explanation?: string;
}

export interface ProcedureStep {
  id: string;
  stepNumber: number;
  title?: string;
  instruction: string;
  duration?: string;
  tip?: string;
  safety?: string;
  expectedResult?: string;
  image?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title?: string;
  caption?: string;
}

// Section Block Definitions
export interface BaseSectionBlock {
  id: string;
  title: string;
  order: number;
  isEnabled: boolean;
  isCollapsed?: boolean;
}

export interface MaterialsSectionBlock extends BaseSectionBlock {
  type: 'materials';
  description?: string;
  columns: TableColumn[];
  rows: MaterialRow[];
}

export interface PrecautionsSectionBlock extends BaseSectionBlock {
  type: 'precautions';
  safetyLevel: SafetyLevel;
  ppeRequired: string[];
  warnings: WarningItem[];
}

export interface TheorySectionBlock extends BaseSectionBlock {
  type: 'theory';
  content: string;
  headingLevel: 'h2' | 'h3' | 'h4';
  alignment: 'left' | 'center' | 'right' | 'justify';
}

export interface MathFormulaSectionBlock extends BaseSectionBlock {
  type: 'math_formula';
  description?: string;
  formulas: FormulaItem[];
}

export interface ProcedureSectionBlock extends BaseSectionBlock {
  type: 'procedure';
  steps: ProcedureStep[];
}

export interface ObservationSectionBlock extends BaseSectionBlock {
  type: 'observation';
  description?: string;
  columns: TableColumn[];
  rows: Record<string, string>[];
  inference: string;
}

export interface VideoSectionBlock extends BaseSectionBlock {
  type: 'video';
  videoUrl: string;
  caption?: string;
  provider: 'youtube' | 'vimeo' | 'mp4';
}

export interface GallerySectionBlock extends BaseSectionBlock {
  type: 'gallery';
  displayMode: GalleryDisplayMode;
  images: GalleryImage[];
}

export interface CustomSectionBlock extends BaseSectionBlock {
  type: 'custom';
  icon: string;
  content: string;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface FaqSectionBlock extends BaseSectionBlock {
  type: 'faq';
  faqs: FaqItem[];
}

export interface HistoryMilestone {
  year: string;
  scientist: string;
  title: string;
  description: string;
}

export interface HistorySectionBlock extends BaseSectionBlock {
  type: 'history';
  discoveredBy?: string;
  discoveryYear?: string;
  summary: string;
  narrative: string;
  image?: string;
  imageCaption?: string;
  milestones?: HistoryMilestone[];
}

export interface ApplicationSubItem {
  id: string;
  title: string;
  content: string;
  image?: string;
  imageCaption?: string;
  externalLink?: string;
  linkText?: string;
  subsections?: ApplicationSubItem[]; // recursive nested subsections
}

export interface ApplicationsSectionBlock extends BaseSectionBlock {
  type: 'applications';
  description?: string;
  applications: ApplicationSubItem[];
}

export interface SetupSectionBlock extends BaseSectionBlock {
  type: 'setup';
  description?: string;
  diagramImage: string;
  diagramCaption?: string;
  setupInstructions?: string[];
  annotations?: { label: string; description: string }[];
}

export type ExperimentSection =
  | MaterialsSectionBlock
  | PrecautionsSectionBlock
  | TheorySectionBlock
  | MathFormulaSectionBlock
  | ProcedureSectionBlock
  | ObservationSectionBlock
  | VideoSectionBlock
  | GallerySectionBlock
  | FaqSectionBlock
  | HistorySectionBlock
  | ApplicationsSectionBlock
  | SetupSectionBlock
  | CustomSectionBlock;

export interface ExperimentItem {
  id: string;
  slug?: string;
  title: string;
  subtitle: string;
  subjectSlug: SubjectSlug;
  subjectName: string;
  category: string;
  gradeLevel: GradeLevel;
  difficulty: DifficultyLevel;
  duration: string;
  safetyLevel: SafetyLevel;
  status: 'draft' | 'published';
  tags: string[];
  badge?: string;
  heroImage?: string;
  colorTheme?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  sections: ExperimentSection[];
}
