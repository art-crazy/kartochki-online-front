type JsonLdValue = Record<string, unknown> | ReadonlyArray<unknown>;

type SeoJsonLdProps = {
  data: JsonLdValue;
};

export function SeoJsonLd({ data }: SeoJsonLdProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
