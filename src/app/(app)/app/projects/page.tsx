import type { Metadata } from "next";
import { ProjectsPage } from "@/views/projects/ui/ProjectsPage";

export const metadata: Metadata = {
  title: "Проекты",
  description: "Список проектов kartochki.online с управлением черновиками и сохраненными наборами карточек.",
};

export default function ProjectsRoute() {
  return <ProjectsPage />;
}
