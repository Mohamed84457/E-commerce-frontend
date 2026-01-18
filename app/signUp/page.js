"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "universal-cookie";
import GoogleIcon from "@mui/icons-material/Google";

// MUI
import { TextField, Typography, Button, Box } from "@mui/material";

// Context
import { useSnackbar } from "../context/snackbarcontext";
import { useLoading } from "../context/loadingcontext";
import { useUserdata } from "../context/userdatacontext";

// Components
import CustomizedSnackbars from "../component/snackBar";
import { NEXT_PUBLIC_API_URL } from "../publicurl/URLbase";

// CSS
import styles from "./register.module.css";

export default function Register() {
  const { setuserdata } = useUserdata();
  const { showloading, setshowloading } = useLoading();
  const { setshowsnackbar } = useSnackbar();
  const router = useRouter();
  const Cookie = new Cookies();

  const [newuser, setnewuser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setnewuser({ ...newuser, [e.target.name]: e.target.value });
  };

  const showError = (message) => {
    setshowsnackbar({
      open: true,
      content: message,
      duration: 5000,
      type: "error",
      vertical: "top",
      horizontal: "center",
    });
  };

  const submitNewUser = async () => {
    setshowloading(true);
    try {
      const { data } = await axios.post(`${NEXT_PUBLIC_API_URL}/api/register`, {
        name: newuser.name,
        email: newuser.email,
        password: newuser.password,
      });

      setuserdata({
        token: data.token,
        user: { name: data.user.name, email: data.user.email },
      });

      Cookie.set("ecommercetoken", data.token, {
        path: "/",
        sameSite: "Lax",
        secure: false,
      });

      setshowsnackbar({
        open: true,
        content: "✅ Registration successful",
        duration: 2000,
        type: "success",
        vertical: "top",
        horizontal: "center",
      });

      setnewuser({ name: "", email: "", password: "", confirmPassword: "" });

      setTimeout(() => router.push("/auth/google/authsignup"), 1500);
    } catch (err) {
      if (err.response?.data?.message) showError(err.response.data.message);
      else showError("❌ Registration failed");
    } finally {
      setshowloading(false);
    }
  };

  const handleSubmit = () => {
    if (!newuser.name) return showError("Name is empty");
    if (!newuser.email) return showError("Email is empty");
    if (!newuser.password) return showError("Password is empty");
    if (newuser.password !== newuser.confirmPassword)
      return showError("Password and confirm password do not match");

    submitNewUser();
  };

  return (
    <Box className={styles.container}>
      {/* Header */}
      <Typography className={styles.header}>Register</Typography>

      {/* Form Fields */}
      <Box className={styles.form}>
        <TextField
          name="name"
          label="Name"
          value={newuser.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          value={newuser.email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          value={newuser.password}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={newuser.confirmPassword}
          onChange={handleChange}
          fullWidth
        />
      </Box>

      {/* Submit */}
      <Button
        className={styles.submitButton}
        variant="contained"
        disabled={showloading}
        onClick={handleSubmit}
      >
        Submit
      </Button>

     {/* Google Login */}
      <Button
        component="a"
        href={`${NEXT_PUBLIC_API_URL}/login-google`}
        className={styles.googleButton}
        fullWidth
        startIcon={<GoogleIcon className={styles.googleIcon} />}
      >
        Continue with Google
      </Button>

      <CustomizedSnackbars />
    </Box>
  );
}
