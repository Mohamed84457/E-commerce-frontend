"use client";

// mui

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

export default function Authsignup() {
  // cookie
  const Cookie = new Cookies();
  // router
  const route = useRouter();

  // navigate
  useEffect(() => {
    // token
    const token = Cookie.get("ecommercetoken");
    if (!token) {
      route.push("/signUp");
      return;
    }

    async function checkUser() {
      try {
        const res = await axios.get(`${NEXT_PUBLIC_API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.role == "2001") {
          route.push("/");
        } else {
          route.push("/home"); //   /home
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        route.push("/signUp");
      }
    }

    checkUser();
  }, [route]);
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    </div>
  );
}
