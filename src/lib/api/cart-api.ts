// lib/api/cart.ts
import { CartItem, WishlistItem } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function addToCart(item: CartItem) {
  const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add item to cart');
  }

  return response.json();
}

export async function removeFromCart(itemId: string) {
  const response = await fetch(`${API_BASE_URL}/api/cart/remove`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: JSON.stringify({ itemId }),
  });

  if (!response.ok) {
    throw new Error('Failed to remove item from cart');
  }

  return response.json();
}

export async function updateCartQuantity(itemId: string, quantity: number) {
  const response = await fetch(`${API_BASE_URL}/api/cart/update`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ itemId, quantity }),
  });

  if (!response.ok) {
    throw new Error('Failed to update cart quantity');
  }

  return response.json();
}

export async function getCart() {
  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }

  return response.json();
}

export async function clearCart() {
  const response = await fetch(`${API_BASE_URL}/api/cart/clear`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to clear cart');
  }

  return response.json();
}

// Wishlist functions
export async function addToWishlist(item: WishlistItem) {
  const response = await fetch(`${API_BASE_URL}/api/wishlist/add`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add item to wishlist');
  }

  return response.json();
}

export async function removeFromWishlist(itemId: string) {
  const response = await fetch(`${API_BASE_URL}/api/wishlist/remove`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: JSON.stringify({ itemId }),
  });

  if (!response.ok) {
    throw new Error('Failed to remove item from wishlist');
  }

  return response.json();
}

export async function getWishlist() {
  const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch wishlist');
  }

  return response.json();
}