"use client";

import { useState, useEffect, useCallback, use } from "react";
import axios from "axios";
import Productcommercecard from "../../componets/productcommercecard";
import Skeletonshow from "../../skeleton/skeleton";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

import styles from "./specificcategory.module.css";
import Link from "next/link";

export default function CategoryProducts({ params }) {
  // get category data
  const [categorydata, setcategorydata] = useState({
    name: "",
    image: null,
  });
  // fetch category data
  async function fetchcategory() {
    try {
      const res = await axios.get(
        `${NEXT_PUBLIC_API_URL}/api/category/${specificcategory}`
      );

      setcategorydata({
        name: res.data.title,
        image: res.data.image,
      });
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchcategory();
  }, []);
  const { specificcategory } = use(params);

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const perPage = 12;

  const fetchProducts = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const res = await axios.get(
        `${NEXT_PUBLIC_API_URL}/api/products/category/${specificcategory}`,
        {
          params: { page, per_page: perPage },
          timeout: 10000,
        }
      );

      setProducts((prev) => {
        const combined = [...prev, ...res.data.data];
        // Remove duplicates by id
        const uniqueProducts = combined.filter(
          (product, index, self) =>
            index === self.findIndex((p) => p.id === product.id)
        );
        return uniqueProducts;
      });

      setHasMore(res.data.current_page < res.data.last_page);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [page, specificcategory, hasMore, loading]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Infinite scroll with debounce
  useEffect(() => {
    let timer;
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 400 &&
        !loading &&
        hasMore
      ) {
        clearTimeout(timer);
        timer = setTimeout(() => setPage((prev) => prev + 1), 150);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className={styles.category_products_wrapper}>
     <img className={styles.category_image} src={categorydata.image} />
      <h2 className={styles.category_title}>Category: {categorydata.name}</h2>

      <div className={styles.products_grid}>
        {products.map((p) => (
          <Link key={p.id} href={`/website/products/${p.id}`}>
            <Productcommercecard pro={p} />
          </Link>
        ))}

        {loading && <Skeletonshow length={perPage} width={250} height={340} />}
      </div>

      {!loading && hasMore && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className={styles.load_more_btn}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}

      {!hasMore && !loading && products.length > 0 && (
        <p className={styles.end_text}>You have reached the end of products.</p>
      )}
    </div>
  );
}
