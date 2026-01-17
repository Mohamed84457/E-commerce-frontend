"use client";
// mui
import Button from "@mui/material/Button";

// components
import Showproductcart from "./showproductcart";
import Feedback from "../feedback/page";
// context
import { useCartitemsnumber } from "../context/cartitemsnumber";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// feedback
import { useFeedbackweb } from "../feedback/page";

import styles from "./cart.module.css";
export default function Cart() {
  // router
  const router = useRouter();
  // change number of cart
  const { changenumberitemsofcart } = useCartitemsnumber();
  // feedback
  const { showSnackbar } = useFeedbackweb();
  const [cart, setcart] = useState([]);

  const cartmapping = cart.map((c) => {
    return (
      <Showproductcart key={c.id} pro={c} removeFromCart={removeFromCart} />
    );
  });

  // fetch items
  useEffect(() => {
    const itemscart = JSON.parse(localStorage.getItem("DMTcart")) || [];
    setcart(itemscart);
  }, []);
  // remove from localstorage
  function removefromlocalstorage(id) {
    const thenitems = JSON.parse(localStorage.getItem("DMTcart"));
    const newitemslocal = thenitems.filter((p) => p.id !== id) || [];
    localStorage.setItem("DMTcart", JSON.stringify(newitemslocal));
    showSnackbar("product remove", "5000");
  }

  // remove from cart state
  function removeFromCart(id) {
    const newitems = cart.filter((p) => p.id !== id);

    setcart(newitems);
    changenumberitemsofcart(newitems.length);
    removefromlocalstorage(id);
  }
  // check
  return (
    <>
      <div className={styles.cartWrapper}>
        {cart.length < 1 ? (
          <div className={styles.emptyCart}>
            <h2>No products in cart</h2>
            <Link href="/website">
              <Button variant="contained">Shopping now</Button>
            </Link>
          </div>
        ) : (
          <div className={styles.products}>{cartmapping}</div>
        )}
      </div>

      {cart.length > 0 && (
        <button
          className={styles.buybtn}
          onClick={() => router.push("/auth/checkuserlogin_order")}
        >
          Order
        </button>
      )}

      <Feedback />
    </>
  );
}
