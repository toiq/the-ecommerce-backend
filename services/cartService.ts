import prismaClient from "../dbclients/prismaClient.js";

export const updateCartTotal = async (cartId: string) => {
  // Calculate total based on cart items belonging to this specific cart
  const cartItems = await prismaClient.cartItem.findMany({
    where: { cartId },
    select: {
      price: true,
      quantity: true,
    },
  });

  // Calculate the total by summing up price * quantity for each cart item
  const total = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  // Update the total in the cart
  await prismaClient.cart.update({
    where: { id: cartId },
    data: { total },
  });
};
