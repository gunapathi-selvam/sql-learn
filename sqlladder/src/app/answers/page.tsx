import { topics } from "@/lib/data";
import AnswerSheet from "@/components/AnswerSheet";

export const metadata = {
  title: "Answer Sheet · Sakila SQL Dojo",
  description: "All 200 SQL answers grouped by topic.",
};

export default function AnswersPage() {
  return <AnswerSheet topics={topics} />;
}
