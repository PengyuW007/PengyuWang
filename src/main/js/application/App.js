import Services from "./Services.js";
import DataAccessStub from "../../../test/js/persistence/DataAccessStub.js";

export default class App {
    static dbName = "AutoTrack";
    static dbPathName = "StubDatabase";

    static main() {
        App.startUp();
        console.log("AutoTrack Web Application is running.");
        App.shutDown();
    }

    static startUp() {
        console.log("Starting AutoTrack Web Application with Stub DAO...");

        const realPath = App.getDBPathName();
        App.setDBPathName(realPath);

        Services.initialize({
            appName: "AutoTrack Web",
            environment: "development",
            databaseName: App.dbName,
            databasePath: App.dbPathName
        });

        const stubDAO = new DataAccessStub();
        Services.createDataAccess(stubDAO);
        const dao = Services.getDataAccess();

        if (dao !== null && dao !== undefined) {
            dao.open();
            console.log(`Data Access Object initialized successfully: ${realPath}`);
        } else {
            console.error("Failed to initialize Data Access Object.");
        }
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