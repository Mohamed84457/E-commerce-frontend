"use client";
// mui
import CircularProgress from "@mui/material/CircularProgress";

import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useUserdata } from "@/app/context/userdatacontext";
import Cookies from "universal-cookie";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

export default function Googlecallback() {
  //cookie
  const Cookie = new Cookies();

  // user data
  const { userdata, setuserdata } = useUserdata();

  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const code = searchParams.get("code");

    // Ensure the code parameter exists before calling backend
    if (!code) return;

    const queryString = searchParams.toString(); // e.g., "code=abc&scope=xyz"
console.log(queryString)
    async function callback() {
      try {
        const response = await axios.get(
          `${NEXT_PUBLIC_API_URL}/api/auth/google/callback?${queryString}`
        );

        console.log("Callback Success:", response.data);

        Cookie.set("ecommercetoken", response.data.access_token, {
          path: "/",
          sameSite: "Lax", // or "Strict", depending on your case
          secure: false, // set to true if using HTTPS
        });

        setuserdata({
          token: response.data.access_token,
          user: {
            name: response.data.user.name,
            email: response.data.user.email,
          },
        });

        // Redirect to home
        setTimeout(() => {
          router.push("/auth/google/authsignup");
        }, 1000);
      } catch (err) {
        console.error("OAuth Callback Error:", err);
        router.back();
      }
    }

    callback();
  }, [searchParams]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
     
    </div>
  );
}
