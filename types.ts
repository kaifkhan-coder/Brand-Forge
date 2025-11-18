export interface Color {
  hex: string;
  name: string;
  usage: string;
}

export interface Typography {
  headerFont: string;
  bodyFont: string;
  reasoning: string;
}

export interface LogoPrompts {
  primary: string;
  secondary1: string;
  secondary2: string;
}

export interface BrandIdentity {
  companyName: string;
  mission: string;
  vibe: string;
  colors: Color[];
  typography: Typography;
  logoPrompts: LogoPrompts;
  // Images are populated after generation
  images?: {
    primary: string | null;
    secondary1: string | null;
    secondary2: string | null;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum GenerationStep {
  IDLE = 'idle',
  STRATEGIZING = 'strategizing', // Text gen
  DESIGNING = 'designing', // Image gen
  COMPLETE = 'complete',
  ERROR = 'error'
}
