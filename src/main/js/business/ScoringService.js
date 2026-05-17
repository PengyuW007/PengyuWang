import AccessTasks from "./AccessTasks.js";
import Task from "../objects/Task.js";

export default class ScoringService {
    static THRESHOLD = 100;

    constructor() {
        this.silentMilestones = [3, 8, 15, 30, 90, 180, 365];
        this.accessTasks = new AccessTasks();
    }

    calculateScore(lead) {
        let score = 0;

        score += this.#getStageWeight(lead.getLeadStage());
        score += this.#getTimeWeight(lead);
        score += this.#getEngagementWeight(lead);

        return score;
    }

    getFullTimeline(lead) {
        const timeline = [];

        if (lead === null || lead === undefined || lead.getLeadCreatedAt() === null) {
            return timeline;
        }

        this.accessTasks.getTasksByLead(timeline, lead);

        const pivotDate =
            lead.getLastInteractionDate() !== null &&
            lead.getLastInteractionBy() === "LEAD"
                ? lead.getLastInteractionDate()
                : lead.getLeadCreatedAt();

        const today = this.#resetTime(new Date());

        const gratitudeTitle = "Gratitude: Thank You & Info Swap";

        if (!this.#containsTask(timeline, gratitudeTitle)) {
            const day1 = this.#addDays(lead.getLeadCreatedAt(), 1);

            if (day1 <= today) {
                const task = new Task(lead, gratitudeTitle, day1);
                task.setCompleted(true);
                this.accessTasks.insertTask(task);
                timeline.push(task);
            }
        }

        const urgentTitle = "URGENT: Lead replied. Respond within 48h!";

        if (
            lead.getLastInteractionBy() === "LEAD" &&
            !this.#containsTask(timeline, urgentTitle)
        ) {
            const urgentTask = new Task(lead, urgentTitle, today);
            const daysFromPivot = this.#getDaysDiff(
                this.#resetTime(pivotDate),
                today
            );

            urgentTask.setCompleted(daysFromPivot > 2);
            this.accessTasks.insertTask(urgentTask);
            timeline.push(urgentTask);
        }

        for (const milestone of this.silentMilestones) {
            const milestoneTitle = this.#getMissionNameByDay(milestone);

            if (!this.#containsTask(timeline, milestoneTitle)) {
                const milestoneDate = this.#addDays(pivotDate, milestone);

                if (milestoneDate <= today) {
                    const task = new Task(lead, milestoneTitle, milestoneDate);
                    task.setCompleted(milestoneDate < today);
                    this.accessTasks.insertTask(task);
                    timeline.push(task);
                }
            }
        }

        timeline.sort((taskA, taskB) => taskA.getDate() - taskB.getDate());

        return timeline;
    }

    getScientificMission(lead, targetDate) {
        if (lead === null || lead === undefined || lead.getLeadCreatedAt() === null) {
            return null;
        }

        const targetDateStr = this.#formatDate(targetDate);

        const leadTasks = [];
        this.accessTasks.getTasksByLead(leadTasks, lead);

        for (const task of leadTasks) {
            if (
                task.getDate() !== null &&
                this.#formatDate(task.getDate()) === targetDateStr
            ) {
                return task.getTitle();
            }
        }

        const createdDate = this.#resetTime(lead.getLeadCreatedAt());
        const target = this.#resetTime(targetDate);

        if (this.#getDaysDiff(createdDate, target) === 1) {
            return "Gratitude: Thank You & Info Swap";
        }

        const pivotDate =
            lead.getLastInteractionDate() !== null &&
            lead.getLastInteractionBy() === "LEAD"
                ? lead.getLastInteractionDate()
                : lead.getLeadCreatedAt();

        const daysFromPivot = this.#getDaysDiff(
            this.#resetTime(pivotDate),
            target
        );

        if (lead.getLastInteractionBy() === "LEAD" && daysFromPivot <= 2) {
            return "URGENT: Lead replied. Respond within 48h!";
        }

        for (const milestone of this.silentMilestones) {
            if (daysFromPivot === milestone) {
                return this.#getMissionNameByDay(milestone);
            }
        }

        const score = this.calculateScore(lead);

        if (score >= ScoringService.THRESHOLD) {
            return `High Priority: Nurture ${lead.getLeadStage()} (Score: ${Math.floor(score)})`;
        }

        return `Standard Follow-up: ${lead.getLeadStage()}`;
    }

    #getStageWeight(stage) {
        if (stage === null || stage === undefined) {
            return 0;
        }

        switch (stage.toUpperCase()) {
            case "NEW":
                return 40;
            case "CONTACTED":
                return 50;
            case "VISITED":
                return 60;
            case "TEST_DRIVE":
                return 70;
            case "NEGOTIATION":
                return 100;
            case "CLOSED":
                return 0;
            default:
                return 10;
        }
    }

    #getTimeWeight(lead) {
        const pivotDate = lead.getLastInteractionDate() || lead.getLeadCreatedAt();

        if (!pivotDate) {
            return 0;
        }

        const daysSilent = this.#getDaysDiff(
            this.#resetTime(pivotDate),
            this.#resetTime(new Date())
        );

        if (daysSilent > 7) {
            return 30;
        }

        if (daysSilent > 3) {
            return 15;
        }

        return 0;
    }

    #getEngagementWeight(lead) {
        let engagementScore = 0;
        const stage = lead.getLeadStage()
            ? lead.getLeadStage().toUpperCase()
            : "";

        if (stage === "VISITED") {
            engagementScore += 20;
        } else if (stage === "TEST_DRIVE") {
            engagementScore += 40;
        } else if (stage === "NEGOTIATION") {
            engagementScore += 60;
        }

        const notes = lead.getLeadNotes()
            ? lead.getLeadNotes().toLowerCase()
            : "";

        if (
            notes.includes("hot") ||
            notes.includes("ready") ||
            notes.includes("urgent")
        ) {
            engagementScore += 20;
        }

        return engagementScore;
    }

    #getMissionNameByDay(day) {
        switch (day) {
            case 3:
                return "New Ideas: Follow up thoughts";
            case 8:
                return "Market Update: Inventory/Trade-in";
            case 15:
                return "Resource: Hidden feature video";
            case 30:
                return "Checking In: Specific specs";
            case 90:
                return "Seasonal: Service specials";
            case 180:
                return "Relationship: High-level check-in";
            case 365:
                return "Anniversary: Yearly check-in";
            default:
                return "Follow up";
        }
    }

    #containsTask(taskList, title) {
        return taskList.some(task => task.getTitle() === title);
    }

    #addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return this.#resetTime(result);
    }

    #getDaysDiff(startDate, endDate) {
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        return Math.floor((endDate - startDate) / millisecondsPerDay);
    }

    #resetTime(date) {
        const result = new Date(date);
        result.setHours(0, 0, 0, 0);
        return result;
    }

    #formatDate(date) {
        const normalizedDate = new Date(date);
        const year = normalizedDate.getFullYear();
        const month = String(normalizedDate.getMonth() + 1).padStart(2, "0");
        const day = String(normalizedDate.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }
}