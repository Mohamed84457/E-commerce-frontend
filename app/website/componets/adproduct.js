import styles from "./adproduct.module.css";

export default function Adproduct() {
  return (
    <div className={styles.ad_container}>
      <div>
    <h2>Up to 50% off – don’t miss out!</h2>
    <p>Shop now and discover amazing deals.</p>
    <button className={styles.adButton} >Explore Now</button>
    {/* put here the link of ad prodcuts */}
  </div>
    </div>
  );
}
