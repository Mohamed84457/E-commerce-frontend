// components/Footer.js
import Image from "next/image";
import styles from "./footer.module.css";
// icons
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Logo */}
      <div className={styles.logoSection}>
        <Image
          src="/DMTcommerce.png"
          alt="DMT commerce"
          width={100}
          height={50}
        />
        <p className={styles.tagline}>Smart Shopping Made Simple</p>
      </div>

      {/* Links */}
      <div className={styles.linksSection}>
        <h4>Quick Links</h4>
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Shop</a>
          </li>
          <li>
            <a href="#">About Us</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
      </div>

      {/* Social Media */}
      <div className={styles.socialSection}>
        <h4>Follow Us</h4>
        <div className={styles.socialIcons}>
          <a
            href="https://www.facebook.com/medowhtie.dmt"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon />
          </a>

          <a
            href="https://eg.linkedin.com/in/mohamed-eldamaty-402466313?trk=profile-badge"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon />
          </a>
          
              
          <a href="#">
            <InstagramIcon />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} DMT Commerce. All rights reserved.
      </div>
    </footer>
  );
}
