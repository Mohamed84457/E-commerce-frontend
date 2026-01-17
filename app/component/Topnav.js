import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from "../signUp/signupstyles.module.css";
import Link from "next/link";
export default function Topnav() {
  return (
    <div className={styles.topnav}>
      <div>
        <Link
          href={"/"}
          style={{ display: "flex", alignItems: "center", gap: "5px" }}
        >
          <Typography color="#4B0082" variant="h4" gutterBottom>
            DMT
          </Typography>
          <Typography color="#4db6ac" variant="h6" gutterBottom>
            website store
          </Typography>
        </Link>
      </div>
      <div className={styles.navbuttons}>
        <Link href={"/signUp/login"}>
          <Button className={styles.signupButton} variant="contained">
            log in
          </Button>
        </Link>
        <Link href={"/signUp"}>
          <Button className={styles.signupButton} variant="contained">
            register
          </Button>
        </Link>
      </div>
    </div>
  );
}
