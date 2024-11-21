function showNotification(message) {
    alert(message);
}

function closeNotification() {
    // La ventana emergente se cerrará automáticamente
}

// Función asincrónica para obtener un producto por su ID
async function getProductById(productId) {
    try {
        const response = await fetch('../data/productos.json');
        const data = await response.json();
        for (const category of data.categories) {
            const product = category.products.find(p => p.id === productId);
            if (product) {
                return { ...product, category: category.name };
            }
        }
        return null;
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;
    }
}


// Función para actualizar la interfaz de usuario del carrito
function updateCartUI() {
    const cartContainer = document.getElementById('carrito-container');
    const realizarCompraBtn = document.getElementById('realizar-compra-btn');
    if (cartContainer && realizarCompraBtn) {
        cartContainer.innerHTML = '';
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = 0;

        // Crear tarjetas de carrito para cada artículo y calcular el total
        for (const item of cart) {
            const cartCard = createCartCard(item);
            cartContainer.appendChild(cartCard);
            total += item.price * item.quantity;
        }

        // Actualizar el total y mostrar o ocultar el botón de compra
        updateTotal(total);

        if (cart.length > 0) {
            realizarCompraBtn.style.display = 'block';
        } else {
            realizarCompraBtn.style.display = 'none';
        }
    } else {
        console.error('Elemento con ID "carrito-container" o "realizar-compra-btn" no encontrado');
    }
}

// Función para crear una tarjeta de carrito para un artículo
function createCartCard(cartItem) {
    const cartCard = document.createElement('div');
    cartCard.classList.add('cart-box');
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('cart-img-container');
    imgContainer.innerHTML = `<img src="${cartItem.image}" alt="${cartItem.name}">`;
    const textContainer = document.createElement('div');
    textContainer.classList.add('cart-text-container');
    const totalPrice = !isNaN(cartItem.price) && !isNaN(cartItem.quantity) ? Math.abs(cartItem.price * cartItem.quantity) : 0;
    textContainer.innerHTML = `
        <h3 style="font-size: 2.5rem;">${cartItem.name}</h3>
        <p style="font-size: 2rem;">Cantidad: ${cartItem.quantity}</p>
        <span class="price" style="font-size: 2rem;"> $${totalPrice.toFixed(2)}</span>
        <button class="remove-btn" onclick="removeFromCart(${cartItem.id})">Eliminar</button>
    `;
    cartCard.appendChild(imgContainer);
    cartCard.appendChild(textContainer);

    updateTotal(totalPrice);
    return cartCard;
}

// Función para actualizar el total y la interfaz de usuario del carrito
function updateTotalAndUI(cart) {
    const total = cart.length > 0 ? cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0;
    updateTotal(total);
    updateCartUI();
}

// Función para actualizar el total mostrado en la interfaz de usuario
function updateTotal(price) {
    const currentTotalElement = document.getElementById('total-price');
    if (currentTotalElement) {
        currentTotalElement.innerText = `$${price.toFixed(2)}`;
    }
}

// Función para realizar la compra y mostrar un mensaje de agradecimiento
function realizarCompra() {
    alert("Gracias por tu compra!");
    localStorage.removeItem('cart');
    updateCartUI();
    updateTotal(0);
}

document.getElementById('categoryFilter').addEventListener('change', function (event) {
    const selectedCategory = event.target.value;
    const productContainer = document.getElementById('productcontainerJug');
    productContainer.innerHTML = ''; // Limpiar productos
    if (selectedCategory === 'Todos') {
        // Llamar a renderProducts para cada categoría si se selecciona 'Todos'
        ['Peluches', 'Autitos', 'Sorpresas'].forEach(category => {
            renderProducts('productcontainerJug', category);
        });
    } else {
        renderProducts('productcontainerJug', selectedCategory);
    }
});

window.onload = function () {
    ['Peluches', 'Autitos', 'Sorpresas'].forEach(category => {
        renderProducts('productcontainerJug', category);
    });
};
