import { useState } from "react";
import styles from "./ordercomponent.module.css";
// mui
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

// icons
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
// update supabase api
import { updatePhoneNumber } from "../orderapi/updateorders";
import { updateWathappNumber } from "../orderapi/updateorders";
import { updateOrderStatus } from "../orderapi/updateorders";
import { deleteOrderItem } from "../orderapi/updateorders";
// context
import { useFeedbackweb } from "../website/feedback/page";

export default function OrderComponent({ or, handleDeleteOrder }) {
  // feedback
  const { showSnackbar } = useFeedbackweb();
  // loading saving
  const [saveloading, setsaveloading] = useState(false);

  const [phoneactive, setphoneactive] = useState(true);
  const [whatappactive, setwhatappactive] = useState(true);
  function changewhatappactive() {
    setwhatappactive((pre) => !pre);
  }
  function changephoneactive() {
    setphoneactive((pre) => !pre);
  }
  // order
  const [order, setorder] = useState(or || {});
  console.log(order);

  //   change status
  function changeprogress() {
    setorder((prev) => ({
      ...prev,
      status: !prev.status,
    }));
  }
  //   change phone number
  function changephonenumber(c) {
    setorder((prev) => ({
      ...prev,
      userdata_order: {
        ...prev.userdata_order,
        phone_number: c,
      },
    }));
  }
  //   change whatapp phone
  function changewhatappnumber(c) {
    setorder((prev) => ({
      ...prev,
      userdata_order: {
        ...prev.userdata_order,
        whatsapp_phone: c,
      },
    }));
  }
  // confirm change user info into api
  async function confirmchangeuserinfo() {
    setsaveloading(true);
    const phoneupdate = await updatePhoneNumber(
      order.userdata_order.user_id,
      order.userdata_order.phone_number
    );
    const whatappupdate = await updateWathappNumber(
      order.userdata_order.user_id,
      order.userdata_order.whatsapp_phone
    );
    if (phoneupdate.success && whatappupdate.success) {
      showSnackbar("update success", "5000");
    } else {
      showSnackbar("error in update", "5000", "error");
    }
    setsaveloading(false);
  }
  //   confirm change status
  async function confirmchangeorderstatus() {
    const updateorderstatus = await updateOrderStatus(
      order.order_id,
      order.status
    );
    if (updateorderstatus.success) {
      showSnackbar("update success", "5000");
    } else {
      showSnackbar("error in update", "5000", "error");
    }
  }

  // delete specific order item and update state
  async function deleteOrderItemFromState(id) {
    try {
      // 1️⃣ Delete from Supabase
      const res = await deleteOrderItem(id);

      if (!res.success) {
        console.error("Failed to delete item:", res.error);
        return;
      }

      // 2️⃣ Update local state
      setorder((prev) => {
        const updatedItems = (prev.order_item || []).filter((o) => o.id !== id);

        // Optional: recalculate total
        const newTotal = updatedItems.reduce(
          (sum, item) => sum + item.price * item.amount,
          0
        );

        return {
          ...prev,
          order_item: updatedItems,
          total: newTotal,
        };
      });

      showSnackbar("order item delete success ", "5000");
    } catch (err) {
      showSnackbar("error in deleting", "5000", "error");
    }
  }
  // confirm deleteing order
  function confirmdeleteorder() {
    handleDeleteOrder(order.userdata_order.user_id, order.order_id);
  }
  const items = order?.order_item || [];

  return (
    <div className={styles.ordercom}>
      {/* Order Info */}
      <div>
        <h2>
          Order <strong className={styles.num}>#{order.order_id}</strong>
        </h2>
        <div className={styles.orderprogress}>
          <p>
            Status:{" "}
            <strong style={{ color: order.status ? "#1bcc15" : "#ae2a1c" }}>
              {order.status ? "Done" : "Pending"}
            </strong>
          </p>
          <button onClick={changeprogress}>
            <PublishedWithChangesIcon />
          </button>
        </div>
        <p>
          Total: <strong>{order.total}</strong>
        </p>
        {/* save button */}
        <button
          className={styles.btnposition}
          onClick={confirmchangeorderstatus}
        >
          {saveloading ? <CircularProgress /> : <SaveIcon />}
        </button>
      </div>

      {/* User Info */}
      <hr />
      <div className={styles.userinfo}>
        <h3>User Info</h3>
        <p>Name: {order.userdata_order.user_name}</p>
        <p>Email: {order.userdata_order.user_email}</p>
        <div className={styles.inpt}>
          Phone:
          <TextField
            defaultValue={order.userdata_order.phone_number}
            variant="standard"
            disabled={phoneactive}
            onChange={(c) => {
              changephonenumber(c.target.value);
            }}
          />
          <button onClick={changephoneactive}>
            <SettingsIcon />
          </button>
        </div>
        <div className={styles.inpt}>
          WhatsApp:{" "}
          <TextField
            defaultValue={order.userdata_order.whatsapp_phone}
            variant="standard"
            disabled={whatappactive}
            onChange={(c) => {
              changewhatappnumber(c.target.value);
            }}
          />
          <button onClick={changewhatappactive}>
            <SettingsIcon />
          </button>
        </div>
        {/* save button */}
        <button className={styles.btnposition} onClick={confirmchangeuserinfo}>
          {saveloading ? <CircularProgress /> : <SaveIcon />}
        </button>
      </div>
      {/* Items */}
      <hr />
      <div>
        <h3>Items</h3>

        {items.length === 0 && <p>No items found</p>}

        {items.map((item, index) => (
          <div
            key={`${order.order_id}-${index}`}
            className={styles.item}
            style={{
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
            <p>
              <strong className={styles.num}>#{index + 1}</strong>
            </p>
            <p>Item: {item.item_name}</p>
            <p>Category: {item.category}</p>
            <p>Price: {item.price}</p>
            <p>Amount: {item.amount}</p>
            <button
              className={styles.deleteBtn}
              onClick={() => {
                deleteOrderItemFromState(item.id);
              }}
            >
              <DeleteIcon />
            </button>
          </div>
        ))}
      </div>
      <button className={styles.deleteorderBtn} onClick={confirmdeleteorder}>
        Delete Order
      </button>
    </div>
  );
}
