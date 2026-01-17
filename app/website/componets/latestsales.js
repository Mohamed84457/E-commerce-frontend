"use client";

import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Skeletonshow from "../skeleton/skeleton";
import Productcommercecard from "./productcommercecard";
import styles from "./latestsales.module.css";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

export default function Latestsales() {
  const [latestSales, setLatestSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLatestSales = useCallback(async () => {
    const controller = new AbortController();
    try {
      const res = await axios.get(
        `${NEXT_PUBLIC_API_URL}/api/latest-sale`,
        { signal: controller.signal, timeout: 8000 }
      );
      setLatestSales(res.data || []);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error("Error fetching latest sales:", err);
      }
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  }, []);

  useEffect(() => {
    fetchLatestSales();
  }, [fetchLatestSales]);

  const productsList = useMemo(() => {
    return latestSales.map((product) => (
      <Link
        key={product.id}
        href={`/website/products/${product.id}`}
        className={styles.cardLink}
      >
        <Productcommercecard pro={product} />
      </Link>
    ));
  }, [latestSales]);

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h2 className={styles.heading}>🔥 Latest Products</h2>
        <p className={styles.subHeading}>
          Fresh arrivals with the best prices
        </p>
      </header>

      <div className={styles.grid}>
        {loading ? (
          <Skeletonshow length={8} width={260} height={360} />
        ) : latestSales.length === 0 ? (
          <p className={styles.empty}>No products available.</p>
        ) : (
          productsList
        )}
      </div>
    </section>
  );
}
