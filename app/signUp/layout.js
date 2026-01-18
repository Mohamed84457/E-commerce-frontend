"use client";

import { useEffect } from "react";
import Topnav from "../component/Topnav";
import Loading from "../component/loading";
import Cookies from "universal-cookie";
import axios from "axios";
import { NEXT_PUBLIC_API_URL } from "../publicurl/URLbase";

import styles from "./signupstyles.module.css";

export default function SignUpLayout({ children }) {
  const Cookie = new Cookies();
  const token = Cookie.get("ecommercetoken");

  useEffect(() => {
    async function getuser() {
      if (token) {
        try {
          const res = await axios.get(`${NEXT_PUBLIC_API_URL}/api/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.data.role === "2001") {
            window.location.href = "/website";
          } else {
            window.location.href = "/home";
          }
        } catch (err) {
          console.log("Error fetching user:", err);
        }
      }
    }
    getuser();
  }, [token]);

  return (
    <>
      <Topnav />
      <div className={styles.secondsignupcontent}>{children}</div>
      <Loading />
    </>
  );
}
