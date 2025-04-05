class TemplateElement {
    static getProductTemplate() {
        const element = document.querySelector('[data-template=product]').cloneNode(true);
        return this.removeTemplate(element);
    }
    static getCartLineTemplate() {
        const element = document.querySelector('[data-template=product-line-item]').cloneNode(true);
        return this.removeTemplate(element);
    }

    static getSettingsProductTemplate() {
        const element = document.querySelector('[data-template=settings-product]').cloneNode(true);
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
    getSettingsProductElement() {
        const productElement = TemplateElement.getSettingsProductTemplate();
        productElement.setAttribute('data-id', this.id);
        productElement.textContent = this.name;
        productElement.addEventListener('click', () => {
            productList.removeProduct(this);
            productList.setExportField();
            productElement.remove();
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
        this.loadFromJson(localStorage.getItem('products') ?? [])
        this.setExportField();
        this.getImportExportTextarea().addEventListener('input', (e) => {
            try {
                const json = e.target.value;
                localStorage.setItem('products', json);
                window.location = window.location;
            } catch (e) {
                console.error(e);
            }
        });
    }

    setExportField() {
        this.getImportExportTextarea().textContent = JSON.stringify(this.products);
    }

    loadFromJson(json) {
        let parse = [];
        try {
            parse = JSON.parse(json);
        } catch (e) {}
        this.products = parse.map(e => new Product(e.name, e.price, e.image));
        this.renderProductList();
    }

    getImportExportTextarea() {
        return document.querySelector('#input-export-import');
    }

    getProductListElement() {
        return document.querySelector('.product-list');
    }

    getSettingListElement() {
        return document.querySelector('.settings-product-list');
    }

    renderProductList() {
        // Clear the product list element before rendering except the template
        this.getProductListElement().querySelectorAll('[data-id]').forEach(e => {
            if (e.getAttribute('data-template') === null) {
                e.remove();
            }
        });
        this.products.forEach(e => {
            this.getProductListElement().appendChild(e.getProductElement());
            this.getSettingListElement().appendChild(e.getSettingsProductElement());
        })
    }

    addProduct(product) {
        this.products.push(product);
        localStorage.setItem('products', JSON.stringify(this.products));
        this.getProductListElement().appendChild(product.getProductElement());
        this.getSettingListElement().appendChild(product.getSettingsProductElement());
        this.setExportField();
    }

    removeProduct(product) {
        this.products = this.products.filter(e => e.id !== product.id);
        const productElement = this.getProductListElement().querySelector(`[data-id="${product.id}"]`);
        if (productElement) {
            productElement.remove();
        }
        localStorage.setItem('products', JSON.stringify(this.products));
        this.setExportField();
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

class Tab {
    static toggleTab() {
        if(!isSettingsTab) {
            this.switchTab('settings');
        } else {
            this.switchTab('products');
        }
        isSettingsTab = !isSettingsTab;
    }
    static switchTab(tab) {
        const tabs = document.querySelectorAll('[data-tab]');
        tabs.forEach(e => {
            e.classList.add('d-none');
        });
        const activeTab = document.querySelector(`[data-tab=${tab}]`);
        activeTab.classList.remove('d-none');
    }
}

let isSettingsTab = false;
const cart = new Cart();
const productList = new ProductList();

document.querySelector('[data-toggle-tab]').addEventListener('click', (e) => {
    Tab.toggleTab();
});

document.querySelector('#create-product').addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission (if any)

    const name = document.querySelector('#product-name').value;
    let fieldPrice = document.querySelector('#product-price').value;
    const image = document.querySelector('#product-image').files[0];

    if(name.length === 0) {
        alert('Name muss ausgefüllt sein');
        return;
    }

    if (image) {
        const reader = new FileReader();
        reader.onloadend = function () {
            const imageBase64 = reader.result;
            const imageSrcWithBase64 = `data:${image.type};base64,${imageBase64.split(',')[1]}`;
            productList.addProduct(new Product(name, fieldPrice, imageSrcWithBase64));
            document.querySelector('#product-name').value = '';
            document.querySelector('#product-price').value = '0,00';
            document.querySelector('#product-image').value = '';
        };
        reader.readAsDataURL(image);
    } else {
        productList.addProduct(new Product(name, fieldPrice, `https://placehold.co/250x250?text={${name}}`));
        document.querySelector('#product-name').value = '';
        document.querySelector('#product-price').value = '';
        document.querySelector('#product-image').value = '';
    }
});