import Services from "../../../main/js/application/Services.js";
import DataAccessStub from "../persistence/DataAccessStub.js";
import AccessLeads from "../../../main/js/business/AccessLeads.js";
import ScoringService from "../../../main/js/business/ScoringService.js";

describe("ScoringService Business Logic", () => {
    let accessLeads;
    let scoringService;

    beforeEach(() => {
        const dao = new DataAccessStub();

        Services.initialize({ environment: "test" });
        Services.createDataAccess(dao);

        accessLeads = new AccessLeads();
        scoringService = new ScoringService();
    });

    afterEach(() => {
        Services.closeDataAccess();
    });

    test("calculateScore should return basic score for NEW lead", () => {
        const lead = accessLeads.getRandom(1);
        lead.setLeadStage("NEW");
        lead.setLeadNotes("");

        const score = scoringService.calculateScore(lead);

        expect(score).toBeGreaterThanOrEqual(40);
    });

    test("calculateScore should return high score for NEGOTIATION lead with urgent notes", () => {
        const lead = accessLeads.getRandom(1);
        lead.setLeadStage("NEGOTIATION");
        lead.setLeadNotes("Customer is ready and urgent.");

        const score = scoringService.calculateScore(lead);

        expect(score).toBeGreaterThanOrEqual(120);
    });

    test("calculateScore should return low score for CLOSED lead", () => {
        const lead = accessLeads.getRandom(1);
        lead.setLeadStage("CLOSED");
        lead.setLeadNotes("");

        const score = scoringService.calculateScore(lead);

        expect(score).toBeLessThan(100);
    });

    test("getScientificMission should return standard follow-up for regular lead", () => {
        const lead = accessLeads.getRandom(2);
        lead.setLeadStage("NEW");

        const mission = scoringService.getScientificMission(lead, new Date());

        expect(mission).toContain("Standard Follow-up");
    });

    test("getFullTimeline should return an array", () => {
        const lead = accessLeads.getRandom(1);

        const timeline = scoringService.getFullTimeline(lead);

        expect(Array.isArray(timeline)).toBe(true);
    });
});