import { useMemo } from "react";
import styles from "./productcard.module.css";
import Rating from "@mui/material/Rating";

export default function Productcommercecard({ pro }) {
  const {
    title,
    description,
    price,
    discount,
    rating,
    images,
  } = pro || {};

  const finalPrice = useMemo(() => {
    if (!discount) return price;
    return (price - price * (discount / 100)).toFixed(2);
  }, [price, discount]);

  return (
    <article className={styles.card}>
      {/* Image */}
      <div className={styles.imageWrapper}>
        <img
          src={images?.[0]?.image || "/placeholder.png"}
          alt={title || "Product image"}
          loading="lazy"
          decoding="async"
        />
        {discount > 0 && (
          <span className={styles.badge}>-{discount}%</span>
        )}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <h4 className={styles.title}>{title}</h4>

        <p className={styles.description}>
          {description?.length > 80
            ? description.slice(0, 80) + "…"
            : description}
        </p>

        {/* Price */}
        <div className={styles.priceRow}>
          {discount > 0 && (
            <span className={styles.oldPrice}>${price}</span>
          )}
          <span className={styles.newPrice}>${finalPrice}</span>
        </div>

        {/* Rating */}
        <Rating
          value={Number(rating) || 0}
          precision={0.5}
          readOnly
          size="small"
        />
      </div>
    </article>
  );
}
