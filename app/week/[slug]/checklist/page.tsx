import { notFound } from "next/navigation";
import { ChecklistSheet } from "@/components/checklist-sheet";
import { getWeekBySlug } from "@/lib/weeks";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WeekChecklistPage({ params }: Props) {
  const { slug } = await params;

  try {
    const week = await getWeekBySlug(slug);
    return <ChecklistSheet week={week} />;
  } catch {
    notFound();
  }
}