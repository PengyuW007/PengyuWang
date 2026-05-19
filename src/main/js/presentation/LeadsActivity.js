import Services from "../application/Services.js";
import DataAccessStub from "../../../test/js/persistence/DataAccessStub.js";
import AccessLeads from "../business/AccessLeads.js";
import ScoringService from "../business/ScoringService.js";

export default class LeadsActivity {
    static accessLeads = null;
    static scoringService = null;
    static allLeads = [];
    static selectedLead = null;

    static initialize() {
        LeadsActivity.initializeServices();
        LeadsActivity.bindViews();
        LeadsActivity.loadLeads();
        LeadsActivity.bindEvents();
    }

    static initializeServices() {
        Services.initialize({
            appName: "AutoTrack Web",
            environment: "browser-development"
        });

        const dao = new DataAccessStub();
        Services.createDataAccess(dao);

        LeadsActivity.accessLeads = new AccessLeads();
        LeadsActivity.scoringService = new ScoringService();
    }

    static bindViews() {
        LeadsActivity.searchInput = document.getElementById("searchInput");
        LeadsActivity.statusFilter = document.getElementById("statusFilter");
        LeadsActivity.stageFilter = document.getElementById("stageFilter");
        LeadsActivity.tradeInFilter = document.getElementById("tradeInFilter");
        LeadsActivity.scoreFilter = document.getElementById("scoreFilter");
        LeadsActivity.leadTableBody = document.getElementById("leadTableBody");
        LeadsActivity.leadCount = document.getElementById("leadCount");

        LeadsActivity.modal = document.getElementById("leadBriefModal");
        LeadsActivity.briefContent = document.getElementById("leadBriefContent");
        LeadsActivity.closeBriefBtn = document.getElementById("closeBriefBtn");
        LeadsActivity.closeBriefBottomBtn = document.getElementById("closeBriefBottomBtn");
        LeadsActivity.modifyFromBriefBtn = document.getElementById("modifyFromBriefBtn");

        LeadsActivity.toast = document.getElementById("notificationToast");
    }

    static bindEvents() {
        LeadsActivity.searchInput.addEventListener("input", LeadsActivity.applyFilters);
        LeadsActivity.statusFilter.addEventListener("change", LeadsActivity.applyFilters);
        LeadsActivity.stageFilter.addEventListener("change", LeadsActivity.applyFilters);
        LeadsActivity.tradeInFilter.addEventListener("change", LeadsActivity.applyFilters);
        LeadsActivity.scoreFilter.addEventListener("change", LeadsActivity.applyFilters);

        LeadsActivity.closeBriefBtn.addEventListener("click", LeadsActivity.closeLeadBrief);
        LeadsActivity.closeBriefBottomBtn.addEventListener("click", LeadsActivity.closeLeadBrief);

        LeadsActivity.modifyFromBriefBtn.addEventListener("click", () => {
            if (LeadsActivity.selectedLead !== null) {
                LeadsActivity.openLeadDetails(LeadsActivity.selectedLead.getLeadID());
            }
        });

        LeadsActivity.modal.addEventListener("click", event => {
            if (event.target === LeadsActivity.modal) {
                LeadsActivity.closeLeadBrief();
            }
        });
    }

    static loadLeads() {
        LeadsActivity.allLeads = LeadsActivity.accessLeads.getAllLeads();

        for (const lead of LeadsActivity.allLeads) {
            const score = LeadsActivity.scoringService.calculateScore(lead);
            lead.setLeadScore(score);
        }

        LeadsActivity.applyFilters();
    }

