"use client";

import { useEffect, useState } from "react";
import Productcard from "@/app/component/productcard";
import Cookies from "universal-cookie";
import axios from "axios";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

export default function Showprojectsofcategory({ categoryid }) {
  const Cookie = new Cookies();

  // states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // trigger refresh
  function makeAction() {
    setRefresh((prev) => !prev);
  }
  // get categories
  useEffect(() => {
    // token
    const token = Cookie.get("ecommercetoken");
    async function getcategories() {
      try {
        const res = await axios.get(`${NEXT_PUBLIC_API_URL}/api/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setCategories(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getcategories();
  }, []);
  // fetch products
  useEffect(() => {
    async function getProducts() {
      const token = Cookie.get("ecommercetoken");
      setLoading(true);
      try {
        const res = await axios.get(`${NEXT_PUBLIC_API_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // filter by category
        console.log(res.data);
        const filtered = res.data.filter(
          (p) => String(p.category) === String(categoryid)
        );
        setProducts(filtered);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    }

    if (categoryid) {
      getProducts();
    }
  }, [categoryid, refresh]); // ✅ rerun if category changes or refresh triggered

  // UI states
  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {products.map((p) => (
        <Productcard
          key={p.id}
          product={p}
          makeaction={makeAction}
          categories={categories}
        />
      ))}
      {products.length === 0 && <p>No products found in this category.</p>}
    </div>
  );
}
