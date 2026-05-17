import Services from "../application/Services.js";

export default class AccessNotifications {
    constructor() {
        this.dataAccess = Services.getDataAccess();
        this.notifications = [];
        this.notification = null;
        this.currNotification = 0;
    }

    getNotifications(notifications) {
        notifications.length = 0;
        return this.dataAccess.getNotificationSequential(notifications);
    }

    getSequential() {
        if (
            this.notification === null ||
            this.notifications === null ||
            this.notifications.length === 0
        ) {
            this.notifications = [];
            this.dataAccess.getNotificationSequential(this.notifications);
            this.currNotification = 0;
        }

        if (this.currNotification < this.notifications.length) {
            this.notification = this.notifications[this.currNotification];
            this.currNotification++;
        } else {
            this.notification = null;
            this.notifications = null;
            this.currNotification = 0;
        }

        return this.notification;
    }

    getAllNotifications() {
        return this.dataAccess.getAllNotifications();
    }

    insertNotification(currNotification) {
        return this.dataAccess.insertNotification(currNotification);
    }

    updateNotification(currNotification) {
        return this.dataAccess.updateNotification(currNotification);
    }

    deleteNotification(currNotification) {
        return this.dataAccess.deleteNotification(currNotification);
    }
}