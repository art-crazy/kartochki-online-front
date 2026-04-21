import type { ErrorResponse, ProductContext } from "@/shared/api";

export const PRODUCT_NAME_MAX_LENGTH = 200;
export const PRODUCT_CATEGORY_MAX_LENGTH = 120;
export const PRODUCT_BRAND_MAX_LENGTH = 120;
export const PRODUCT_DESCRIPTION_MAX_LENGTH = 2000;
export const PRODUCT_BENEFITS_MAX_ITEMS = 10;
export const PRODUCT_BENEFIT_MAX_LENGTH = 120;
export const PRODUCT_CHARACTERISTICS_MAX_ITEMS = 20;
export const PRODUCT_CHARACTERISTIC_FIELD_MAX_LENGTH = 120;

export type ProductCharacteristicDraft = {
  name: string;
  value: string;
};

export type ProductContextDraft = {
  name: string;
  category: string;
  brand: string;
  description: string;
  benefits: string[];
  characteristics: ProductCharacteristicDraft[];
};

export type ProductCharacteristicErrors = {
  name?: string;
  value?: string;
};

export type ProductContextFormErrors = {
  form?: string;
  name?: string;
  category?: string;
  brand?: string;
  description?: string;
  benefitsForm?: string;
  benefits: string[];
  characteristicsForm?: string;
  characteristics: ProductCharacteristicErrors[];
};

type ProductValidationResult = {
  errors: ProductContextFormErrors;
  hasErrors: boolean;
  product?: ProductContext;
};

export function createEmptyProductContextDraft(): ProductContextDraft {
  return {
    name: "",
    category: "",
    brand: "",
    description: "",
    benefits: [],
    characteristics: [],
  };
}

export function createEmptyProductContextErrors(): ProductContextFormErrors {
  return {
    benefits: [],
    characteristics: [],
  };
}

export function validateProductContextDraft(draft: ProductContextDraft): ProductValidationResult {
  const errors = createEmptyProductContextErrors();
  const trimmedName = draft.name.trim();
  const trimmedCategory = draft.category.trim();
  const trimmedBrand = draft.brand.trim();
  const trimmedDescription = draft.description.trim();
  const benefits = draft.benefits.map((benefit) => benefit.trim());
  const characteristics = draft.characteristics.map((item) => ({
    name: item.name.trim(),
    value: item.value.trim(),
  }));
  const hasInput =
    Boolean(trimmedName || trimmedCategory || trimmedBrand || trimmedDescription) ||
    benefits.some(Boolean) ||
    characteristics.some((item) => item.name || item.value);

  if (!hasInput) {
    return { errors, hasErrors: false };
  }

  if (!trimmedName) {
    errors.name = "Укажите название товара";
  } else if (trimmedName.length > PRODUCT_NAME_MAX_LENGTH) {
    errors.name = `Не более ${PRODUCT_NAME_MAX_LENGTH} символов`;
  }

  if (trimmedCategory.length > PRODUCT_CATEGORY_MAX_LENGTH) {
    errors.category = `Не более ${PRODUCT_CATEGORY_MAX_LENGTH} символов`;
  }

  if (trimmedBrand.length > PRODUCT_BRAND_MAX_LENGTH) {
    errors.brand = `Не более ${PRODUCT_BRAND_MAX_LENGTH} символов`;
  }

  if (trimmedDescription.length > PRODUCT_DESCRIPTION_MAX_LENGTH) {
    errors.description = `Не более ${PRODUCT_DESCRIPTION_MAX_LENGTH} символов`;
  }

  const normalizedBenefits = benefits.filter(Boolean);
  if (normalizedBenefits.length > PRODUCT_BENEFITS_MAX_ITEMS) {
    errors.benefitsForm = `Можно добавить не более ${PRODUCT_BENEFITS_MAX_ITEMS} преимуществ`;
  }

  benefits.forEach((benefit, index) => {
    if (benefit.length > PRODUCT_BENEFIT_MAX_LENGTH) {
      errors.benefits[index] = `Не более ${PRODUCT_BENEFIT_MAX_LENGTH} символов`;
    }
  });

  const normalizedCharacteristics = characteristics.filter((item) => item.name || item.value);
  if (normalizedCharacteristics.length > PRODUCT_CHARACTERISTICS_MAX_ITEMS) {
    errors.characteristicsForm = `Можно добавить не более ${PRODUCT_CHARACTERISTICS_MAX_ITEMS} характеристик`;
  }

  characteristics.forEach((item, index) => {
    const rowErrors: ProductCharacteristicErrors = {};

    if ((item.name && !item.value) || (!item.name && item.value)) {
      rowErrors.name = !item.name ? "Заполните название" : undefined;
      rowErrors.value = !item.value ? "Заполните значение" : undefined;
    }

    if (item.name.length > PRODUCT_CHARACTERISTIC_FIELD_MAX_LENGTH) {
      rowErrors.name = `Не более ${PRODUCT_CHARACTERISTIC_FIELD_MAX_LENGTH} символов`;
    }

    if (item.value.length > PRODUCT_CHARACTERISTIC_FIELD_MAX_LENGTH) {
      rowErrors.value = `Не более ${PRODUCT_CHARACTERISTIC_FIELD_MAX_LENGTH} символов`;
    }

    if (rowErrors.name || rowErrors.value) {
      errors.characteristics[index] = rowErrors;
    }
  });

  const hasErrors = hasProductContextErrors(errors);
  if (hasErrors) {
    return { errors, hasErrors: true };
  }

  return {
    errors,
    hasErrors: false,
    product: {
      name: trimmedName,
      category: trimmedCategory || undefined,
      brand: trimmedBrand || undefined,
      description: trimmedDescription || undefined,
      benefits: normalizedBenefits.length ? normalizedBenefits : undefined,
      characteristics: normalizedCharacteristics.length ? normalizedCharacteristics : undefined,
    },
  };
}

export function mapProductContextApiErrors(error: ErrorResponse): ProductContextFormErrors {
  const errors = createEmptyProductContextErrors();
  errors.form = error.message;

  for (const detail of error.details ?? []) {
    const field = detail.field?.replace(/^product\./, "");

    if (!field) {
      errors.form = detail.message;
      continue;
    }

    if (field === "product") {
      errors.form = detail.message;
      continue;
    }

    if (field === "name" || field === "category" || field === "brand" || field === "description") {
      errors[field] = detail.message;
      continue;
    }

    if (field === "benefits") {
      errors.benefitsForm = detail.message;
      continue;
    }

    const benefitMatch = field.match(/^benefits\[(\d+)\]$/);
    if (benefitMatch) {
      errors.benefits[Number(benefitMatch[1])] = detail.message;
      continue;
    }

    if (field === "characteristics") {
      errors.characteristicsForm = detail.message;
      continue;
    }

    const characteristicMatch = field.match(/^characteristics\[(\d+)\]\.(name|value)$/);
    if (characteristicMatch) {
      const index = Number(characteristicMatch[1]);
      const key = characteristicMatch[2] as keyof ProductCharacteristicErrors;
      errors.characteristics[index] = { ...errors.characteristics[index], [key]: detail.message };
      continue;
    }
  }

  return errors;
}

function hasProductContextErrors(errors: ProductContextFormErrors) {
  return Boolean(
    errors.form ||
      errors.name ||
      errors.category ||
      errors.brand ||
      errors.description ||
      errors.benefitsForm ||
      errors.characteristicsForm ||
      errors.benefits.some(Boolean) ||
      errors.characteristics.some((item) => Boolean(item?.name || item?.value)),
  );
}
