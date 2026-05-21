import questionsJson from "@/data/questions.json";
import type { Topic } from "./types";

export const topics: Topic[] = questionsJson as Topic[];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.id === slug);
}

export function totalQuestions(): number {
  return topics.reduce((sum, t) => sum + t.questions.length, 0);
}
