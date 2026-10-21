loadCurrentUser();
document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const menuBtn = document.getElementById("menuBtn");
    const pageTitle = document.getElementById("pageTitle");
    const toast = document.getElementById("toast");
    const toastText = document.getElementById("toastText");

    const pageNames = {
        dashboard: "Dashboard",
        domains: "My Subdomains",
        dns: "DNS Settings",
        billing: "Billing",
        profile: "Profile"
    };


    // ============================================
    // MOBILE SIDEBAR
    // ============================================

    menuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("show");
    });

    overlay.addEventListener("click", closeSidebar);

    function closeSidebar() {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
    }


    // ============================================
    // PAGE NAVIGATION
    // ============================================

    const navItems = document.querySelectorAll(".nav-item[data-page]");

    function showPage(page) {

        document.querySelectorAll(".page").forEach(section => {
            section.classList.remove("active-page");
        });

        const selectedPage =
            document.getElementById(page + "Page");

        if (selectedPage) {
            selectedPage.classList.add("active-page");
        }

        navItems.forEach(item => {
            item.classList.toggle(
                "active",
                item.dataset.page === page
            );
        });

        pageTitle.textContent =
            pageNames[page] || "Dashboard";

        closeSidebar();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    navItems.forEach(item => {

        item.addEventListener("click", event => {

            event.preventDefault();

            const page = item.dataset.page;

            window.location.hash = page;

            showPage(page);
        });

    });


    // ============================================
    // HASH ROUTING
    // ============================================

    function loadHashPage() {

        let page =
            window.location.hash.replace("#", "");

        if (!page || !pageNames[page]) {
            page = "dashboard";
        }

        showPage(page);
    }

    window.addEventListener("hashchange", loadHashPage);

    loadHashPage();


    // ============================================
    // COPY DOMAIN
    // ============================================

    document.querySelectorAll(".copy-btn")
        .forEach(button => {

            button.addEventListener("click", async () => {

                const domain =
                    button.dataset.domain;

                try {

                    await navigator.clipboard.writeText(domain);

                    showToast(
                        domain + " copied to clipboard."
                    );

                } catch {

                    showToast(
                        "Could not copy domain."
                    );

                }

            });

        });


    // ============================================
    // MANAGE BUTTONS
    // ============================================

    document.querySelectorAll(".manage-btn, .outline-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                window.location.hash = "dns";

            });

        });


    // ============================================
    // ADD DNS RECORD
    // ============================================

    document
        .querySelector(".add-record")
        ?.addEventListener("click", () => {

            showToast(
                "DNS record form will open here."
            );

        });


    // ============================================
    // NOTIFICATION
    // ============================================

    document
        .getElementById("notificationBtn")
        .addEventListener("click", () => {

            showToast(
                "You have 1 new notification."
            );

        });


    // ============================================
    // PROFILE
    // ============================================

    document
        .getElementById("profileForm")
        ?.addEventListener("submit", event => {

            event.preventDefault();

            document.getElementById(
                "profileMessage"
            ).textContent =
                "Profile changes saved locally. Connect your API to persist them.";

            showToast(
                "Profile updated."
            );

        });


    // ============================================
    // LOGOUT
    // ============================================

    document
        .getElementById("logoutBtn")
        .addEventListener("click", () => {

            /*
             * When JWT authentication is connected:
             *
             * localStorage.removeItem("token");
             * sessionStorage.clear();
             * window.location.href = "login.html";
             */

            localStorage.removeItem("token");
            sessionStorage.clear();

            window.location.href = "login.html";

        });


    // ============================================
    // TOAST
    // ============================================

    let toastTimer;

    function showToast(text) {

        toastText.textContent = text;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {

            toast.classList.remove("show");

        }, 2800);

    }

});

// fetch account data

async function loadCurrentUser() {
    try {
        const response = await fetch('https://localhost:7181/api/Auth/me',
            {
            method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.status === 401) {
            document.location.href = "/home/login";
            return;
        }

        if (!response.ok) {
            throw new Error("Unable to load user information.");
        }

        const user = await response.json();

        
        document.getElementById("sidebarEmail").textContent =
            user.email ?? "";

    } catch (error) {
        console.error(error);
    }
}




document.getElementById("logoutBtn").addEventListener("click", () => {
    fetch('https://localhost:7181/api/Auth/logout', {
        method: 'POST',
        credentials: "include"
    });
    window.location.href="/home/login"
});
