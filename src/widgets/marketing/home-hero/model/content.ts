import heroPreviewAdvantages from "../assets/hero-preview-advantages.webp";
import heroPreviewComposition from "../assets/hero-preview-composition.webp";
import heroPreviewDetails from "../assets/hero-preview-details.webp";
import heroPreviewInfographic from "../assets/hero-preview-infographic.webp";
import heroPreviewMain from "../assets/hero-preview-main.webp";
import heroPreviewSizes from "../assets/hero-preview-sizes.webp";

export const heroMockupPreviews = [
  {
    label: "Главная",
    alt: "Главная карточка товара худи с ключевыми преимуществами и фотографией модели",
    image: heroPreviewMain,
  },
  {
    label: "Инфографика",
    alt: "Карточка товара худи с инфографикой и выносами преимуществ изделия",
    image: heroPreviewInfographic,
  },
  {
    label: "Состав",
    alt: "Карточка товара худи с составом ткани и крупными фрагментами материала",
    image: heroPreviewComposition,
  },
  {
    label: "Размеры",
    alt: "Карточка товара худи с размерной таблицей и параметрами изделия",
    image: heroPreviewSizes,
  },
  {
    label: "Детали",
    alt: "Карточка товара худи с деталями конструкции капюшона, швов и манжет",
    image: heroPreviewDetails,
  },
  {
    label: "Преимущества",
    alt: "Карточка товара худи с преимуществами ткани и адаптацией под маркетплейсы",
    image: heroPreviewAdvantages,
  },
] as const;
