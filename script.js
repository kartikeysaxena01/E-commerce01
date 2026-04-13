const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSomADrhP03ixMB8ttAaDaJLX8IOeIk1Yjd0qx2aTsbAabh2-GSOeLP4OpW2Xhhxw37ejed6QQTGifbdbjStzaDD02pkhEXU3RO5HvqM1t_9vkmqAgsfWmqLMU",
        category: "Electronics"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        image:"https://www.lapcare.com/cdn/shop/files/Fitso_3_black.jpg?v=1757325785&width=2048",
        category: "Electronics"
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 89.99,
        image: "https://www.campusshoes.com/cdn/shop/files/VESPER_VESPER_WHT-MILKY_BLU_07.webp?v=1758174807",
        category: "Fashion"
    },
    {
        id: 4,
        name: "Coffee Maker",
        price: 129.99,
        image: "https://m.media-amazon.com/images/I/61f6PcoXczL._AC_UF350,350_QL80_.jpg",
        category: "Home & Kitchen"
    },
    {
        id: 5,
        name: "Backpack",
        price: 59.99,
        image: "https://icon.in/cdn/shop/files/1_5b7bd7ae-1e7e-4cbe-a7fc-2f6d8b64f082.jpg?v=1763107481",
        category: "Fashion"
    },
    {
        id: 6,
        name: "Bluetooth Speaker",
        price: 79.99,
        image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRIoOzkYiHkv2nLyOtZERvnhG-Bo5camaOvpq7XPOFhPGUPpWWjSd0T_bynMMTRzstbORCrsI1WOaHZqqFv2B8J8jZuUlFIswZRKKsa08ctShiLAduZYmonTYehB2Th5NbS-bDTepE&usqp=CAc",
        category: "Electronics"
    },
    {
        id: 7,
        name: "Yoga Mat",
        price: 39.99,
        image: "https://www.prosourcefit.com/cdn/shop/files/Classic-Yoga-Mat-Aqua-01-Shopify_f41de27e-7801-4640-afe1-bcc057b34e1e.jpg?v=1741295551&width=1406",
        category: "Sports"
    },
    {
        id: 8,
        name: "Notebook",
        price: 19.99,
        image: "https://m.media-amazon.com/images/I/718vM+75UNL._AC_UF1000,1000_QL80_.jpg",
        category: "Stationery"
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    updateCartCount();
    
    if (document.getElementById('productsGrid')) {
        renderProducts('productsGrid', products);
    }
    
    if (document.getElementById('featuredProducts')) {
        const featuredProducts = products.slice(0, 4);
        renderProducts('featuredProducts', featuredProducts);
    }
    
    if (document.getElementById('contactForm')) {
        initContactForm();
    }
});

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage || 
            (currentPage === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function renderProducts(containerId, productList) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = productList.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     loading="lazy" 
                     onerror="handleImageError(this)"
                     onload="this.classList.add('loaded')">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function handleImageError(img) {
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
    img.classList.add('loaded');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    showSuccessMessage(`${product.name} added to cart!`);
    
    const button = event.target.closest('.add-to-cart');
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cartCount');
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        element.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

function showSuccessMessage(message) {
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageEl = document.createElement('div');
    messageEl.className = 'success-message';
    messageEl.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => messageEl.classList.add('show'), 100);
    
    setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => messageEl.remove(), 300);
    }, 3000);
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        showSuccessMessage('Thank you for your message! We\'ll get back to you soon.');
        
        form.reset();
    });
}

document.addEventListener('click', function(e) {
    if (e.target.closest('#cartLink')) {
        e.preventDefault();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems === 0) {
            alert('Your cart is empty!');
        } else {
            alert(`You have ${totalItems} items in your cart. (Full cart page not implemented)`);
        }
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});




