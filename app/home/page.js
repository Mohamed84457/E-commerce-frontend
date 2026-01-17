"use client";
import { useUserdata } from "../context/userdatacontext";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";

export default function Home() {
  // cookies
  const Cookie = new Cookies();

  const router = useRouter();
  const { userdata, setuserdata } = useUserdata();

  useEffect(() => {
    const ecoomerce_token = Cookie.get("ecommercetoken");

    console.log(ecoomerce_token);
    if (!userdata.token && !ecoomerce_token) {
      // if token exist in cookie that mean user make refresh so you 
      // must make refresh token 
      router.push("/signUp");
    }
  }, []);
  return (
    <div>
      <h1>hello home</h1>
    </div>
  );
}
