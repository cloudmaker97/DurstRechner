class TemplateElement {
    static getProductTemplate() {
        const element = document.querySelector('[data-template=product]').cloneNode(true);
        return this.removeTemplate(element);
    }
    static getCartLineTemplate() {
        const element = document.querySelector('[data-template=product-line-item]').cloneNode(true);
        return this.removeTemplate(element);
    }

    static removeTemplate(element) {
        element.removeAttribute('data-template');
        return element;
    }
}

class Product {
    constructor(name, price, image) {
        this.id = Product.generateId();
        this.name = name;
        this.price = price;
        this.image = image;
    }

    static generateId() {
        return Math.floor(Math.random() * 1000000000) * Math.floor(Math.random() * 1000000000);
    }

    getProductElement() {
        const productElement = TemplateElement.getProductTemplate();
        productElement.setAttribute('data-id', this.id);
        productElement.querySelector('[data-attr=name]').textContent = this.name;
        productElement.querySelector('[data-attr=image]').src = this.image;
        productElement.addEventListener('click', () => {
            cart.addProduct(this);
        })
        return productElement;
    }
}

class CartLine {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }
}

class ProductList {
    constructor() {
        this.products = [];
        this.products.push(new Product('Product 1', 10, 'https://placehold.co/250x250/000000/FFF?text=Product 1'));
        this.products.push(new Product('Product 2', 5, 'https://placehold.co/250x250/000000/FFF?text=Product 2'));
        this.products.push(new Product('Product 3', 2.5, 'https://placehold.co/250x250/000000/FFF?text=Product 3'));
        this.products.push(new Product('Product 4', 1, 'https://placehold.co/250x250/000000/FFF?text=Product 4'));
        this.renderProductList();
    }

    getProductJson() {
        return JSON.stringify(this.products);
    }

    getProductListElement() {
        return document.querySelector('.product-list');
    }

    renderProductList() {
        this.products.forEach(e => {
            this.getProductListElement().appendChild(e.getProductElement());
        })
    }
}

class Cart {
    constructor() {
        this.cartLines = [];
        this.getCartButton().addEventListener('click', () => {
            this.cartLines = [];
            this.renderCart();
        });
    }

    addProduct(product) {
        const cartLine = this.cartLines.find(e => e.product.id === product.id);
        if (cartLine) {
            cartLine.quantity++;
        } else {
            this.cartLines.push(new CartLine(product, 1));
        }
        this.renderCart();
    }

    removeProduct(product) {
        const cartLine = this.cartLines.find(e => e.product.id === product.id);
        if (cartLine) {
            cartLine.quantity--;
            if (cartLine.quantity <= 0) {
                this.cartLines = this.cartLines.filter(e => e.product.id !== product.id);
            }
        }
        this.renderCart();
    }

    renderCart() {
        // Clear the cart element before rendering except the template
        this.getCartElement().querySelectorAll('[data-id]').forEach(e => {
            if (e.getAttribute('data-template') === null) {
                e.remove();
            }
        });

        if(this.cartLines.length === 0) {
            this.getAlertElement().classList.remove('d-none');
        } else {
            this.getAlertElement().classList.add('d-none');
        }
        this.calculateCartValue();

        // Render each cart line
        this.cartLines.forEach(cartLine => {
            const cartLineElement = this.getCartLineElement(cartLine);
            this.getCartElement().appendChild(cartLineElement);
        });
    }

    getCartLineElement(cartLine) {
        const cartLineElement = TemplateElement.getCartLineTemplate();
        cartLineElement.setAttribute('data-id', cartLine.product.id);
        cartLineElement.querySelector('[data-attr=name]').textContent = cartLine.product.name;
        cartLineElement.querySelector('[data-attr=value]').textContent = Cart.getNumberFormatter().format(cartLine.product.price);
        cartLineElement.querySelector('[data-attr=quantity]').textContent = cartLine.quantity;
        cartLineElement.addEventListener('click', () => {
            this.removeProduct(cartLine.product);
        })
        return cartLineElement;
    }

    getAlertElement() {
        return document.querySelector('.alert.cart-empty');
    }

    getCartElement() {
        return document.querySelector('.cart-items');
    }

    calculateCartValue() {
        let cartValue = this.cartLines.reduce((acc, cartLine) => {
            return acc + (cartLine.product.price * cartLine.quantity);
        }, 0);
        this.getCartButton().querySelector('[data-total-value]').textContent = Cart.getNumberFormatter().format(cartValue);
    }

    static getNumberFormatter() {
        return new Intl.NumberFormat('de-DE', {
            currency: 'EUR',
            minimumFractionDigits: 2
        });
    }

    getCartButton() {
        return document.querySelector('button.cart-value');
    }
}

const cart = new Cart();
const productList = new ProductList();