import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from "./topnav.module.css";
import Link from "next/link";

export default function Topnav() {
  return (
    <div className={styles.topnav}>
      <Link href={"/"} className={styles.navLogo}>
        <Typography variant="h4">DMT</Typography>
        <Typography variant="h6">website store</Typography>
      </Link>

      <div className={styles.navbuttons}>
        <Link href={"/signUp/login"}>
          <Button className={styles.signupButton} variant="contained">
            Log in
          </Button>
        </Link>
        <Link href={"/signUp"}>
          <Button className={styles.signupButton} variant="contained">
            Register
          </Button>
        </Link>
      </div>
    </div>
  );
}
