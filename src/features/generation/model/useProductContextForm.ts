"use client";

import { useState } from "react";
import type { ErrorResponse, ProductContext } from "@/shared/api";
import {
  createEmptyProductContextDraft,
  createEmptyProductContextErrors,
  mapProductContextApiErrors,
  PRODUCT_BENEFITS_MAX_ITEMS,
  PRODUCT_CHARACTERISTICS_MAX_ITEMS,
  type ProductCharacteristicDraft,
  type ProductContextDraft,
  type ProductContextFormErrors,
  validateProductContextDraft,
} from "./productContext";

type ProductValidationResult =
  | { ok: true; product?: ProductContext }
  | { ok: false };

export function useProductContextForm() {
  const [draft, setDraft] = useState<ProductContextDraft>(createEmptyProductContextDraft);
  const [errors, setErrors] = useState<ProductContextFormErrors>(createEmptyProductContextErrors);

  function setFieldValue(field: "name" | "category" | "brand" | "description", value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, form: undefined, [field]: undefined }));
  }

  function setBenefitValue(index: number, value: string) {
    setDraft((current) => ({
      ...current,
      benefits: current.benefits.map((item, itemIndex) => (itemIndex === index ? value : item)),
    }));
    setErrors((current) => ({
      ...current,
      form: undefined,
      benefitsForm: undefined,
      benefits: current.benefits.map((item, itemIndex) => (itemIndex === index ? "" : item)),
    }));
  }

  function addBenefit() {
    setDraft((current) =>
      current.benefits.length >= PRODUCT_BENEFITS_MAX_ITEMS
        ? current
        : { ...current, benefits: [...current.benefits, ""] },
    );
    setErrors((current) => ({ ...current, form: undefined, benefitsForm: undefined }));
  }

  function removeBenefit(index: number) {
    setDraft((current) => ({
      ...current,
      benefits: current.benefits.filter((_, itemIndex) => itemIndex !== index),
    }));
    setErrors((current) => ({
      ...current,
      form: undefined,
      benefitsForm: undefined,
      benefits: current.benefits.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function setCharacteristicValue(index: number, field: keyof ProductCharacteristicDraft, value: string) {
    setDraft((current) => ({
      ...current,
      characteristics: current.characteristics.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
    setErrors((current) => ({
      ...current,
      form: undefined,
      characteristicsForm: undefined,
      characteristics: current.characteristics.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: undefined } : item,
      ),
    }));
  }

  function addCharacteristic() {
    setDraft((current) =>
      current.characteristics.length >= PRODUCT_CHARACTERISTICS_MAX_ITEMS
        ? current
        : { ...current, characteristics: [...current.characteristics, { name: "", value: "" }] },
    );
    setErrors((current) => ({ ...current, form: undefined, characteristicsForm: undefined }));
  }

  function removeCharacteristic(index: number) {
    setDraft((current) => ({
      ...current,
      characteristics: current.characteristics.filter((_, itemIndex) => itemIndex !== index),
    }));
    setErrors((current) => ({
      ...current,
      form: undefined,
      characteristicsForm: undefined,
      characteristics: current.characteristics.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function validateAndBuildProduct(): ProductValidationResult {
    const result = validateProductContextDraft(draft);
    setErrors(result.errors);

    if (result.hasErrors) {
      return { ok: false };
    }

    return { ok: true, product: result.product };
  }

  function applyApiErrors(error: ErrorResponse) {
    setErrors(mapProductContextApiErrors(error));
  }

  return {
    draft,
    errors,
    canAddBenefit: draft.benefits.length < PRODUCT_BENEFITS_MAX_ITEMS,
    canAddCharacteristic: draft.characteristics.length < PRODUCT_CHARACTERISTICS_MAX_ITEMS,
    setFieldValue,
    setBenefitValue,
    addBenefit,
    removeBenefit,
    setCharacteristicValue,
    addCharacteristic,
    removeCharacteristic,
    validateAndBuildProduct,
    applyApiErrors,
  };
}
