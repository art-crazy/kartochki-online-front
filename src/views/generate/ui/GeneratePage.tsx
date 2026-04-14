import { GenerateScreen } from "@/widgets/app/generate-screen/ui/GenerateScreen";
import { loadGenerateConfigContent } from "@/features/generation/model/api";

export async function GeneratePage() {
  const config = await loadGenerateConfigContent();

  return <GenerateScreen config={config} />;
}
