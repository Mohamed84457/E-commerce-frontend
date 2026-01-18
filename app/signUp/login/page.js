"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "universal-cookie";

// MUI
import { TextField, Typography, Button, Box, Divider } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

// Contexts
import { useSnackbar } from "@/app/context/snackbarcontext";
import { useLoading } from "@/app/context/loadingcontext";
import { useUserdata } from "@/app/context/userdatacontext";

// Components
import CustomizedSnackbars from "@/app/component/snackBar";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

// CSS
import styles from "./Login.module.css";

export default function Register() {
  const router = useRouter();
  const cookies = new Cookies();

  const { setuserdata } = useUserdata();
  const { showloading, setshowloading } = useLoading();
  const { setshowsnackbar } = useSnackbar();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showError = (message) => {
    setshowsnackbar({
      open: true,
      content: message,
      duration: 4000,
      type: "error",
      vertical: "top",
      horizontal: "center",
    });
  };

  const submitLogin = async () => {
    if (!form.email) return showError("Email is required");
    if (!form.password) return showError("Password is required");

    setshowloading(true);

    try {
      const { data } = await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/login`,
        form
      );

      setuserdata({
        token: data.token,
        user: { name: data.user.name, email: data.user.email },
      });

      cookies.set("ecommercetoken", data.token, {
        path: "/",
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      });

      setshowsnackbar({
        open: true,
        content: "Login successful 🎉",
        duration: 2000,
        type: "success",
        vertical: "top",
        horizontal: "center",
      });

      setForm({ email: "", password: "" });

      setTimeout(() => router.push("/auth/google/authsignup"), 800);
    } catch (err) {
      if (err.response?.status === 401) {
        showError("Incorrect email or password");
      } else {
        showError(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setshowloading(false);
    }
  };

  return (
    <Box className={styles.container}>
      {/* Header */}
      <Typography className={styles.header}>Login</Typography>

      {/* Form */}
      <Box
        className={styles.form}
        onKeyDown={(e) => e.key === "Enter" && submitLogin()}
      >
        <TextField
          name="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          disabled={showloading}
          autoComplete="email"
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          disabled={showloading}
          autoComplete="current-password"
        />
      </Box>

      {/* Submit */}
      <Button
        className={styles.submitButton}
        variant="contained"
        size="large"
        disabled={showloading}
        onClick={submitLogin}
      >
        {showloading ? "Signing in..." : "Sign In"}
      </Button>

      <Divider className={styles.divider}>OR</Divider>

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
