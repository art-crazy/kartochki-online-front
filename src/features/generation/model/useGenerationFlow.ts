"use client";

import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createGenerationMutation,
  getGenerationByIdOptions,
  type ErrorResponse,
  type GenerationStatusResponse,
  type ProductContext,
  uploadGenerationImageMutation,
} from "@/shared/api";
import { getApiErrorMessage, getGenerationStepIndex, mapGenerationCards } from "./apiMappers";
import { type CardTypeId, type CardTypeOption, type MarketplaceId, type ModelId, type ResultState, type StyleId } from "./content";

type GenerationFlowParams = {
  availableCardTypes: ReadonlyArray<CardTypeOption>;
  cardCount: number;
  marketplace: MarketplaceId;
  modelId: ModelId;
  projectName: string;
  selectedTypes: ReadonlyArray<CardTypeId>;
  showToast: (message: string) => void;
  style: StyleId;
  uploadedFileUrl: string;
  onCreateError?: (error: ErrorResponse) => void;
};

export function useGenerationFlow({
  availableCardTypes,
  cardCount,
  marketplace,
  modelId,
  projectName,
  selectedTypes,
  showToast,
  style,
  uploadedFileUrl,
  onCreateError,
}: GenerationFlowParams) {
  const [sourceAssetId, setSourceAssetId] = useState("");
  const [generationId, setGenerationId] = useState("");
  const [resultState, setResultState] = useState<ResultState>("empty");
  const uploadRequestIdRef = useRef(0);

  const uploadMutation = useMutation(uploadGenerationImageMutation());

  const createMutation = useMutation({
    ...createGenerationMutation(),
    onSuccess: (response) => {
      setGenerationId(response.generation_id);
      setResultState("loading");
      showToast("Р“РµРЅРµСЂР°С†РёСЏ Р·Р°РїСѓС‰РµРЅР°");
    },
    onError: (error) => {
      setResultState("empty");
      if (isErrorResponse(error)) {
        onCreateError?.(error);
      }
      showToast(getApiErrorMessage(error, "РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РїСѓСЃС‚РёС‚СЊ РіРµРЅРµСЂР°С†РёСЋ"));
    },
  });

  const generationQuery = useQuery({
    ...getGenerationByIdOptions({ path: { id: generationId } }),
    enabled: Boolean(generationId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "completed" || status === "failed" ? false : 2000;
    },
  });

  const generationStatus = generationQuery.data;
  const activeStepIndex = getGenerationStepIndex(generationStatus);
  const generatedCards = useMemo(
    () => (generationStatus?.status === "completed" ? mapGenerationCards(generationStatus.result_cards, availableCardTypes) : []),
    [availableCardTypes, generationStatus],
  );
  const effectiveResultState = getEffectiveResultState(resultState, generationStatus?.status);
  const isBusy = effectiveResultState === "loading" || uploadMutation.isPending || createMutation.isPending;
  const canGenerate = Boolean(uploadedFileUrl && sourceAssetId) && !isBusy;

  function uploadImage(file: File) {
    const requestId = uploadRequestIdRef.current + 1;
    uploadRequestIdRef.current = requestId;

    setSourceAssetId("");
    setGenerationId("");
    setResultState("empty");
    uploadMutation.mutate(
      { body: { file } },
      {
        onSuccess: (response) => {
          if (uploadRequestIdRef.current !== requestId) {
            return;
          }

          setSourceAssetId(response.asset_id);
          showToast("Р¤РѕС‚Рѕ Р·Р°РіСЂСѓР¶РµРЅРѕ");
        },
        onError: (error) => {
          if (uploadRequestIdRef.current !== requestId) {
            return;
          }

          setSourceAssetId("");
          showToast(getApiErrorMessage(error, "РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ С„РѕС‚Рѕ"));
        },
      },
    );
  }

  function startGeneration(fallbackCardTypes: ReadonlyArray<CardTypeId>, product?: ProductContext) {
    if (!uploadedFileUrl) {
      showToast("РЎРЅР°С‡Р°Р»Р° Р·Р°РіСЂСѓР·РёС‚Рµ С„РѕС‚Рѕ С‚РѕРІР°СЂР°");
      return;
    }

    if (!sourceAssetId) {
      showToast(uploadMutation.isPending ? "Р”РѕР¶РґРёС‚РµСЃСЊ Р·Р°РІРµСЂС€РµРЅРёСЏ Р·Р°РіСЂСѓР·РєРё С„РѕС‚Рѕ" : "Р—Р°РіСЂСѓР·РёС‚Рµ С„РѕС‚Рѕ РµС‰Рµ СЂР°Р·");
      return;
    }

    setResultState("loading");
    setGenerationId("");
    createMutation.mutate({
      body: {
        project_name: projectName.trim() || undefined,
        marketplace_id: marketplace,
        style_id: style,
        model_id: modelId,
        card_type_ids: selectedTypes.length ? [...selectedTypes] : [...fallbackCardTypes],
        card_count: cardCount,
        source_asset_id: sourceAssetId,
        product,
      },
    });
  }

  return {
    activeStepIndex,
    canGenerate,
    effectiveResultState,
    generatedCards,
    generationStatus,
    startGeneration,
    uploadImage,
  };
}

function getEffectiveResultState(resultState: ResultState, status: GenerationStatusResponse["status"] | undefined): ResultState {
  if (status === "completed") return "result";
  if (status === "failed") return "error";
  return resultState;
}

function isErrorResponse(error: unknown): error is ErrorResponse {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string",
  );
}
