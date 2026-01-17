"use client";
// mui
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
// components
import Productcommercecard from "../website/componets/productcommercecard";

import Image from "next/image";
import styles from "./searchpage.module.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { NEXT_PUBLIC_API_URL } from "../publicurl/URLbase";
import Link from "next/link";
export default function Searchpage() {
  // searched products
  const [searchedproducts, setsearchedproducts] = useState([]);
  const [totalproducts, settotalproducts] = useState(0);

  // search by data
  const [searchdata, setsearchdata] = useState({
    productnamesearch: "",
    categorysearch: "",
    maxprice: "",
    minprice: "",
  });

  // loading
  const [loading, setloading] = useState(false);
  const [categoriesloading, setcategoriesloading] = useState(true);
  // categories
  const [categories, setcategories] = useState([]);
  //   get categories

  useEffect(() => {
    async function getcategories() {
      try {
        const res = await axios.get(
          `${NEXT_PUBLIC_API_URL}/api/categories?limit=50`
        );
        setcategories(res.data.data);
      } catch (error) {
        console.log(error);
      }
      setcategoriesloading(false);
    }
    getcategories();
  }, []);
  function changestate(name, value) {
    setsearchdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  // search
  const confirmsearchedproduct = useCallback(async () => {
    setloading(true);
    try {
      const res = await axios.get(
        `${NEXT_PUBLIC_API_URL}/api/products/search`,
        {
          params: {
            q: searchdata.productnamesearch,
            category: searchdata.categorysearch,
            min_price: searchdata.minprice,
            max_price: searchdata.maxprice,
          },
        }
      );
      setsearchedproducts(res.data.data);
      settotalproducts(res.data.total);
    } catch (error) {
      console.log(error);
    }
    setloading(false);
  }, [searchdata]);

  // handel serach
  function handelclicksearch() {
    confirmsearchedproduct();
  }
  // mapping searched products
  const mappingsearchedproducts = useMemo(() => {
    return searchedproducts.map((p) => {
      return (
        <Link key={p.id} href={`/website/products/${p.id}`}>
          <Productcommercecard pro={p} />
        </Link>
      );
    });
  }, [searchedproducts]);
  // filtring
  useEffect(() => {
    if (!searchdata.productnamesearch) return;

    const timer = setTimeout(() => {
      confirmsearchedproduct();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchdata.categorysearch, searchdata.minprice, searchdata.maxprice]);

  return (
    <div className={styles.serchcontainer}>
      <div >
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <Image
            src="/DMTcommerce.png"
            alt="DMT commerce"
            width={60}
            height={45}
            priority
          />
        </Link>
      </div>
      {/* Search */}
      <div className={styles.searchpage}>
        <TextField
          size="small"
          placeholder="Search products..."
          fullWidth
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (searchdata.productnamesearch) {
                handelclicksearch();
              }
            }
          }}
          onChange={(e) => {
            changestate("productnamesearch", e.target.value);
          }}
        />
        <Button
          disabled={loading || !searchdata.productnamesearch}
          variant="contained"
          onClick={handelclicksearch}
        >
          search
        </Button>
      </div>
      {/* search filter */}

      <div className={styles.filtersearch}>
        <Autocomplete
          onChange={(event, value) => {
            changestate("categorysearch", value || "");
          }}
          disabled={categoriesloading || !searchdata.productnamesearch}
          sx={{ width: 700 }}
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          options={categories.map((option) => option.title)}
          renderInput={(params) => (
            <TextField
              onChange={(e) => {
                changestate("categorysearch", e.target.value);
              }}
              {...params}
              label="category..."
              slotProps={{
                input: {
                  ...params.InputProps,
                  type: "search",
                },
              }}
            />
          )}
        />

        <TextField
          size="small"
          placeholder="min price..."
          type="number"
          disabled={!searchdata.productnamesearch}
          fullWidth
          onChange={(e) => {
            changestate("minprice", e.target.value);
          }}
        />
        <TextField
          size="small"
          placeholder="max price..."
          type="number"
          disabled={!searchdata.productnamesearch}
          fullWidth
          onChange={(e) => {
            changestate("maxprice", e.target.value);
          }}
        />
      </div>
      {/* search result  */}
      <div>
        {loading && <div className={styles.loading}>Searching products...</div>}

        {totalproducts > 0 && (
          <div className={styles.resultCount}>
            {totalproducts} products found
          </div>
        )}
        {totalproducts > 0 ? (
          <div className={styles.productscontainer}>
            {mappingsearchedproducts}
          </div>
        ) : (
          !loading && <div className={styles.emptyState}>No products found</div>
        )}
      </div>
    </div>
  );
}
