export const FREE_PLAN_CARD_LIMIT = 5;

function getCardsNoun(value: number) {
  const mod10 = value % 10;
  const mod100 = value % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return "карточка";
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return "карточки";
  }

  return "карточек";
}

export function formatCardsLabel(value: number) {
  return `${value} ${getCardsNoun(value)}`;
}

export const FREE_PLAN_CARDS_LABEL = formatCardsLabel(FREE_PLAN_CARD_LIMIT);
export const FREE_PLAN_CARDS_PER_MONTH_LABEL = `${FREE_PLAN_CARDS_LABEL} в месяц`;
export const FREE_PLAN_CARDS_PER_MONTH_UP_TO_LABEL = `До ${FREE_PLAN_CARDS_PER_MONTH_LABEL}`;

export const FREE_PLAN_SUMMARY = `${FREE_PLAN_CARDS_LABEL} бесплатно, без карты, отмена в любой момент.`;
export const FREE_PLAN_SHORT_SUMMARY = `${FREE_PLAN_CARDS_LABEL} бесплатно, без карты`;
export const FREE_PLAN_CTA_DESCRIPTION = `${FREE_PLAN_CARDS_PER_MONTH_LABEL} без оплаты. Регистрация занимает 30 секунд.`;
export const FREE_PLAN_BLOG_CTA_DESCRIPTION = `${FREE_PLAN_CARDS_LABEL} без карты. Загрузи фото и получи готовый сет за 30 секунд.`;
