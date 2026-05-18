# AutoTrack CRM Web
AutoTrack is a Customer Relationship Management (CRM) application designed for automotive sales workflows. The project was inspired by real dealership sales experience, where one of the most common challenges for sales representatives is determining which customers should be prioritized for follow-up and when those follow-ups should happen.

Unlike traditional static CRM systems, AutoTrack focuses on workflow prioritization and daily follow-up management. The system dynamically evaluates customer leads based on sales stage, interaction history, timing urgency, and engagement activity in order to help organize daily sales tasks more effectively.

The application was developed as a native Web project using HTML, CSS and JavaScript. Also, follows a layered architecture separating presentation, business logic, persistence, and object models.

---
## Architecture
AutoTrack follows a layered architecture in order to separate user interface logic, business rules, persistence operations, and data models.
### Layered Architecture
```
src/main/
├── res/
│   ├── layout/
│   │   ├── index.html
│   │   ├── leads.html
│   │   ├── lead-details.html
│   │   ├── agenda.html
│   │   └── dashboard.html
│   │
│   └── css/
│       ├── global.css: shared style for the whole app
│       ├── dashboard.css
│       ├── leads.css: only Lead List page style
│       ├── lead-details.css
│       └── agenda.css: only Calendar/Agenda page style
│
└── js/
    └── controllers/
        ├── DashboardController.js
        ├── LeadsController.js
        ├── LeadDetailsController.js
        ├── AgendaController.js
        └── NotificationController.js
```

## Features
### Dashboard
- Number of follow-ups due today
- High-priority leads
- Overdue leads
- Active / lost lead summary

### Lead List
- Search
- Filter by stage, status, vehicle, and division
- Sort by score or follow-up date
- Quick actions: call, email, view details

### Agenda
- Today’s agenda
- Date switcher
- Priority section
- General follow-up section

### Lead Detail
- Customer profile
- Vehicle interest
- Trade-in vehicle
- Interaction history
- Scientific follow-up timeline
- Notes
- Edit mode