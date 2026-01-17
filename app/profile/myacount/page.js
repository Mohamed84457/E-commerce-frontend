"use client";
// mui
import Button from "@mui/material/Button";
//icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// contexts
import { useLoading } from "@/app/context/loadingcontext";
// component
import Loading from "@/app/component/loading";

import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

export default function Myacount() {
  // show loading
  const { showloading, setshowloading } = useLoading();
  // user data
  const [data, setdata] = useState({
    role: "",
    name: "",
    email: "",
    id: "",
  });
  //   role
  const [role, setrole] = useState("");
  //Cookie
  const Cookie = new Cookies();
  // route
  const route = useRouter();

  useEffect(() => {
    setshowloading(true);
    // token
    const token = Cookie.get("ecommercetoken");
    if (!token) {
      route.push("/signUp");
      return;
    }

    async function getUser() {
      try {
        const res = await axios.get(`${NEXT_PUBLIC_API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setdata({
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          id: res.data.id,
        });
        setshowloading(false);
      } catch (err) {
        console.log(err);
        setshowloading(false);
      }
    }
    getUser();
  }, []);
 
  return !showloading ? (
    <div style={{ padding: "10px" }}>
      <h1 style={{ marginBottom: "20px" }}>My Acount</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          border: "solid 1px #898686ff",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px #a49a9aff",
        }}
      >
        <h2>{data.email}</h2>
        <div>
          <Button variant="text">
            <EditIcon />
          </Button>
          <Button
            disabled={data.role === "1995"}
            onClick={() => {
              handeldeleteacount();
            }}
            style={{ color: data.role !== "1995" ? "#f42929ff" : "#a4a1a1ff" }}
            variant="text"
          >
            <DeleteIcon />
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
