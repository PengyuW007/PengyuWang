import Services from "./Services.js";
import StubDataAccess from "../persistence/DataAccessStub.js";

export default class App {
    static dbName = "AutoTrack";
    static dbPathName = "StubDatabase";

    static main() {
        App.startUp();

        const dao = Services.getDataAccess();

        const leads = [];
        dao.getLeadSequential(leads);

        console.log("========== Lead List ==========");
        leads.forEach(lead => {
            console.log(lead.toString());
        });

        const tasks = [];
        dao.getTaskSequential(tasks);

        console.log("========== Task List ==========");
        tasks.forEach(task => {
            console.log(task.getTitle());
            console.log("Completed:", task.isCompleted());
        });

        const notifications = [];
        dao.getNotificationSequential(notifications);

        console.log("========== Notification List ==========");
        notifications.forEach(notification => {
            console.log(notification.getTitle());
            console.log("Lead ID:", notification.getLeadID());
        });

        App.shutDown();
    }

    static startUp() {
        console.log("Starting AutoTrack Web Application with Stub DAO...");

        Services.initialize({
            appName: "AutoTrack Web",
            environment: "development"
        });

        const stubDAO = new StubDataAccess();
        Services.createDataAccess(stubDAO);
    }

    static shutDown() {
        Services.closeDataAccess();
        console.log("AutoTrack Web Application shut down successfully.");
    }

    static getDBPathName() {
        return App.dbPathName || App.dbName;
    }

    static setDBPathName(pathName) {
        App.dbPathName = pathName;
    }
}

App.main();