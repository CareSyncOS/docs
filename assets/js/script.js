// --- CENTRAL NAVIGATION DATA (The Single Source of Truth!) ---
const DOC_STRUCTURE = [
    // Root Files
    { title: "Introduction", path: "index.html" },
    { title: "Installation", path: "pages/02-local-development-setup.html"},

    // Getting Started (Example from previous turn)
    {
        title: "Getting Started",
        isCollapsible: true,
        children: [
            { title: "Installation", path: "pages/getting-started/01-installation.html" },
            { title: "Configuration", path: "pages/getting-started/02-configuration.html" },
        ]
    },

    // 03-architecture
    {
        title: "Backend Architecture",
        isCollapsible: true,
        children: [
            { title: "01 Overview", path: "pages/03-architecture/01-overview.html" },
            { title: "02 Request Flow", path: "pages/03-architecture/02-request-flow.html" },
            { title: "03 Logging System", path: "pages/03-architecture/03-logging-system.html" },
        ]
    },

    // 04-common-utilities
    {
        title: "Common Utilities",
        isCollapsible: true,
        children: [
            { title: "01 Authentication", path: "pages/04-common-utilities/01-authentication.html" },
            { title: "02 Database Handler", path: "pages/04-common-utilities/02-database-handler.html" },
            { title: "03 Configuration", path: "pages/04-common-utilities/03-configuration.html" },
        ]
    },

    // 05-database-schema
    {
        title: "Database Schema",
        isCollapsible: true,
        children: [
            { title: "01 Overview / ER Diagram", path: "pages/05-database-schema/01-overview-and-er-diagram.html" },
            { title: "02 Core Tables", path: "pages/05-database-schema/02-core-tables.html" },
            { title: "03 Patient Related Tables", path: "pages/05-database-schema/03-patient-related-tables.html" },
            { title: "04 System Tables", path: "pages/05-database-schema/04-system-tables.html" },
            { title: "05 Financial Tables", path: "pages/05-database-schema/05-financial-tables.html" },
            { title: "06 Diagnostics Tables", path: "pages/05-database-schema/06-diagnostics-tables.html" },
            { title: "07 Auxiliary Tables", path: "pages/05-database-schema/07-auxiliary-tables.html" },
        ]
    },

    // 06-admin-module
    {
        title: "Admin Module",
        isCollapsible: true,
        children: [
            { title: "01 Overview", path: "pages/06-admin-module/01-overview.html" },
            { title: "02 Views", path: "pages/06-admin-module/02-views.html" },
            { title: "03 API Endpoints", path: "pages/06-admin-module/03-api-endpoints.html" },
            { title: "04 Client-Side Scripts", path: "pages/06-admin-module/04-client-side-scripts.html" },
        ]
    },

    // 07-reception-module
    {
        title: "Reception Module",
        isCollapsible: true,
        children: [
            { title: "01 Introduction", path: "pages/07-reception-module/01-introduction.html" },
            { title: "02 Local Development Setup", path: "pages/07-reception-module/02-local-development-setup.html" },
        ]
    },
];

// Function to render the navigation recursively
function renderNavigation(items, targetElement) {
    // Get the full URL path for comparison (including any query parameters)
    const currentURL = window.location.pathname + window.location.search;

    const ul = document.createElement('ul');
    ul.classList.add('sidebar-nav');

    items.forEach(item => {
        const li = document.createElement('li');

        if (item.isCollapsible && item.children) {
            // This is a folder/collapsible section
            li.classList.add('collapsible');

            const header = document.createElement('div');
            header.classList.add('collapsible-header');
            header.innerHTML = `${item.title} <i class="fa-solid fa-chevron-right text-xs"></i>`;

            // Add click listener to toggle the folder
            header.addEventListener('click', () => toggleCollapsible(li));

            li.appendChild(header);

            const body = document.createElement('div');
            body.classList.add('collapsible-body');

            // Recursively render children inside the body
            // Note: We pass the target as 'ul' for the recursive call
            const childrenUl = renderNavigation(item.children, body);
            body.appendChild(childrenUl);
            li.appendChild(body);

            // Check if any child is the current active link and open the parent
            const isActive = Array.from(childrenUl.querySelectorAll('.nav-link.active')).length > 0;
            if (isActive) {
                li.classList.add('open');
            }

        } else {
            // This is a single link
            const a = document.createElement('a');
            a.href = item.path;
            a.classList.add('nav-link');
            a.textContent = item.title;

            // FIX: Robust Logic to set the 'active' class
            // If the current full URL contains the relative link path, it's active.
            if (item.path && currentURL.includes(item.path)) {
                a.classList.add('active');
            }

            li.appendChild(a);
        }

        targetElement.appendChild(li);
    });
    return ul;
}

// Function to toggle collapsible sections
function toggleCollapsible(li) {
    li.classList.toggle('open');
}

// --- Main Execution ---
document.addEventListener('DOMContentLoaded', () => {
    const sidebarNav = document.getElementById('sidebarNav');

    // Clear the existing (potentially static) content
    sidebarNav.innerHTML = '';

    // Render the navigation into the sidebar
    DOC_STRUCTURE.forEach(item => {
        const li = document.createElement('li');

        // This logic is mostly redundant with the recursive call, but handles the top level correctly
        if (item.isCollapsible) {
            li.classList.add('collapsible');
            const header = document.createElement('div');
            header.classList.add('collapsible-header');
            header.innerHTML = `${item.title} <i class="fa-solid fa-chevron-right text-xs"></i>`;
            header.addEventListener('click', () => toggleCollapsible(li));

            const body = document.createElement('div');
            body.classList.add('collapsible-body');

            // Render children inside the body's nested ul
            const childrenUl = renderNavigation(item.children, body); // Recursive call starts here
            body.appendChild(childrenUl);

            li.appendChild(header);
            li.appendChild(body);

            // Check if any child is active and open the folder if necessary
            const isActive = childrenUl.querySelector('.nav-link.active');
            if (isActive) {
                li.classList.add('open');
            }

        } else {
            // For non-collapsible root items
            const a = document.createElement('a');
            a.href = item.path;
            a.classList.add('nav-link');
            a.textContent = item.title;

            // Re-run the active check for top-level links
            if (item.path && (window.location.pathname + window.location.search).includes(item.path)) {
                a.classList.add('active');
            }

            li.appendChild(a);
        }
        sidebarNav.appendChild(li);
    });

    // Fallback for the theme toggle (just toggles the class for visual feedback)
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        const icon = themeToggle.querySelector('i');
        if (icon.classList.contains('fa-moon')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
});