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

import { use, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

export default function User({ params: paramsPromise }) {
  // select role
  const [role, setrole] = useState("");
  const [email, setemail] = useState("");

  // is loading
  const [isload, setisload] = useState(false);
  // router
  const router = useRouter();

  // snack bar
  const { setshowsnackbar } = useSnackbar();

  // unwrap params because it became promise
  const params = use(paramsPromise);
  // cookie
  const Cookie = new Cookies();
  // user
  const [user, setuser] = useState({
    name: "",
    email: "",
    role: "",
  });

  // get the user now
  useEffect(() => {
    const token = Cookie.get("ecommercetoken");

    async function getuser() {
      try {
        const res = await axios.get(`${NEXT_PUBLIC_API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userrole = res.data.role;
        if (userrole === "1997") {
          router.push("/notallowed");
        }
        if (userrole === "2001") {
          router.push("/notfound");
        }
        setrole(userrole);
        setemail(res.data.email);
      } catch (err) {
        console.log(err);
      }
    }
    getuser();
  }, []);

  useEffect(() => {
    // load
    setisload(true);
    // user id
    const userid = params.specificuser;
    // token
    const token = Cookie.get("ecommercetoken");

    async function getuser() {
      try {
        const res = await axios.get(
          `${NEXT_PUBLIC_API_URL}/api/user/${userid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setuser({
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        });
        setisload(false);
      } catch (err) {
        console.log(err);
        setshowsnackbar({
          open: true,
          content: "sorry error in server come back soon ",
          duration: 2000,
          type: "error",
          vertical: "top",
          horizontal: "center",
        });
      }
    }
    getuser();
  }, []);

  //   handeledituser

  async function edituser() {
    // load
    setisload(true);
    // user id
    const userid = params.specificuser;

    // token
    const token = Cookie.get("ecommercetoken");

    try {
      const res = await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/user/edit/${userid}`,
        {
          name: user.name,
          email: user.email,
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
        content: "edit success",
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
      setisload(false);
    }
  }

  //   handel check the inputs
  function handeledituser() {
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
        content: "email is empety",
        duration: 4000,
        type: "error",
        vertical: "top",
        horizontal: "center",
      });
    } else {
      edituser();
    }
  }
  return role === "1995" ? (
    <div style={{ padding: "15px" }}>
      {/* <h1>{params.specificuser}</h1> */}
      <h2 style={{ marginBottom: "20px" }}>Edit User</h2>
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
            disabled={role !== "1995"}
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
            disabled={role !== "1995"}
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
            gap: "8px",
            marginTop: "30px",
          }}
        >
          <FormControl
            disabled={role !== "1995" || email === user.email}
            sx={{ m: 1, minWidth: 120 }}
            size="small"
          >
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
              <MenuItem value="1999">Product manger</MenuItem>
              <MenuItem value="2001">User</MenuItem>
            </Select>
          </FormControl>

          <Button
            disabled={isload || role !== "1995"}
            variant="contained"
            onClick={() => {
              handeledituser();
            }}
          >
            edit
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
