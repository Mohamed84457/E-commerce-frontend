"use client";

import axios from "axios";
import { useEffect, useState, useCallback } from "react";
// components
import Categorycommercecard from "./categorycommercecard";
import Link from "next/link";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

export default function Categoriescommerce() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const perPage = 10;

  const fetchCategories = useCallback(async () => {
    if (!hasMore) return;
    setLoading(true);

    try {
      const res = await axios.get(`${NEXT_PUBLIC_API_URL}/api/categories`, {
        params: { limit: perPage, page },
        timeout: 10000,
      });

      setCategories(prev => {
        const combined = [...prev, ...res.data.data];
        // Remove duplicates if API returns duplicates
        const unique = combined.filter(
          (cat, index, self) => index === self.findIndex(c => c.id === cat.id)
        );
        return unique;
      });

      setHasMore(res.data.current_page < res.data.last_page);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Optional: infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 400 &&
        !loading &&
        hasMore
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px" }}>
      {categories.length > 0 ? (
        categories.map(c => (
          <Link key={c.id} href={`/website/categories/${c.id}`}>
            <Categorycommercecard cat={c} />
          </Link>
        ))
      ) : (
        !loading && <p>No categories available.</p>
      )}

      {loading && <p>Loading...</p>}

      {!loading && hasMore && (
        <button
          style={{
            margin: "20px auto",
            padding: "10px 20px",
            display: "block",
            cursor: "pointer",
          }}
          onClick={() => setPage(prev => prev + 1)}
        >
          Load More
        </button>
      )}

      {!hasMore && categories.length > 0 && <p style={{ width: "100%", textAlign: "center" }}>You have reached the end of categories.</p>}
    </div>
  );
}