    static applyFilters = () => {
        const query = LeadsActivity.searchInput.value.trim().toLowerCase();
        const status = LeadsActivity.statusFilter.value;
        const stage = LeadsActivity.stageFilter.value;
        const tradeIn = LeadsActivity.tradeInFilter.value;
        const scoreRange = LeadsActivity.scoreFilter.value;

        let filteredLeads = [...LeadsActivity.allLeads];

        if (query !== "") {
            filteredLeads = filteredLeads.filter(lead => {
                const name = lead.getLeadName().toLowerCase();
                const email = lead.getLeadEmail().toLowerCase();
                const phone = lead.getLeadPhoneNumber().toLowerCase();

                return name.includes(query) ||
                    email.includes(query) ||
                    phone.includes(query);
            });
        }

        if (status !== "All") {
            const isActive = status === "Active";
            filteredLeads = filteredLeads.filter(lead => lead.getLeadStatus() === isActive);
        }

        if (stage !== "All") {
            filteredLeads = filteredLeads.filter(lead => lead.getLeadStage() === stage);
        }

        if (tradeIn === "Has Trade-in") {
            filteredLeads = filteredLeads.filter(lead => lead.getTradeInVehicle() !== null);
        } else if (tradeIn === "No Trade-in") {
            filteredLeads = filteredLeads.filter(lead => lead.getTradeInVehicle() === null);
        }

        if (scoreRange === "High") {
            filteredLeads = filteredLeads.filter(lead => lead.getLeadScore() >= 80);
        } else if (scoreRange === "Medium") {
            filteredLeads = filteredLeads.filter(
                lead => lead.getLeadScore() >= 50 && lead.getLeadScore() < 80
            );
        } else if (scoreRange === "Low") {
            filteredLeads = filteredLeads.filter(lead => lead.getLeadScore() < 50);
        }

        filteredLeads.sort((leadA, leadB) => {
            const dateA = leadA.getLeadCreatedAt()
                ? leadA.getLeadCreatedAt().getTime()
                : 0;

            const dateB = leadB.getLeadCreatedAt()
                ? leadB.getLeadCreatedAt().getTime()
                : 0;

            return dateB - dateA;
        });

        LeadsActivity.renderGroupedLeads(filteredLeads);
    };

    static renderGroupedLeads(leads) {
        LeadsActivity.leadTableBody.innerHTML = "";
        LeadsActivity.leadCount.textContent = `${leads.length} Leads`;

        const groupedLeads = LeadsActivity.groupLeadsByCreatedDate(leads);

        for (const [dateLabel, dateLeads] of groupedLeads.entries()) {
            const groupRow = document.createElement("tr");
            groupRow.className = "date-group-row";
            groupRow.innerHTML = `<td colspan="8">${dateLabel}</td>`;
            LeadsActivity.leadTableBody.appendChild(groupRow);

            for (const lead of dateLeads) {
                LeadsActivity.renderLeadRow(lead);
            }
        }
    }

    static renderLeadRow(lead) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
        <div class="lead-status-indicator-wrapper">
            <span 
                class="lead-status-dot ${lead.getLeadStatus() ? "lead-status-active" : "lead-status-lost"}"
                title="${lead.getLeadStatus() ? "Active Lead" : "Lost Lead"}"
            ></span>
            <span class="lead-status-text">
                ${lead.getLeadStatus() ? "Active" : "Lost"}
            </span>
        </div>
    </td>

    <td>
        <div class="name-cell">
            <button class="brief-btn" data-id="${lead.getLeadID()}" title="View lead briefing">⊙</button>
            <span>${lead.getLeadName()}</span>
        </div>
    </td>

    <td>
        <div class="contact-email">${lead.getLeadEmail() || "N/A"}</div>
        <div class="contact-phone">${lead.getLeadPhoneNumber() || "N/A"}</div>
    </td>

    <td>${LeadsActivity.getVehicleText(lead.getLeadVehicleInterest())}</td>

    <td>${LeadsActivity.getVehicleText(lead.getTradeInVehicle())}</td>

    <td>
        <span class="status-badge ${LeadsActivity.getStatusClass(lead)}">
            ${LeadsActivity.getDisplayStatus(lead)}
        </span>
    </td>

    <td>
        <div class="score-cell">
            <span class="${LeadsActivity.getScoreIconClass(lead.getLeadScore())}">
                ${LeadsActivity.getScoreIcon(lead.getLeadScore())}
            </span>
            <span>${Math.round(lead.getLeadScore())}</span>
        </div>
    </td>

    <td>${LeadsActivity.formatDate(lead.getLeadCreatedAt())}</td>
        `;

        row.querySelector(".brief-btn").addEventListener("click", () => {
            LeadsActivity.showLeadBrief(lead);
        });

        // row.querySelector(".modify-btn").addEventListener("click", () => {
        //     LeadsActivity.openLeadDetails(lead.getLeadID());
        // });

        LeadsActivity.leadTableBody.appendChild(row);
    }

    static showLeadBrief(lead) {
        LeadsActivity.selectedLead = lead;

        LeadsActivity.briefContent.innerHTML = `
            <div>
                <div class="brief-item-label">Name</div>
                <div class="brief-item-value">${lead.getLeadName()}</div>
            </div>

