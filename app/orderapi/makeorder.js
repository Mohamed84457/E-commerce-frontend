import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://mndxiqetauidfyfiykci.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZHhpcWV0YXVpZGZ5Zml5a2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTI0ODAsImV4cCI6MjA4MjE2ODQ4MH0.dj0PvZsBSZs5sO1UiMjvutAHYMfUSKN54sUeEsLqMvU"
);
// price after discount
function priceafterdiscount(p, d) {
  return Number(p) - Number(p) * (Number(d) / 100);
}
// check if user had been exist
export async function ifUserExist(userId) {
  try {
    const { data: existingUser, error } = await supabase
      .from("userdata_order")
      .select("*")
      .eq("user_id", userId)
      .limit(1)
      .single(); // returns single row or error if not found

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found

        return false;
      } else {
        throw error; // some other error
      }
    }

    return true;
  } catch (err) {
    console.error("Error checking user:", err.message);
    return false;
  }
}

// ===check if user had been exist ===
export async function addOrder(userData, items) {
  try {
    // 1️⃣ Insert user data
    const userexist = await ifUserExist(userData.user_id);
    if (!userexist) {
      const { data: user, error: userError } = await supabase
        .from("userdata_order")
        .insert([
          {
            user_id: userData.user_id,
            user_name: userData.user_name,
            user_email: userData.user_email,
            whatsapp_phone: userData.whatsapp_phone,
            phone_number: userData.phone_number,
            address: userData.address,
          },
        ])
        .select()
        .single();

      if (userError) throw userError;
    }

    // 2️⃣ Calculate total
    const total = items.reduce(
      (sum, item) =>
        sum + priceafterdiscount(item.price, item.discount) * item.Amount,
      0
    );

    // 3️⃣ Insert order
    const { data: order, error: orderError } = await supabase
      .from("order")
      .insert([
        {
          user_id: userData.user_id,
          total: total,
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;
    const order_id = order.order_id;

    // 4️⃣ Insert order items
    const orderItems = items.map((item) => ({
      item_id: order_id,
      item_name: item.title,
      category: item.category,
      price: priceafterdiscount(item.price, item.discount),
      amount: item.Amount,
    }));

    const { error: itemsError } = await supabase
      .from("order_item")
      .insert(orderItems);

    if (itemsError) {
      await supabase.from("order").delete().eq("order_id", order_id);
      throw itemsError;
    }

    return {
      success: true,
      order_id: order.order_id,
    };
  } catch (error) {
    console.error("Add order error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
