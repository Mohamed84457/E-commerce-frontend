"use client";
// mui
import Button from "@mui/material/Button";

import Link from "next/link";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";

export default function ProfileNav() {
  
  // route
  const route = useRouter();
  //cookie
  const Cookie = new Cookies();

  // handellogout
  function handellogout() {
    // token
    const token = Cookie.remove("ecommercetoken");
    route.push("/signUp");
  }
  return (
    <div
      style={{
        height: "8vh",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        boxShadow: "0px 0px 10px #8b8383ff",
        borderRadius: "0px 0px 10px 10px ",
      }}
    >
      <h1>DMT</h1>
      <div
        style={{
          width: "27%",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <Link href={"/home"}>
          <Button color="#000" variant="text">
            home
          </Button>
        </Link>
        <Button
          onClick={() => {
            handellogout();
          }}
          style={{ background: "#f12323dd" }}
          variant="contained"
        >
          log out
        </Button>
      </div>
    </div>
  );
}
