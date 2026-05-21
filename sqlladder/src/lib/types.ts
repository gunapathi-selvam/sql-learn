export type QuestionType = "mcq" | "single" | "code";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  hint: string;
  options?: string[];
  answer?: string;
  sql?: string;
  explanation: string;
  schemaTables: string[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
}
