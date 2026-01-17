"use client";
import { useEffect, useState } from "react";
import Ordercomponent from "@/app/component/ordercomponent";
import { createClient } from "@supabase/supabase-js";
import { deleteOrder } from "@/app/orderapi/updateorders";
import { useFeedbackweb } from "@/app/website/feedback/page";
import {
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_URL,
} from "@/app/supabaseapi/supabasekey";

const supabase = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function OrdersPage() {
  const { showSnackbar } = useFeedbackweb();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getOrders() {
    const { data, error } = await supabase
      .from("order")
      .select(
        `
        order_id,
        total,
        status,
        created_at,
        userdata_order (
          user_id,
          user_name,
          user_email,
          phone_number,
          whatsapp_phone,
          address
        ),
        order_item (
          id,
          item_name,
          category,
          price,
          amount
        )
      `
      )
      .range(0, 50)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        showSnackbar("Failed to load orders", "5000", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  async function handleDeleteOrder(user_id, order_id) {
    const res = await deleteOrder(user_id, order_id);

    if (res.success) {
      setOrders((prev) => prev.filter((o) => o.order_id !== order_id));
      showSnackbar("Order deleted successfully", "5000");
    } else {
      showSnackbar("Error deleting order", "5000", "error");
    }
  }

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      {orders.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          No orders found
        </p>
      )}
      {orders.map((or) => (
        <Ordercomponent
          key={or.order_id}
          or={or}
          handleDeleteOrder={handleDeleteOrder}
        />
      ))}
    </div>
  );
}
