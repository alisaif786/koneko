/* global importScripts, firebase */

importScripts("https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCzlG9etVvu2oN8BYjV5fRzpErSokq11wE",
    authDomain: "koneko-bcbe9.firebaseapp.com",
    projectId: "koneko-bcbe9",
    storageBucket: "koneko-bcbe9.firebasestorage.app",
    messagingSenderId: "335436791269",
    appId: "1:335436791269:web:f64149c45595995cc3430c"
});

const messaging = firebase.messaging();

function notificationLink(payload) {
    const requestedLink = payload?.fcmOptions?.link
        || payload?.data?.link
        || payload?.data?.url
        || "/";

    try {
        const url = new URL(requestedLink, self.location.origin);
        return url.origin === self.location.origin
            ? `${url.pathname}${url.search}${url.hash}`
            : "/";
    } catch {
        return "/";
    }
}

messaging.onBackgroundMessage((payload) => {
    console.info("[Koneko] Background notification received.");

    const title = payload.notification?.title
        || payload.data?.title
        || "Koneko reminder";
    const options = {
        body: payload.notification?.body || payload.data?.body || "You have a reminder.",
        icon: "/icons/icon-192.png",
        data: { url: notificationLink(payload) },
    };

    return self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const requestedUrl = new URL(
        event.notification.data?.url || "/",
        self.location.origin,
    );
    const targetUrl = requestedUrl.origin === self.location.origin
        ? requestedUrl.href
        : new URL("/", self.location.origin).href;

    event.waitUntil((async () => {
        const windows = await self.clients.matchAll({
            type: "window",
            includeUncontrolled: true,
        });
        const existingWindow = windows.find((client) => (
            new URL(client.url).origin === self.location.origin
        ));

        if (existingWindow) {
            await existingWindow.navigate(targetUrl);
            return existingWindow.focus();
        }

        return self.clients.openWindow(targetUrl);
    })());
});
