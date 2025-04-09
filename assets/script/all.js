/**
 * This imports the necessary files and registers the service worker.
 */
import './../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./assets/script/service-worker.js')
            .then(reg => console.log('Service Worker installiert', reg))
            .catch(err => console.error('Service Worker fehlgeschlagen', err));
    });
}
/**
 * Element class provides static methods to get various elements from the DOM.
 */
class Element {
    /**
     * Get the import/export textarea element
     * @returns {HTMLTextAreaElement}
     */
    static getImportExportTextarea() {
        return document.querySelector('#input-export-import');
    }

    /**
     * Get the product list element
     * @returns {HTMLElement}
     */
    static getProductListElement() {
        return document.querySelector('.product-list');
    }

    /**
     * Get the settings product list element
     * @returns {HTMLElement}
     */
    static getSettingListElement() {
        return document.querySelector('.settings-product-list');
    }

    /**
     * Get the cart element
     * @returns {HTMLElement}
     */
    static getCartElement() {
        return document.querySelector('.cart-items');
    }

    /**
     * Get the cart empty alert element
     * @returns {HTMLElement}
     */
    static getCartEmptyAlertElement() {
        return document.querySelector('.alert.cart-empty');
    }

    /**
     * Get the create new product button element
     * @returns {HTMLButtonElement}
     */
    static getCreateNewProductButton() {
        return document.querySelector('#create-product');
    }

    /**
     * Get the cart button element
     * @returns {HTMLButtonElement}
     */
    static getCartButton() {
        return document.querySelector('button.cart-value');
    }

    /**
     * Get the navbar brand element
     * @returns {Element}
     */
    static getNavbarBrand() {
        return document.querySelector('.navbar-brand');
    }

    /**
     * Get the buttons for importing test data
     * @returns {Element}
     */
    static getButtonsImportTestdata() {
        return document.querySelectorAll('[data-action=import-testdata]');
    }

    /**
     * Get the buttons for showing the test data
     * @returns {Element}
     */
    static getButtonShowTestdata() {
        return document.querySelectorAll('[data-action=import-show-testdata]');
    }

    /**
     * Get the button for clearing the test data
     * @returns {Element}
     */
    static getButtonClearTestdata() {
        return document.querySelectorAll('[data-action=import-clear]');
    }

    /**
     * Get the button for accessing the GitHub repository
     * @returns {Element}
     */
    static getGitHubReferenceLink() {
        return document.querySelector('[data-github-ref]');
    }
}

/**
 * TemplateElement class provides static methods to get various templates from the DOM.
 */
class TemplateElement {
    /**
     * Get the product list element template
     * @returns {HTMLElement}
     */
    static getProductTemplate() {
        const element = document.querySelector('[data-template=product]').cloneNode(true);
        return this.removeTemplate(element);
    }

    /**
     * Get the cart line element template
     * @returns {HTMLElement}
     */
    static getCartLineTemplate() {
        const element = document.querySelector('[data-template=product-line-item]').cloneNode(true);
        return this.removeTemplate(element);
    }

    /**
     * Get the settings product element template
     * @returns {HTMLElement}
     */
    static getSettingsProductTemplate() {
        const element = document.querySelector('[data-template=settings-product]').cloneNode(true);
        return this.removeTemplate(element);
    }

    /**
     * Get the deposit element template
     * @returns {HTMLElement}
     */
    static getDepositTemplate() {
        const element = document.querySelector('[data-template=product-deposit]').cloneNode(true);
        return this.removeTemplate(element);
    }

    /**
     * Remove the template attribute from the element
     * @param element {HTMLElement}
     * @returns {HTMLElement}
     */
    static removeTemplate(element) {
        element.removeAttribute('data-template');
        return element;
    }
}

/**
 * Product class represents a product with an id, name, price, and image.
 */
class Product {
    /**
     * Product constructor
     * @param name {string} Name of the product
     * @param price {number} Price of the product
     * @param image {string} Image of the product (source url or base64)
     */
    constructor(name, price, deposit, image) {
        this.id = Product.generateId();
        this.name = name;
        this.price = price;
        this.image = image;
        this.deposit = deposit;
    }

    /**
     * Generate a random id for the product
     * @returns {number}
     */
    static generateId() {
        return Math.floor(Math.random() * 1000000000) * Math.floor(Math.random() * 1000000000);
    }

