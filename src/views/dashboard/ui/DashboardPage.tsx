"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMarketplaceLabel } from "@/entities/project";
import { getDashboardOptions } from "@/shared/api";
import { Badge, Button, CardSurface } from "@/shared/ui";
import { AppShell } from "@/widgets/app/app-shell/ui/AppShell";
import { mapDashboardResponse } from "@/views/dashboard/model/mappers";
import type { DashboardStat } from "@/views/dashboard/model/content";
import styles from "./DashboardPage.module.scss";

export function DashboardPage() {
  const {
    data: pageContent,
    isError,
    isPending,
    refetch,
  } = useQuery({
    ...getDashboardOptions(),
    select: mapDashboardResponse,
  });

  if (isPending) {
    return (
      <DashboardShell subtitle="Загружаем данные аккаунта">
        <DashboardStateCard title="Загружаем главную" description="Получаем лимиты, проекты и быстрый старт." />
      </DashboardShell>
    );
  }

  if (isError || !pageContent) {
    return (
      <DashboardShell subtitle="Не удалось получить данные аккаунта">
        <DashboardStateCard
          title="Главная не загрузилась"
          description="Проверьте API и повторите запрос."
          action={<Button variant="darkPrimary" onClick={() => void refetch()}>Повторить</Button>}
        />
      </DashboardShell>
    );
  }

  return (
    <AppShell
      title="Главная"
      subtitle={new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date()).replace(/^./, (c) => c.toUpperCase())}
      activeKey="dashboard"
      action={(
        <>
          <Button as={Link} href="/app/generate" variant="darkPrimary" size="md" className={styles.primaryActionButton}>
            + Создать карточки
          </Button>
        </>
      )}
    >
      <main className={styles.page}>
        <section className={styles.statsGrid} aria-label="\u041e\u0431\u0437\u043e\u0440 \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430">
          {pageContent.stats.map((stat) => (
            <CardSurface key={stat.label} theme="dark" className={styles.statCard}>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={getStatValueClassName(stat.variant)}>{renderStatValue(stat)}</div>
              <div className={styles.statSub}>
                {stat.accentText ? (
                  <>
                    {stat.description} <span className={styles.statAccent}>{stat.accentText}</span>
                  </>
                ) : (
                  stat.description
                )}
              </div>
              {stat.progress ? (
                <div className={styles.statProgress} aria-hidden="true">
                  <div className={styles.statProgressFill} style={{ width: `${(stat.progress.value / stat.progress.max) * 100}%` }} />
                </div>
              ) : null}
            </CardSurface>
          ))}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{ "\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u044b" }</h2>
            <Link href="#projects" className={styles.sectionLink}>{ "\u0412\u0441\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u044b \u2192" }</Link>
          </div>

          <div className={styles.projectsGrid}>
            {pageContent.recentProjects.map((project) => (
              <Link key={project.id} href={project.href} className={styles.cardLink}>
                <CardSurface theme="dark" className={styles.projectCard}>
                  <div className={styles.projectPreview}>
                    <ProjectPreviewStrip previewUrls={project.previewUrls} variant="grid" />
                  </div>
                  <div className={styles.projectBody}>
                    <div className={styles.projectName}>{project.title}</div>
                    <div className={styles.projectMeta}>
                      <span>{project.cardCount} { "\u043a\u0430\u0440\u0442\u043e\u0447\u0435\u043a \u00b7 " }{project.updatedAt}</span>
                      <MarketplaceBadge marketplace={project.marketplace} />
                    </div>
                  </div>
                </CardSurface>
              </Link>
            ))}

            <Button as={Link} href="/app/generate" variant="darkOutline" size="lg" className={styles.newProjectCard}>
              <span className={styles.newProjectPlus}>+</span>
              <span className={styles.newProjectLabel}>{ "\u041d\u043e\u0432\u044b\u0439 \u043f\u0440\u043e\u0435\u043a\u0442" }</span>
            </Button>
          </div>
        </section>

        <section className={styles.quickStartSection}>
          <h2 className={styles.sectionTitle}>{ "\u0411\u044b\u0441\u0442\u0440\u044b\u0439 \u0441\u0442\u0430\u0440\u0442" }</h2>
          <CardSurface theme="dark" className={styles.quickStartCard}>
            <div className={styles.quickStartIcon} aria-hidden="true">{"\u26A1"}</div>
            <div className={styles.quickStartBody}>
              <h2 className={styles.quickStartTitle}>{pageContent.quickStart.title}</h2>
              <p className={styles.quickStartText}>{pageContent.quickStart.description}</p>
            </div>
            <Button as={Link} href={pageContent.quickStart.href} variant="darkPrimary" size="lg">
              { "\u041d\u0430\u0447\u0430\u0442\u044C \u2192" }
            </Button>
          </CardSurface>
        </section>

        <section id="projects" className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>{ "\u0412\u0441\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u044b" }</h2>
              <p className={styles.sectionSub}>{ "\u0411\u044b\u0441\u0442\u0440\u044b\u0439 \u0434\u043e\u0441\u0442\u0443\u043f \u043a \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u043d\u044b\u043c \u043d\u0430\u0431\u043e\u0440\u0430\u043c \u043a\u0430\u0440\u0442\u043e\u0447\u0435\u043a." }</p>
            </div>
          </div>

          <div className={styles.projectList}>
            {pageContent.allProjects.map((project) => (
              <Link key={project.id} href={project.href} className={styles.projectRow}>
                <div className={styles.projectRowLead}>
                  <div className={styles.projectThumbs} aria-hidden="true">
                    <ProjectPreviewStrip previewUrls={project.previewUrls} variant="row" />
                  </div>
                  <div className={styles.projectInfo}>
                    <div className={styles.projectTitle}>{project.title}</div>
                    <div className={styles.projectInfoMeta}>
                      {project.cardCount} { "\u043a\u0430\u0440\u0442\u043e\u0447\u0435\u043a \u00b7 " }{getMarketplaceLabel(project.marketplace)}{" \u00b7 "}{project.updatedAt}
                    </div>
                  </div>
                </div>
                <div className={styles.projectRowSide}>
                  <div className={styles.projectRowBadge}>
                    <MarketplaceBadge marketplace={project.marketplace} />
                  </div>
                  <div className={styles.projectActions} aria-hidden="true">
                    <span className={styles.iconButton}>{"\u2193"}</span>
                    <span className={styles.iconButton}>{"\u2192"}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </AppShell>
  );
}

function DashboardShell({ children, subtitle }: { children: ReactNode; subtitle: string }) {
  return (
    <AppShell title="Главная" subtitle={subtitle} activeKey="dashboard">
      <main className={styles.page}>{children}</main>
    </AppShell>
  );
}

function DashboardStateCard({
  action,
  description,
  title,
}: {
  action?: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <CardSurface theme="dark" className={styles.stateCard}>
      <h2 className={styles.stateTitle}>{title}</h2>
      <p className={styles.stateText}>{description}</p>
      {action ? <div className={styles.stateAction}>{action}</div> : null}
    </CardSurface>
  );
}

const statValueClassMap = {
  usage: styles.statValueUsage,
  tariff: styles.statValueTariff,
  default: styles.statValueDefault,
} as const;

function MarketplaceBadge({ marketplace }: { marketplace: string }) {
  const n = marketplace.trim().toLowerCase().replaceAll("-", "_");
  if (n === "wildberries" || n === "wb") return <Badge tone="wb">WB</Badge>;
  if (n === "ozon") return <Badge tone="ozon">Ozon</Badge>;
  if (n === "ym" || n === "yandex" || n === "yandex_market") return <Badge tone="ym">{ "\u042f\u043d\u0434\u0435\u043a\u0441 \u041c\u0430\u0440\u043a\u0435\u0442" }</Badge>;
  return <Badge>{getMarketplaceLabel(marketplace)}</Badge>;
}

function ProjectPreviewStrip({
  previewUrls,
  variant,
}: {
  previewUrls: ReadonlyArray<string>;
  variant: "grid" | "row";
}) {
  const previews = previewUrls.slice(0, 3);
  const slots = previews.length ? previews : Array.from({ length: variant === "grid" ? 3 : 2 }, () => "");

  return (
    <>
      {slots.map((previewUrl, index) => (
        <span
          key={previewUrl || `empty-${variant}-${index}`}
          className={variant === "grid" ? styles.projectThumbPreview : styles.projectThumb}
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt=""
              fill
              sizes={variant === "grid" ? "160px" : "48px"}
              unoptimized
              className={styles.projectThumbImage}
            />
          ) : (
            <span className={styles.projectThumbPlaceholder} />
          )}
        </span>
      ))}
      {!previewUrls.length ? <span className={styles.projectThumbLabel}>{ "\u041d\u0435\u0442 \u043f\u0440\u0435\u0432\u044c\u044e" }</span> : null}
    </>
  );
}

function getStatValueClassName(variant: DashboardStat["variant"]) {
  return statValueClassMap[variant ?? "default"];
}

function renderStatValue(stat: DashboardStat) {
  if (stat.variant === "usage" && stat.valueParts) {
    return (
      <>
        {stat.valueParts.primary}{" "}
        <span className={styles.statValueUsageMuted}>{stat.valueParts.secondary}</span>
      </>
    );
  }
  return stat.value;
}
