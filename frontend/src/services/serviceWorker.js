const SERVICE_WORKER_URL = "/firebase-messaging-sw.js";

let registrationPromise;

export function registerFirebaseMessagingServiceWorker() {
    if (!("serviceWorker" in navigator)) {
        return Promise.reject(new Error("This browser does not support service workers."));
    }

    if (!registrationPromise) {
        registrationPromise = navigator.serviceWorker
            .register(SERVICE_WORKER_URL)
            .then((registration) => {
                console.info("[Koneko] Firebase service worker registered.");
                return registration;
            })
            .catch((error) => {
                registrationPromise = undefined;
                throw error;
            });
    }

    return registrationPromise;
}
