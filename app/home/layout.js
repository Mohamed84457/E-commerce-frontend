"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";
import axios from "axios";

// components
import Sidebar from "../component/sidebar";
import Pagetopnav from "../component/pagetopnav";
import styles from "./homestyles.module.css";

// Contexts
import { useSidebar } from "../context/sidebarcontext";
import { useUserdata } from "../context/userdatacontext";
import { NEXT_PUBLIC_API_URL } from "../publicurl/URLbase";
// Axios instance
const api = axios.create({
  baseURL: `${NEXT_PUBLIC_API_URL}/api`,
});
export default function Pagelayout({ children }) {
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { setuserdata } = useUserdata();
  const { showsidebar } = useSidebar();

  useEffect(() => {
    const token = new Cookies().get("ecommercetoken");

    if (!token) {
      router.replace("/signUp");
      return;
    }

    let mounted = true;

    api
      .get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (!mounted) return;

        // Seller → public website
        if (res.data.role === "2001") {
          router.replace("/website");
          return;
        }

        setuserdata({
          token,
          user: {
            name: res.data.name,
            email: res.data.email,
            role: res.data.role,
          },
        });
      })
      .catch(() => {
        router.replace("/signUp");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [router, setuserdata]);

  if (loading) return null; // replace with <Loading />

  return (
    <div className={styles.maincontainer}>
      <Pagetopnav />

      <div className={styles.children_sidebar}>
        {/* Sidebar */}
        <div
          className={styles.sidebar}
          style={{ width: showsidebar ? "250px" : "95px" }}
        >
          <Sidebar />
        </div>

        {/* Main content area */}
        <div
          className={styles.content}
          style={{ marginLeft: showsidebar ? "250px" : "95px" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
