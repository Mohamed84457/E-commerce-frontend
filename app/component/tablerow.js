"use client";
// icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Cookies from "universal-cookie";
import { useState } from "react";
// contexts
import { useSnackbar } from "../context/snackbarcontext";
import { useIsuserchange } from "../context/isuserschangescontext";
import { useUserdata } from "../context/userdatacontext";

import styles from "../home/users/users.module.css";
import Link from "next/link";
import axios from "axios";
import { NEXT_PUBLIC_API_URL } from "../publicurl/URLbase";
export default function Tablerow({ index, user }) {
  console.log(user);
  // user data
  const { userdata, setuserdata } = useUserdata();
  // is users change
  const { setisuserchange } = useIsuserchange();
  // cookie
  const Cookie = new Cookies();
  // snackbar
  const { setshowsnackbar } = useSnackbar();
  //   delete dialog
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //   ===delete dialog===

  //   handeldeleteuser
  async function handeldeleteuser() {
    //token
    const token = Cookie.get("ecommercetoken");
    // check if the admin
    if (user.role === "1995") {
      setshowsnackbar({
        open: true,
        content: "you can not delete admin",
        duration: 4000,
        type: "error",
        vertical: "top",
        horizontal: "center",
      });
      handleClose();
      return;
    }
    // delete user
    try {
      const res = await axios.delete(
        `${NEXT_PUBLIC_API_URL}/api/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res);
      if (res.status === 200) {
        setisuserchange((pre) => {
          return !pre;
        });
        setshowsnackbar({
          open: true,
          content: "deleting success",
          duration: 4000,
          type: "success",
          vertical: "top",
          horizontal: "center",
        });
      } else {
        setshowsnackbar({
          open: true,
          content: "Failed to delete user",
          duration: 4000,
          type: "error",
          vertical: "top",
          horizontal: "center",
        });
      }
    } catch (err) {
      console.log(err);
    }
    handleClose();
  }
  return (
    <>
      <tr
        style={{
          background: user.email === "admin@gmail.com" ? "#528e9dcd" : "",
        }}
        className={index % 2 ? styles.rowAlt : styles.row}
      >
        <td className={styles.tdStyle}>{index + 1}</td>
        <td className={styles.tdStyle}>
          {user.email === userdata.user.email
            ? `${user.name} ( you )`
            : user.name}
        </td>
        <td className={styles.tdStyle}>{user.email}</td>
        <td className={styles.tdStyle}>
          {user.role === "1995"
            ? "admin"
            : user.role === "2001"
            ? "user"
            : user.role === "1999"
            ? "product manger "
            : "writer"}
        </td>
        <td>{user.created_at}</td>
        <td>{user.updated}</td>
        <td className={styles.tdStyle}>
          <Link href={`/home/users/${user.id}`}>
            <EditIcon id={styles.iconuser} />
          </Link>
        </td>
        <td className={styles.tdStyle}>
          <DeleteIcon
            id={styles.iconuser}
            onClick={handleClickOpen}
            style={{ color: "#fe4444ff" }}
          />
        </td>
      </tr>
      {/* delete dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">deleting user</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            are you sure delete {user.name} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>close</Button>
          <Button
            onClick={() => {
              handeldeleteuser();
            }}
            style={{ background: "#ff3333ff", color: "#fff" }}
            autoFocus
          >
            confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
