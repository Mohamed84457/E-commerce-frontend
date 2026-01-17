"use client";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
// components
import Orderitem from "./orderitem";
import axios from "axios";

import styles from "../cart/cart.module.css";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";
export default function Order() {
  const [orderitems, setorderitems] = useState([]);
  const [total, settotal] = useState(0);
  const [changeitem, setchangeitem] = useState(false);
  // loading
  const [loading, setloading] = useState(true);
  // router
  const router = useRouter();
  useEffect(() => {
    // token
    const Cookie = new Cookies();
    const token = Cookie.get("ecommercetoken");
    if (!token) {
      router.push("/signUp");
      return;
    }
    async function getuser() {
      setloading(true);
      try {
        const res = await axios.get(`${NEXT_PUBLIC_API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setloading(false);
      } catch (error) {
        router.push("/signUp");
        return;
      }
    }
    getuser();
  }, [router]);

  useEffect(() => {
    const cartitems = JSON.parse(localStorage.getItem("DMTcart")) || [];

    setorderitems(cartitems);
  }, [changeitem]);
  // calculate total
  useEffect(() => {
    let totalprice = 0;
    for (let n = 0; n < orderitems.length; n++) {
      totalprice +=
        (Number(orderitems[n].price) -
          Number(orderitems[n].price) *
            (Number(orderitems[n].discount) / 100)) *
        Number(orderitems[n].Amount);
    }
    settotal(totalprice);
  }, [orderitems]);
  const mappingorderitems = orderitems.map((oi, index) => {
    return <Orderitem key={oi.id} num={index} orderitem={oi} />;
  });
  // format egypt price 
  const formatPrice = (value) =>
    value.toLocaleString("en-EG", {
      style: "currency",
      currency: "EGP",
    });
  return (
    <div>
      {loading ? (
        <>loading...</>
      ) : orderitems.length > 0 ? (
        <div>
          {mappingorderitems}
          <h3 style={{ margin: "10px", fontSize: "25px" }}>
            Total :{" "}
            <span style={{ color: "#e49712ff" }}>{formatPrice(total)} </span>
          </h3>
          <button
            onClick={()=>{
              if(orderitems.length>0){
                router.push("order/progress")
              }
            }}
            disabled={orderitems < 1}
            className={styles.buybtn}

          >
            next
          </button>
        </div>
      ) : (
        <>on items for order</>
      )}
    </div>
  );
}
