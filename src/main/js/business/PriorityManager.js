export default class PriorityManager {
    constructor(scoringService) {
        this.scoringService = scoringService;
        this.priorityQueue = [];
    }

    getPrioritizedList(inputLeads) {
        this.priorityQueue = [];

        if (inputLeads !== null && inputLeads !== undefined) {
            for (const lead of inputLeads) {
                if (lead.getLeadScore() === 0) {
                    lead.setLeadScore(this.scoringService.calculateScore(lead));
                }

                this.priorityQueue.push(lead);
            }
        }

        return this.getAllLeadsSorted();
    }

    addOrUpdateLead(lead) {
        this.removeLead(lead);

        const score = this.scoringService.calculateScore(lead);
        lead.setLeadScore(score);

        this.priorityQueue.push(lead);
    }

    removeLead(lead) {
        this.priorityQueue = this.priorityQueue.filter(
            item => item.getLeadID() !== lead.getLeadID()
        );
    }

    peekTopLead() {
        const sortedList = this.getAllLeadsSorted();

        if (sortedList.length === 0) {
            return null;
        }

        return sortedList[0];
    }

    getAllLeadsSorted() {
        return [...this.priorityQueue].sort(
            (leadA, leadB) => leadB.getLeadScore() - leadA.getLeadScore()
        );
    }
}