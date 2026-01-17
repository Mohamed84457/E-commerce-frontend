"use client";
// mui
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

// context
import { useSnackbar } from "@/app/context/snackbarcontext";
import { useLoading } from "@/app/context/loadingcontext";
import { useUserdata } from "@/app/context/userdatacontext";

import { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import CustomizedSnackbars from "@/app/component/snackBar";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";
export default function Register() {
  // user data
  const { setuserdata } = useUserdata();
  // show laoding
  const { showloading, setshowloading } = useLoading();
  // route
  const router = useRouter();
  // cookie
  const Cookie = new Cookies();
  // snackbar
  const { setshowsnackbar } = useSnackbar();

  const [newuser, setnewuser] = useState({
    email: "",
    password: "",
  });
  // Handle submit
  async function submitnewuser() {
    setshowloading(true);
    try {
      const response = await axios.post(`${NEXT_PUBLIC_API_URL}/api/login`, {
        email: newuser.email,
        password: newuser.password,
      });

      console.log("✅ Registration successful:", response.data);
      setuserdata({
        token: response.data.token,
        user: {
          name: response.data.user.name,
          email: response.data.user.email,
        },
      });

      Cookie.set("ecommercetoken", response.data.token, {
        path: "/",
        sameSite: "Lax", // or "Strict", depending on your case
        secure: false, // set to true if using HTTPS
      });

      setshowloading(false);
      setshowsnackbar({
        open: true,
        content: "✅ Registration successful",
        duration: 2000,
        type: "success",
        vertical: "top",
        horizontal: "center",
      });
      setnewuser({
        email: "",
        password: "",
      });
      setTimeout(() => {
        router.push("/auth/google/authsignup");
      }, 1000);
    } catch (error) {
      console.error("❌ Registration failed");

      setshowloading(false);
      // Axios error with server response (500, 400, etc.)
      if (error.response) {
        console.error("Status:", error.response.status);
        if (error.response.status === 401) {
          setshowsnackbar({
            open: true,
            content: "the email or password are incorrect",
            duration: 5000,
            type: "error",
            vertical: "top",
            horizontal: "center",
          });
        } else {
          setshowsnackbar({
            open: true,
            content: error.response.data.message,
            duration: 5000,
            type: "error",
            vertical: "top",
            horizontal: "center",
          });
          console.error("Data:", error.response.data.message);
        }
      }
      // Axios error with no response (Network Error, CORS, etc.)
      else if (error.request) {
        console.error("No response received:", error.request);
      }
      // Other error
      else {
        console.error("Error setting up the request:", error.message);
      }

      console.error("Full error object:", error);
    }
  }

  // check the inputs
  function handelsubmit() {
    if (!newuser.email) {
      setshowsnackbar({
        open: true,
        content: "Email is empety",
        duration: 5000,
        type: "error",
        vertical: "top",
        horizontal: "center",
      });
    } else if (!newuser.password) {
      setshowsnackbar({
        open: true,
        content: "Password is empety",
        duration: 5000,
        type: "error",
        vertical: "top",
        horizontal: "center",
      });
    } else {
      submitnewuser();
    }
  }
  return (
    <Box
      sx={{
        height: "70vh",
        width: "400px",
        background: "#f9f9f9ff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "24px",
        margin: "40px auto",
      }}
    >
      {/* Header */}
      <Box sx={{ marginTop: "30px", textAlign: "center" }}>
        <Typography variant="h4" component="h1" color="#4db6ac">
          log in
        </Typography>
      </Box>

      {/* Form Fields */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "35px",
          flexGrow: 1,
        }}
      >
        <TextField
          value={newuser.email}
          onChange={(e) => {
            setnewuser({ ...newuser, email: e.target.value });
          }}
          fullWidth
          label="Email"
          variant="outlined"
          type="email"
        />
        <TextField
          value={newuser.password}
          onChange={(e) => {
            setnewuser({ ...newuser, password: e.target.value });
          }}
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
        />
      </Box>

      {/* Button */}
      <Button
        variant="contained"
        disabled={showloading}
        style={{ background: "#4db6ac" }}
        sx={{ fontWeight: "bold" }}
        onClick={() => {
          handelsubmit();
        }}
      >
        Submit
      </Button>
      {/* google button  */}
      <a
        href={`${NEXT_PUBLIC_API_URL}/login-google`}
        style={{
          marginTop: "30px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          color: "#000",
          border: "1px solid #ddd",
          padding: "10px 16px",
          borderRadius: "4px",
          fontSize: "14px",
          fontWeight: "500",
          fontFamily: "Arial, sans-serif",
          textDecoration: "none",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          cursor: "pointer",
          transition: "background-color 0.2s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#f7f7f7")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google logo"
          style={{ width: "18px", height: "18px", marginRight: "8px" }}
        />
        Sign in with Google
      </a>
      <CustomizedSnackbars />
    </Box>
  );
}
