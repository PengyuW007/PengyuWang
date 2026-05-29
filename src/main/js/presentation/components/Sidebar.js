export default class Sidebar {
    static initialize() {
        const sideNav = document.getElementById("sideNav");
        const appShell = document.getElementById("appShell");
        const toggleButton = document.getElementById("sidebarToggleBtn");

        if (!sideNav || !appShell || !toggleButton) {
            return;
        }

        const collapsed = localStorage.getItem("sidebarCollapsed");

        if (collapsed === "true") {
            sideNav.classList.add("collapsed");
            appShell.classList.add("sidebar-collapsed");
            toggleButton.textContent = "»";
            toggleButton.title = "Expand sidebar";
        } else {
            toggleButton.textContent = "«";
            toggleButton.title = "Collapse sidebar";
        }

        toggleButton.addEventListener("click", () => {
            sideNav.classList.toggle("collapsed");
            appShell.classList.toggle("sidebar-collapsed");

            const isCollapsed = sideNav.classList.contains("collapsed");

            toggleButton.textContent = isCollapsed ? "»" : "«";
            toggleButton.title = isCollapsed ? "Expand sidebar" : "Collapse sidebar";

            localStorage.setItem("sidebarCollapsed", String(isCollapsed));
        });
    }
}