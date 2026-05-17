import Services from "../application/Services.js";
import Lead from "../objects/Lead.js";

export default class AccessLeads {
    constructor() {
        this.dataAccess = Services.getDataAccess();
        this.leads = [];
        this.lead = null;
        this.currLead = 0;
    }

    getLeads(leads) {
        leads.length = 0;
        return this.dataAccess.getLeadSequential(leads);
    }

    getSequential() {
        if (this.leads === null || this.leads.length === 0) {
            this.leads = [];
            this.dataAccess.getLeadSequential(this.leads);
            this.currLead = 0;
        }

        if (this.currLead < this.leads.length) {
            this.lead = this.leads[this.currLead];
            this.currLead++;
        } else {
            this.lead = null;
            this.leads = null;
            this.currLead = 0;
        }

        return this.lead;
    }

    getRandom(id) {
        if (id <= 0) {
            this.lead = null;
            return null;
        }

        const temp = new Lead({
            firstName: "Temp",
            lastName: "Search"
        });

        temp.setLeadID(id);

        this.leads = this.dataAccess.getLeadRandom(temp);
        this.currLead = 0;

        if (this.currLead < this.leads.length) {
            this.lead = this.leads[this.currLead];
            this.currLead++;
        } else {
            this.lead = null;
            this.leads = null;
        }

        return this.lead;
    }

    getLeadByNamePhone(name, phone) {
        const allLeads = [];
        this.dataAccess.getLeadSequential(allLeads);

        if (!name || name.trim() === "" || !phone || phone.trim() === "") {
            return null;
        }

        for (const lead of allLeads) {
            if (
                lead.getLeadName() === name &&
                lead.getLeadPhoneNumber() === phone
            ) {
                return lead;
            }
        }

        return null;
    }

    getLeadByName_Phone(name, phone) {
        return this.getLeadByNamePhone(name, phone);
    }

    getLeadByContactInfo(contactInfo) {
        const allLeads = [];
        this.dataAccess.getLeadSequential(allLeads);

        for (const lead of allLeads) {
            if (
                lead.getLeadPhoneNumber() !== null &&
                lead.getLeadPhoneNumber() === contactInfo
            ) {
                return lead;
            }

            if (
                lead.getLeadEmail() !== null &&
                lead.getLeadEmail().toLowerCase() === String(contactInfo).toLowerCase()
            ) {
                return lead;
            }
        }

        return null;
    }

    getAllLeads() {
        const allLeads = [];
        this.dataAccess.getLeadSequential(allLeads);
        return allLeads;
    }

    getLeadsByDate(date) {
        const allLeads = [];
        const filteredLeads = [];

        this.dataAccess.getLeadSequential(allLeads);

        if (date !== null && date !== undefined) {
            const targetDate = this.#formatDate(date);

            for (const lead of allLeads) {
                if (lead.getLeadFollowUpDate() !== null) {
                    const leadDate = this.#formatDate(lead.getLeadFollowUpDate());

                    if (targetDate === leadDate) {
                        filteredLeads.push(lead);
                    }
                }
            }
        }

        return filteredLeads;
    }

    insertLead(currLead) {
        return this.dataAccess.insertLead(currLead);
    }

    updateLead(currLead) {
        return this.dataAccess.updateLead(currLead);
    }

    deleteLead(currLead) {
        return this.dataAccess.deleteLead(currLead);
    }

    getLeadsFiltered(query, status, stage, division, year, make, model) {
        const allLeads = [];
        this.dataAccess.getLeadSequential(allLeads);

        allLeads.sort((l1, l2) => l2.getLeadID() - l1.getLeadID());

        const filtered = [];

        for (const lead of allLeads) {
            if (
                this.#matchesSearch(lead, query) &&
                this.#matchesStatus(lead, status) &&
                this.#matchesStage(lead, stage) &&
                this.#matchesDivision(lead, division) &&
                this.#matchesCar(lead, year, make, model)
            ) {
                filtered.push(lead);
            }
        }

        return filtered;
    }

    #matchesSearch(lead, query) {
        if (query === null || query === undefined || query.trim() === "") {
            return true;
        }

        const lowerQuery = query.toLowerCase().trim();
        const fullName = `${lead.getLeadFirstName()} ${lead.getLeadLastName()}`.toLowerCase();
        const phone = lead.getLeadPhoneNumber() !== null ? lead.getLeadPhoneNumber() : "";

        return fullName.includes(lowerQuery) || phone.includes(lowerQuery);
    }

    #matchesStatus(lead, status) {
        if (
            status === null ||
            status === undefined ||
            status.trim() === "" ||
            status.toLowerCase().includes("all")
        ) {
            return true;
        }

        const isActive = status.toLowerCase() === "active";
        return lead.getLeadStatus() === isActive;
    }

    #matchesStage(lead, stage) {
        if (
            stage === null ||
            stage === undefined ||
            stage.trim() === "" ||
            stage.toLowerCase().includes("all")
        ) {
            return true;
        }

        const leadStage = lead.getLeadStage();

        return leadStage !== null &&
            leadStage !== undefined &&
            leadStage.toLowerCase() === stage.toLowerCase();
    }

    #matchesDivision(lead, division) {
        if (
            division === null ||
            division === undefined ||
            division.trim() === "" ||
            division.toLowerCase().includes("all")
        ) {
            return true;
        }

        const leadDivision = lead.getLeadDivision();

        return leadDivision !== null &&
            leadDivision !== undefined &&
            leadDivision.toLowerCase() === division.toLowerCase();
    }

    #matchesCar(lead, year, make, model) {
        const isYearFiltered =
            year !== null &&
            year !== undefined &&
            year.toLowerCase() !== "year" &&
            year.trim() !== "";

        const isMakeFiltered =
            make !== null &&
            make !== undefined &&
            make.toLowerCase() !== "make" &&
            make.trim() !== "";

        const isModelFiltered =
            model !== null &&
            model !== undefined &&
            model.toLowerCase() !== "model" &&
            model.trim() !== "";

        if (!isYearFiltered && !isMakeFiltered && !isModelFiltered) {
            return true;
        }

        const vehicle = lead.getLeadVehicleInterest();

        if (vehicle === null || vehicle === undefined) {
            return false;
        }

        const yearMatch =
            !isYearFiltered ||
            (vehicle.getYear() !== null &&
                vehicle.getYear() !== undefined &&
                vehicle.getYear().toLowerCase() === year.toLowerCase());

        const makeMatch =
            !isMakeFiltered ||
            (vehicle.getMake() !== null &&
                vehicle.getMake() !== undefined &&
                vehicle.getMake().toLowerCase() === make.toLowerCase());

        const modelMatch =
            !isModelFiltered ||
            (vehicle.getModel() !== null &&
                vehicle.getModel() !== undefined &&
                vehicle.getModel().toLowerCase() === model.toLowerCase());

        return yearMatch && makeMatch && modelMatch;
    }

    #formatDate(date) {
        const normalizedDate = new Date(date);
        const year = normalizedDate.getFullYear();
        const month = String(normalizedDate.getMonth() + 1).padStart(2, "0");
        const day = String(normalizedDate.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }
}