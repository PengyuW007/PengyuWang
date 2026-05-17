import DataAccess from "./DataAccess.js";
import Lead from "../objects/Lead.js";
import Vehicle from "../objects/Vehicle.js";
import Task from "../objects/Task.js";
import Notification from "../objects/Notification.js";

export default class DataAccessStub extends DataAccess {
    constructor() {
        super();

        this.isOpen = false;

        this.leads = [];
        this.tasks = [];
        this.notifications = [];
        this.vehicles = [];

        this.nextLeadID = 1;
        this.nextTaskID = 1;
        this.nextNotificationID = 1;
        this.nextVehicleID = 1;
    }

    open() {
        this.isOpen = true;
        this.#loadStubData();
        console.log("Stub database opened.");
    }

    close() {
        this.isOpen = false;
        console.log("Stub database closed.");
    }

    // =========================
    // Lead
    // =========================

    getLeadSequential(leadResult) {
        this.#checkOpen();

        leadResult.length = 0;
        leadResult.push(...this.leads);

        return null;
    }

    getLeadRandom(criteria) {
        this.#checkOpen();

        if (criteria.getLeadID() > 0) {
            return this.leads.filter(lead => lead.getLeadID() === criteria.getLeadID());
        }

        return this.leads.filter(lead =>
            lead.getLeadFirstName() === criteria.getLeadFirstName() &&
            lead.getLeadLastName() === criteria.getLeadLastName() &&
            lead.getLeadPhoneNumber() === criteria.getLeadPhoneNumber()
        );
    }

    insertLead(lead) {
        this.#checkOpen();

        lead.setLeadID(this.nextLeadID++);
        this.leads.push(lead);

        return null;
    }

    updateLead(lead) {
        this.#checkOpen();

        const index = this.leads.findIndex(item => item.getLeadID() === lead.getLeadID());

        if (index === -1) {
            return "Update failed: Lead not found.";
        }

        this.leads[index] = lead;
        return null;
    }

    deleteLead(lead) {
        this.#checkOpen();

        const originalSize = this.leads.length;

        this.leads = this.leads.filter(item => item.getLeadID() !== lead.getLeadID());

        return this.leads.length < originalSize ? null : "Delete failed: Lead not found.";
    }

    // =========================
    // Task
    // =========================

    getTaskSequential(taskResult) {
        this.#checkOpen();

        taskResult.length = 0;
        taskResult.push(...this.tasks);

        return null;
    }

    getTaskRandom(criteria) {
        this.#checkOpen();

        if (!criteria.getLead()) {
            return [];
        }

        return this.tasks.filter(task =>
            task.getLead() &&
            task.getLead().getLeadID() === criteria.getLead().getLeadID()
        );
    }

    insertTask(task) {
        this.#checkOpen();

        task.setEventID(this.nextTaskID++);
        this.tasks.push(task);

        return null;
    }

    updateTask(task) {
        this.#checkOpen();

        const index = this.tasks.findIndex(item => item.getEventID() === task.getEventID());

        if (index === -1) {
            return "Update failed: Task not found.";
        }

        this.tasks[index] = task;
        return null;
    }

    deleteTask(task) {
        this.#checkOpen();

        const originalSize = this.tasks.length;

        this.tasks = this.tasks.filter(item => item.getEventID() !== task.getEventID());

        return this.tasks.length < originalSize ? null : "Delete failed: Task not found.";
    }

    // =========================
    // Notification
    // =========================

    getNotificationSequential(notificationResult) {
        this.#checkOpen();

        notificationResult.length = 0;
        notificationResult.push(...this.notifications);

        return null;
    }

    getNotificationRandom(criteria) {
        this.#checkOpen();

        if (criteria.getTitle()) {
            return this.notifications.filter(notification =>
                notification.getTitle().toLowerCase().includes(criteria.getTitle().toLowerCase())
            );
        }

        return this.notifications.filter(notification =>
            notification.getEventID() === criteria.getEventID()
        );
    }

    insertNotification(notification) {
        this.#checkOpen();

        notification.setEventID(this.nextNotificationID++);
        this.notifications.push(notification);

        return null;
    }

