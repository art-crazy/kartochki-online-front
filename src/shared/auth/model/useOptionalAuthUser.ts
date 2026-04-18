"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUserOptions } from "@/shared/api";

export function useOptionalAuthUser() {
  const query = useQuery({
    ...getCurrentUserOptions(),
    retry: false,
  });

  return {
    user: query.isError ? null : query.data?.user ?? null,
    isLoading: query.isLoading,
  };
}
