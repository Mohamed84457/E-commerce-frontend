"use client";

import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import StarRateIcon from "@mui/icons-material/StarRate";
import Link from "next/link";
import Productcommercecard from "./productcommercecard";
import Skeletonshow from "../skeleton/skeleton";
import styles from "./latestsales.module.css";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

export default function Toprating() {
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTopRated = useCallback(async () => {
    const controller = new AbortController();
    try {
      const res = await axios.get(
        `${NEXT_PUBLIC_API_URL}/api/top-rated`,
        { signal: controller.signal, timeout: 8000 }
      );
      setTopRated(res.data || []);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error("Error fetching top rated:", err);
      }
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  }, []);

  useEffect(() => {
    fetchTopRated();
  }, [fetchTopRated]);

  const productsList = useMemo(() => {
    return topRated.map((product) => (
      <Link
        key={product.id}
        href={`/website/products/${product.id}`}
        className={styles.cardLink}
      >
        <Productcommercecard pro={product} />
      </Link>
    ));
  }, [topRated]);

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h2 className={styles.heading}>
          <StarRateIcon className={styles.starIcon} />
          Top Rated
        </h2>
        <p className={styles.subHeading}>
          Customers’ favorite products
        </p>
      </header>

      <div className={styles.grid}>
        {loading ? (
          <Skeletonshow length={6} width={260} height={360} />
        ) : topRated.length === 0 ? (
          <p className={styles.empty}>No top-rated products found.</p>
        ) : (
          productsList
        )}
      </div>
    </section>
  );
}
