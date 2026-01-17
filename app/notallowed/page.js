"use client";
import styles from "./notalloed.module.css";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className={styles.notfound_container}>
      <div className={styles.notfound_card}>
        <AlertCircle className={styles.notfound_icon} />
        <h1 className={styles.notfound_title}>403 access denied</h1>
        <p className={styles.notfound_text}>
          Oops! you do not have permission to get in .
        </p>
        <Link href="/home" className={styles.notfound_button}>
          Go Home
        </Link>
      </div>
    </div>
  );
}
