"use client";
import styles from "./notfoundpage.module.css";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className={styles.notfound_container}>
      <div className={styles.notfound_card}>
        <AlertCircle className={styles.notfound_icon} />
        <h1 className={styles.notfound_title}>404</h1>
        <p className={styles.notfound_text}>
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <Link href="/home" className={styles.notfound_button}>
          Go Home
        </Link>
      </div>
    </div>
  );
}
