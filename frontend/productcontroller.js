// Función para crear una card para un producto
function createCard(product) {
    const card = document.createElement('div');
    card.classList.add('box');
    card.id = `${product.category.toLowerCase()}-${product.id}`;
    card.innerHTML = `
        <span class="price"> $${product.price} </span>
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <a class="btn" onclick="addToCart(${product.id})">Pedilos ahora!</a>
        <div class="container">
            <button class="decrement" onclick="stepper(document.getElementById('my-input-${product.id}'), false)"> - </button>
            <input type="number" value="0" min="0" max="20" step="1" id="my-input-${product.id}" readonly>
            <button class="increment" onclick="stepper(document.getElementById('my-input-${product.id}'), true)"> + </button>
        </div>
    `;
    return card;
}

// Función para renderizar productos en un contenedor específico
function renderProducts(container, category) {
    const productContainer = document.getElementById(container);

    if (productContainer) {
        fetch('../data/productos.json')
            .then(res => res.json())
            .then(data => {
                const products = data.categories.find(cat => cat.name === category);

                if (products) {
                    products.products.forEach(product => {
                        const card = createCard({ ...product, category: category });
                        productContainer.appendChild(card);
                    });
                } else {
                    console.error(`Products not found for category: ${category}`);
                }
            })
            .catch(error => console.error('Error fetching products:', error));
    } else {
        console.error(`Product container with id '${container}' not found`);
    }
}