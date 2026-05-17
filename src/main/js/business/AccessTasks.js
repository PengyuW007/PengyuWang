import Services from "../application/Services.js";
import Task from "../objects/Task.js";

export default class AccessTasks {
    constructor() {
        this.dataAccess = Services.getDataAccess();
        this.tasks = [];
        this.task = null;
        this.currTask = 0;
    }

    getTasks(tasks) {
        tasks.length = 0;
        return this.dataAccess.getTaskSequential(tasks);
    }

    getSequential() {
        if (this.task === null || this.tasks === null || this.tasks.length === 0) {
            this.tasks = [];
            this.dataAccess.getTaskSequential(this.tasks);
            this.currTask = 0;
        }

        if (this.currTask < this.tasks.length) {
            this.task = this.tasks[this.currTask];
            this.currTask++;
        } else {
            this.task = null;
            this.tasks = null;
            this.currTask = 0;
        }

        return this.task;
    }

    insertTask(currTask) {
        return this.dataAccess.insertTask(currTask);
    }

    updateTask(currTask) {
        return this.dataAccess.updateTask(currTask);
    }

    deleteTask(currTask) {
        return this.dataAccess.deleteTask(currTask);
    }

    getTasksByLead(resultList, lead) {
        if (lead === null || lead === undefined) {
            return "Lead cannot be null";
        }

        resultList.length = 0;

        try {
            const criteria = new Task(lead, null, null);
            const foundTasks = this.dataAccess.getTaskRandom(criteria);

            if (foundTasks !== null && foundTasks !== undefined) {
                resultList.push(...foundTasks);
            }

            return null;
        } catch (error) {
            return error.message;
        }
    }
}