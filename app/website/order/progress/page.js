"use client";
// cookie
import Cookies from "universal-cookie";
// mui
import TextField from "@mui/material/TextField";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
// context
import { useFeedbackweb } from "../../feedback/page";
// the api of order
import { addOrder } from "@/app/orderapi/makeorder";

import styles from "../../cart/cart.module.css";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";
export default function Progress() {
  // feedback
  const { showSnackbar } = useFeedbackweb();
  // items
  const [orderitems, setorderitems] = useState([]);
  //   user data
  const [userdata, setuserdata] = useState({
    user_id: "",
    user_name: "",
    user_email: "",
    whatsapp_phone: "",
    phone_number: "",
    address: "",
  });
  // loading
  const [loading, setloading] = useState(true);
  // router
  const router = useRouter();

  //   get order items
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("DMTcart")) || [];
    setorderitems(items);
    console.log(items);
  }, []);
  useEffect(() => {
    // cookie
    const Cookie = new Cookies();
    const token = Cookie.get("ecommercetoken");

    async function getuser() {
      try {
        const res = await axios.get(`${NEXT_PUBLIC_API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setuserdata({
          ...userdata,
          user_id: res.data.id,
          user_name: res.data.name,
          user_email: res.data.email,
        });
        setloading(false);
      } catch (error) {
        console.log(error);
        router.push("/signUp");
      }
    }
    getuser();
  }, [router]);
  // check if value number
  function ifNumber(value) {
    return typeof value === "number" && !isNaN(value);
  }
  // chaeck if this correct phone number
  function ifCorrectphonenumner(value) {
    if (String(value).length != 11) {
      return false;
    } else if (
      String(value).slice(0, 3) != "011" &&
      String(value).slice(0, 3) != "012" &&
      String(value).slice(0, 3) != "010" &&
      String(value).slice(0, 3) != "015"
    ) {
      return false;
    }
    return true;
  }
  // handel confrim order
  function handelconfirmorder() {
    if (!userdata.whatsapp_phone) {
      showSnackbar("whatsapp field empety", "5000", "error");
      return false;
    } else if (
      !ifNumber(Number(userdata.whatsapp_phone)) ||
      !ifCorrectphonenumner(userdata.whatsapp_phone)
    ) {
      showSnackbar("not correct whatsapp phone", "5000", "error");
      return false;
    } else if (!userdata.phone_number) {
      showSnackbar("phone numner field empety", "5000", "error");
      return false;
    } else if (
      !ifNumber(Number(userdata.phone_number)) ||
      !ifCorrectphonenumner(userdata.phone_number)
    ) {
      showSnackbar("not correct phone number ", "5000", "error");
      return false;
    } else if (!userdata.address) {
      showSnackbar("address field empety", "5000", "error");
      return false;
    }
    return true;
  }

  // ===handel confrim order===
  // if order done or not
  function iforderdoneornot(result) {
    if (result.success) {
      showSnackbar("order has been submit we will conect you soon", "10000");
      setTimeout(() => {
        router.push("/");
      }, 10000);
    } else {
      showSnackbar("sorry the order not been submit ", "7000");
      setTimeout(() => {
        router.push("/");
      }, 7000);
    }
  }
  // ===if order done or not===
  // make order
  async function makeuserorder() {
    if (handelconfirmorder()) {
      setloading(true);
      const result = await addOrder(userdata, orderitems);
      iforderdoneornot(result);
    }
  }
  // ===make order===
  return (
    <div>
      {loading ? (
        <div>loading...</div>
      ) : orderitems.length < 1 ? (
        <div>there is no items</div>
      ) : (
        <div>
          <TextField
            style={{ width: "95%", margin: "20px 10px" }}
            disabled
            label={userdata.user_name}
            variant="outlined"
          />
          <TextField
            style={{ width: "95%", margin: "20px 10px" }}
            disabled
            label={userdata.user_email}
            variant="outlined"
          />
          <p style={{ margin: "0px 15px " }}>please fill the fields... </p>
          <TextField
            style={{ width: "95%", margin: "20px 10px" }}
            label="whatsapp"
            variant="outlined"
            onChange={(e) => {
              setuserdata({ ...userdata, whatsapp_phone: e.target.value });
            }}
          />
          <TextField
            style={{ width: "95%", margin: "20px 10px" }}
            label="phone number"
            variant="outlined"
            onChange={(e) => {
              setuserdata({ ...userdata, phone_number: e.target.value });
            }}
          />
          <TextField
            style={{ width: "95%", margin: "20px 10px" }}
            label="address"
            variant="outlined"
            onChange={(e) => {
              setuserdata({ ...userdata, address: e.target.value });
            }}
          />
          <button
            disabled={loading}
            className={styles.buybtn}
            onClick={() => {
              makeuserorder();
            }}
          >
            confirm
          </button>
        </div>
      )}
    </div>
  );
}
