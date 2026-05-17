import ScoringService from "./ScoringService.js";

export default class AgendaService {
    constructor(scoringService, priorityManager) {
        this.scoringService = scoringService;
        this.priorityManager = priorityManager;
        this.highPriorityThreshold = ScoringService.THRESHOLD;
    }

    getTodayAgenda(allLeads, allTasks, targetDate) {
        const targetDateStr = this.#formatDate(targetDate);
        const realTodayStr = this.#formatDate(new Date());

        const isViewingToday = targetDateStr === realTodayStr;
        const agendaMap = new Map();

        const currentTime = Date.now();
        const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000;

        for (const lead of allLeads) {
            const currentScore = this.scoringService.calculateScore(lead);
            lead.setLeadScore(currentScore);

            let hasTaskOnDate = false;

            if (
                lead.getFollowUpDate() !== null &&
                lead.getFollowUpDate() !== undefined &&
                this.#formatDate(lead.getFollowUpDate()) === targetDateStr
            ) {
                hasTaskOnDate = true;
            }

            if (!hasTaskOnDate && allTasks !== null && allTasks !== undefined) {
                for (const task of allTasks) {
                    if (
                        task.getLead() !== null &&
                        task.getLead() !== undefined &&
                        task.getLead().getLeadID() === lead.getLeadID() &&
                        task.getDate() !== null &&
                        task.getDate() !== undefined &&
                        this.#formatDate(task.getDate()) === targetDateStr
                    ) {
                        hasTaskOnDate = true;
                        break;
                    }
                }
            }

            const isHighPriority = currentScore >= this.highPriorityThreshold;

            let lastInteraction = 0;

            if (lead.getLastInteractionDate() !== null) {
                lastInteraction = lead.getLastInteractionDate().getTime();
            } else if (lead.getLeadCreatedAt() !== null) {
                lastInteraction = lead.getLeadCreatedAt().getTime();
            }

            const isNeglected = currentTime - lastInteraction > threeDaysInMillis;

            if (
                hasTaskOnDate ||
                (isViewingToday && isHighPriority && isNeglected)
            ) {
                agendaMap.set(lead.getLeadID(), lead);
            }
        }

        return this.priorityManager.getPrioritizedList([...agendaMap.values()]);
    }

    #formatDate(date) {
        const normalizedDate = new Date(date);
        const year = normalizedDate.getFullYear();
        const month = String(normalizedDate.getMonth() + 1).padStart(2, "0");
        const day = String(normalizedDate.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }
}