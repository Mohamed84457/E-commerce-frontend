"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Cookies from "universal-cookie";

// MUI
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CloudUpload as CloudUploadIcon,
  CallReceived as CallReceivedIcon,
  CallMade as CallMadeIcon,
  ArrowOutward as ArrowOutwardIcon,
} from "@mui/icons-material";

import styles from "../home/products/product.module.css";
import { Dateconvertfromiso } from "../heelpers/dataconvert";
import { NEXT_PUBLIC_API_URL } from "../publicurl/URLbase";

export default function Productcard({ product, makeaction, categories=[] }) {
  const Cookie = new Cookies();
  const token = Cookie.get("ecommercetoken");

  // loading
  const [loading, setLoading] = useState(false);

  // image selection
  const fileInput = useRef(null);
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  // dialogs
  const [openDialog, setOpenDialog] = useState({
    delete: false,
    edit: false,
    addImage: false,
    deleteImage: false,
  });

  const toggleDialog = (key, value) =>
    setOpenDialog((prev) => ({ ...prev, [key]: value }));

  // new product data
  const [newData, setNewData] = useState({
    title: product.title,
    description: product.description,
    category: product.category,
    price: product.price,
    discount: product.discount,
    About: product.About,
    stock: product.stock,
  });

  const buttonDisabled =
    loading ||
    !newData.title ||
    !newData.description ||
    !newData.price ||
    !newData.discount ||
    !newData.About;

  // category name directly from props
  const categoryName =
    categories.find((c) => c.id === product.category)?.title ?? "Uncategorized";

  // ==============================
  // API handlers
  // ==============================

  async function handleDeleteProduct() {
    try {
      await axios.delete(`${NEXT_PUBLIC_API_URL}/api/product/${product.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      makeaction();
    } catch (err) {
      console.error(err);
    } finally {
      toggleDialog("delete", false);
    }
  }

  async function handleEditProduct() {
    setLoading(true);
    try {
      const formProduct = new FormData();
      Object.entries(newData).forEach(([key, val]) =>
        formProduct.append(key, key === "stock" ? Number(val) : val)
      );

      await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/product/edit/${product.id}`,
        formProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      makeaction();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      toggleDialog("edit", false);
    }
  }

  async function handleAddImages() {
    if (!images.length) return;
    setLoading(true);
    try {
      for (let img of images) {
        const form = new FormData();
        form.append("image", img);
        form.append("product_id", product.id);
        await axios.post(`${NEXT_PUBLIC_API_URL}/api/product-img/add`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      makeaction();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setImages([]);
      toggleDialog("addImage", false);
    }
  }

  async function handleDeleteImage(id) {
    setLoading(true);
    try {
      await axios.delete(`${NEXT_PUBLIC_API_URL}/api/product-img/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      makeaction();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ==============================
  // Handlers
  // ==============================
  function handleInputChange(e) {
    setNewData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // ==============================
  // Render
  // ==============================
  return (
    <div className={styles.productCard}>
      {/* Product Images */}

      <div className={styles.imagecontainer}>
        <img
          src={
            product.images.length > 0
              ? product.images[currentImage].image
              : "/placeholder.png"
          }
          alt="product"
          className={styles.mainImage}
          width={400}
          height={400}
          sizes="(max-width: 768px) 100vw, 400px"
          loading="lazy"
        />
        <h3 className={styles.productName}>{product.title}</h3>

        <div className={styles.thumbnailRow}>
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img.image}
              width={80}
              height={80}
              alt={`thumbnail-${index}`}
              className={`${styles.thumbnail} ${
                index === currentImage ? styles.activeThumb : ""
              }`}
              onClick={() => setCurrentImage(index)}
              loading="lazy"
            />
          ))}
        </div>
      </div>

      {/* Product Data */}
      <div className={styles.productData}>
        <h3>
          Category: <span>{categoryName}</span>
        </h3>
        <h3>
          Description: <span>{product.description}</span>
        </h3>
        <h3>
          Price:
          <span
            style={{
              textDecoration: product.discount > 0 ? "line-through" : "",
            }}
          >
            {product.price} $
          </span>
        </h3>
        <h3>
          Discount: <span>{product.discount} %</span>
        </h3>
        <h3>
          Total:
          <span>
            {product.discount > 0
              ? product.price - (product.price * product.discount) / 100
              : product.price}{" "}
            $
          </span>
        </h3>
        <h3>
          About: <span>{product.About}</span>
        </h3>
        <h3>
          stock: <span>{product.stock}</span>
        </h3>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <Tooltip title="delete product">
          <Button
            onClick={() => toggleDialog("delete", true)}
            style={{ color: "#e72f2fff", width: "100%" }}
            variant="text"
          >
            <DeleteIcon />
          </Button>
        </Tooltip>
        <Tooltip title="edit product">
          <Button
            onClick={() => toggleDialog("edit", true)}
            style={{ width: "100%" }}
            variant="text"
          >
            <EditIcon />
          </Button>
        </Tooltip>
        <Tooltip title="add images">
          <Button
            onClick={() => toggleDialog("addImage", true)}
            style={{ width: "100%" }}
            variant="text"
          >
            <CallReceivedIcon />
          </Button>
        </Tooltip>
        <Tooltip title="delete images">
          <Button
            onClick={() => toggleDialog("deleteImage", true)}
            style={{ width: "100%" }}
            variant="text"
          >
            <CallMadeIcon />
          </Button>
        </Tooltip>

        <div
          id="date"
          style={{
            height: "40%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <h4>
            created :{" "}
            <span style={{ color: "#1f8eefff" }}>
              {Dateconvertfromiso(product.created_at)}
            </span>
          </h4>
          <h4>
            updated :
            <span style={{ color: "#1f8eefff" }}>
              {" "}
              {Dateconvertfromiso(product.updated_at)}
            </span>
          </h4>
        </div>
      </div>

      {/* Delete Product Dialog */}
      <Dialog
        open={openDialog.delete}
        onClose={() => toggleDialog("delete", false)}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => toggleDialog("delete", false)}>Cancel</Button>
          <Button
            style={{ background: "#e72f2fff", color: "#fff" }}
            onClick={handleDeleteProduct}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog
        open={openDialog.edit}
        onClose={() => toggleDialog("edit", false)}
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <form>
            <Select
              name="category"
              value={newData.category}
              onChange={handleInputChange}
              fullWidth
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.title}
                </MenuItem>
              ))}
            </Select>

            {[
              "title",
              "description",
              "price",
              "discount",
              "About",
              "stock",
            ].map((field) => (
              <TextField
                key={field}
                value={newData[field]}
                onChange={handleInputChange}
                margin="dense"
                name={field}
                label={field}
                type={
                  field === "price" || field === "discount" || field === "stock"
                    ? "number"
                    : "text"
                }
                fullWidth
                variant="standard"
                required
              />
            ))}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => toggleDialog("edit", false)}>Cancel</Button>
          <Button
            disabled={buttonDisabled}
            onClick={handleEditProduct}
            style={{
              background: buttonDisabled ? "#858282ff" : "#117ae9ff",
              color: "#fff",
            }}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Images Dialog */}
      <Dialog
        open={openDialog.addImage}
        onClose={() => toggleDialog("addImage", false)}
      >
        <DialogTitle>Add Images</DialogTitle>
        <DialogContent>
          <div
            onClick={() => fileInput.current.click()}
            className={styles.upload}
          >
            <CloudUploadIcon style={{ fontSize: "55px", color: "#338ab8ff" }} />
            <h3>Upload new images</h3>
            <input
              ref={fileInput}
              hidden
              multiple
              type="file"
              onChange={(e) =>
                setImages((prev) => [...prev, ...Array.from(e.target.files)])
              }
            />
          </div>
          <div>
            {images.map((img) => (
              <div key={img.name} className={styles.imagePreview}>
                <img
                  src={URL.createObjectURL(img)}
                  width={80}
                  height={80}
                  alt={img.name}
                  loading="lazy"
                />
                <h3>{img.name}</h3>
                <h3>
                  {img.size / 1024 < 900
                    ? `${(img.size / 1024).toFixed(2)} kb`
                    : `${(img.size / (1024 * 1024)).toFixed(2)} mb`}
                </h3>
                <IconButton
                  onClick={() => setImages(images.filter((i) => i !== img))}
                >
                  <ArrowOutwardIcon />
                </IconButton>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => toggleDialog("addImage", false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddImages}
            disabled={!images.length || loading}
            style={{
              background: !images.length ? "#6b6969ff" : "#117ae9ff",
              color: "#fff",
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Images Dialog */}
      <Dialog
        open={openDialog.deleteImage}
        onClose={() => toggleDialog("deleteImage", false)}
      >
        <DialogTitle>Delete Images</DialogTitle>
        <DialogContent>
          {product.images.map((old) => (
            <div key={old.id} className={styles.imagePreview}>
              <img
                src={old.image}
                width={80}
                height={80}
                alt={`old-${old.id}`}
                loading="lazy"
              />
              <h3>{old.id}</h3>
              <IconButton
                disabled={loading}
                onClick={() => handleDeleteImage(old.id)}
              >
                <ArrowOutwardIcon />
              </IconButton>
            </div>
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => toggleDialog("deleteImage", false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
