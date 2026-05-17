import DataAccessStub from "../../../src/main/js/persistence/DataAccessStub.js";
import Lead from "../../../src/main/js/objects/Lead.js";
import Vehicle from "../../../src/main/js/objects/Vehicle.js";

describe("DataAccessStub Lead CRUD", () => {
    let dao;

    beforeEach(() => {
        dao = new DataAccessStub();
        dao.open();
    });

    test("getLeadSequential should return initial stub leads", () => {
        const leads = [];

        const result = dao.getLeadSequential(leads);

        expect(result).toBeNull();
        expect(leads.length).toBe(2);
        expect(leads[0].getLeadName()).toBe("Demo1 Customer");
        expect(leads[1].getLeadName()).toBe("Demo2 Customer");
    });

    test("insertLead should add a new lead", () => {
        const vehicle = new Vehicle("Volkswagen", "Golf GTI", "2025", "Autobahn");

        const lead = new Lead({
            firstName: "Test",
            lastName: "Customer",
            phone: "905-888-9999",
            vehicleInterest: vehicle
        });

        const result = dao.insertLead(lead);

        expect(result).toBeNull();
        expect(lead.getLeadID()).toBeGreaterThan(0);

        const leads = [];
        dao.getLeadSequential(leads);

        expect(leads.length).toBe(3);
        expect(leads[2].getLeadName()).toBe("Test Customer");
    });

    test("getLeadRandom should find a lead by ID", () => {
        const criteria = new Lead({
            firstName: "Temp",
            lastName: "Search"
        });

        criteria.setLeadID(1);

        const results = dao.getLeadRandom(criteria);

        expect(results.length).toBe(1);
        expect(results[0].getLeadID()).toBe(1);
        expect(results[0].getLeadName()).toBe("Demo1 Customer");
    });

    test("updateLead should update an existing lead", () => {
        const criteria = new Lead({
            firstName: "Temp",
            lastName: "Search"
        });

        criteria.setLeadID(1);

        const lead = dao.getLeadRandom(criteria)[0];

        lead.setLeadStage("NEGOTIATION");
        lead.setLeadBudget(60000);
        lead.setLeadNotes("Customer is ready and urgent.");

        const result = dao.updateLead(lead);

        expect(result).toBeNull();

        const updatedLead = dao.getLeadRandom(criteria)[0];

        expect(updatedLead.getLeadStage()).toBe("NEGOTIATION");
        expect(updatedLead.getLeadBudget()).toBe(60000);
        expect(updatedLead.getLeadNotes()).toBe("Customer is ready and urgent.");
    });

    test("deleteLead should remove an existing lead", () => {
        const leads = [];
        dao.getLeadSequential(leads);

        const lead = leads[0];
        const result = dao.deleteLead(lead);

        expect(result).toBeNull();

        const updatedLeads = [];
        dao.getLeadSequential(updatedLeads);

        expect(updatedLeads.length).toBe(1);
    });
});