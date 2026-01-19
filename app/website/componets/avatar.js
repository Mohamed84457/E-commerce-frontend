// mui
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Logout from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";
import axios from "axios";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";

export default function AccountMenu() {
  // global cookie
  const Cookie = new Cookies();
  // user data
  const [userdata, setuserdata] = useState({
    name: "",
    email: "",
  });
  // router
  const router = useRouter();
  useEffect(() => {
    // token
    const token = Cookie.get("ecommercetoken");
    if (!token) {
      setuserdata({
        name: "",
        email: "",
      });
      return;
    }
    async function getuser() {
      try {
        const res = await axios.get(`${NEXT_PUBLIC_API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setuserdata({
          name: res.data.name,
          email: res.data.email,
        });
      } catch (error) {
        return;
      }
    }
    getuser();
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //   logout
  function logout() {
    Cookie.remove("ecommercetoken", {
      path: "/",
      sameSite: "Lax",
      secure: false,
    });
    Cookie.remove("ecommercetoken");
    setuserdata({
      name: "",
      email: "",
    });
  }
  // login
  function login() {
    setuserdata({
      name: "",
      email: "",
    });
    router.push("/signUp");
  }
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {!userdata.name ? "" : userdata.name[0].toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> {userdata.name || "name"}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> {userdata.email || "email"}
        </MenuItem>
        <Divider />
        <MenuItem onClick={login}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>

        {!userdata.name && !userdata.email ? (
          <MenuItem
            onClick={login}
            style={{ background: "#2a7be4", borderRadius: "5px" }}
          >
            <ListItemIcon>
              <LoginIcon fontSize="small" />
            </ListItemIcon>
            login
          </MenuItem>
        ) : (
          <MenuItem
            onClick={logout}
            style={{ background: "#e42a2a", borderRadius: "5px" }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
