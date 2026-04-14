import type { Metadata } from "next";
import { ProjectDetailsPage } from "@/views/project-details/ui/ProjectDetailsPage";

export const metadata: Metadata = {
  title: "Проект",
  description: "Детальная страница проекта kartochki.online.",
};

export default async function ProjectDetailsRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProjectDetailsPage id={id} />;
}
