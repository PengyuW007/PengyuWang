import Services from "../../../main/js/application/Services.js";
import DataAccessStub from "../persistence/DataAccessStub.js";
import AccessVehicles from "../../../main/js/business/AccessVehicles.js";
import Vehicle from "../../../main/js/objects/Vehicle.js";

describe("AccessVehicles Business Layer", () => {
    let accessVehicles;

    beforeEach(() => {
        const dao = new DataAccessStub();

        Services.initialize({ environment: "test" });
        Services.createDataAccess(dao);

        accessVehicles = new AccessVehicles();
    });

    afterEach(() => {
        Services.closeDataAccess();
    });

    test("getVehicles should return initial stub vehicles", () => {
        const vehicles = [];

        const result = accessVehicles.getVehicles(vehicles);

        expect(result).toBeNull();
        expect(vehicles.length).toBe(2);
        expect(vehicles[0].getMake()).toBe("Volkswagen");
    });

    test("getSequential should return vehicles one by one", () => {
        const firstVehicle = accessVehicles.getSequential();
        const secondVehicle = accessVehicles.getSequential();
        const thirdVehicle = accessVehicles.getSequential();

        expect(firstVehicle).not.toBeNull();
        expect(secondVehicle).not.toBeNull();
        expect(thirdVehicle).toBeNull();
    });

    test("insertVehicle should add vehicle", () => {
        const vehicle = new Vehicle("Volkswagen", "Jetta", "2025", "Highline");

        const result = accessVehicles.insertVehicle(vehicle);

        expect(result).toBeNull();
        expect(vehicle.getVehicleID()).toBeGreaterThan(0);

        const vehicles = [];
        accessVehicles.getVehicles(vehicles);

        expect(vehicles.length).toBe(3);
    });

    test("updateVehicle should update vehicle trim", () => {
        const vehicles = [];
        accessVehicles.getVehicles(vehicles);

        const vehicle = vehicles[0];
        vehicle.setTrim("Updated Trim");

        const result = accessVehicles.updateVehicle(vehicle);

        expect(result).toBeNull();

        const updatedVehicles = [];
        accessVehicles.getVehicles(updatedVehicles);

        expect(updatedVehicles[0].getTrim()).toBe("Updated Trim");
    });

    test("deleteVehicle should remove vehicle", () => {
        const vehicles = [];
        accessVehicles.getVehicles(vehicles);

        const vehicle = vehicles[0];

        const result = accessVehicles.deleteVehicle(vehicle);

        expect(result).toBeNull();

        const updatedVehicles = [];
        accessVehicles.getVehicles(updatedVehicles);

        expect(updatedVehicles.length).toBe(1);
    });
});