// Función asincrónica para agregar un producto al carrito
async function addToCart(productId) {
    const product = await getProductById(productId);
    const quantityInput = document.getElementById(`my-input-${productId}`);
    const quantity = parseInt(quantityInput.value, 10);

    if (!isNaN(quantity) && quantity > 0 && product) {
        const cartItem = { ...product, quantity };
        addToLocalStorageCart(cartItem);
        showNotification('Tu producto ha sido agregado al carrito de compras');
        setTimeout(() => {
            closeNotification();
        }, 2000);
        window.location.reload();
    } else {
        console.error('Cantidad inválida o producto no encontrado');
    }
}

// Función para agregar un artículo al carrito en el almacenamiento local
function addToLocalStorageCart(cartItem) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === cartItem.id);

    if (existingItem) {
        existingItem.quantity += cartItem.quantity;
    } else {
        cart.push(cartItem);
    }

    // Almacenar el carrito actualizado en el localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para eliminar un artículo
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const removedItem = cart.find(item => item.id === productId);
    
    if (removedItem) {
        const removedItemTotal = removedItem.price * removedItem.quantity;
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateTotalAndUI(cart);
    }
}

async function syncCartWithBackend(cart) {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('/api/sales/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ products: cart }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Carrito sincronizado:', result);
        } else {
            console.error('Error al sincronizar el carrito');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

async function finalizePurchase() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    await syncCartWithBackend(cart);
    localStorage.removeItem('cart'); // Limpiar el carrito local
    alert('¡Compra finalizada con éxito!');
}
