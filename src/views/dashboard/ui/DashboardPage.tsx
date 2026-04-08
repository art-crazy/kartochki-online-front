import styles from "./DashboardPage.module.scss";

export function DashboardPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>App Area</p>
        <h1 className={styles.title}>Workspace placeholder</h1>
        <p className={styles.description}>
          This route is reserved for the authenticated product area.
        </p>
      </div>
    </main>
  );
}
