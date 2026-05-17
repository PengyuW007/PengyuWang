import Services from "../../../src/main/js/application/Services.js";
import DataAccessStub from "../../../src/main/js/persistence/DataAccessStub.js";
import AccessLeads from "../../../src/main/js/business/AccessLeads.js";
import Lead from "../../../src/main/js/objects/Lead.js";
import Vehicle from "../../../src/main/js/objects/Vehicle.js";

describe("AccessLeads Business Layer", () => {
    let accessLeads;

    beforeEach(() => {
        const dao = new DataAccessStub();
        Services.initialize({ environment: "test" });
        Services.createDataAccess(dao);

        accessLeads = new AccessLeads();
    });

    afterEach(() => {
        Services.closeDataAccess();
    });

    test("getAllLeads should return stub leads", () => {
        const leads = accessLeads.getAllLeads();

        expect(leads.length).toBe(2);
        expect(leads[0].getLeadName()).toBe("Demo1 Customer");
    });

    test("insertLead should add lead through business layer", () => {
        const vehicle = new Vehicle("Volkswagen", "Jetta", "2025", "Highline");

        const lead = new Lead({
            firstName: "Business",
            lastName: "Test",
            phone: "416-999-0000",
            vehicleInterest: vehicle
        });

        const result = accessLeads.insertLead(lead);

        expect(result).toBeNull();
        expect(lead.getLeadID()).toBeGreaterThan(0);
        expect(accessLeads.getAllLeads().length).toBe(3);
    });

    test("getRandom should find lead by ID", () => {
        const lead = accessLeads.getRandom(1);

        expect(lead).not.toBeNull();
        expect(lead.getLeadID()).toBe(1);
    });

    test("updateLead should update lead stage", () => {
        const lead = accessLeads.getRandom(1);
        lead.setLeadStage("TEST_DRIVE");

        const result = accessLeads.updateLead(lead);
        const updated = accessLeads.getRandom(1);

        expect(result).toBeNull();
        expect(updated.getLeadStage()).toBe("TEST_DRIVE");
    });

    test("deleteLead should remove lead", () => {
        const lead = accessLeads.getRandom(1);

        const result = accessLeads.deleteLead(lead);

        expect(result).toBeNull();
        expect(accessLeads.getAllLeads().length).toBe(1);
    });

    test("getLeadByContactInfo should find lead by phone", () => {
        const lead = accessLeads.getLeadByContactInfo("416-111-2222");

        expect(lead).not.toBeNull();
        expect(lead.getLeadName()).toBe("Demo1 Customer");
    });

    test("getLeadsFiltered should filter by stage", () => {
        const filtered = accessLeads.getLeadsFiltered("", "All", "VISITED", "All", "Year", "Make", "Model");

        expect(filtered.length).toBe(1);
        expect(filtered[0].getLeadStage()).toBe("VISITED");
    });
});