"use client";

import { useQuery } from "@tanstack/react-query";
import { getGenerateConfigOptions } from "@/shared/api";
import { mapGenerateConfigResponse } from "@/views/generate/model/mappers";
import { fallbackGenerateConfigContent } from "@/features/generation/model/content";
import { GenerateScreen } from "@/widgets/app/generate-screen/ui/GenerateScreen";

export function GeneratePage() {
  const { data: config = fallbackGenerateConfigContent } = useQuery({
    ...getGenerateConfigOptions(),
    select: mapGenerateConfigResponse,
  });

  return <GenerateScreen config={config} />;
}
