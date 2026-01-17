import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://mndxiqetauidfyfiykci.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZHhpcWV0YXVpZGZ5Zml5a2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTI0ODAsImV4cCI6MjA4MjE2ODQ4MH0.dj0PvZsBSZs5sO1UiMjvutAHYMfUSKN54sUeEsLqMvU"
);
// update phone number
export async function updatePhoneNumber(user_id, newPhone) {
  try {
    const { data, error } = await supabase
      .from("userdata_order")
      .update({
        phone_number: newPhone,
        updated_at: new Date().toISOString(), // optional
      })
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      user: data,
    };
  } catch (error) {
    console.error("Update phone error:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// update whatsapp number
export async function updateWathappNumber(user_id, newPhone) {
  try {
    const { data, error } = await supabase
      .from("userdata_order")
      .update({
        whatsapp_phone: newPhone,
        updated_at: new Date().toISOString(), // optional
      })
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      user: data,
    };
  } catch (error) {
    console.error("Update phone error:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}
// update order status
export async function updateOrderStatus(order_id, value = false) {
  try {
    const { data, error } = await supabase
      .from("order")
      .update({ status: value })
      .eq("order_id", order_id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      order: data,
    };
  } catch (error) {
    console.error("Update order status error:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}



// delete a specific order item
export async function deleteOrderItem(item_id) {
  try {
    const { data, error } = await supabase
      .from("order_item")
      .delete()
      .eq("id", item_id)
      .select()
      .single(); // returns the deleted row

    if (error) throw error;

    return {
      success: true,
      deletedItem: data,
    };
  } catch (error) {
    console.error("Delete order item error:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// delete full order
export async function deleteOrder(user_id, order_id) {
  try {
    const { error: itemsError } = await supabase
      .from("order_item")
      .delete()
      .eq("item_id", order_id);

    if (itemsError) throw itemsError;

    const { data: deletedOrder, error: orderError } = await supabase
      .from("order")
      .delete()
      .eq("order_id", order_id)
      .eq("user_id", user_id)
      .select()
      .single();

    if (orderError) throw orderError;

    return { success: true, deletedOrder };
  } catch (error) {
    console.error("Delete order error:", error.message);
    return { success: false, error: error.message };
  }
}



