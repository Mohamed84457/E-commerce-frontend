"use client";

import styles from "./addproduct.module.css";
// mui
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";

// icons
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

import { useEffect, useRef, useState } from "react";

import Cookies from "universal-cookie";
import axios from "axios";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

export default function Addproduct() {
  //loading
  const [loading, setloading] = useState(false);
  // open input file by useref
  const fileinput = useRef("");

  // form data
  const [productdata, setproductdata] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    category: "",
    About: "",
    stock: 0,
  });
  // product id
  const [productid, setproductid] = useState();
  // send new one
  const [send, setsend] = useState(false);
  const dummy = {
    title: "dummy",
    category: 1,
    description: "dummy",
    price: 200,
    discount: 0,
    About: "about",
  };

  const [images, setimages] = useState([]);

  //   handel change
  function handelchange(e) {
    setproductdata({ ...productdata, [e.target.name]: e.target.value });
  }
  const Cookie = new Cookies();

  // get categories
  const [categories, setcategories] = useState([]);

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

        setcategories(res.data.data);
      } catch (err) {
        console.log(err);
      }
    }
    getcategories();
  }, []);
  // ===get categories===

  // handel out photo
  function handleDeletePhoto(name) {
    setimages((prev) => prev.filter((i) => i.name !== name));
  }

  // handel mave image and display it
  function handelsmooth(name) {
    const contain = document.getElementsByName(name)[0];
    contain.style.transition = ".5s";
    contain.style.transform = "translate(1500px, 0px)";
    setTimeout(() => {
      contain.style.display = "none";
    }, 200);
  }

  // make product from draft to published
  async function handeladdproduct() {
    // token
    setloading(true);
    const token = Cookie.get("ecommercetoken");

    const productform = new FormData();
    productform.append("title", productdata.title);
    productform.append("description", productdata.description);
    productform.append("price", productdata.price);
    productform.append("discount", productdata.discount);
    productform.append("category", productdata.category);
    productform.append("About", productdata.About);
    productform.append("stock", productdata.stock);

    for (let n = 0; n < images.length; n++) {
      console.log(images[n]);
      productform.append("images[]", images[n]);
    }

    try {
      const res = await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/product/edit/${productid}`,
        productform,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("success");
      console.log(res.data);
      setTimeout(() => {
        window.location.href = "/home/products";
      }, 1000);
    } catch (err) {
      console.log(err);
      setloading(false);
    }
  }

  //   mapping
  const mappingcategories = categories.map((cat) => {
    return (
      <MenuItem key={cat.id} value={cat.id}>
        {cat.title}
      </MenuItem>
    );
  });

  // make new product
  async function handelmakenewproduct(e) {
    setproductdata({
      ...productdata,
      category: e.target.value,
    });

    if (!send) {
      const token = Cookie.get("ecommercetoken");
      try {
        const res = await axios.post(
          `${NEXT_PUBLIC_API_URL}/api/product/add`,
          dummy,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setproductid(res.data.id);
        console.log(res.data.id);
      } catch (err) {
        console.log(err);
      }
    }
    setsend(true);
  }

  const mappingimages = images.map((i) => {
    return (
      <div
        key={i.name}
        name={i.name}
        style={{
          margin: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "15px",
          padding: "5px",
          border: "solid 1px #000",
          borderRadius: "8px",
        }}
      >
        <img
          style={{ borderRadius: "8px" }}
          src={URL.createObjectURL(i)}
          width={"70px"}
          loading="lazy"
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h3 style={{ color: "#12a0deff" }}>{i.name}</h3>
          <h3 style={{ color: "#322" }}>
            {i.size / 1024 < 900
              ? `${(i.size / 1024).toFixed(2)} kb`
              : `${(i.size / (1024 * 1024)).toFixed(2)} mb`}
          </h3>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            flexGrow: "2",
          }}
        >
          <IconButton
            onClick={() => {
              handelsmooth(i.name);
              setloading(true);
              setTimeout(() => {
                handleDeletePhoto(i.name);
                setloading(false);
              }, 300);
            }}
            aria-label="delete"
          >
            <ArrowOutwardIcon />
          </IconButton>
        </div>
      </div>
    );
  });

  return (
    <div className={styles.container}>
      <h2>add product</h2>
      <div className={styles.formcontainer}>
        <FormControl sx={{ width: "100%" }} size="small">
          <InputLabel>category</InputLabel>
          <Select
            label="category"
            value={productdata.category}
            onChange={(e) => {
              handelmakenewproduct(e);
            }}
          >
            <MenuItem disabled value={""}>
              select category
            </MenuItem>
            {mappingcategories}
          </Select>
        </FormControl>

        <TextField
          value={productdata.title}
          onChange={(e) => {
            handelchange(e);
          }}
          disabled={productdata.category === ""}
          style={{ width: "100%" }}
          label="title"
          variant="outlined"
          name="title"
        />

        <TextField
          value={productdata.description}
          onChange={(e) => {
            handelchange(e);
          }}
          disabled={productdata.category === ""}
          style={{ width: "100%" }}
          label="description"
          variant="outlined"
          name="description"
        />
        <TextField
          value={productdata.price}
          onChange={(e) => {
            handelchange(e);
          }}
          disabled={productdata.category === ""}
          style={{ width: "100%" }}
          label="price"
          variant="outlined"
          name="price"
          type="number"
        />
        <TextField
          value={productdata.discount}
          onChange={(e) => {
            handelchange(e);
          }}
          disabled={productdata.category === ""}
          style={{ width: "100%" }}
          label="discount"
          variant="outlined"
          name="discount"
          type="number"
        />
        <TextField
          value={productdata.About}
          onChange={(e) => {
            handelchange(e);
          }}
          disabled={productdata.category === ""}
          style={{ width: "100%" }}
          label="about "
          variant="outlined"
          name="About"
        />
        {/* stock */}
        <TextField
          value={productdata.stock}
          onChange={(e) => {
            handelchange(e);
          }}
          type="number"
          disabled={productdata.category === ""}
          style={{ width: "100%" }}
          label="stock "
          variant="outlined"
          name="stock"
        />

        {/* images inputs */}
        <div
          onClick={() => {
            fileinput.current.click();
          }}
          className={styles.upload}
        >
          <CloudUploadIcon style={{ fontSize: "55px", color: "#338ab8ff" }} />
          <h3>upload images</h3>
          <input
            ref={fileinput}
            hidden
            multiple
            type="file"
            onChange={(e) => {
              setimages([...images, ...Array.from(e.target.files)]);
            }}
          />
        </div>
        {/* show photos */}
        <div style={{ overflow: "hidden" }}>{mappingimages}</div>
        {/* button */}
        <div style={{ margin: "20px 5px" }}>
          <Button
            disabled={
              productdata.category === "" ||
              !productdata.title ||
              !productdata.price ||
              !productdata.description ||
              !productdata.About ||
              !productdata.stock ||
              productdata.stock<0||
              loading
            }
            onClick={() => {
              handeladdproduct();
            }}
            style={{ width: "100%" }}
            variant="contained"
          >
            create
          </Button>
        </div>
      </div>
    </div>
  );
}
