import './calculator.js'
import './../../node_modules/bootstrap/dist/js/bootstrap.min.js'

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./assets/script/service-worker.js')
            .then(reg => console.log('Service Worker installiert', reg))
            .catch(err => console.error('Service Worker fehlgeschlagen', err));
    });
}