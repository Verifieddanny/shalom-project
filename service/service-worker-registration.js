export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service/service-worker.js').then((registration) => {
            console.log('Service worker registered successfully: ', registration);
        }).catch((error) => {
            console.error('Service worker registration failed: ', error);
        });
    } else {
        console.warn('Service workers are not supported in this browser');
    }
}