    /**
     * Get the product html element by template and set the attributes by the product object
     * @returns {HTMLElement}
     */
    getProductElement() {
        const productElement = TemplateElement.getProductTemplate();
        productElement.setAttribute('data-id', this.id);
        productElement.querySelector('[data-attr=name]').textContent = this.name;
        productElement.querySelector('[data-attr=price]').textContent = CartManager.getNumberFormatter().format(this.price);
        productElement.querySelector('[data-attr=image]').src = this.image;
        productElement.addEventListener('click', () => {
            cartManager.addProduct(this);
        })
        return productElement;
    }

    /**
     * Get the settings product html element by template and set the attributes by the product object
     * @returns {HTMLElement}
     */
    getSettingsProductElement() {
        const productElement = TemplateElement.getSettingsProductTemplate();
        productElement.setAttribute('data-id', this.id);
        productElement.textContent = this.name;
        productElement.addEventListener('click', () => {
            productManager.removeProduct(this);
            productManager.setExportFieldJsonValue();
            productElement.remove();
        })
        return productElement;
    }
}

/**
 * CartLine class represents a line in the cart with a product and its quantity.
 */
class CartLine {
    /**
     * CartLine constructor
     * @param product {Product}
     * @param quantity {number}
     */
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }
}

/**
 * Base64Image class provides static methods to convert an image URL or file to a base64 string.
 */
class Base64Image {
    /**
     * Convert an image URL to a base64 string
     * @param url
     * @returns {Promise<string>}
     */
    static fromImageUrl(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL();
                resolve(dataUrl);
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    /**
     * Resize an image from a base64 string to a smaller size
     * @param base64
     * @returns {Promise<unknown>}
     */
    static imageResize(base64) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 250;
                canvas.height = 250;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL();
                resolve(dataUrl);
            };
            img.onerror = reject;
            img.src = base64;
        });
    }

    /**
     * Convert a file to a base64 string
     * @param file
     * @returns {Promise<string>}
     */
    static fromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}

/**
 * ProductManager class manages the product list, including loading from JSON, adding, and removing products.
 */
class ProductManager {
    constructor() {
        this.loadFromJson(localStorage.getItem('products') ?? [])
        this.setExportFieldJsonValue();
        this.registerSettingsFormEvents();
        this.registerImportFormEvents();
        this.registerNavbarBrandToProductEvent();
    }

    /**
     * Register the event for the navbar brand to switch to the products tab when clicked.
     */
    registerNavbarBrandToProductEvent() {
        Element.getNavbarBrand().addEventListener('click', () => {
            TabManager.switchTab('products');
        })
    }

    /**
     * Register events for the import/export textarea.
     */
    registerImportFormEvents() {
        Element.getButtonsImportTestdata().forEach(button => {
            button.addEventListener('click', async () => {
                await fetch('assets/example/example.json').then(r => r.json()).then(async json => {
                    await this.convertAndSaveProductImages(json);
                    location.reload();
                })
            });
        })

        Element.getImportExportTextarea().addEventListener('input', async (e) => {
            try {
                const json = JSON.parse(e.target.value);
                await this.convertAndSaveProductImages(json);
                location.reload();
            } catch (e) {
                console.error(e);
            }
        });
    }

    /**
     * Convert and save product images from JSON string to base64 and save it to local storage.
     * @param json
     * @returns {Promise<void>}
     */
    async convertAndSaveProductImages(json) {
        const products = json.map(e => new Product(e.name, e.price, e.deposit, e.image));
        for (const product of products) {
            if (!product.image.toString().startsWith('data:image/')) {
                product.image = await Base64Image.imageResize(await Base64Image.fromImageUrl(product.image))
            }
        }
        localStorage.setItem('products', JSON.stringify(products));
    }

    /**
     * Set the JSON value of the export field to the current products.
     */
    setExportFieldJsonValue() {
        Element.getImportExportTextarea().textContent = JSON.stringify(this.products);
    }

    /**
     * Load products from JSON string and parse it into Product objects, then render the product list.
     * @param json
     */
    loadFromJson(json) {
        let parse = [];
        try {
            parse = JSON.parse(json);
        } catch (e) {}
        this.products = parse.map(e => new Product(e.name, e.price, e.deposit, e.image));
        this.renderProductList();
    }

