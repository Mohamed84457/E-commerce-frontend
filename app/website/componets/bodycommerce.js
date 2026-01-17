"use client";

import { useMemo } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Image from "next/image";
import Link from "next/link";

// components
import Categorycommerce from "./categorycommerce";

import styles from "../body.module.css";

export default function BodyCommerce({ categories }) {
  const categoriesMapping = useMemo(
    () =>
      categories.map((c) => (
        <Link key={c.id} href={`/website/categories/${c.id}`}>
          <Categorycommerce title={c.title} />
        </Link>
      )),
    [categories]
  );

  return (
    <div id={styles.bodycommerce}>
      {/* Hero section */}
      <section className={styles.hero}>
        {/* Lazy background image */}
        <div className={styles.heroImage}>
          <Image
            src="/cyber-monday-shopping-sales.jpg"
            alt="DMT commerce "
            fill
            priority={false}
            sizes="100vw"
            placeholder="blur"
            blurDataURL="/blur-placeholder.png"
            className={styles.heroImg}
          />
        </div>

        {/* Content */}
        <div className={styles.heroContent}>
          <Typography variant="h2" className={styles.title}>
            DMT commerce
          </Typography>

          <p className={styles.subtitle}>
            Hello, welcome to my ecommerce website. <br />
            Here you can find everything.
          </p>

         <Link href="/website/categories" variant="contained" className={styles.exploreBtn}>
            Explore
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section id={styles.categoriescommerc}>
        {categoriesMapping}
        <Link href="/website/categories" className={styles.moreLink}>
          more...
        </Link>
      </section>
    </div>
  );
}
