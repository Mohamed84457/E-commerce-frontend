"use client";
// mui
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
// components
import Loading from "@/app/component/loading";
// contexts
import { useLoading } from "@/app/context/loadingcontext";
import { useSnackbar } from "../context/snackbarcontext";
import { NEXT_PUBLIC_API_URL } from "../publicurl/URLbase";

export default function Profile() {
  // route
  const route = useRouter();
  // snack bar
  const { setshowsnackbar } = useSnackbar();
  // loading

  const { showloading, setshowloading } = useLoading();
  // token
  const Cookie = new Cookies();
  const [token, settoken] = useState("");
  // user data
  const [userdata, setuserdata] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
    createdat: "",
    updatedat: "",
  });
  // created date
  const createddate = new Date(userdata.createdat);
  // update date
  const updateddate = new Date(userdata.updatedat);

  // get user data
  useEffect(() => {
    setshowloading(true);
    // get token
    const ecommercetoken = Cookie.get("ecommercetoken");
    settoken(ecommercetoken);
    async function getuserdata() {
      try {
        const res = await axios.get(`${NEXT_PUBLIC_API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${ecommercetoken}`,
          },
        });

        setuserdata({
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          createdat: res.data.created_at,
          updatedat: res.data.updated_at,
        });
        setshowloading(false);
      } catch (err) {
        console.log(err);
        setshowloading(false);
      }
    }
    getuserdata();
  }, []);
  //   handeleditdata
  function handeleditdata() {
    setshowloading(true);
    axios
      .post(
        `${NEXT_PUBLIC_API_URL}/api/user/edit/${userdata.id}`,
        {
          name: userdata.name,
          email: userdata.email,
          role: userdata.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setshowloading(false);
        setshowsnackbar({
          open: true,
          content: "edit success",
          duration: 2000,
          type: "success",
          vertical: "top",
          horizontal: "center",
        });
        route.push("/profile");
      })
      .catch((err) => {
        setshowloading(false);
        setshowsnackbar({
          open: true,
          content:
            err.response?.data?.message || "Server error, please try again.",
          duration: 4000,
          type: "error",
          vertical: "top",
          horizontal: "center",
        });
      });
  }
  return showloading ? (
    <Loading />
  ) : (
    <div style={{ height: "100vh", padding: "10px" }}>
      <div
        style={{
          boxShadow: "0px 0px 10px #989595ff",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        {/* name */}
        <div style={{ marginBottom: "15px" }}>
          <TextField
            style={{ width: "100%" }}
            label="name"
            variant="outlined"
            value={userdata.name}
            onChange={(c) => {
              setuserdata({
                ...userdata,
                name: c.target.value,
              });
            }}
          />
        </div>
        {/* email */}
        <div style={{ marginBottom: "15px" }}>
          <TextField
            style={{ width: "100%" }}
            label="email"
            variant="outlined"
            value={userdata.email}
            onChange={(c) => {
              setuserdata({
                ...userdata,
                email: c.target.value,
              });
            }}
          />
        </div>
        {/* role */}
        <div>
          <FormControl disabled sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>Role</InputLabel>
            <Select value={userdata.role} label="Role">
              <MenuItem value="1995">Admin</MenuItem>
              <MenuItem value="1997">Writer</MenuItem>
              <MenuItem value="2001">User</MenuItem>
              <MenuItem value="1999">Product manger</MenuItem>
            </Select>
          </FormControl>
        </div>
        {/* date */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px",
            marginTop: "10px",
          }}
        >
          <h3>
            email created at:{" "}
            {createddate ? createddate.toLocaleDateString() : "N/A"}
          </h3>
          <h3>
            last updated at:{" "}
            {updateddate ? updateddate.toLocaleDateString() : "N/A"}
          </h3>
        </div>

        <div style={{ marginTop: "20px", padding: "5px" }}>
          <Button
            onClick={() => {
              handeleditdata();
            }}
            disabled={showloading || !userdata.name || !userdata.email}
            style={{ width: "100%" }}
            variant="contained"
          >
            edit
          </Button>
        </div>
      </div>
    </div>
  );
}
