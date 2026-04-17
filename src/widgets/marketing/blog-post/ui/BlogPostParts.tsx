import type { BlogTableCellTone } from "@/entities/blog/model/content";
import styles from "./BlogPost.module.scss";

export function Callout({
  tone,
  title,
  text,
}: {
  tone: "tip" | "warn" | "info";
  title: string;
  text: string;
}) {
  const icon = tone === "tip" ? "💡" : tone === "warn" ? "⚠" : "ℹ";

  return (
    <div className={[styles.callout, styles[`callout${tone}`]].join(" ")}>
      <span className={styles.calloutIcon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.calloutText}>
        <strong>{title}</strong> {text}
      </span>
    </div>
  );
}

export function DataTable({
  head,
  rows,
  emphasizedColumns = [],
  cellTones,
}: {
  head: readonly string[];
  rows: readonly (readonly string[])[];
  emphasizedColumns?: number[];
  cellTones?: readonly (readonly (BlogTableCellTone | null)[])[];
}) {
  return (
    <div className={styles.tableWrap}>
      <table>
        <thead>
          <tr>
            {head.map((cell, index) => (
              <th
                key={`${cell}-${index}`}
                className={emphasizedColumns.includes(index) ? styles.emphasizedHeading : undefined}
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.join("-")}>
              {row.map((cell, index) => {
                const tone = cellTones?.[rowIndex]?.[index];

                return (
                  <td
                    key={`${cell}-${index}`}
                    className={[
                      tone === "success" ? styles.checkCell : undefined,
                      tone === "muted" ? styles.crossCell : undefined,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
