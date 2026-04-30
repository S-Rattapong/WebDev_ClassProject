import { supabase } from "./supabase";

/**
 * Execute the checkout flow using the Header-Detail relational pattern.
 *
 * @param {string} userEmail - The email of the user placing the order (to lookup USER.user_id)
 * @param {Array} cartItems - Array of cart items from Zustand state
 * @returns {string} The newly created order_id
 */
export async function checkoutOrder(userEmail, cartItems) {
  if (!cartItems || cartItems.length === 0) {
    throw new Error("Cannot checkout an empty cart.");
  }

  // Lookup the custom user_id from the USER table based on email
  const { data: userData, error: userError } = await supabase
    .from("USER")
    .select("user_id")
    .eq("email", userEmail)
    .single();

  if (userError || !userData) {
    throw new Error(`Failed to find user profile: ${userError?.message || 'User not found in USER table'}`);
  }

  const customUserId = userData.user_id;

  // Step 1: Insert a single new record into the ORDERS table
  const { data: orderData, error: orderError } = await supabase
    .from("ORDERS")
    .insert({
      user_id: customUserId,
      order_status: "pending",
    })
    .select("order_id")
    .single();

  if (orderError) {
    throw new Error(`Failed to create order header: ${orderError.message}`);
  }

  const newOrderId = orderData.order_id;

  // Step 2: Map the array of cart items attaching the new order_id
  const orderItemsData = cartItems.map((item) => ({
    order_id: newOrderId,
    variant_id: item.variant_id,
    quantity: item.quantity,
    total_price: item.price * item.quantity,
  }));

  // Step 3: Perform a bulk insert into the ORDER_ITEMS table
  const { error: itemsError } = await supabase
    .from("ORDER_ITEMS")
    .insert(orderItemsData);

  if (itemsError) {
    // Ideally we should rollback the ORDER here if we had a transaction,
    // but without RPC, we throw an error.
    throw new Error(`Failed to insert order items: ${itemsError.message}`);
  }

  // Success
  return newOrderId;
}
