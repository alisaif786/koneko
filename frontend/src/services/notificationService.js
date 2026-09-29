import { getToken, onMessage } from "firebase/messaging";
import { messagingPromise } from "./firebase";
import { apiUrl } from "./apiConfig";
import { registerFirebaseMessagingServiceWorker } from "./serviceWorker";

const VAPID_KEY =
    "BIE9NMJ7SjO9MVsbL8NXvp1p8F0dIXwppRlBXOaSPPVLEltnoYkjdvxiia_2RmJtQOnoXBl4xGeaY9gSG43dfq4";

const FCM_TOKEN_KEY = "koneko_fcm_token";
const TOKEN_SYNC_KEY = "koneko_fcm_token_sync";
const PERMISSION_ATTEMPTED_KEY = "koneko_notification_permission_requested";

let setupPromise;
let tokenPromise;
let foregroundListenerRegistered = false;

function notificationLink(payload) {
    const requestedLink = payload?.fcmOptions?.link
        || payload?.data?.link
        || payload?.data?.url
        || "/";

    try {
        const url = new URL(requestedLink, window.location.origin);
        return url.origin === window.location.origin
            ? `${url.pathname}${url.search}${url.hash}`
            : "/";
    } catch {
        return "/";
    }
}

async function ensureNotificationPermission() {
    if (!("Notification" in window)) {
        console.warn("[Koneko] Browser notifications are not supported.");
        return "unsupported";
    }

    if (Notification.permission === "granted") {
        return "granted";
    }

    if (Notification.permission === "denied") {
        console.info("[Koneko] Notification permission is blocked in browser settings.");
        return "denied";
    }

    if (localStorage.getItem(PERMISSION_ATTEMPTED_KEY)) {
        console.info("[Koneko] Notification permission was already requested.");
        return "default";
    }

    // Save before opening the browser prompt. A dismissed prompt must not be
    // shown again by Strict Mode or on a later page load.
    localStorage.setItem(PERMISSION_ATTEMPTED_KEY, "true");
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
        console.info("[Koneko] Notification permission granted.");
    } else {
        console.info(`[Koneko] Notification permission ${permission}.`);
    }

    return permission;
}

function registerForegroundMessageHandler(messaging) {
    if (foregroundListenerRegistered) {
        return;
    }

    onMessage(messaging, (payload) => {
        console.info("[Koneko] Foreground notification received.");

        const title = payload.notification?.title
            || payload.data?.title
            || "Koneko reminder";
        const options = {
            body: payload.notification?.body || payload.data?.body || "You have a reminder.",
            icon: "/icons/icon-192.png",
            data: { url: notificationLink(payload) },
        };

        try {
            const notification = new Notification(title, options);
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        } catch (error) {
            // Mobile browsers can reject the page Notification constructor;
            // their service worker can still display the notification.
            navigator.serviceWorker?.ready
                .then((registration) => registration.showNotification(title, options))
                .catch((fallbackError) => {
                    console.error(
                        "[Koneko] Could not show the foreground notification.",
                        fallbackError || error,
                    );
                });
        }
    });

    foregroundListenerRegistered = true;
}

function userKeyFromJwt(jwt) {
    try {
        const encodedPayload = jwt.split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");
        const paddedPayload = encodedPayload.padEnd(
            Math.ceil(encodedPayload.length / 4) * 4,
            "=",
        );
        const claims = JSON.parse(window.atob(paddedPayload));
        return claims.sub || claims.userId || claims.id || "authenticated-user";
    } catch {
        return "authenticated-user";
    }
}

async function getOrCreateFcmToken(messaging, serviceWorkerRegistration) {
    const savedToken = localStorage.getItem(FCM_TOKEN_KEY);
    if (savedToken) {
        console.info("[Koneko] Reusing saved FCM token.");
        return savedToken;
    }

    if (!tokenPromise) {
        tokenPromise = getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration,
        }).then((token) => {
            if (token) {
                localStorage.setItem(FCM_TOKEN_KEY, token);
                console.info("[Koneko] FCM token generated.");
            }
            return token;
        }).finally(() => {
            tokenPromise = undefined;
        });
    }

    return tokenPromise;
}

async function syncTokenToBackend(token) {
    const jwt = localStorage.getItem("koneko_token");
    if (!jwt) {
        console.info("[Koneko] Skipping token sync because no login token is available.");
        return;
    }

    const userKey = userKeyFromJwt(jwt);
    let previousSync;
    try {
        previousSync = JSON.parse(localStorage.getItem(TOKEN_SYNC_KEY) || "null");
    } catch {
        previousSync = null;
    }

    if (previousSync?.token === token && previousSync?.user === userKey) {
        return;
    }

    const response = await fetch(apiUrl("/api/device-token"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ token }),
    });

    if (!response.ok) {
        throw new Error(`Device token request failed with status ${response.status}.`);
    }

    localStorage.setItem(TOKEN_SYNC_KEY, JSON.stringify({ token, user: userKey }));
    console.info("[Koneko] FCM token sent to backend.");
}

async function setupNotifications() {
    try {
        const [serviceWorkerRegistration, messaging] = await Promise.all([
            registerFirebaseMessagingServiceWorker(),
            messagingPromise,
        ]);

        if (!messaging) {
            console.info("[Koneko] Firebase Messaging is not supported in this browser.");
            return;
        }

        const permission = await ensureNotificationPermission();
        if (permission !== "granted") {
            return;
        }

        registerForegroundMessageHandler(messaging);

        const token = await getOrCreateFcmToken(messaging, serviceWorkerRegistration);
        if (!token) {
            console.warn("[Koneko] Firebase did not return an FCM token.");
            return;
        }

        await syncTokenToBackend(token);
    } catch (error) {
        console.error("[Koneko] Notification setup failed.", error);
    }
}

export function registerNotifications() {
    if (!setupPromise) {
        setupPromise = setupNotifications().finally(() => {
            setupPromise = undefined;
        });
    }

    return setupPromise;
}
