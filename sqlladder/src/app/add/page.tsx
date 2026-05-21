import AddQuestionForm from "@/components/AddQuestionForm";

export const metadata = {
  title: "Add a question · Sakila SQL Dojo",
  description: "Generate a ready-to-paste question JSON snippet.",
};

export default function AddPage() {
  return <AddQuestionForm />;
}
