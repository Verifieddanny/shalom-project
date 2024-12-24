self.addEventListener('push', (event) => {
    const data = event?.data ? event.data.json() : {};
    const options = {
        body: data?.body ? data.body : 'Your transcript is ready!',
        icon: "./vercel.svg",
    };

    event.waitUntil(self.registration.showNotification("Transcript ready!", options));
});

self.addEventListener('notificationclick', (event) => {
    const notification = event.notification;
    notification.close();

    event.waitUntil(
        clients.openWindow('/student/dashboard/transcript')
    );
});