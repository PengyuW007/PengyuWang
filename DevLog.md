# Developer Log- AutoTrack Web
**Date:** May 19, 2026

**Module:** Presentation Layer Architecture & Lead Management Interface

## Itinerary

1. Presentation Layer Structure Initialization

* Create the foundational presentation-layer directory structure:

  * Controllers
  * Layouts (HTML)
  * CSS Styling
* Establish clean separation between:

  * HTML Structure
  * Controller Logic
  * Business Logic
  * Persistence Layer

2. Lead List Page Development (Primary Focus)

* Create `leads.html`
* Design the main lead management table
* Add:

  * Search bar
  * Filter controls
  * Sorting options
  * Quick action buttons
* Implement dynamic lead rendering using DOM manipulation

3. LeadListController Implementation

* Begin development of `LeadListController.js`
* Implement:

  * Lead loading
  * Lead rendering
  * Search functionality
  * Filtering logic
  * Sorting logic
  * Event listeners
* Connect controller to:

  * `AccessLeads`
  * `ScoringService`

4. Initial Styling System

* Create:

  * `global.css`
  * `leads.css`
* Establish reusable styling system for:

  * Navigation
  * Tables
  * Buttons
  * Layout containers
  * Form controls

5. Stretch Goal (If Time Permits)

* Begin implementation of:

  * `LeadDetailsController.js`
  * `lead-details.html`
* Prepare structure for:

  * View/Edit mode
  * Scientific follow-up timeline
  * Vehicle interest details
  * Lead scoring display

Architecture Direction

The Web version of AutoTrack is now evolving beyond a direct Android port and is being redesigned to better support browser-based automotive sales workflows.

Key presentation-layer design decisions:

* Dashboard will function as a high-level operational overview page
* Agenda page will function as the actionable daily execution workspace
* Notifications will be implemented as popup toast/dropdown components rather than a dedicated page
* Future Analytics page will support predictive lead analysis and close-deal probability estimation using scoring and machine learning integrations

Technical Goals

* Maintain layered architecture consistency from Android version
* Keep controllers lightweight and UI-focused
* Prevent business logic leakage into presentation layer
* Prepare architecture for future Node.js + Express + MySQL production deployment

Next Major Milestone
Successfully rendering and interacting with live lead data through the browser-based presentation layer using controllers and DOM integration.

---
**Date:** May 16, 2026

**Module:** Business Layer Testing & Scientific Mission Logic

**Status:** AccessLeads Tests Completed; ScoringService Logic Stabilized

## Itinerary

- Continued development and testing for the **AutoTrack Web version**, focusing on the Business Layer and lead management workflow.

- Completed implementation and validation of the `AccessObjects` (Lead, Task, Notification, Vehicle) business controller test suite.
    - Terminal-based Jest execution
    - WebStorm run-button execution
- Verified that the core object access operations behave correctly across the current web-based architecture, including:
  - Object retrieval
  - Object insertion
  - Object update
  - Object deletion
- Business-layer interaction with the underlying data access layer
- Continued testing of `ScoringService`, `PriorityManager`, and `AgendaService` to ensure that the lead scoring, priority ranking, and task generation logic is functioning as expected.

## Issues

- Jest initially failed when running tests from the WebStorm run button due to ES Module parsing and configuration issues.

- The test environment produced an experimental VM Modules warning from Node.js, but the tests were still able to execute correctly after configuration adjustment.

- The actual returned string was formatted as a customer-specific follow-up message, which caused the test expectation to fail.

- The issue was resolved by aligning the mission output format with the expected test behavior while preserving the business meaning of the follow-up recommendation.

## Next

- Continue with the next phase of AutoTrack Web development after completing the current Business Layer testing milestone.

- Begin refining the web version’s integration flow between:
  - Data Access Layer
  - Business Logic Layer
  - UI / Presentation Layer

- Prepare the next implementation step for the AutoTrack Web version, focusing on connecting stabilized business logic to user-facing components.
  - Presentation layer
  - Jest tests for UI components
  - Layout and styling adjustments for web compatibility
  - DOM Interaction implementation, testing and validation