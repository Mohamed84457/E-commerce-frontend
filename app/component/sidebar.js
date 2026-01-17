"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Cookies from "universal-cookie";
import axios from "axios";

// MUI
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

// Icons
import CategoryIcon from "@mui/icons-material/Category";
import GroupIcon from "@mui/icons-material/Group";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import SellIcon from "@mui/icons-material/Sell";

// Context
import { useSidebar } from "../context/sidebarcontext";
import { NEXT_PUBLIC_API_URL } from "../publicurl/URLbase";

// Roles
const ROLES = {
  ADMIN: "1995",
  SELLER: "2001",
  WRITER: "1997",
  PRODUCT_MANAGER: "1999",
};

// Axios instance (better performance & reuse)
const api = axios.create({
  baseURL: `${NEXT_PUBLIC_API_URL}/api`,
});

export default function Sidebar() {
  const [role, setRole] = useState(null);
  const { showsidebar } = useSidebar();
  const cookies = new Cookies();

  useEffect(() => {
    const token = cookies.get("ecommercetoken");
    if (!token) return;

    let mounted = true;

    api
      .get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (mounted) setRole(res.data.role);
      })
      .catch(console.error);

    return () => {
      mounted = false;
    };
  }, []);

  // Sidebar items (memoized)
  const menuItems = useMemo(
    () => [
      {
        label: "users",
        href: "/home/users",
        icon: <GroupIcon />,
        roles: [ROLES.ADMIN, ROLES.WRITER],
      },
      {
        label: "categories",
        href: "/home/categories",
        icon: <CategoryIcon />,
      },
      {
        label: "products",
        href: "/home/products",
        icon: <LocalMallIcon />,
      },
      {
        label: "add category",
        href: "/home/categories/addcategory",
        icon: <AddCircleOutlineIcon />,
        roles: [ROLES.ADMIN, ROLES.PRODUCT_MANAGER],
      },
      {
        label: "add product",
        href: "/home/products/addproduct",
        icon: <AddCircleOutlineIcon />,
        roles: [ROLES.ADMIN, ROLES.PRODUCT_MANAGER],
      },
      {
        label: "orders",
        href: "/home/orders",
        icon: <SellIcon />,
      },
    ],
    []
  );

  if (!role) return null;

  return (
    <div>
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          color: "#676767",
          mb: 2,
          display: showsidebar ? "block" : "none",
        }}
      >
        DASHBOARD
      </Typography>

      {menuItems.map((item) => {
        if (item.roles && !item.roles.includes(role)) return null;

        return (
          <Tooltip key={item.href} title={item.label}>
            <Link href={item.href}>
              <Button
                variant="contained"
                sx={{
                  background: "#222",
                  color: "#fff",
                  width: "90%",
                  mx: "10px",
                  my: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  "&:hover": { background: "#000" },
                }}
              >
                {item.icon}
                {showsidebar && (
                  <Typography variant="h6">{item.label}</Typography>
                )}
              </Button>
            </Link>
          </Tooltip>
        );
      })}
    </div>
  );
}
