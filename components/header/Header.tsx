import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.links}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link className={styles.button} href="/topics">
          Topics
        </Link>
        {/* <Link href="/">Sign in</Link> */}
      </div>
    </header>
  );
}
