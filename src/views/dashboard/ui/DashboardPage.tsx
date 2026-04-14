import Link from "next/link";
import { loadDashboardContent } from "@/views/dashboard/model/api";
import {
  type DashboardPageContent,
  type DashboardStat,
} from "@/views/dashboard/model/content";
import { Badge, Button, CardSurface } from "@/shared/ui";
import { AppShell } from "@/widgets/app/app-shell/ui/AppShell";
import styles from "./DashboardPage.module.scss";

type DashboardPageProps = {
  content?: DashboardPageContent;
};

export async function DashboardPage({ content }: DashboardPageProps) {
  const pageContent = content ?? (await loadDashboardContent());

  return (
    <AppShell
      title="Дашборд"
      subtitle="Среда, 8 апреля 2025"
      activeKey="dashboard"
      action={
        <>
          <Button variant="darkOutline" size="md" iconOnly className={styles.notificationButton} aria-label="Уведомления">
            🔔
          </Button>
          <Button as={Link} href="/app/generate" variant="darkPrimary" size="md">
            + Создать карточки
          </Button>
        </>
      }
    >
      <main className={styles.page}>
        <section className={styles.statsGrid} aria-label="Обзор аккаунта">
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
            <h2 className={styles.sectionTitle}>Последние проекты</h2>
            <Link href="#projects" className={styles.sectionLink}>
              Все проекты →
            </Link>
          </div>

          <div className={styles.projectsGrid}>
            {pageContent.recentProjects.map((project) => (
              <Link key={project.id} href={project.href} className={styles.cardLink}>
                <CardSurface theme="dark" className={styles.projectCard}>
                  <div className={styles.projectPreview}>
                    {project.previews.map((preview) => (
                      <span key={preview} className={styles.projectThumbPreview} style={{ background: preview }} />
                    ))}
                  </div>
                  <div className={styles.projectBody}>
                    <div className={styles.projectName}>{project.title}</div>
                    <div className={styles.projectMeta}>
                      <span>
                        {project.cardCount} карточек · {project.updatedAt}
                      </span>
                      <MarketplaceBadge marketplace={project.marketplace} />
                    </div>
                  </div>
                </CardSurface>
              </Link>
            ))}

            <Button as={Link} href="/app/generate" variant="darkOutline" size="lg" className={styles.newProjectCard}>
              <span className={styles.newProjectPlus}>+</span>
              <span className={styles.newProjectLabel}>Новый проект</span>
            </Button>
          </div>
        </section>

        <section className={styles.quickStartSection}>
          <h2 className={styles.sectionTitle}>Быстрый старт</h2>
          <CardSurface theme="dark" className={styles.quickStartCard}>
            <div className={styles.quickStartIcon} aria-hidden="true">
              ⚡
            </div>
            <div className={styles.quickStartBody}>
              <h2 className={styles.quickStartTitle}>{pageContent.quickStart.title}</h2>
              <p className={styles.quickStartText}>{pageContent.quickStart.description}</p>
            </div>
            <Button as={Link} href={pageContent.quickStart.href} variant="darkPrimary" size="lg">
              Начать →
            </Button>
          </CardSurface>
        </section>

        <section id="projects" className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Все проекты</h2>
              <p className={styles.sectionSub}>Быстрый доступ к сохранённым наборам карточек.</p>
            </div>
          </div>

          <div className={styles.projectList}>
            {pageContent.allProjects.map((project) => (
              <Link key={project.id} href={project.href} className={styles.projectRow}>
                <div className={styles.projectThumbs} aria-hidden="true">
                  {project.previews.map((preview) => (
                    <span key={preview} className={styles.projectThumb} style={{ background: preview }} />
                  ))}
                </div>

                <div className={styles.projectInfo}>
                  <div className={styles.projectTitle}>{project.title}</div>
                  <div className={styles.projectMeta}>
                    {project.cardCount} карточек · {getMarketplaceLabel(project.marketplace)} · {project.updatedAt}
                  </div>
                </div>

                <MarketplaceBadge marketplace={project.marketplace} />

                <div className={styles.projectActions} aria-hidden="true">
                  <span className={styles.iconButton}>↓</span>
                  <span className={styles.iconButton}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </AppShell>
  );
}

const marketplaceLabelMap = {
  wildberries: "Wildberries",
  wb: "Wildberries",
  ozon: "Ozon",
  ym: "Яндекс Маркет",
  yandex: "Яндекс Маркет",
  yandex_market: "Яндекс Маркет",
} as const;

const statValueClassMap = {
  usage: styles.statValueUsage,
  tariff: styles.statValueTariff,
  default: styles.statValueDefault,
} as const;

function MarketplaceBadge({ marketplace }: { marketplace: string }) {
  const normalizedMarketplace = normalizeMarketplace(marketplace);

  if (normalizedMarketplace === "wildberries" || normalizedMarketplace === "wb") {
    return <Badge tone="wb">WB</Badge>;
  }

  if (normalizedMarketplace === "ozon") {
    return <Badge tone="ozon">Ozon</Badge>;
  }

  if (isYandexMarket(normalizedMarketplace)) {
    return <Badge tone="ym">Яндекс Маркет</Badge>;
  }

  return <Badge>{getMarketplaceLabel(marketplace)}</Badge>;
}

function getMarketplaceLabel(marketplace: string) {
  const normalizedMarketplace = normalizeMarketplace(marketplace);

  return marketplaceLabelMap[normalizedMarketplace as keyof typeof marketplaceLabelMap] ?? marketplace;
}

function normalizeMarketplace(marketplace: string) {
  return marketplace.trim().toLowerCase().replaceAll("-", "_");
}

function isYandexMarket(marketplace: string) {
  return marketplace === "ym" || marketplace === "yandex" || marketplace === "yandex_market";
}

function getStatValueClassName(variant: DashboardStat["variant"]) {
  return statValueClassMap[variant ?? "default"];
}

function renderStatValue(stat: DashboardStat) {
  if (stat.variant === "usage" && stat.valueParts) {
    return (
      <>
        {stat.valueParts.primary} <span className={styles.statValueUsageMuted}>{stat.valueParts.secondary}</span>
      </>
    );
  }

  return stat.value;
}
