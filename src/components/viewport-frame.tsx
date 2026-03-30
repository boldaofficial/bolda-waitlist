import styles from "./viewport-frame.module.css";

export function ViewportFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={styles.shell}>
      <div className={styles.frame}>{children}</div>
    </main>
  );
}
