"use client";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
// components
// import Profilenavwebsite from "../website/componets/profilenavwebsite";
// contexts
import { useUserdata } from "../context/userdatacontext";

import { useEffect } from "react";
import axios from "axios";
import { NEXT_PUBLIC_API_URL } from "../publicurl/URLbase";

export default function Layout({ children }) {
  // user data
  const { userdata, setuserdata } = useUserdata();
  //router
  const router = useRouter();
  // cookie
  const Cookie = new Cookies();
  useEffect(() => {
    const token = Cookie.get("ecommercetoken");

    if (!token) {
      router.push("/signUp");
      return;
    }

    axios
      .get(`${NEXT_PUBLIC_API_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setuserdata({
          token: token,
          user: {
            name: res.data.name,
            email: res.data.email,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        router.push("/signUp");
      });
  }, []);
  return <div>{children}</div>;
}
