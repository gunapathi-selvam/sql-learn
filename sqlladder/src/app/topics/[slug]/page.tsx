import { notFound } from "next/navigation";
import { getTopic, topics } from "@/lib/data";
import TopicView from "@/components/TopicView";

export function generateStaticParams() {
  return topics.map((t) => ({ slug: t.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const topic = getTopic(params.slug);
  if (!topic) return { title: "Topic not found" };
  return {
    title: `${topic.title} · Sakila SQL Dojo`,
    description: topic.description,
  };
}

export default function TopicPage({ params }: { params: { slug: string } }) {
  const topic = getTopic(params.slug);
  if (!topic) notFound();
  return <TopicView topic={topic} />;
}
