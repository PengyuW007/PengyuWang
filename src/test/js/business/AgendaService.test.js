import Services from "../../../main/js/application/Services.js";
import DataAccessStub from "../persistence/DataAccessStub.js";
import AccessLeads from "../../../main/js/business/AccessLeads.js";
import AccessTasks from "../../../main/js/business/AccessTasks.js";
import ScoringService from "../../../main/js/business/ScoringService.js";
import PriorityManager from "../../../main/js/business/PriorityManager.js";
import AgendaService from "../../../main/js/business/AgendaService.js";
import Task from "../../../main/js/objects/Task.js";

describe("AgendaService Business Logic", () => {
    let accessLeads;
    let accessTasks;
    let scoringService;
    let priorityManager;
    let agendaService;

    beforeEach(() => {
        const dao = new DataAccessStub();

        Services.initialize({ environment: "test" });
        Services.createDataAccess(dao);

        accessLeads = new AccessLeads();
        accessTasks = new AccessTasks();
        scoringService = new ScoringService();
        priorityManager = new PriorityManager(scoringService);
        agendaService = new AgendaService(scoringService, priorityManager);
    });

    afterEach(() => {
        Services.closeDataAccess();
    });

    test("getTodayAgenda should include lead with task on target date", () => {
        const lead = accessLeads.getRandom(1);
        const today = new Date();

        const task = new Task(lead, "Today follow-up task", today);
        accessTasks.insertTask(task);

        const allLeads = accessLeads.getAllLeads();

        const allTasks = [];
        accessTasks.getTasks(allTasks);

        const agenda = agendaService.getTodayAgenda(allLeads, allTasks, today);

        expect(agenda.length).toBeGreaterThan(0);
        expect(agenda.some(item => item.getLeadID() === lead.getLeadID())).toBe(true);
    });

    test("getTodayAgenda should return prioritized list", () => {
        const allLeads = accessLeads.getAllLeads();
        const allTasks = [];

        accessTasks.getTasks(allTasks);

        const agenda = agendaService.getTodayAgenda(allLeads, allTasks, new Date());

        for (let i = 1; i < agenda.length; i++) {
            expect(agenda[i - 1].getLeadScore()).toBeGreaterThanOrEqual(
                agenda[i].getLeadScore()
            );
        }
    });
});