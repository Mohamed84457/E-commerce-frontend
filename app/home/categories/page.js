"use client";

import axios from "axios";
import Cookies from "universal-cookie";
import { Suspense, useEffect, useState } from "react";

// components
import CategoryCard from "@/app/component/categorycard";
import Loading from "@/app/component/loading";
// contexts
import { useSnackbar } from "@/app/context/snackbarcontext";
import { useLoading } from "@/app/context/loadingcontext";

// mui
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PaginatedItems from "@/app/component/pagination";
import TextField from "@mui/material/TextField";

import { useMemo } from "react";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

export default function Categories() {
  // loading
  const { showloading, setshowloading } = useLoading();

  const { setshowsnackbar } = useSnackbar();

  const [search, setsearch] = useState("");

  const [categories, setCategories] = useState([]);
  // pagination
  const [page, setpage] = useState(1);
  const [limit, setlimit] = useState(5);
  const [datalength, setdatalength] = useState(0);
  const [current_page, setcurrent_page] = useState(1);

  function handelchangepage(e) {
    setpage(e);
  }
  function handelchangelimit(e) {
    setlimit(e);
  }
  const Cookie = useMemo(() => new Cookies(), []);

  useEffect(() => {
    async function getAllCategories() {
      const token = Cookie.get("ecommercetoken");
      setshowloading(true);
      try {
        const res = await axios.get(
          `${NEXT_PUBLIC_API_URL}/api/categories?limit=${limit}&page=${page}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(res.data);
        setCategories(res.data.data);
        setdatalength(res.data.total);
        setcurrent_page(res.data.current_page);
      } catch (err) {
        if (err.response?.status === 401) {
          setshowsnackbar({
            open: true,
            content: "You are not allowed",
            duration: 4000,
            type: "error",
            vertical: "top",
            horizontal: "center",
          });
        } else {
          setshowsnackbar({
            open: true,
            content: "Failed to fetch categories. Please try again.",
            duration: 4000,
            type: "error",
            vertical: "top",
            horizontal: "center",
          });
          console.error("Error fetching categories:", err);
        }
      } finally {
        setshowloading(false);
      }
    }
    if (search === "") {
      getAllCategories();
    }
  }, [limit, page, search]);

  // search
  async function categorysearch() {
    // token

    const token = Cookie.get("ecommercetoken");
    try {
      const res = await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/category/search?title=${search}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);

      setCategories(res.data);
    } catch (err) {
      setshowsnackbar({
        open: true,
        content: "Search failed. Please try again.",
        duration: 4000,
        type: "error",
        vertical: "top",
        horizontal: "center",
      });
    }
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      if (search !== "") {
        categorysearch();
        setpage(1);
      }
    }, 600);
    return () => {
      clearTimeout(delay);
    };
  }, [search]);

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Categories
        </Typography>
        <TextField
          style={{ width: "35%" }}
          label="search..."
          variant="outlined"
          value={search}
          onChange={(e) => {
            setsearch(e.target.value);
          }}
        />
      </div>
      {!showloading ? (
        <Suspense>
          {categories.length === 0 ? (
            <Typography color="text.secondary">
              No categories available.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {categories.map((cat) => (
                <Grid item key={cat.id} xs={12} sm={6} md={4} lg={3}>
                  <CategoryCard
                    id={cat.id}
                    title={cat.title}
                    image={cat.image}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Suspense>
      ) : (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loading />
        </div>
      )}
      <PaginatedItems
        changepage={handelchangepage}
        limit={limit}
        changelimit={handelchangelimit}
        itemsPerPage={limit}
        datalength={datalength}
        currentpage={current_page}
      />
    </div>
  );
}
