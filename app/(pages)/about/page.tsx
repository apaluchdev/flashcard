import styles from "./page.module.css";
import { MarkGithubIcon } from "@primer/octicons-react";

export default function Page() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1 style={{ fontSize: 64, color: "#000000" }}>About</h1>
        <p style={{ marginTop: "2rem" }}>
          This is a web application created by me, Adrian Paluch, using Next.js
          13. <br></br> Users can find, create, and share flashcard decks.{" "}
          <br></br>
        </p>
        <a
          style={{ paddingTop: "2rem", textDecoration: "none" }}
          href="https://github.com/apaluchdev/flashcard"
        >
          <MarkGithubIcon size={64} />
        </a>
        <h2 style={{ marginTop: "25%", fontWeight: "800" }}>TODOs</h2>
        <ul style={{ textAlign: "left" }}>
          <li>User authentication</li>
          <li>
            Integrate ChatGPT to help with flashcard creation (give a topic and
            generate a list of questions & answers).
          </li>
        </ul>
      </div>
    </main>
  );
}
