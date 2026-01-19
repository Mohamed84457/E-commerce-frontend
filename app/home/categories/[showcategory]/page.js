"use client";

import { useState, useEffect, use, useCallback } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";

import Productcard from "@/app/component/productcard";

// MUI
import {
  Pagination,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  CircularProgress,
} from "@mui/material";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// Context
import { useSnackbar } from "@/app/context/snackbarcontext";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

// CSS
import styles from "./showcategory.module.css";

export default function ShowCategory({ params }) {
  const { showcategory: categoryId } = use(params);
  const { setshowsnackbar } = useSnackbar();

  const router = useRouter();
  const cookies = new Cookies();

  // Dialogs
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Data states
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);

  /* ===============================
     Fetch category + products
  ================================ */
  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          `${NEXT_PUBLIC_API_URL}/api/categories/${categoryId}/products`,
          {
            params: { page, per_page: 8 },
            signal: controller.signal,
          }
        );

        setCategory(res.data.category);
        setProducts(res.data.products?.data ?? []);
        setLastPage(res.data.products?.last_page ?? 1);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setError("Failed to load category data");
          setshowsnackbar({
            open: true,
            content: "Failed to load category",
            type: "error",
            duration: 3000,
            vertical: "top",
            horizontal: "center",
          });
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [categoryId, page, refresh, setshowsnackbar]);

  /* ===============================
     Fetch all categories (once)
  ================================ */
  useEffect(() => {
    axios
      .get(`${NEXT_PUBLIC_API_URL}/api/allcategories`)
      .then((res) => setAllCategories(res.data.data ?? []))
      .catch(() => {});
  }, []);

  /* ===============================
     Helpers
  ================================ */
  const makeAction = useCallback(() => {
    setRefresh((prev) => !prev);
  }, []);

  /* ===============================
     Edit Category
  ================================ */
  async function handleEditCategory() {
    const token = cookies.get("ecommercetoken");
    const formdata = new FormData();

    formdata.append("title", category.title);
    if (category.image instanceof File) {
      formdata.append("image", category.image);
    }

    try {
      await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/category/edit/${categoryId}`,
        formdata,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setshowsnackbar({
        open: true,
        content: "Category updated successfully",
        type: "success",
        duration: 2000,
        vertical: "top",
        horizontal: "center",
      });

      setEditOpen(false);
      setRefresh((p) => !p);
    } catch {
      setshowsnackbar({
        open: true,
        content: "Update failed",
        type: "error",
        duration: 3000,
        vertical: "top",
        horizontal: "center",
      });
    }
  }

  /* ===============================
     Delete Category
  ================================ */
  async function handleDeleteCategory() {
    const token = cookies.get("ecommercetoken");

    try {
      await axios.delete(
        `${NEXT_PUBLIC_API_URL}/api/category/${categoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setshowsnackbar({
        open: true,
        content: "Category deleted",
        type: "success",
        duration: 2000,
        vertical: "top",
        horizontal: "center",
      });

      router.push("/home/categories");
    } catch {
      setshowsnackbar({
        open: true,
        content: "Delete failed",
        type: "error",
        duration: 3000,
        vertical: "top",
        horizontal: "center",
      });
    }
  }

  /* ===============================
     Render states
  ================================ */
  if (loading) {
    return (
      <Box className={styles.centered}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography className={styles.errorText}>{error}</Typography>;
  }

  if (!category) {
    return (
      <Typography className={styles.errorText}>
        Category not found
      </Typography>
    );
  }

  return (
    <>
      <Box className={styles.container}>
        {/* HEADER */}
        <Box className={styles.header}>
          <img
            src={category.image || "/placeholder.jpg"}
            alt={category.title}
            className={styles.headerImg}
            loading="lazy"
          />
          <Box className={styles.overlay} />

          <Box className={styles.headerText}>
            <Typography variant="h4" fontWeight="bold">
              {category.title}
            </Typography>

            <div>
              <Button onClick={() => setEditOpen(true)}>
                <EditIcon />
              </Button>
              <Button color="error" onClick={() => setDeleteOpen(true)}>
                <DeleteIcon />
              </Button>
            </div>
          </Box>
        </Box>

        {/* PRODUCTS */}
        <Box className={styles.productsGrid}>
          {products.length === 0 && (
            <Typography className={styles.noProducts}>
              No products in this category
            </Typography>
          )}

          {products.map((product) => (
            <Productcard
              key={product.id}
              product={product}
              categories={allCategories}
              makeaction={makeAction}
            />
          ))}
        </Box>

        {/* PAGINATION */}
        {lastPage > 1 && (
          <Box className={styles.paginationWrapper}>
            <Pagination
              count={lastPage}
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </Box>
        )}
      </Box>

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="standard"
            label="Category name"
            value={category.title}
            onChange={(e) =>
              setCategory({ ...category, title: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setCategory({ ...category, image: e.target.files[0] })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditCategory}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteCategory}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
