"use client";
import { useMemo } from "react";
import styles from "./orderItem.module.css";

export default function OrderItem({ num = 0, orderitem }) {
  const priceAfterDiscount = useMemo(() => {
    const price = Number(orderitem.price);
    const discount = Number(orderitem.discount || 0);
    return price - price * (discount / 100);
  }, [orderitem.price, orderitem.discount]);

  const totalPrice = useMemo(() => {
    return priceAfterDiscount * Number(orderitem.Amount);
  }, [priceAfterDiscount, orderitem.Amount]);

  const formatPrice = (value) =>
    value.toLocaleString("en-EG", {
      style: "currency",
      currency: "EGP",
    });

  return (
    <div className={styles.order_item}>
      <div className={styles.order_header}>
        <span className={styles.order_number}>#{num + 1}</span>
      </div>

      <div className={styles.order_row}>
        <span>Title</span>
        <span className={styles.highlight}>{orderitem.title}</span>
      </div>

      <div className={styles.order_row}>
        <span>Price</span>
        <span className={styles.highlight}>
          {formatPrice(priceAfterDiscount)}
        </span>
      </div>

      <div className={styles.order_row}>
        <span>Amount</span>
        <span className={styles.highlight}>{orderitem.Amount}</span>
      </div>

      <div className={styles.order_total}>
        <span>Total</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>
    </div>
  );
}
