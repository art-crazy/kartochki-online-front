export type LegalLink = {
  href: string;
  label: string;
};

export type LegalSection = {
  title: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
};

export type LegalDocument = {
  eyebrow: string;
  title: string;
  lead: string;
  sections: readonly LegalSection[];
  relatedLinks?: readonly LegalLink[];
};

export type RekvizityRow = {
  label: string;
  value: string;
};
