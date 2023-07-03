import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="https://en.wikipedia.org/wiki/Next.js">Sign in</Link>
    </header>
  );
}
