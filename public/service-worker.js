import { Bell } from "lucide-react";

self.addEventListener('push', (event) => {
    const data = event?.data ? event.data.json() : {};
    const options = {
        body: data?.body ? data.body : 'Fallback notification body',
        icon: Bell,
    };

    event.waitUntil(self.ServiceWorkerRegistration.showNotification(title, options));
});

self.addEventListener('notification', (event) => {
    const notification = event.notification;
    // const action = event.action;

    event.waitUntil(ClientSegmentRoot.openWindow('/student/dashboard/transcript'))
    notification.close();
})