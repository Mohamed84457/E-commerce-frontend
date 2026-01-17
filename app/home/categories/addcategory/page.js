"use client";
// mui
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// contexts
import { useSnackbar } from "@/app/context/snackbarcontext";

import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";

import { useState } from "react";
import axios from "axios";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

export default function Addcategory() {
  // loading
  const [loading, setloading] = useState(false);
  // cookie
  const Cookie = new Cookies();
  //   route
  const route = useRouter();

  const [category, setcategory] = useState({
    name: "",
    image: null,
  });

  const { setshowsnackbar } = useSnackbar();

  async function handeladdcategory() {
    if (!category.name) {
      setshowsnackbar({
        open: true,
        content: "name is empty",
        duration: 4000,
        type: "error",
        vertical: "top",
        horizontal: "center",
      });
      return;
    }

    if (!category.image) {
      setshowsnackbar({
        open: true,
        content: "please upload an image",
        duration: 4000,
        type: "error",
        vertical: "top",
        horizontal: "center",
      });
      return;
    }

    const token = Cookie.get("ecommercetoken");
    setloading(true);
    const formdata = new FormData();
    formdata.append("title", category.name);
    formdata.append("image", category.image);

    try {
      const res = await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/category/add`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setshowsnackbar({
        open: true,
        content: "make category success",
        duration: 2000,
        type: "success",
        vertical: "top",
        horizontal: "center",
      });

      setTimeout(() => {
        route.push("/home/categories");
      }, 1500);

      console.log(res.data);
    } catch (err) {
      if (err.response) {
        console.log("Validation errors:", err.response.data);
      }
    }
  }

  return (
    <div style={{ height: "100vh", padding: "10px" }}>
      <h2>Add Category</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          height: "25%",
          marginTop: "10px",
        }}
      >
        <TextField
          value={category.name}
          onChange={(e) => {
            setcategory({ ...category, name: e.target.value });
          }}
          id="outlined-basic"
          label="category name"
          variant="outlined"
        />

        {/* ✅ no "value" prop here */}
       
       <div >
        <label>category photo: </label>
         <input
      
          type="file"
          accept="image/*"
          onChange={(e) => {
            setcategory({
              ...category,
              image: e.target.files[0], // store actual File object
            });
          }}
        />
       </div>

        <Button
          disabled={loading}
          variant="contained"
          onClick={handeladdcategory}
        >
          add
        </Button>
      </div>
    </div>
  );
}
