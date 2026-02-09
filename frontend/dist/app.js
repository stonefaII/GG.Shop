// GG.Shop - Application JavaScript
class GGShop {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('ggshop_cart')) || [];
        this.currentPage = 'home';
        this.user = JSON.parse(localStorage.getItem('ggshop_user')) || {
            name: 'Pierre Dubois',
            email: 'pierre@example.com',
            phone: '+33 6 12 34 56 78',
            address: '123 Rue de Paris, 75001 Paris'
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartCount();
        this.handleRouting();
    }

    setupEventListeners() {
        // Cart icon
        document.querySelectorAll('.cart-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('cart');
            });
        });

        // Profile icon
        document.querySelectorAll('.profile-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('profile');
            });
        });

        // View all buttons
        document.querySelectorAll('.view-all-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('products');
            });
        });

        // Logo - back to home
        document.querySelectorAll('.logo-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('home');
            });
        });

        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-btn')) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    const product = {
                        id: Date.now(),
                        name: productCard.querySelector('h3').textContent,
                        price: parseFloat(productCard.querySelector('.text-2xl').textContent.replace('$', '')),
                        image: productCard.querySelector('img').src,
                        quantity: 1
                    };
                    this.addToCart(product);
                }
            }
        });
    }

    handleRouting() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            this.navigateTo(hash);
        }
    }

    navigateTo(page) {
        this.currentPage = page;
        window.location.hash = page;
        
        const mainContent = document.querySelector('body');
        
        switch(page) {
            case 'cart':
                this.renderCartPage();
                break;
            case 'profile':
                this.renderProfilePage();
                break;
            case 'products':
                this.renderProductsPage();
                break;
            case 'home':
            default:
                window.location.href = '/';
                break;
        }
    }

    renderCartPage() {
        const content = `
            <!-- Header -->
            <header class="bg-dark/95 backdrop-blur-md border-b border-dark-lighter sticky top-0 z-50 shadow-lg">
                <div class="container mx-auto px-6 py-5">
                    <div class="flex items-center justify-between">
                        <a href="#home" class="logo-link text-3xl font-display font-bold text-white hover:text-primary transition-colors duration-300">GG.SHOP</a>
                        <div class="flex items-center space-x-6">
                            <button class="cart-icon text-white hover:text-primary relative">
                                <i class="fas fa-shopping-cart text-xl"></i>
                                ${this.cart.length > 0 ? `<span class="cart-badge">${this.cart.length}</span>` : ''}
                            </button>
                            <button class="profile-icon text-white hover:text-primary">
                                <i class="fas fa-user-circle text-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Cart Content -->
            <section class="py-12 bg-dark min-h-screen">
                <div class="container mx-auto px-4">
                    <nav class="text-gray-400 mb-8 text-sm">
                        <a href="#home" class="logo-link hover:text-primary">Accueil</a>
                        <span class="mx-2">/</span>
                        <span class="text-white">Panier</span>
                    </nav>

                    <h1 class="text-4xl font-display font-bold mb-8">VOTRE PANIER</h1>

                    ${this.cart.length === 0 ? `
                        <div class="text-center py-20">
                            <i class="fas fa-shopping-cart text-6xl text-gray-600 mb-6"></i>
                            <h2 class="text-2xl font-bold mb-4">Votre panier est vide</h2>
                            <p class="text-gray-400 mb-8">Ajoutez des produits pour commencer vos achats</p>
                            <a href="#products" class="view-all-btn btn-primary">Voir les produits</a>
                        </div>
                    ` : `
                        <div class="grid lg:grid-cols-3 gap-8">
                            <!-- Cart Items -->
                            <div class="lg:col-span-2 space-y-4">
                                ${this.cart.map((item, index) => `
                                    <div class="bg-dark-light border border-dark-lighter rounded-3xl p-6 flex gap-6">
                                        <img src="${item.image}" alt="${item.name}" class="w-32 h-32 object-cover rounded-2xl">
                                        <div class="flex-1">
                                            <h3 class="text-xl font-bold mb-2">${item.name}</h3>
                                            <p class="text-gray-400 mb-4">Taille: M | Couleur: Noir</p>
                                            <p class="text-2xl font-bold text-primary">$${item.price}</p>
                                        </div>
                                        <div class="flex flex-col justify-between items-end">
                                            <button onclick="app.removeFromCart(${index})" class="text-red-500 hover:text-red-400">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                            <div class="flex items-center gap-3 bg-dark border border-dark-lighter rounded-full px-4 py-2">
                                                <button onclick="app.decreaseQuantity(${index})" class="text-white hover:text-primary">
                                                    <i class="fas fa-minus"></i>
                                                </button>
                                                <span class="font-bold w-8 text-center">${item.quantity}</span>
                                                <button onclick="app.increaseQuantity(${index})" class="text-white hover:text-primary">
                                                    <i class="fas fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>

                            <!-- Order Summary -->
                            <div class="lg:col-span-1">
                                <div class="bg-dark-light border border-dark-lighter rounded-3xl p-8 sticky top-24">
                                    <h2 class="text-2xl font-bold mb-6">Résumé de commande</h2>
                                    <div class="space-y-4 mb-6">
                                        <div class="flex justify-between">
                                            <span class="text-gray-400">Sous-total</span>
                                            <span class="font-bold">$${this.getSubtotal().toFixed(2)}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-400">Réduction (-20%)</span>
                                            <span class="font-bold text-red-500">-$${(this.getSubtotal() * 0.2).toFixed(2)}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-400">Frais de livraison</span>
                                            <span class="font-bold">$15</span>
                                        </div>
                                        <hr class="border-dark-lighter">
                                        <div class="flex justify-between text-xl">
                                            <span class="font-bold">Total</span>
                                            <span class="font-bold text-primary">$${this.getTotal().toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div class="space-y-3">
                                        <div class="flex gap-2">
                                            <input type="text" placeholder="Code promo" class="flex-1 bg-dark text-white px-4 py-3 rounded-full border border-dark-lighter focus:border-primary focus:outline-none">
                                            <button class="bg-dark hover:bg-dark-lighter text-white px-6 py-3 rounded-full border border-dark-lighter transition-all">
                                                Appliquer
                                            </button>
                                        </div>
                                        <button onclick="app.checkout()" class="btn-primary w-full">
                                            Passer à la caisse <i class="fas fa-arrow-right ml-2"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `}
                </div>
            </section>

            <!-- Footer -->
            ${this.getFooter()}
        `;
        
        document.body.innerHTML = content;
        this.setupEventListeners();
    }

    renderProfilePage() {
        const content = `
            <!-- Header -->
            <header class="bg-dark/95 backdrop-blur-md border-b border-dark-lighter sticky top-0 z-50 shadow-lg">
                <div class="container mx-auto px-6 py-5">
                    <div class="flex items-center justify-between">
                        <a href="#home" class="logo-link text-3xl font-display font-bold text-white hover:text-primary transition-colors duration-300">GG.SHOP</a>
                        <div class="flex items-center space-x-6">
                            <button class="cart-icon text-white hover:text-primary relative">
                                <i class="fas fa-shopping-cart text-xl"></i>
                                ${this.cart.length > 0 ? `<span class="cart-badge">${this.cart.length}</span>` : ''}
                            </button>
                            <button class="profile-icon text-white hover:text-primary">
                                <i class="fas fa-user-circle text-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Profile Content -->
            <section class="py-12 bg-dark min-h-screen">
                <div class="container mx-auto px-4">
                    <nav class="text-gray-400 mb-8 text-sm">
                        <a href="#home" class="logo-link hover:text-primary">Accueil</a>
                        <span class="mx-2">/</span>
                        <span class="text-white">Mon Profil</span>
                    </nav>

                    <div class="grid lg:grid-cols-4 gap-8">
                        <!-- Sidebar -->
                        <div class="lg:col-span-1">
                            <div class="bg-dark-light border border-dark-lighter rounded-3xl p-6 space-y-2">
                                <button class="w-full text-left px-4 py-3 rounded-xl bg-primary text-white font-semibold">
                                    <i class="fas fa-user mr-3"></i>Mon Profil
                                </button>
                                <button class="w-full text-left px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-dark transition-all">
                                    <i class="fas fa-box mr-3"></i>Mes Commandes
                                </button>
                                <button class="w-full text-left px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-dark transition-all">
                                    <i class="fas fa-heart mr-3"></i>Favoris
                                </button>
                                <button class="w-full text-left px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-dark transition-all">
                                    <i class="fas fa-cog mr-3"></i>Paramètres
                                </button>
                                <button class="w-full text-left px-4 py-3 rounded-xl text-red-500 hover:text-red-400 hover:bg-dark transition-all">
                                    <i class="fas fa-sign-out-alt mr-3"></i>Déconnexion
                                </button>
                            </div>
                        </div>

                        <!-- Main Content -->
                        <div class="lg:col-span-3 space-y-6">
                            <!-- Personal Info -->
                            <div class="bg-dark-light border border-dark-lighter rounded-3xl p-8">
                                <div class="flex justify-between items-center mb-6">
                                    <h2 class="text-2xl font-bold">Informations Personnelles</h2>
                                    <button class="text-primary hover:text-primary-dark">
                                        <i class="fas fa-edit mr-2"></i>Modifier
                                    </button>
                                </div>
                                <div class="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="text-gray-400 text-sm mb-2 block">Nom complet</label>
                                        <input type="text" value="${this.user.name}" class="w-full bg-dark text-white px-4 py-3 rounded-xl border border-dark-lighter focus:border-primary focus:outline-none" readonly>
                                    </div>
                                    <div>
                                        <label class="text-gray-400 text-sm mb-2 block">Email</label>
                                        <input type="email" value="${this.user.email}" class="w-full bg-dark text-white px-4 py-3 rounded-xl border border-dark-lighter focus:border-primary focus:outline-none" readonly>
                                    </div>
                                    <div>
                                        <label class="text-gray-400 text-sm mb-2 block">Téléphone</label>
                                        <input type="tel" value="${this.user.phone}" class="w-full bg-dark text-white px-4 py-3 rounded-xl border border-dark-lighter focus:border-primary focus:outline-none" readonly>
                                    </div>
                                    <div>
                                        <label class="text-gray-400 text-sm mb-2 block">Adresse</label>
                                        <input type="text" value="${this.user.address}" class="w-full bg-dark text-white px-4 py-3 rounded-xl border border-dark-lighter focus:border-primary focus:outline-none" readonly>
                                    </div>
                                </div>
                            </div>

                            <!-- Recent Orders -->
                            <div class="bg-dark-light border border-dark-lighter rounded-3xl p-8">
                                <h2 class="text-2xl font-bold mb-6">Commandes Récentes</h2>
                                <div class="space-y-4">
                                    ${this.getRecentOrders().map(order => `
                                        <div class="bg-dark border border-dark-lighter rounded-2xl p-6 hover:border-primary/50 transition-all">
                                            <div class="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 class="font-bold text-lg mb-1">Commande #${order.id}</h3>
                                                    <p class="text-gray-400 text-sm">${order.date}</p>
                                                </div>
                                                <span class="px-4 py-1 rounded-full text-sm ${order.status === 'Livré' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}">
                                                    ${order.status}
                                                </span>
                                            </div>
                                            <div class="flex items-center gap-4">
                                                <img src="${order.image}" alt="Product" class="w-20 h-20 object-cover rounded-xl">
                                                <div class="flex-1">
                                                    <p class="font-semibold">${order.product}</p>
                                                    <p class="text-gray-400 text-sm">${order.items} article${order.items > 1 ? 's' : ''}</p>
                                                </div>
                                                <div class="text-right">
                                                    <p class="text-2xl font-bold text-primary">$${order.total}</p>
                                                    <button class="text-sm text-gray-400 hover:text-primary mt-2">
                                                        Voir détails <i class="fas fa-arrow-right ml-1"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Footer -->
            ${this.getFooter()}
        `;
        
        document.body.innerHTML = content;
        this.setupEventListeners();
    }

    renderProductsPage() {
        const products = this.getAllProducts();
        const content = `
            <!-- Header -->
            <header class="bg-dark/95 backdrop-blur-md border-b border-dark-lighter sticky top-0 z-50 shadow-lg">
                <div class="container mx-auto px-6 py-5">
                    <div class="flex items-center justify-between">
                        <a href="#home" class="logo-link text-3xl font-display font-bold text-white hover:text-primary transition-colors duration-300">GG.SHOP</a>
                        <div class="flex items-center space-x-6">
                            <button class="cart-icon text-white hover:text-primary relative">
                                <i class="fas fa-shopping-cart text-xl"></i>
                                ${this.cart.length > 0 ? `<span class="cart-badge">${this.cart.length}</span>` : ''}
                            </button>
                            <button class="profile-icon text-white hover:text-primary">
                                <i class="fas fa-user-circle text-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Products Content -->
            <section class="py-12 bg-dark min-h-screen">
                <div class="container mx-auto px-4">
                    <nav class="text-gray-400 mb-8 text-sm">
                        <a href="#home" class="logo-link hover:text-primary">Accueil</a>
                        <span class="mx-2">/</span>
                        <span class="text-white">Tous les produits</span>
                    </nav>

                    <div class="grid lg:grid-cols-4 gap-8">
                        <!-- Filters Sidebar -->
                        <div class="lg:col-span-1">
                            <div class="bg-dark-light border border-dark-lighter rounded-3xl p-6 space-y-6 sticky top-24">
                                <div>
                                    <h3 class="font-bold text-lg mb-4">Filtres</h3>
                                    <button class="text-sm text-gray-400 hover:text-primary">Réinitialiser tout</button>
                                </div>

                                <!-- Category Filter -->
                                <div>
                                    <h4 class="font-semibold mb-3">Catégorie</h4>
                                    <div class="space-y-2">
                                        <label class="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" class="form-checkbox text-primary rounded">
                                            <span class="text-gray-300">T-shirts</span>
                                        </label>
                                        <label class="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" class="form-checkbox text-primary rounded">
                                            <span class="text-gray-300">Jeans</span>
                                        </label>
                                        <label class="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" class="form-checkbox text-primary rounded">
                                            <span class="text-gray-300">Chemises</span>
                                        </label>
                                        <label class="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" class="form-checkbox text-primary rounded">
                                            <span class="text-gray-300">Shorts</span>
                                        </label>
                                    </div>
                                </div>

                                <!-- Price Filter -->
                                <div>
                                    <h4 class="font-semibold mb-3">Prix</h4>
                                    <input type="range" min="0" max="500" value="250" class="w-full mb-2">
                                    <div class="flex justify-between text-sm text-gray-400">
                                        <span>$0</span>
                                        <span>$500</span>
                                    </div>
                                </div>

                                <!-- Size Filter -->
                                <div>
                                    <h4 class="font-semibold mb-3">Taille</h4>
                                    <div class="grid grid-cols-4 gap-2">
                                        <button class="bg-dark hover:bg-primary border border-dark-lighter hover:border-primary text-white py-2 rounded-lg transition-all">XS</button>
                                        <button class="bg-dark hover:bg-primary border border-dark-lighter hover:border-primary text-white py-2 rounded-lg transition-all">S</button>
                                        <button class="bg-dark hover:bg-primary border border-dark-lighter hover:border-primary text-white py-2 rounded-lg transition-all">M</button>
                                        <button class="bg-dark hover:bg-primary border border-dark-lighter hover:border-primary text-white py-2 rounded-lg transition-all">L</button>
                                        <button class="bg-dark hover:bg-primary border border-dark-lighter hover:border-primary text-white py-2 rounded-lg transition-all">XL</button>
                                        <button class="bg-dark hover:bg-primary border border-dark-lighter hover:border-primary text-white py-2 rounded-lg transition-all">XXL</button>
                                    </div>
                                </div>

                                <!-- Style Filter -->
                                <div>
                                    <h4 class="font-semibold mb-3">Style</h4>
                                    <div class="space-y-2">
                                        <label class="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" class="form-checkbox text-primary rounded">
                                            <span class="text-gray-300">Casual</span>
                                        </label>
                                        <label class="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" class="form-checkbox text-primary rounded">
                                            <span class="text-gray-300">Formal</span>
                                        </label>
                                        <label class="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" class="form-checkbox text-primary rounded">
                                            <span class="text-gray-300">Party</span>
                                        </label>
                                        <label class="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" class="form-checkbox text-primary rounded">
                                            <span class="text-gray-300">Gym</span>
                                        </label>
                                    </div>
                                </div>

                                <button class="btn-primary w-full">
                                    Appliquer les filtres
                                </button>
                            </div>
                        </div>

                        <!-- Products Grid -->
                        <div class="lg:col-span-3">
                            <div class="flex justify-between items-center mb-8">
                                <h1 class="text-3xl font-display font-bold">Tous les produits</h1>
                                <select class="bg-dark-light text-white px-4 py-2 rounded-xl border border-dark-lighter focus:border-primary focus:outline-none">
                                    <option>Plus récent</option>
                                    <option>Prix croissant</option>
                                    <option>Prix décroissant</option>
                                    <option>Meilleures ventes</option>
                                </select>
                            </div>

                            <p class="text-gray-400 mb-6">Affichage de 1-${products.length} sur ${products.length} résultats</p>

                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                ${products.map(product => `
                                    <div class="product-card">
                                        <div class="bg-gray-200 h-64 flex items-center justify-center rounded-t-3xl relative overflow-hidden group">
                                            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                            <button class="add-to-cart-btn absolute bottom-4 right-4 bg-white text-dark w-12 h-12 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white shadow-lg">
                                                <i class="fas fa-shopping-cart"></i>
                                            </button>
                                        </div>
                                        <div class="p-5 space-y-3">
                                            <h3 class="font-semibold text-lg">${product.name}</h3>
                                            <div class="flex items-center gap-1">
                                                ${this.renderStars(product.rating)}
                                                <span class="text-sm text-gray-400 ml-1">${product.rating}/5</span>
                                            </div>
                                            <div class="flex items-center gap-3">
                                                <span class="text-2xl font-bold">$${product.price}</span>
                                                ${product.oldPrice ? `
                                                    <span class="text-gray-400 line-through">$${product.oldPrice}</span>
                                                    <span class="text-primary text-sm bg-primary/20 px-2 py-1 rounded-full">-${Math.round((1 - product.price/product.oldPrice) * 100)}%</span>
                                                ` : ''}
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>

                            <!-- Pagination -->
                            <div class="flex justify-center items-center gap-2 mt-12">
                                <button class="px-4 py-2 rounded-lg bg-dark-light border border-dark-lighter hover:border-primary transition-all">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                <button class="px-4 py-2 rounded-lg bg-primary text-white">1</button>
                                <button class="px-4 py-2 rounded-lg bg-dark-light border border-dark-lighter hover:border-primary transition-all">2</button>
                                <button class="px-4 py-2 rounded-lg bg-dark-light border border-dark-lighter hover:border-primary transition-all">3</button>
                                <button class="px-4 py-2 rounded-lg bg-dark-light border border-dark-lighter hover:border-primary transition-all">...</button>
                                <button class="px-4 py-2 rounded-lg bg-dark-light border border-dark-lighter hover:border-primary transition-all">10</button>
                                <button class="px-4 py-2 rounded-lg bg-dark-light border border-dark-lighter hover:border-primary transition-all">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Footer -->
            ${this.getFooter()}
        `;
        
        document.body.innerHTML = content;
        this.setupEventListeners();
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push(product);
        }
        this.saveCart();
        this.updateCartCount();
        this.showNotification('Produit ajouté au panier!');
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.renderCartPage();
    }

    increaseQuantity(index) {
        this.cart[index].quantity++;
        this.saveCart();
        this.renderCartPage();
    }

    decreaseQuantity(index) {
        if (this.cart[index].quantity > 1) {
            this.cart[index].quantity--;
            this.saveCart();
            this.renderCartPage();
        }
    }

    getSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getTotal() {
        const subtotal = this.getSubtotal();
        const discount = subtotal * 0.2;
        const shipping = 15;
        return subtotal - discount + shipping;
    }

    saveCart() {
        localStorage.setItem('ggshop_cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const badges = document.querySelectorAll('.cart-badge');
        badges.forEach(badge => {
            if (this.cart.length > 0) {
                badge.textContent = this.cart.length;
            } else {
                badge.remove();
            }
        });
    }

    checkout() {
        alert('Redirection vers le paiement... (À implémenter)');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-6 bg-primary text-white px-6 py-4 rounded-2xl shadow-2xl z-50 animate-slide-in';
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fas fa-check-circle text-2xl"></i>
                <span class="font-semibold">${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star star-rating text-sm"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt star-rating text-sm"></i>';
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star text-yellow-400 text-sm"></i>';
        }
        
        return stars;
    }

    getAllProducts() {
        return [
            { id: 1, name: 'T-shirt avec Détails Tape', price: 120, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', rating: 4.5 },
            { id: 2, name: 'Jean Fit Skinny', price: 240, oldPrice: 260, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', rating: 3.5 },
            { id: 3, name: 'Chemise à Carreaux', price: 180, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400', rating: 4.5 },
            { id: 4, name: 'T-shirt à Manches Rayé', price: 130, oldPrice: 160, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400', rating: 4.5 },
            { id: 5, name: 'Chemise à Rayures Verticales', price: 212, oldPrice: 232, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', rating: 5.0 },
            { id: 6, name: 'T-shirt Graphique Courage', price: 145, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', rating: 4.0 },
            { id: 7, name: 'Short Fit Bermuda Loose', price: 80, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400', rating: 4.5 },
            { id: 8, name: 'Jean Skinny Délavé', price: 210, image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400', rating: 4.5 },
            { id: 9, name: 'Polo Classic Blanc', price: 95, image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400', rating: 4.0 },
            { id: 10, name: 'Veste en Jean', price: 180, oldPrice: 220, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', rating: 4.5 },
            { id: 11, name: 'Sweater à Capuche', price: 160, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', rating: 4.5 },
            { id: 12, name: 'Pantalon Chino Beige', price: 140, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400', rating: 4.0 }
        ];
    }

    getRecentOrders() {
        return [
            {
                id: '12345',
                date: '5 Février 2026',
                product: 'T-shirt avec Détails Tape',
                items: 2,
                total: 240,
                status: 'Livré',
                image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'
            },
            {
                id: '12344',
                date: '28 Janvier 2026',
                product: 'Jean Fit Skinny',
                items: 1,
                total: 240,
                status: 'En cours',
                image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'
            },
            {
                id: '12343',
                date: '15 Janvier 2026',
                product: 'Chemise à Carreaux',
                items: 3,
                total: 540,
                status: 'Livré',
                image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400'
            }
        ];
    }

    getFooter() {
        return `
            <footer class="bg-dark-lighter pt-20 pb-10">
                <div class="container mx-auto px-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                        <div class="lg:col-span-1 space-y-6">
                            <h3 class="text-3xl font-display font-bold">SHOP.CO</h3>
                            <p class="text-gray-400 text-sm">
                                We have clothes that suits your style and which you're proud to wear.
                            </p>
                        </div>
                        <div class="space-y-4">
                            <h4 class="font-bold text-lg">COMPANY</h4>
                            <ul class="space-y-3 text-gray-400">
                                <li><a href="#" class="hover:text-primary transition-colors">About</a></li>
                                <li><a href="#" class="hover:text-primary transition-colors">Features</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="border-t border-dark-lighter pt-8 text-center">
                        <p class="text-gray-400 text-sm">Shop.co © 2000-2026, All Rights Reserved</p>
                    </div>
                </div>
            </footer>
        `;
    }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new GGShop();
});
