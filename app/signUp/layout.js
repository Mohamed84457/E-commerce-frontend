"use client"; // make it a client component

import Topnav from "../component/Topnav";
import styles from "./signupstyles.module.css";
// mui
import Typography from "@mui/material/Typography";

// components
import Loading from "../component/loading";

import Cookies from "universal-cookie";
import axios from "axios";
import { useEffect } from "react";
import { NEXT_PUBLIC_API_URL } from "../publicurl/URLbase";

// export const metadata = {
//   title: "DMT store sign up",
// };

export default function SignUpLayout({ children }) {
  // cookie
  const Cookie = new Cookies();
  const token = Cookie.get("ecommercetoken");

  useEffect(() => {
    async function getuser() {
      if (token) {
        try {
          const res = await axios.get(`${NEXT_PUBLIC_API_URL}/api/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.data.role === "2001") {
            console.log("Role:", res.data.role);
            window.location.href = "/website"; // redirect to website
          } else {
            console.log("Role:", res.data.role);
            window.location.href = "/home"; // redirect to home
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
      <div style={{ height: "100vh" }}>
        <Topnav />
        <div className={styles.container}>
          <div className={styles.signupContent}>
            <div className={styles.firstsignupcontent}>
              <Typography
                style={{ textAlign: "center", padding: "10px" }}
                variant="h3"
              >
                Welcome to
                <p style={{ display: "inline-block", color: "#4db6acc0" }}>
                  DMT
                </p>
                Store
              </Typography>
              <h4 style={{ textAlign: "center", padding: "10px" }}>
                Discover your inner space. Safe and trusted psychedelics online.
              </h4>
            </div>
            <div className={styles.secondsignupcontent}>{children}</div>
          </div>
        </div>
      </div>
      <Loading />
    </>
  );
}
