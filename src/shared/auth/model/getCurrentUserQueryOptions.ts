"use client";

import { getCurrentUserOptions } from "@/shared/api";

export function getCurrentUserQueryOptions() {
  return {
    ...getCurrentUserOptions(),
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  };
}
