/**
 * Editora Graça — Cart Logic (Vanila JS)
 */

let cart = JSON.parse(localStorage.getItem('cart') || '[]');

/**
 * Add a book to the cart
 */
export function addToCart(book) {
    const existing = cart.find(item => item.id === book.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...book, quantity: 1 });
    }
    saveCart();
    notifyCartChange();
}

/**
 * Remove an item from the cart
 */
export function removeFromCart(bookId) {
    cart = cart.filter(item => item.id !== bookId);
    saveCart();
    notifyCartChange();
}

/**
 * Update item quantity
 */
export function updateQuantity(bookId, delta) {
    const item = cart.find(item => item.id === bookId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(bookId);
        } else {
            saveCart();
            notifyCartChange();
        }
    }
}

/**
 * Get total items count
 */
export function getCartCount() {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
}

/**
 * Get total price
 */
export function getCartTotal() {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
}

/**
 * Clear the cart
 */
export function clearCart() {
    cart = [];
    saveCart();
    notifyCartChange();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function notifyCartChange() {
    // Dispatch custom event for UI updates
    const event = new CustomEvent('cartUpdated', { detail: { count: getCartCount(), cart } });
    window.dispatchEvent(event);
}

// Initial notification for pages that load later
window.addEventListener('DOMContentLoaded', () => {
    notifyCartChange();
});
