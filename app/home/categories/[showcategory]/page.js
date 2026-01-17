"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";
import axios from "axios";
// components
import Showprojectsofcategory from "./showprojectofcategory";

// mui
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// context
import { useSnackbar } from "@/app/context/snackbarcontext";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

export default function ShowCategory({ params }) {
  const { setshowsnackbar } = useSnackbar();
  const router = useRouter();
  const Cookie = new Cookies();

  const { showcategory: categoryId } = use(params); // ✅ unwrapped

  // states
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [createddate, setcreateddate] = useState("");
  const [updateddate, setupdateddate] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch category
  useEffect(() => {
    async function getCategory() {
      const token = Cookie.get("ecommercetoken");
      try {
        const res = await axios.get(
          `${NEXT_PUBLIC_API_URL}/api/category/${categoryId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(res);
        setTitle(res.data.title);
        setImage(res.data.image);
        setcreateddate(res.data.created_at);
        setupdateddate(res.data.updated_at);
      } catch (err) {
        setError("Failed to load category.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    getCategory();
  }, [categoryId]);

  // edit
  async function handleEditCategory() {
    const token = Cookie.get("ecommercetoken");
    const formdata = new FormData();
    formdata.append("title", title);
    if (image instanceof File) formdata.append("image", image);

    try {
      await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/category/edit/${categoryId}`,
        formdata,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setshowsnackbar({
        open: true,
        content: "Category updated successfully",
        duration: 2000,
        type: "success",
        vertical: "top",
        horizontal: "center",
      });

      setEditOpen(false);
      router.refresh();
    } catch (err) {
      setshowsnackbar({
        open: true,
        content: "Update failed",
        duration: 4000,
        type: "error",
        vertical: "top",
        horizontal: "center",
      });
    }
  }

  // delete
  async function handleDeleteCategory() {
    const token = Cookie.get("ecommercetoken");

    try {
      await axios.delete(`${NEXT_PUBLIC_API_URL}/api/category/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setshowsnackbar({
        open: true,
        content: "Category deleted",
        duration: 2000,
        type: "success",
        vertical: "top",
        horizontal: "center",
      });

      setDeleteOpen(false);
      router.push("/home/categories");
    } catch (err) {
      setshowsnackbar({
        open: true,
        content: "Delete failed",
        duration: 4000,
        type: "error",
        vertical: "top",
        horizontal: "center",
      });
    }
  }

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-center" style={{ color: "red", fontWeight: "bold" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ height: "100vh" }}>
      {/* image + title */}
      <div style={{ height: "45%", position: "relative", borderRadius: "8px" }}>
        <img
          src={image instanceof File ? URL.createObjectURL(image) : image}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
          loading="lazy"
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0))",
          }}
        />

        <div
          style={{
            zIndex: "10",
            position: "absolute",
            bottom: "20px",
            left: "20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <h1
              style={{
                color: "white",
                fontSize: "2rem",
                fontWeight: "bold",
                textShadow: "0px 2px 6px rgba(0,0,0,0.6)",
              }}
            >
              {title}
            </h1>
            <div>
              <Button onClick={() => setEditOpen(true)} variant="text">
                <EditIcon />
              </Button>
              <Button
                onClick={() => setDeleteOpen(true)}
                variant="text"
                style={{ color: "#f93c3c" }}
              >
                <DeleteIcon />
              </Button>
            </div>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <h3 style={{ color: "#fff", textShadow: "0px 0px 10px #000" }}>
              Created :<span style={{ color: "#18a0e9ff" }}>{createddate}</span>
            </h3>
            <h3 style={{ color: "#fff", textShadow: "0px 0px 10px #000" }}>
              Updated :<span style={{ color: "#18a0e9ff" }}>{updateddate}</span>
            </h3>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Showprojectsofcategory categoryid={categoryId} />
      </div>
      {/* edit dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            required
            margin="dense"
            label="Category name"
            fullWidth
            variant="standard"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button disabled={!title || loading} onClick={handleEditCategory}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* delete dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Deleting Category</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            style={{ background: "#f52e2e", color: "#fff" }}
            onClick={handleDeleteCategory}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
