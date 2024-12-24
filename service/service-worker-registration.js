export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js').catch((error) => {
            console.error('Service worker registration failed: ', error);
        });
    } else {
        console.warn('Service workers are not supported in this browser');
    }
}