"use client";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
// components
import AccountMenu from "./avatar";

import Image from "next/image";
import Link from "next/link";
// icons
import SearchIcon from "@mui/icons-material/Search";

import { useCartitemsnumber } from "../context/cartitemsnumber";
import styles from "../nav.module.css";

// ✅ move outside component (performance)
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -4,
    top: 10,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 6px",
    fontSize: "11px",
  },
}));

export default function NavCommerce() {
  // route
  const router = useRouter();

  const { cartnumber } = useCartitemsnumber();

  return (
    <nav className={styles.nav}>
      {/* Logo */}
      <Link href="/" className={styles.logo}>
        <Image
          src="/DMTcommerce.png"
          alt="DMT commerce"
          width={90}
          height={60}
          priority
          className={styles.logoImage}
        />
      </Link>

      {/* Search */}
      <div className={styles.search}>
        <TextField
  size="small"
  placeholder="Search products..."
  fullWidth
  inputProps={{ readOnly: true }}
  onFocus={() => router.push("/search")}
  InputProps={{
    startAdornment: <SearchIcon fontSize="small" />,
  }}
/>

      </div>

      {/* Icons */}
      <div className={styles.icons}>
        <Link href="/website/cart" aria-label="Cart">
          <IconButton>
            <StyledBadge badgeContent={cartnumber} color="secondary">
              <ShoppingCartIcon />
            </StyledBadge>
          </IconButton>
        </Link>

       
          <AccountMenu/>
      
      </div>
    </nav>
  );
}