    /**
     * Register events for the create new product button.
     */
    registerSettingsFormEvents() {
        Element.getCreateNewProductButton().addEventListener('click', async (e) => {
            e.preventDefault();

            const name = document.querySelector('#product-name').value;
            const price = document.querySelector('#product-price').value;
            const deposit = document.querySelector('#product-deposit').value;
            const image = document.querySelector('#product-image').files[0];

            // Validate price
            if (name.length === 0) {
                alert('Name muss ausgefüllt sein');
                return;
            }

            // Turn image into base64 or use placeholder image
            if (image) {
                const imageSrcWithBase64 = Base64Image.fromFile(image);
                imageSrcWithBase64.then(async imageSrcWithBase64 => {
                    productManager.addProduct(new Product(name, price, deposit, await Base64Image.imageResize(imageSrcWithBase64)));
                    ProductManager.resetProductSettingsForm();
                });
            } else {
                let imageDemoBase64 = await Base64Image.imageResize(await Base64Image.fromImageUrl(`https://placehold.co/250x250?text=${name}`));
                productManager.addProduct(new Product(name, price, deposit, imageDemoBase64));
                ProductManager.resetProductSettingsForm();
            }
        });
    }

    /**
     * Reset the product settings form by clearing all input fields.
     */
    static resetProductSettingsForm() {
        document.querySelectorAll('form input:not([type=submit])').forEach(inputField => inputField.value = '');
    }

    /**
     * Render the product list by clearing the existing elements and appending new ones.
     */
    renderProductList() {
        // Clear the product list element before rendering except the template
        Element.getProductListElement().querySelectorAll('[data-id]').forEach(e => {
            if (e.getAttribute('data-template') === null) {
                e.remove();
            }
        });
        this.products.forEach(e => {
            Element.getProductListElement().appendChild(e.getProductElement());
            Element.getSettingListElement().appendChild(e.getSettingsProductElement());
        })
    }

    /**
     * Add a new product to the list and save it to local storage.
     * @param product {Product}
     */
    addProduct(product) {
        this.products.push(product);
        localStorage.setItem('products', JSON.stringify(this.products));
        Element.getProductListElement().appendChild(product.getProductElement());
        Element.getSettingListElement().appendChild(product.getSettingsProductElement());
        this.setExportFieldJsonValue();
    }

    /**
     * Remove a product from the list and local storage.
     * @param product {Product}
     */
    removeProduct(product) {
        this.products = this.products.filter(e => e.id !== product.id);
        const productElement = Element.getProductListElement().querySelector(`[data-id="${product.id}"]`);
        if (productElement) {
            productElement.remove();
        }
        localStorage.setItem('products', JSON.stringify(this.products));
        this.setExportFieldJsonValue();
    }
}

/**
 * CartManager class manages the cart, including adding, removing products, and rendering the cart.
 */
class CartManager {
    constructor() {
        this.cartLines = [];
        this.registerCartResetEvent();
    }

    /**
     * Register the cart reset event to clear the cart when the button is clicked.
     */
    registerCartResetEvent() {
        Element.getCartButton().addEventListener('click', () => {
            CartHistoryManager.addToTotal(this.cartLines.reduce((acc, cartLine) => {
                return acc + (cartLine.product.price * cartLine.quantity) + (cartLine.product.deposit * cartLine.quantity);
            }, 0));
            this.cartLines = [];
            this.renderCart();
        });
    }

    /**
     * Add a product to the cart. If the product already exists, increase the quantity.
     * @param product {Product}
     */
    addProduct(product) {
        const cartLine = this.cartLines.find(e => e.product.id === product.id);
        if (cartLine) {
            cartLine.quantity++;
        } else {
            this.cartLines.push(new CartLine(product, 1));
        }
        this.renderCart();
    }

    /**
     * Remove a product from the cart. If the quantity is 0, remove the product from the cart.
     * @param product {Product}
     */
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

    /**
     * Render the cart by clearing the existing elements and appending new ones.
     */
    renderCart() {
        // Clear the cart element before rendering except the template
        Element.getCartElement().querySelectorAll('[data-id], .product-deposit').forEach(e => {
            if (e.getAttribute('data-template') === null) {
                e.remove();
            }

            console.log(e)
        });

        if(this.cartLines.length === 0) {
            Element.getCartEmptyAlertElement().classList.remove('d-none');
        } else {
            Element.getCartEmptyAlertElement().classList.add('d-none');
        }
        this.calculateCartValue();

        // Render each cart line
        this.cartLines.forEach(cartLine => {
            const cartLineElement = this.getCartLineElement(cartLine);
            Element.getCartElement().appendChild(cartLineElement);
        });

        let depositTotal = 0;
        this.cartLines.forEach(cartLine => {
            depositTotal += cartLine.product.deposit * cartLine.quantity;
        });
        if(depositTotal !== 0) {
            let depositElement = TemplateElement.getDepositTemplate();
            depositElement.querySelector('[data-attr=deposit]').textContent = CartManager.getNumberFormatter().format(depositTotal);
            Element.getCartElement().appendChild(depositElement);
        }
    }

