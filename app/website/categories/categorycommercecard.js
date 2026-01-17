import Image from "next/image";
import styles from "./Categorycommercecard.module.css";

export default function Categorycommercecard({ cat, onClick }) {
  if (!cat) return null;

  return (
    <div
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <Image
        src={cat.image || "/placeholder.jpg"}
        alt={cat.title || "category"}
        fill
        className={styles.image}
        priority
      />

      <div className={styles.title}>
        {cat.title || "Category"}
      </div>
    </div>
  );
}
