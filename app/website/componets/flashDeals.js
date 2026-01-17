"use client";

import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Skeletonshow from "../skeleton/skeleton";
import Productcommercecard from "./productcommercecard";
import styles from "./latestsales.module.css";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

export default function FlashDeals() {
  const [flashDeals, setflashDeals] = useState([]);
  const [loading, setLoading] = useState(true);

 const fetchFlashDeals = useCallback(async () => {
  try {
    const res = await axios.get(
      `${NEXT_PUBLIC_API_URL}/api/flash-deals`,
      { timeout: 8000 }
    );
    setflashDeals(res.data || []);
  } catch (err) {
    console.error("Error fetching flash deals:", err);
  } finally {
    setLoading(false);
  }
}, []);


  useEffect(() => {
    fetchFlashDeals();
  }, [fetchFlashDeals]);

  const productsList = useMemo(() => {
    return flashDeals.map((product) => (
      <Link
        key={product.id}
        href={`/website/products/${product.id}`}
        className={styles.cardLink}
      >
        <Productcommercecard pro={product} />
      </Link>
    ));
  }, [flashDeals]);

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Special Offers</h2>
        <p className={styles.subHeading}>
          Fresh arrivals with the best prices
        </p>
      </header>

      <div className={styles.grid}>
        {loading ? (
          <Skeletonshow length={8} width={260} height={360} />
        ) : flashDeals.length === 0 ? (
          <p className={styles.empty}>No products available.</p>
        ) : (
          productsList
        )}
      </div>
    </section>
  );
}
