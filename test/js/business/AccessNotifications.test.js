import Services from "../../../src/main/js/application/Services.js";
import DataAccessStub from "../../../src/main/js/persistence/DataAccessStub.js";
import AccessLeads from "../../../src/main/js/business/AccessLeads.js";
import AccessNotifications from "../../../src/main/js/business/AccessNotifications.js";
import Notification from "../../../src/main/js/objects/Notification.js";

describe("AccessNotifications Business Layer", () => {
    let accessLeads;
    let accessNotifications;

    beforeEach(() => {
        const dao = new DataAccessStub();

        Services.initialize({ environment: "test" });
        Services.createDataAccess(dao);

        accessLeads = new AccessLeads();
        accessNotifications = new AccessNotifications();
    });

    afterEach(() => {
        Services.closeDataAccess();
    });

    test("getNotifications should return initial stub notifications", () => {
        const notifications = [];

        const result = accessNotifications.getNotifications(notifications);

        expect(result).toBeNull();
        expect(notifications.length).toBe(1);
        expect(notifications[0].getTitle()).toBe("Incoming inquiry from Demo1 Customer");
    });

    test("getSequential should return notifications one by one", () => {
        const firstNotification = accessNotifications.getSequential();
        const secondNotification = accessNotifications.getSequential();

        expect(firstNotification).not.toBeNull();
        expect(firstNotification.getTitle()).toBe("Incoming inquiry from Demo1 Customer");
        expect(secondNotification).toBeNull();
    });

    test("getAllNotifications should return all notifications", () => {
        const notifications = accessNotifications.getAllNotifications();

        expect(notifications.length).toBe(1);
        expect(notifications[0].getLeadID()).toBe(1);
    });

    test("insertNotification should add notification", () => {
        const lead = accessLeads.getRandom(1);
        const notification = new Notification(
            lead,
            "SMS from Demo1 Customer",
            new Date()
        );

        const result = accessNotifications.insertNotification(notification);

        expect(result).toBeNull();
        expect(notification.getEventID()).toBeGreaterThan(0);

        const notifications = [];
        accessNotifications.getNotifications(notifications);

        expect(notifications.length).toBe(2);
    });

    test("updateNotification should update notification title", () => {
        const notifications = [];
        accessNotifications.getNotifications(notifications);

        const notification = notifications[0];
        notification.setTitle("Updated notification title");

        const result = accessNotifications.updateNotification(notification);

        expect(result).toBeNull();

        const updatedNotifications = [];
        accessNotifications.getNotifications(updatedNotifications);

        expect(updatedNotifications[0].getTitle()).toBe("Updated notification title");
    });

    test("deleteNotification should remove notification", () => {
        const notifications = [];
        accessNotifications.getNotifications(notifications);

        const notification = notifications[0];

        const result = accessNotifications.deleteNotification(notification);

        expect(result).toBeNull();

        const updatedNotifications = [];
        accessNotifications.getNotifications(updatedNotifications);

        expect(updatedNotifications.length).toBe(0);
    });
});