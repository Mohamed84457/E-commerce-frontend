"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";
// components
import Productcard from "@/app/component/productcard";
import PaginatedItems from "@/app/component/pagination";

// mui
import TextField from "@mui/material/TextField";

export default function Products() {
  // --------------------
  // STATE
  // --------------------
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // --------------------
  // AUTH TOKEN (memoized)
  // --------------------
  const token = useMemo(() => {
    const cookie = new Cookies();
    return cookie.get("ecommercetoken");
  }, []);

  // --------------------
  // FETCH CATEGORIES + PRODUCTS
  // --------------------
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const [categoriesRes, productsRes] = await Promise.all([
        axios.get(`${NEXT_PUBLIC_API_URL}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(
          `${NEXT_PUBLIC_API_URL}/api/products?limit=${limit}&page=${page}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);

      setCategories(categoriesRes.data.data);
      setProducts(productsRes.data.data);
      setTotal(productsRes.data.total);
      setCurrentPage(productsRes.data.current_page);
    } catch (err) {
      console.error("Fetch products error:", err);
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [token, limit, page]);

  // --------------------
  // SEARCH PRODUCTS
  // --------------------
  const searchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/product/search?title=${search}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts(res.data);
      setTotal(res.data.length);
      setCurrentPage(1);
    } catch (err) {
      console.error("Search error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, token]);

  // --------------------
  // INITIAL LOAD + PAGINATION
  // --------------------
  useEffect(() => {
    if (search === "") {
      fetchProducts();
    }
  }, [fetchProducts, search]);

  // --------------------
  // DEBOUNCED SEARCH
  // --------------------
  useEffect(() => {
    if (!search) return;

    const delay = setTimeout(() => {
      setPage(1);
      searchProducts();
    }, 600);

    return () => clearTimeout(delay);
  }, [search, searchProducts]);

  // --------------------
  // CALLBACK AFTER PRODUCT ACTION
  // --------------------
  const makeAction = useCallback(() => {
    if (search) {
      searchProducts();
    } else {
      fetchProducts();
    }
  }, [fetchProducts, searchProducts, search]);

  // --------------------
  // HANDLERS
  // --------------------
  const handleChangePage = (p) => setPage(p);
  const handleChangeLimit = (l) => {
    setLimit(l);
    setPage(1);
  };

  // --------------------
  // RENDER
  // --------------------
  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Products</h2>
        <TextField
          label="Search products..."
          variant="outlined"
          style={{ width: "35%" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ padding: "20px" }}>Loading...</div>
      ) : products.length > 0 ? (
        products.map((product) => (
          <Productcard
            key={product.id}
            product={product}
            categories={categories}
            makeaction={makeAction}
          />
        ))
      ) : (
        <p>No products found.</p>
      )}

      {/* Pagination (disabled during search) */}
      {!search && (
        <PaginatedItems
          changepage={handleChangePage}
          changelimit={handleChangeLimit}
          itemsPerPage={limit}
          datalength={total}
          currentpage={currentPage}
          limit={limit}
        />
      )}
    </div>
  );
}
