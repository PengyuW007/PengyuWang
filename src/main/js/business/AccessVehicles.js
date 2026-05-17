import Services from "../application/Services.js";
import Vehicle from "../objects/Vehicle.js";

export default class AccessVehicles {
    constructor() {
        this.dataAccess = Services.getDataAccess();
        this.vehicles = [];
        this.vehicle = null;
        this.currVehicle = 0;
    }

    getVehicles(vehicles) {
        vehicles.length = 0;
        return this.dataAccess.getVehicleSequential(vehicles);
    }

    getSequential() {
        if (this.vehicles === null || this.vehicles.length === 0) {
            this.vehicles = [];
            this.dataAccess.getVehicleSequential(this.vehicles);
            this.currVehicle = 0;
        }

        if (this.currVehicle < this.vehicles.length) {
            this.vehicle = this.vehicles[this.currVehicle];
            this.currVehicle++;
        } else {
            this.vehicle = null;
            this.vehicles = null;
            this.currVehicle = 0;
        }

        return this.vehicle;
    }

    getRandom(id) {
        if (id <= 0) {
            this.vehicle = null;
            return null;
        }

        const temp = new Vehicle();
        temp.setVehicleID(id);

        this.vehicles = this.dataAccess.getVehicleRandom(temp);
        this.currVehicle = 0;

        if (this.currVehicle < this.vehicles.length) {
            this.vehicle = this.vehicles[this.currVehicle];
            this.currVehicle++;
        } else {
            this.vehicle = null;
            this.vehicles = null;
        }

        return this.vehicle;
    }

    insertVehicle(currVehicle) {
        return this.dataAccess.insertVehicle(currVehicle);
    }

    updateVehicle(currVehicle) {
        return this.dataAccess.updateVehicle(currVehicle);
    }

    deleteVehicle(currVehicle) {
        return this.dataAccess.deleteVehicle(currVehicle);
    }
}