    /**
     * Get the cart line html element and set the attributes by the product object
     * @param cartLine {CartLine}
     * @returns {*}
     */
    getCartLineElement(cartLine) {
        const cartLineElement = TemplateElement.getCartLineTemplate();
        cartLineElement.setAttribute('data-id', cartLine.product.id);
        cartLineElement.querySelector('[data-attr=name]').textContent = cartLine.product.name;
        cartLineElement.querySelector('[data-attr=value]').textContent = CartManager.getNumberFormatter().format(cartLine.product.price);
        cartLineElement.querySelector('[data-attr=quantity]').textContent = cartLine.quantity;
        cartLineElement.addEventListener('click', () => {
            this.removeProduct(cartLine.product);
        })
        return cartLineElement;
    }

    /**
     * Calculate the total value of the cart by multiplying the product price with the quantity and setting it to the button.
     */
    calculateCartValue() {
        let cartValue = this.cartLines.reduce((acc, cartLine) => {
            return acc + (cartLine.product.price * cartLine.quantity) + (cartLine.product.deposit * cartLine.quantity);
        }, 0);
        Element.getCartButton().querySelector('[data-total-value]').textContent = CartManager.getNumberFormatter().format(cartValue);
    }

    /**
     * Get the number formatter for the currency.
     * @returns {Intl.NumberFormat}
     */
    static getNumberFormatter() {
        return new Intl.NumberFormat('de-DE', {
            currency: 'EUR',
            minimumFractionDigits: 2
        });
    }
}

/**
 * TabManager class manages the tabs in the settings page.
 */
class TabManager {
    /**
     * @type {boolean} If the settings tab is active or not
     */
    static isSettingsTabActive = false;

    constructor() {
        TabManager.isSettingsTabActive = false;
        document.querySelector('[data-toggle-tab]').addEventListener('click', (e) => {
            TabManager.toggleTab();
        });
    }

    /**
     * Toggle the active tab between settings and products.
     */
    static toggleTab() {
        if(!TabManager.isSettingsTabActive) {
            TabManager.isSettingsTabActive = true;
            this.switchTab('settings');
        } else {
            this.switchTab('products');
            TabManager.isSettingsTabActive = false;
        }
    }

    /**
     * Switch the active tab by adding/removing the d-none class.
     * @param tab {string} The tab to switch to
     */
    static switchTab(tab) {
        if(tab !== 'settings') {
            TabManager.isSettingsTabActive = false;
        }
        const tabs = document.querySelectorAll('[data-tab]');
        tabs.forEach(e => {
            e.classList.add('d-none');
        });
        const activeTab = document.querySelector(`[data-tab=${tab}]`);
        activeTab.classList.remove('d-none');
    }
}

/**
 * ThemeManager class manages the theme of the application.
 */
class ThemeManager {
    constructor() {
        this.setBootstrapTheme(localStorage.getItem('bootstrap-theme') || 'light');
        this.registerThemeSwitchEvent();
        this.showGitHubIconOnAlternateInstallation();
    }

    /**
     * Show the GitHub icon on alternate installation if the URL does not start with the specified string.
     */
    showGitHubIconOnAlternateInstallation() {
        if (!location.href.startsWith('https://cloudmaker97.github.io/DurstRechner')) {
            Element.getGitHubReferenceLink().classList.remove('visually-hidden');
        }
    }

    /**
     * Register events for the theme switch button.
     */
    registerThemeSwitchEvent() {
        document.querySelectorAll('[data-toggle-bs-theme]').forEach(element => {
            element.addEventListener('click', event => {
                const theme = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
                this.setBootstrapTheme(theme);
            })
        });
    }

    /**
     * Set the bootstrap theme by setting the data-bs-theme attribute on the html element and saving it to local storage.
     * @param theme {string} The theme to set (light or dark)
     */
    setBootstrapTheme(theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('bootstrap-theme', theme);
    }
}

/**
 * Define the CartHistoryManager class to manage the cart history.
 */
class CartHistoryManager {
    static getTotal() {
        return localStorage.getItem('cart-total-value') || 0;
    }

    static setTotal(value) {
        localStorage.setItem('cart-total-value', value);
    }

    static addToTotal(value) {
        const total = parseFloat(CartHistoryManager.getTotal()) + value;
        CartHistoryManager.setTotal(total);
    }
}

/**
 * Main function to initialize the application.
 */
const cartManager = new CartManager();
const productManager = new ProductManager();
const tabManager = new TabManager();
const themeManager = new ThemeManager();
const cartHistoryManager = new CartHistoryManager();