            <div>
                <div class="brief-item-label">Email</div>
                <div class="brief-item-value">${lead.getLeadEmail() || "N/A"}</div>
            </div>

            <div>
                <div class="brief-item-label">Phone</div>
                <div class="brief-item-value">${lead.getLeadPhoneNumber() || "N/A"}</div>
            </div>

            <div>
                <div class="brief-item-label">Vehicle Interest</div>
                <div class="brief-item-value">${LeadsActivity.getVehicleText(lead.getLeadVehicleInterest())}</div>
            </div>

            <div>
                <div class="brief-item-label">Trade-in Vehicle</div>
                <div class="brief-item-value">${LeadsActivity.getVehicleText(lead.getTradeInVehicle())}</div>
            </div>

            <div>
                <div class="brief-item-label">Status</div>
                <div class="brief-item-value">${LeadsActivity.getDisplayStatus(lead)}</div>
            </div>

            <div>
                <div class="brief-item-label">Lead Score</div>
                <div class="brief-item-value">${Math.round(lead.getLeadScore())}</div>
            </div>

            <div>
                <div class="brief-item-label">Created At</div>
                <div class="brief-item-value">${LeadsActivity.formatDate(lead.getLeadCreatedAt())}</div>
            </div>

            <div>
                <div class="brief-item-label">Follow-up Date</div>
                <div class="brief-item-value">${LeadsActivity.formatDate(lead.getLeadFollowUpDate())}</div>
            </div>

            <div class="brief-wide">
                <div class="brief-item-label">Notes</div>
                <div class="brief-item-value">${lead.getLeadNotes() || "No notes available."}</div>
            </div>
        `;

        LeadsActivity.modal.classList.remove("hidden");
    }

    static closeLeadBrief = () => {
        LeadsActivity.modal.classList.add("hidden");
        LeadsActivity.selectedLead = null;
    };

    static openLeadDetails(leadID) {
        window.location.href = `activity_lead_details.html?leadID=${leadID}`;
    }

    static groupLeadsByCreatedDate(leads) {
        const grouped = new Map();

        for (const lead of leads) {
            const label = LeadsActivity.getDateGroupLabel(lead.getLeadCreatedAt());

            if (!grouped.has(label)) {
                grouped.set(label, []);
            }

            grouped.get(label).push(lead);
        }

        return grouped;
    }

    static getDateGroupLabel(date) {
        const target = new Date(date);
        target.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (target.getTime() === today.getTime()) {
            return `Today, Created on ${LeadsActivity.formatDate(date)}`;
        }

        if (target.getTime() === yesterday.getTime()) {
            return `Yesterday, Created on ${LeadsActivity.formatDate(date)}`;
        }

        return `Created on ${LeadsActivity.formatDate(date)}`;
    }

    static getVehicleText(vehicle) {
        if (vehicle === null || vehicle === undefined) {
            return "None";
        }

        return vehicle.getFullDescription();
    }

    static getDisplayStatus(lead) {
        if (lead.getLeadStatus() === false) {
            return "Lost";
        }

        const stage = lead.getLeadStage();

        if (stage === "NEW") return "New";
        if (stage === "CONTACTED") return "Contacted";
        if (stage === "VISITED") return "Qualified";
        if (stage === "TEST_DRIVE") return "Test Drive";
        if (stage === "NEGOTIATION") return "Negotiation";
        if (stage === "CLOSED") return "Closed";

        return stage;
    }

    static getStatusClass(lead) {
        if (lead.getLeadStatus() === false) {
            return "status-lost";
        }

        return `status-${String(lead.getLeadStage()).toLowerCase()}`;
    }

    static getScoreIcon(score) {
        if (score >= 80) return "↗";
        if (score >= 50) return "—";
        return "↘";
    }

    static getScoreIconClass(score) {
        if (score >= 80) return "score-up";
        if (score >= 50) return "score-neutral";
        return "score-down";
    }

    static formatDate(date) {
        if (date === null || date === undefined) {
            return "N/A";
        }

        const normalizedDate = new Date(date);
        const year = normalizedDate.getFullYear();
        const month = String(normalizedDate.getMonth() + 1).padStart(2, "0");
        const day = String(normalizedDate.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    LeadsActivity.initialize();
});