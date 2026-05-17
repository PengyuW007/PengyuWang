import Services from "../../../main/js/application/Services.js";
import DataAccessStub from "../persistence/DataAccessStub.js";
import AccessLeads from "../../../main/js/business/AccessLeads.js";
import AccessTasks from "../../../main/js/business/AccessTasks.js";
import Task from "../../../main/js/objects/Task.js";

describe("AccessTasks Business Layer", () => {
    let accessLeads;
    let accessTasks;

    beforeEach(() => {
        const dao = new DataAccessStub();

        Services.initialize({ environment: "test" });
        Services.createDataAccess(dao);

        accessLeads = new AccessLeads();
        accessTasks = new AccessTasks();
    });

    afterEach(() => {
        Services.closeDataAccess();
    });

    test("getTasks should return initial stub tasks", () => {
        const tasks = [];

        const result = accessTasks.getTasks(tasks);

        expect(result).toBeNull();
        expect(tasks.length).toBe(1);
        expect(tasks[0].getTitle()).toBe("Follow up with Demo1 Customer");
    });

    test("getSequential should return tasks one by one", () => {
        const firstTask = accessTasks.getSequential();
        const secondTask = accessTasks.getSequential();

        expect(firstTask).not.toBeNull();
        expect(firstTask.getTitle()).toBe("Follow up with Demo1 Customer");
        expect(secondTask).toBeNull();
    });

    test("insertTask should add a task through business layer", () => {
        const lead = accessLeads.getRandom(1);
        const task = new Task(lead, "Book test drive", new Date());

        const result = accessTasks.insertTask(task);

        expect(result).toBeNull();
        expect(task.getEventID()).toBeGreaterThan(0);

        const tasks = [];
        accessTasks.getTasks(tasks);

        expect(tasks.length).toBe(2);
    });

    test("updateTask should update task completion status", () => {
        const tasks = [];
        accessTasks.getTasks(tasks);

        const task = tasks[0];
        task.setCompleted(true);

        const result = accessTasks.updateTask(task);

        expect(result).toBeNull();

        const updatedTasks = [];
        accessTasks.getTasks(updatedTasks);

        expect(updatedTasks[0].isCompleted()).toBe(true);
    });

    test("deleteTask should remove a task", () => {
        const tasks = [];
        accessTasks.getTasks(tasks);

        const task = tasks[0];
        const result = accessTasks.deleteTask(task);

        expect(result).toBeNull();

        const updatedTasks = [];
        accessTasks.getTasks(updatedTasks);

        expect(updatedTasks.length).toBe(0);
    });

    test("getTasksByLead should return tasks for selected lead", () => {
        const lead = accessLeads.getRandom(1);
        const resultList = [];

        const result = accessTasks.getTasksByLead(resultList, lead);

        expect(result).toBeNull();
        expect(resultList.length).toBe(1);
        expect(resultList[0].getLead().getLeadID()).toBe(1);
    });

    test("getTasksByLead should return error when lead is null", () => {
        const resultList = [];

        const result = accessTasks.getTasksByLead(resultList, null);

        expect(result).toBe("Lead cannot be null");
        expect(resultList.length).toBe(0);
    });
});