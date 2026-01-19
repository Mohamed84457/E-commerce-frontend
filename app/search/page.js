"use client";

import {
  Box,
  Button,
  TextField,
  Autocomplete,
  Typography,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

import Productcommercecard from "../website/componets/productcommercecard";
import { NEXT_PUBLIC_API_URL } from "../publicurl/URLbase";
import styles from "./searchpage.module.css";

export default function Searchpage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [filters, setFilters] = useState({
    q: "",
    category: "",
    min_price: "",
    max_price: "",
  });

  // 🔹 Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get(`${NEXT_PUBLIC_API_URL}/api/allcategories`);
        setCategories(res.data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setCategoriesLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // 🔹 Search function
  const searchProducts = useCallback(async () => {
    if (!filters.q) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `${NEXT_PUBLIC_API_URL}/api/products/search`,
        { params: filters }
      );
      setProducts(res.data.data);
      setTotal(res.data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // 🔹 Debounce filters
  useEffect(() => {
    const timer = setTimeout(searchProducts, 500);
    return () => clearTimeout(timer);
  }, [filters.category, filters.min_price, filters.max_price]);

  const productList = useMemo(
    () =>
      products.map((p) => (
        <Link key={p.id} href={`/website/products/${p.id}`}>
          <Productcommercecard pro={p} />
        </Link>
      )),
    [products]
  );

  return (
    <Box className={styles.page}>
      {/* 🔹 Header */}
      <Box className={styles.header}>
        <Link href="/">
          <Image src="/DMTcommerce.png" alt="logo" width={70} height={50} />
        </Link>
        <Typography variant="h5" fontWeight="bold">
          Search Products
        </Typography>
      </Box>

      {/* 🔹 Search Card */}
      <Box className={styles.searchCard}>
        <Box className={styles.searchRow}>
          <TextField
            fullWidth
            placeholder="Search for products..."
            onChange={(e) =>
              setFilters((p) => ({ ...p, q: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && searchProducts()}
          />
          <Button
            variant="contained"
            disabled={!filters.q || loading}
            onClick={searchProducts}
          >
            Search
          </Button>
        </Box>

        {/* 🔹 Filters */}
        <Box className={styles.filters}>
          <Autocomplete
            options={categories}
            getOptionLabel={(o) => o.title}
            loading={categoriesLoading}
            onChange={(e, v) =>
              setFilters((p) => ({ ...p, category: v ? v.id : "" }))
            }
            renderInput={(params) => (
              <TextField {...params} label="Category" />
            )}
          />

          <TextField
            label="Min Price"
            type="number"
            onChange={(e) =>
              setFilters((p) => ({ ...p, min_price: e.target.value }))
            }
          />

          <TextField
            label="Max Price"
            type="number"
            onChange={(e) =>
              setFilters((p) => ({ ...p, max_price: e.target.value }))
            }
          />
        </Box>
      </Box>

      {/* 🔹 Results */}
      <Box className={styles.results}>
        {loading && (
          <Box className={styles.loading}>
            <CircularProgress size={30} />
            <Typography>Searching products...</Typography>
          </Box>
        )}

        {!loading && total > 0 && (
          <Typography className={styles.count}>
            {total} products found
          </Typography>
        )}

        {!loading && total === 0 && filters.q && (
          <Typography className={styles.empty}>
            No products found
          </Typography>
        )}

        <Box className={styles.productsGrid}>{productList}</Box>
      </Box>
    </Box>
  );
}
