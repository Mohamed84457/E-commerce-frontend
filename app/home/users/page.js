"use client";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import styles from "./users.module.css";
import axios from "axios";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// components
import Tablerow from "@/app/component/tablerow";
import Loading from "@/app/component/loading";
import PaginatedItems from "@/app/component/pagination";
// context
import { useLoading } from "@/app/context/loadingcontext";
import { useSnackbar } from "@/app/context/snackbarcontext";

import { useIsuserchange } from "@/app/context/isuserschangescontext";
import Link from "next/link";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

// role constants
const ADMIN_ROLE = "1995";
const WRITER_ROLE = "1997";
const PRODUCT_MANGER_ROLE = "1999";
const SELLER_ROLE = "2001";

export default function Users() {
  const [role, setRole] = useState("");
  const [searchuser, setSearchuser] = useState("");
  const [users, setUsers] = useState([]);

  const route = useRouter();
  const { isuserchange } = useIsuserchange();
  const { setshowloading } = useLoading();
const { setshowsnackbar } = useSnackbar();
  const Cookie = new Cookies();
  const ecommercetoken = Cookie.get("ecommercetoken");

  // pagination
  const [page, setpage] = useState(1);
  const [limit, setlimit] = useState(5);
  const [datalength, setdatalength] = useState(0);
  const [current_page, setcurrent_page] = useState(1);

  function handelchangepage(e) {
    setpage(e);
  }
  function handelchangelimit(e) {
    setlimit(e);
  }
  // fetch current user + role check
  useEffect(() => {
    async function checkUserRole() {
      try {
        const res = await axios.get(`${NEXT_PUBLIC_API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${ecommercetoken}` },
        });
        const userrole = res.data.role;
        setRole(userrole);

        if (userrole === PRODUCT_MANGER_ROLE || userrole === WRITER_ROLE)
          route.push("/notallowed");
        if (userrole === SELLER_ROLE) route.push("/notfound");
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }
    checkUserRole();
  }, []);

  // fetch all users (only if admin)
  useEffect(() => {
    if (role !== ADMIN_ROLE) return;

    setshowloading(true);
    async function getAllUsers() {
      try {
        const res = await axios.get(
          `${NEXT_PUBLIC_API_URL}/api/users?limit=${limit}&page=${page}`,
          {
            headers: { Authorization: `Bearer ${ecommercetoken}` },
          }
        );
       
        setUsers(res.data.data);
        setcurrent_page(res.data.current_page);
        setdatalength(res.data.total);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setshowloading(false);
      }
    }
    if (!searchuser) {
      getAllUsers();
    }
  }, [role, isuserchange, limit, page]);

  

  async function handelsearchuser() {
    // token
    const token = Cookie.get("ecommercetoken");
    setshowloading(true);
    try {
      const res = await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/user/search?title=${searchuser}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      setUsers(res.data);
    } catch (err) {
      setshowsnackbar({
        open: true,
        content: "Search failed. Please try again.",
        duration: 4000,
        type: "error",
        vertical: "top",
        horizontal: "center",
      });
    }
    setshowloading(false);
  }

  useEffect(() => {
    const t = setTimeout(() => {
      handelsearchuser();
      setpage(1);
    }, 600);
    return () => clearTimeout(t);
  }, [searchuser]);

  if (role !== ADMIN_ROLE) return null;

  return (
    <div style={{ overflowX: "auto", padding: "5px" }}>
      {/* Header */}
      <div
        style={{
          padding: "10px 15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "5px",
        }}
      >
        <h2 style={{ letterSpacing: "2px" }}>USERS</h2>
        <TextField
          style={{ marginBottom: "5px", width: "25%" }}
          value={searchuser}
          onChange={(e) => setSearchuser(e.target.value)}
          label="Search"
          variant="standard"
        />
      </div>

      {/* Users Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th className={styles.thStyle}>#</th>
            <th className={styles.thStyle}>Name</th>
            <th className={styles.thStyle}>Email</th>
            <th className={styles.thStyle}>Role</th>
            <th className={styles.thStyle}>created</th>
            <th className={styles.thStyle}>updated</th>
            <th className={styles.thStyle}>Edit</th>
            <th className={styles.thStyle}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <Tablerow key={user.id} index={index} user={user} />
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "10px" }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add User Button */}
      <Link href="/home/users/newuser">
        <Tooltip title="New User">
          <Button id={styles.buttonaAddUser} variant="contained">
            Add
          </Button>
        </Tooltip>
      </Link>

      <PaginatedItems
        changepage={handelchangepage}
        limit={limit}
        changelimit={handelchangelimit}
        itemsPerPage={limit}
        datalength={datalength}
        currentpage={current_page}
      />
      <Loading />
    </div>
  );
}
