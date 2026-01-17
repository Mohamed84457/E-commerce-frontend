import styles from "./categorycard.module.css";

export default function Categorycommerce({
  id,
  title = "",
  maxLength = 20,
  onClick,
}) {
  const displayTitle =
    title.length > maxLength ? title.slice(0, maxLength) + "..." : title;

  return (
    <div
      className={styles.categoryCard}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      data-id={id}
    >
      <h3 className={styles.title}>{displayTitle || "Category"}</h3>
    </div>
  );
}
