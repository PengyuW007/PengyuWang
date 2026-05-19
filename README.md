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
        ├── Analystics.js 
        └── NotificationController.js
```

## Features
### Dashboard
summary / overview / KPI page
- Number of follow-ups due today
- High-priority leads
- Overdue leads
- Active / lost lead summary
- Top 3 urgent leads preview

### Analytics
- Lead score distribution
- Close-deal probability
- Conversion by stage
- Follow-up completion rate
- Vehicle interest trends
- Sales pipeline insights
- Future ML/deep learning prediction

### Lead List
- Search
- Filter by stage, status, vehicle, and division
- Sort by score or follow-up date
- Quick actions: call, email, view details

### Agenda
- Today/Selected date’s agenda
- Date switcher
- Priority queue for that date
- General follow-up section
- Completed / pending task state
- Click lead to open details

### Lead Detail
- Customer profile
- Vehicle interest
- Trade-in vehicle
- Interaction history
- Scientific follow-up timeline
- Notes
- Edit mode