function setBootstrapTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('bootstrap-theme', theme);
}

setBootstrapTheme(localStorage.getItem('bootstrap-theme') || 'light');

document.querySelectorAll('[data-toggle-bs-theme]').forEach(element => {
    element.addEventListener('click', event => {
        const theme = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
        setBootstrapTheme(theme);
    })
});


