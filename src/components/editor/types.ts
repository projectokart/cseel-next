export type EditorContentType =
  | 'experiment'
  | 'project'
  | 'blog'
  | 'article'
  | 'job'
  | 'post'
  | 'notice'
  | 'document'
  | 'course'
  | 'tutorial';

export interface EditorFeatureConfig {
  formulas: boolean;
  graphs: boolean;
  code: boolean;
  diagrams: boolean;
  tables: boolean;
  images: boolean;
  videos: boolean;
  callouts: boolean;
  experimentBlocks: boolean;
  projectBlocks: boolean;
  questions: boolean;
  aiAssistance: boolean;
  slashCommands: boolean;
  characterCount: boolean;
  placeholder?: string;
}

export type CalloutVariant = 'note' | 'tip' | 'warning' | 'definition' | 'example' | 'assessment';

export interface GraphDataPoint {
  x: number | string;
  y: number;
  label?: string;
}

export interface GraphDataset {
  name: string;
  color: string;
  data: GraphDataPoint[];
}

export interface GraphNodeAttributes {
  id: string;
  title: string;
  graphType: 'line' | 'scatter' | 'bar';
  xLabel: string;
  yLabel: string;
  xUnit?: string;
  yUnit?: string;
  showGrid: boolean;
  showBestFit: boolean;
  datasets: GraphDataset[];
}

export interface FormulaNodeAttributes {
  latex: string;
  displayMode: boolean;
}

export interface MermaidNodeAttributes {
  code: string;
}

export interface CalloutNodeAttributes {
  variant: CalloutVariant;
  title?: string;
}

export interface UniversalEditorValue {
  json?: any;
  html?: string;
  text?: string;
}

export interface UniversalEditorProps {
  contentType?: EditorContentType;
  initialContent?: any;
  value?: UniversalEditorValue | string;
  onChange?: (value: UniversalEditorValue) => void;
  onSave?: (value: UniversalEditorValue) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: string;
  maxHeight?: string;
  className?: string;
  autoFocus?: boolean;
  showWordCount?: boolean;
}
