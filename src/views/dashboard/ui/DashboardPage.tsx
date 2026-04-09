import Link from "next/link";
import { allProjects, dashboardStats, quickStartContent, recentProjects } from "@/views/dashboard/model/content";
import { Badge, Button, CardSurface, ProjectCard, StatCard } from "@/shared/ui";
import { AppShell } from "@/widgets/app/app-shell/ui/AppShell";
import styles from "./DashboardPage.module.scss";

export function DashboardPage() {
  return (
    <AppShell
      title="Дашборд"
      subtitle="Обзор проектов, лимитов и быстрых действий"
      activeKey="dashboard"
      action={
        <>
          <Button variant="darkOutline" size="md" aria-label="Уведомления">
            Уведомления
          </Button>
          <Button as={Link} href="/app/generate" variant="darkPrimary" size="md">
            + Создать карточки
          </Button>
        </>
      }
    >
      <main className={styles.page}>
        <section className={styles.statsGrid} aria-label="Обзор аккаунта">
          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              description={
                stat.accentText ? (
                  <>
                    {stat.description} <span className={styles.statAccent}>{stat.accentText}</span>
                  </>
                ) : (
                  stat.description
                )
              }
              progress={
                stat.progress
                  ? {
                      label: "Лимит текущего тарифа",
                      value: stat.progress.value,
                      max: stat.progress.max,
                      valueLabel: stat.progress.valueLabel,
                    }
                  : undefined
              }
            />
          ))}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Последние проекты</h2>
              <p className={styles.sectionSub}>Недавние генерации и быстрый вход в работу.</p>
            </div>
            <Link href="#projects" className={styles.sectionLink}>
              Все проекты →
            </Link>
          </div>

          <div className={styles.projectsGrid}>
            {recentProjects.map((project) => (
              <Link key={project.id} href={project.href} className={styles.cardLink}>
                <ProjectCard
                  title={project.title}
                  meta={`${project.cardCount} карточек · ${project.updatedAt}`}
                  badge={<MarketplaceBadge marketplace={project.marketplace} />}
                  previews={project.previews}
                />
              </Link>
            ))}

            <Button as={Link} href="/app/generate" variant="darkOutline" size="lg" className={styles.newProjectCard}>
              <span className={styles.newProjectPlus}>+</span>
              <span className={styles.newProjectLabel}>Новый проект</span>
            </Button>
          </div>
        </section>

        <section className={styles.quickStartSection}>
          <CardSurface theme="dark" className={styles.quickStartCard}>
            <div className={styles.quickStartIcon} aria-hidden="true">
              ⚡
            </div>
            <div className={styles.quickStartBody}>
              <h2 className={styles.quickStartTitle}>{quickStartContent.title}</h2>
              <p className={styles.quickStartText}>{quickStartContent.description}</p>
            </div>
            <Button as={Link} href={quickStartContent.href} variant="darkPrimary" size="lg">
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
            {allProjects.map((project) => (
              <Link key={project.id} href={project.href} className={styles.projectRow}>
                <div className={styles.projectThumbs} aria-hidden="true">
                  {project.previews.map((preview) => (
                    <span key={preview} className={styles.projectThumb} style={{ background: preview }} />
                  ))}
                </div>

                <div className={styles.projectInfo}>
                  <div className={styles.projectTitle}>{project.title}</div>
                  <div className={styles.projectMeta}>
                    {project.cardCount} карточек · {marketplaceLabelMap[project.marketplace]} · {project.updatedAt}
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
  ozon: "Ozon",
} as const;

function MarketplaceBadge({ marketplace }: { marketplace: keyof typeof marketplaceLabelMap }) {
  if (marketplace === "wildberries") {
    return <Badge tone="wb">WB</Badge>;
  }

  return <Badge tone="ozon">Ozon</Badge>;
}
