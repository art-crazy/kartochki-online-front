import { gradientPresets } from "@/shared/config/ui-kit";

export const sectionLinks = [
  ["tokens", "Токены"],
  ["typography", "Типографика"],
  ["buttons", "Кнопки"],
  ["inputs", "Поля"],
  ["badges", "Бейджи"],
  ["cards", "Карточки"],
  ["controls", "Контролы"],
  ["navigation", "Навигация"],
  ["feedback", "Фидбек"],
  ["domain", "Доменные"],
  ["mobile", "Мобилка"],
] as const;

export const lightTokens = [
  ["ink", "var(--foreground)"],
  ["paper", "var(--background)"],
  ["card", "var(--background-elevated)"],
  ["accent", "var(--accent)"],
  ["success", "var(--success)"],
  ["danger", "var(--danger)"],
  ["muted", "var(--muted)"],
  ["border", "var(--line)"],
] as const;

export const darkTokens = [
  ["bg", "var(--dark-bg)"],
  ["bg-2", "var(--dark-bg-2)"],
  ["bg-3", "var(--dark-bg-3)"],
  ["text", "var(--dark-text)"],
  ["text-2", "var(--dark-text-2)"],
  ["border", "var(--dark-border)"],
] as const;

export const typographyScale = [
  { meta: "Unbounded 900 · clamp(2rem, 5vw, 4rem)", sample: "AI-генератор карточек для маркетплейсов" },
  { meta: "Unbounded 900 · clamp(1.5rem, 3vw, 2.4rem)", sample: "Продающие карточки для Wildberries и Ozon" },
  { meta: "Unbounded 700 · 1.1rem", sample: "Заголовок карточки, баннера или формы" },
  { meta: "Unbounded 700 · 0.88rem", sample: "Kicker для блоков и микро-заголовков" },
  { meta: "Golos Text 400 · 1rem · lh 1.7", sample: "Основной наборный текст, описания, SEO-контент и пояснения." },
  { meta: "Golos Text 400 · 0.88rem", sample: "Текст интерфейса для карточек, sidebar и списка настроек." },
  { meta: "Golos Text 700 · 0.68rem · uppercase", sample: "Label / Eyebrow / Status" },
  { meta: "monospace · 0.8rem", sample: "token.color.accent" },
] as const;

export const statCards = [
  {
    label: "Карточек создано",
    value: "7",
    valueSuffix: "/ 10",
    description: "Осталось",
    descriptionAccent: "3 карточки",
    progress: { label: "Лимит", value: 7, max: 10 },
  },
  {
    label: "Проектов",
    value: "3",
    valueSuffix: undefined,
    description: "WB: 2 · Ozon: 1",
    descriptionAccent: undefined,
    progress: undefined,
  },
  {
    label: "Тариф",
    value: "Бесплатный",
    valueSuffix: undefined,
    description: "Обновляется 1 мая",
    descriptionAccent: undefined,
    progress: undefined,
  },
] as const;

export const planCards = [
  {
    name: "Старт",
    price: "0 ₽",
    period: "навсегда бесплатно",
    features: [
      { label: "10 карточек/мес", enabled: true },
      { label: "WB, Ozon, Яндекс Маркет", enabled: true },
      { label: "Batch-генерация", enabled: false },
    ],
    actionLabel: "Начать бесплатно",
    popular: false,
  },
  {
    name: "Pro",
    price: "490 ₽/мес",
    period: "50 карточек в месяц",
    features: [
      { label: "50 карточек/мес", enabled: true },
      { label: "Batch до 20 шт", enabled: true },
      { label: "ИИ-копирайтинг", enabled: true },
    ],
    actionLabel: "Подключить →",
    popular: true,
  },
  {
    name: "Бизнес",
    price: "990 ₽/мес",
    period: "200 карточек в месяц",
    features: [
      { label: "200 карточек/мес", enabled: true },
      { label: "Batch до 50 шт", enabled: true },
      { label: "Бренд-шаблоны", enabled: true },
    ],
    actionLabel: "Подключить →",
    popular: false,
  },
] as const;

export const blogCards = [
  {
    title: "Требования к фото для WB 2025: полный гайд",
    meta: "3 апр · 10 мин",
    gradient: "linear-gradient(135deg, #e8f4fd, #b3d9f7)",
    tone: "wb" as const,
  },
  {
    title: "Инфографика для Ozon, которая увеличивает конверсию",
    meta: "28 мар · 7 мин",
    gradient: "linear-gradient(135deg, #fef3e2, #fdd89a)",
    tone: "ozon" as const,
  },
  {
    title: "7 ошибок в карточках, которые допускают 90% продавцов",
    meta: "7 мар · 6 мин",
    gradient: "linear-gradient(135deg, #e8f8f2, #95d5b2)",
    tone: "accent" as const,
  },
] as const;

export const faqItems = [
  {
    title: "Подходит ли для любых категорий товаров?",
    content: "Да, сервис рассчитан на одежду, косметику, электронику, товары для дома и другие ниши.",
  },
  {
    title: "Карточки соответствуют требованиям всех площадок?",
    content: "Да, правила по Wildberries, Ozon и Яндекс Маркету закладываются в шаблоны и регулярно обновляются.",
  },
  {
    title: "Что делать, если закончился лимит карточек?",
    content: "Можно докупить пакет или перейти на следующий тариф без пересоздания проектов.",
  },
] as const;

export const projectPreviewSets = [
  gradientPresets.slice(0, 3),
  gradientPresets.slice(3, 6),
] as const;

export const loadingSteps = [
  { label: "Удаление фона", state: "done" as const, step: "1" },
  { label: "Генерация карточек", state: "done" as const, step: "2" },
  { label: "Применение стиля", state: "active" as const, step: "3" },
  { label: "Финальная сборка", state: "idle" as const, step: "4" },
] as const;
