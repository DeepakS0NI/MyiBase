// Please see documentation at https://learn.microsoft.xyz/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
document.addEventListener("DOMContentLoaded", () => {
    const domainForm = document.getElementById("domainForm");
    const domainInput = document.getElementById("domainName");
    const searchMessage = document.getElementById("searchMessage");
    const toastEl = document.getElementById("siteToast");
    const toastText = document.getElementById("toastText");
    const toast = window.bootstrap ? bootstrap.Toast.getOrCreateInstance(toastEl) : null;

    // Change this to your deployed FastAPI URL before production.
    const API_BASE_URL = "https://api.myibase.xyz";

    document.getElementById("year").textContent = new Date().getFullYear();

    function showToast(message) {
        toastText.textContent = message;
        if (toast) toast.show();
        else alert(message);
    }

    function showSearchMessage(message, type = "") {
        searchMessage.replaceChildren();
        searchMessage.classList.remove("error", "success", "taken");
        if (type) searchMessage.classList.add(type);
        searchMessage.textContent = message;
    }

    domainForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = domainInput.value.trim().toLowerCase();
        const valid = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/.test(name);

        if (!valid) {
            showSearchMessage("Use 1–40 letters, numbers, or hyphens. Start and end with a letter or number.", "error");
            domainInput.focus();
            return;
        }

        const button = domainForm.querySelector('button[type="submit"]');
        const originalButton = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Checking...';
        showSearchMessage("Checking availability...");

        try {
            const response = await fetch(`${API_BASE_URL}/api/Auth/checksubd/${encodeURIComponent(name)}`, {
                method: "GET",
                headers: { "Accept": "application/json" }
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.detail || "Could not check this subdomain. Please try again.");

            if (data === true) {
               
                const line = document.createElement("div");
                line.className = "availability-result available-result";
                const text = document.createElement("span");
                text.textContent = `✓ ${name}.myibase.xyz is available!`;
                const buy = document.createElement("button");
                buy.className = "btn btn-gradient btn-sm ms-2";
                buy.id = "addtocart";
                //buy.href = `https://myibase.xyz/user/mydashboard`;
                buy.textContent = "add to cart";
                line.append(text, buy);
                searchMessage.appendChild(line);
            } else {
                showSearchMessage(`✕ ${name}.myibase.xyz is already taken. Try another name.`, "taken");
            }
        } catch (error) {
            showSearchMessage(error.message || "Unable to connect to the server. Please try again.", "error");
        } finally {
            button.disabled = false;
            button.innerHTML = originalButton;
        }

        document.getElementById("addtocart").addEventListener("click", () => {

            
            // Find next available ID
            let id = 1;

            while (localStorage.getItem(`subd_${id}`) !== null) {
                id++;
            }

            // Save in localStorage
            localStorage.setItem(`subd_${id}`, name);

            console.log("Saved:", `subd_${id}`, name);

            // Redirect after saving
            window.location.href = "https://myibase.xyz/user/mydashboard";
        });

    });

  
    document.getElementById("newsletterForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const email = document.getElementById("newsletterEmail");
        if (!email.checkValidity()) {
            email.reportValidity();
            return;
        }
        document.getElementById("newsletterMessage").textContent =
            "Thanks! Newsletter signup needs to be connected to your backend.";
        email.value = "";
    });

    document.querySelectorAll('a[href="#search"]').forEach((link) => {
        link.addEventListener("click", () => {
            setTimeout(() => domainInput.focus({ preventScroll: true }), 250);
        });
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener("click", () => {
            const nav = document.getElementById("mainNav");
            if (nav.classList.contains("show") && window.bootstrap) {
                bootstrap.Collapse.getOrCreateInstance(nav).hide();
            }
        });
    });
});


