"use client";
// mui
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// contexts
import { useSnackbar } from "@/app/context/snackbarcontext";
// components
import Loading from "@/app/component/loading";

import { useState } from "react";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

export default function User() {
  // is loading
  const [isload, setisload] = useState(false);
  // router
  const router = useRouter();

  //   token
  const Cookie = new Cookies();
  const token = Cookie.get("ecommercetoken");
  // snack bar
  const { setshowsnackbar } = useSnackbar();

  const [user, setuser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  // handeladduser
  function adduser() {
    setisload(true);
    async function newuser() {
      try {
        const res = await axios.post(
          `${NEXT_PUBLIC_API_URL}/api/user/add`,
          {
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setshowsnackbar({
          open: true,
          content: "new user add success",
          duration: 2000,
          type: "success",
          vertical: "top",
          horizontal: "center",
        });
        setTimeout(() => {
          router.push("/home/users");
        }, 1500);
      } catch (err) {
        console.log(err);
        setisload(true);
      }
    }
    newuser();
  }
  //   handel check the inputs
  function handeladduser() {
    if (!user.name) {
      setshowsnackbar({
        open: true,
        content: "name is empety",
        duration: 4000,
        type: "error",
        vertical: "top",
        horizontal: "center",
      });
    } else if (!user.email) {
      setshowsnackbar({
        open: true,
        content: "email is empety ",
        duration: 4000,
        type: "error",
        vertical: "top",
        horizontal: "center",
      });
    } else if (!user.password) {
      setshowsnackbar({
        open: true,
        content: "password is empety",
        duration: 2000,
        type: "error",
        vertical: "top",
        horizontal: "center",
      });
    } else if (user.password.length < 8) {
      setshowsnackbar({
        open: true,
        content: "password must at least 8",
        duration: 4000,
        type: "error",
        vertical: "top",
        horizontal: "center",
      });
    } else if (!user.role) {
      setshowsnackbar({
        open: true,
        content: "select role ",
        duration: 4000,
        type: "error",
        vertical: "top",
        horizontal: "center",
      });
    } else {
      adduser();
    }
  }
  return (
    <div style={{ padding: "15px" }}>
      <h2 style={{ marginBottom: "20px" }}>New User</h2>
      {/* edit content */}
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "25px",
          }}
        >
          <TextField
            value={user.name}
            onChange={(c) => {
              setuser({
                ...user,
                name: c.target.value,
              });
            }}
            id="outlined-basic"
            label="name"
            variant="outlined"
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "20px",
          }}
        >
          <TextField
            value={user.email}
            onChange={(c) => {
              setuser({
                ...user,
                email: c.target.value,
              });
            }}
            id="outlined-basic"
            label="email"
            variant="outlined"
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "20px",
          }}
        >
          <TextField
            value={user.password}
            onChange={(c) => {
              setuser({
                ...user,
                password: c.target.value,
              });
            }}
            id="outlined-basic"
            label="password"
            variant="outlined"
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "30px",
          }}
        >
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Role</InputLabel>
            <Select
              value={user.role}
              label="Role"
              onChange={(c) => {
                setuser({ ...user, role: c.target.value });
              }}
            >
              <MenuItem value="1995">Admin</MenuItem>
              <MenuItem value="1997">Writer</MenuItem>
              <MenuItem value="1999">Product_manger</MenuItem>
              <MenuItem value="2001">User</MenuItem>
            </Select>
          </FormControl>
          <Button
            disabled={isload}
            variant="contained"
            onClick={() => {
              handeladduser();
            }}
          >
            add
          </Button>
        </div>
      </div>
      <Loading />
    </div>
  );
}
