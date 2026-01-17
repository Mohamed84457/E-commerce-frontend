"use client";
// mui
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import MailIcon from "@mui/icons-material/Mail";
// icons
import MenuIcon from "@mui/icons-material/Menu";
// context
import { useSidebar } from "../context/sidebarcontext";
// components
import AccountMenu from "./acountmenu";

import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";
// context
import { useUserdata } from "../context/userdatacontext";
import styles from "../home/homestyles.module.css";

export default function Pagetopnav() {
  // side bar
  const { setshowsidebar } = useSidebar();
  // car shop styles
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
      padding: "0 4px",
    },
  }));
  // user data
  const { userdata, setuserdata } = useUserdata();
  // cookie
  const Cookie = new Cookies();
  // route
  const route = useRouter();
  // handelsidebar
  function handelsidebar() {
    //multiple set on button
    setshowsidebar((pre) => {
      return !pre;
    });
  }
  return (
    <div className={styles.containerpagetopnav}>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Button
          variant="text"
          style={{ color: "#676767ff" }}
          onClick={() => {
            handelsidebar();
          }}
        >
          <MenuIcon />
        </Button>
        <h1>DMT </h1>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "50%",
            gap: "30px",
            padding: "10px 20px",
          }}
        >
          <Badge badgeContent={4} color="primary">
            <MailIcon color="action" />
          </Badge>

          <AccountMenu userrole={"1995"} />
        </div>
      </div>
    </div>
  );
}
