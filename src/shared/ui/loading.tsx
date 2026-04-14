import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loaderContainer}>
      <span className={styles.loader}></span>
    </div>
  );
}