    updateNotification(notification) {
        this.#checkOpen();

        const index = this.notifications.findIndex(
            item => item.getEventID() === notification.getEventID()
        );

        if (index === -1) {
            return "Update failed: Notification not found.";
        }

        this.notifications[index] = notification;
        return null;
    }

    deleteNotification(notification) {
        this.#checkOpen();

        const originalSize = this.notifications.length;

        this.notifications = this.notifications.filter(
            item => item.getEventID() !== notification.getEventID()
        );

        return this.notifications.length < originalSize
            ? null
            : "Delete failed: Notification not found.";
    }

    getAllNotifications() {
        this.#checkOpen();
        return this.notifications;
    }

    // =========================
    // Vehicle
    // =========================

    getVehicleSequential(vehicleResult) {
        this.#checkOpen();

        vehicleResult.length = 0;
        vehicleResult.push(...this.vehicles);

        return null;
    }

    getVehicleRandom(criteria) {
        this.#checkOpen();

        const searchText = (
            criteria.getModel() ||
            criteria.getMake() ||
            ""
        ).toLowerCase();

        return this.vehicles.filter(vehicle =>
            String(vehicle.getModel()).toLowerCase().includes(searchText) ||
            String(vehicle.getMake()).toLowerCase().includes(searchText)
        );
    }

    insertVehicle(vehicle) {
        this.#checkOpen();

        vehicle.setVehicleID(this.nextVehicleID++);
        this.vehicles.push(vehicle);

        return null;
    }

    updateVehicle(vehicle) {
        this.#checkOpen();

        const index = this.vehicles.findIndex(
            item => item.getVehicleID() === vehicle.getVehicleID()
        );

        if (index === -1) {
            return "Update failed: Vehicle not found.";
        }

        this.vehicles[index] = vehicle;
        return null;
    }

    deleteVehicle(vehicle) {
        this.#checkOpen();

        const originalSize = this.vehicles.length;

        this.vehicles = this.vehicles.filter(
            item => item.getVehicleID() !== vehicle.getVehicleID()
        );

        return this.vehicles.length < originalSize
            ? null
            : "Delete failed: Vehicle not found.";
    }

    getFilteredColumnValues(targetColumn) {
        this.#checkOpen();

        return this.leads
            .map(lead => lead[targetColumn])
            .filter(value => value !== null && value !== undefined && value !== "");
    }

    getUniqueColumnValues(columnName) {
        this.#checkOpen();

        const values = this.leads
            .map(lead => lead[columnName])
            .filter(value => value !== null && value !== undefined && value !== "");

        return [...new Set(values)];
    }

    // =========================
    // Private Helpers
    // =========================

    #checkOpen() {
        if (!this.isOpen) {
            throw new Error("Stub database is not open.");
        }
    }

    #loadStubData() {
        if (this.leads.length > 0) {
            return;
        }

        const atlas = new Vehicle("Volkswagen", "Atlas", "2025", "Highline R-Line");
        atlas.setVehicleID(this.nextVehicleID++);

        const tiguan = new Vehicle("Volkswagen", "Tiguan", "2024", "Comfortline");
        tiguan.setVehicleID(this.nextVehicleID++);

        this.vehicles.push(atlas, tiguan);

        const lead1 = new Lead({
            firstName: "Demo1",
            lastName: "Customer",
            phone: "416-111-2222",
            leadEmail: "demo1@example.com",
            budget: 58000,
            vehicleInterest: atlas,
            stage: "NEW",
            notes: "Interested in Atlas."
        });

        const lead2 = new Lead({
            firstName: "Demo2",
            lastName: "Customer",
            phone: "647-333-4444",
            leadEmail: "demo2@example.com",
            budget: 42000,
            vehicleInterest: tiguan,
            stage: "VISITED",
            notes: "Interested in Tiguan."
        });

        this.insertLead(lead1);
        this.insertLead(lead2);

        const task = new Task(
            lead1,
            "Follow up with Demo1 Customer",
            new Date()
        );

        this.insertTask(task);

        const notification = new Notification(
            lead1,
            "Incoming inquiry from Demo1 Customer",
            new Date()
        );

        this.insertNotification(notification);
    }
}