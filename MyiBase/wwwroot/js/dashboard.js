// ============================================
// LOAD CURRENT USER
// ============================================

loadCurrentUser();

document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const menuBtn = document.getElementById("menuBtn");
    const pageTitle = document.getElementById("pageTitle");
    const toast = document.getElementById("toast");
    const toastText = document.getElementById("toastText");


    // ============================================
    // PAGE NAMES
    // ============================================

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

    menuBtn?.addEventListener("click", () => {
        sidebar?.classList.toggle("open");
        overlay?.classList.toggle("show");
    });


    overlay?.addEventListener("click", closeSidebar);


    function closeSidebar() {
        sidebar?.classList.remove("open");
        overlay?.classList.remove("show");
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

    //=============================================
    // Add checkout subdomains
    //=============================================

    const domainList = document.getElementById("domain-list");

    let id = 1;

    while (localStorage.getItem(`subd_${id}`) !== null) {

        const name = localStorage.getItem(`subd_${id}`);

        const domainRow = document.createElement("div");

        domainRow.className = "domain-row";

        domainRow.innerHTML = `
            <div class="domain-symbol">
                ${name.substring(0, 2).toUpperCase()}
            </div>

            <div class="domain-info">

                <strong>
                    ${name}
                </strong>

                <span>
                    ${name}.myibase.xyz
                </span>

            </div>

            <span class="connected">

                <i></i>
                Connected

            </span>

            <div class="domain-actions">

                <button
                    title="Copy domain"
                    class="copy-btn"
                    data-domain="${name}.myibase.xyz">

                    ⧉

                </button>

                <button
                    title="Manage"
                    id="manage-btn"
                    data-id="${id}">

                    checkout

                </button>

            </div>
        `;

        domainList.appendChild(domainRow);

        id++;
    }

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

    document.querySelectorAll("#manage-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                createOrder();

            });

        });

    document.querySelectorAll('.outline-btn').forEach(button => {

        button.addEventListener("click", () => {

            window.location.href = "https://localhost:7084/user/mydashboard#dns";

        });

    });

    // ============================================
    // ADD DNS RECORD
    // ============================================
    var target = document.getElementById("target-value");
    
    document
        .querySelector(".add-record")
        ?.addEventListener("click", () => {
            target.readOnly = true;

            var response =  fetch('https://localhost:7181/api/cloudflare/create-subdomain', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subdomain: target.dataset.subd,
                    target: target.value
                })

            })


            window.location.href = "http://localhost:7084/user/mydashboard#dns";

            
        });

    var deleted = document.querySelector(".delete-record");

    document
        .querySelector(".delete-record")
        ?.addEventListener("click", () => {

            var subd = deleted.dataset.subd;

            var response = fetch(
                `https://localhost:7181/api/cloudflare/delete/${subd}`,
                {
                    method: 'DELETE',
                    credentials: "include"
                }
            );
            
            window.location.href = "http://localhost:7084/user/mydashboard#dns";

        });
     
    // ============================================
    // NOTIFICATION
    // ============================================

    document
        .getElementById("notificationBtn")
        ?.addEventListener("click", () => {

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
        ?.addEventListener("click", async () => {

            try {

                await fetch(
                    "https://localhost:7181/api/Auth/logout",
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Accept": "application/json"
                        }
                    }
                );

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            } finally {

                localStorage.removeItem("token");
                sessionStorage.clear();

                window.location.href =
                    "/home/login";
            }

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


// ============================================
// LOAD CURRENT USER
// ============================================

async function loadCurrentUser() {

    try {

        const response = await fetch(
            "https://localhost:7181/api/Auth/me",
            {
                method: "GET",

                // IMPORTANT:
                // Browser automatically sends
                // HttpOnly authentication cookie
                credentials: "include",

                headers: {
                    "Accept": "application/json"
                }
            }
        );


        // ============================================
        // NOT LOGGED IN
        // ============================================

        if (response.status === 401) {

            window.location.href =
                "/home/login";

            return;
        }


        // ============================================
        // OTHER API ERROR
        // ============================================

        if (!response.ok) {

            throw new Error(
                "Unable to load user information."
            );
        }


        // ============================================
        // GET USER
        // ============================================

        const user =
            await response.json();


        console.log(
            "Logged-in user:",
            user
        );


        // ============================================
        // DISPLAY EMAIL
        // ============================================

        const sidebarEmail =
            document.getElementById("sidebarEmail");


        if (sidebarEmail) {

            sidebarEmail.textContent =
                user.email ?? "";
        }


        // Optional user fields
        const userName =
            document.getElementById("userName");

        if (userName) {

            userName.textContent =
                user.name ??
                user.userName ??
                "";
        }

    } catch (error) {

        console.error(
            "Current user error:",
            error
        );

    }
}


// ============================================
// RAZORPAY
// ============================================

const API_URL =
    "https://localhost:7181";


// ============================================
// RAZORPAY TEST KEY
// ============================================

const RAZORPAY_KEY_ID =
    "rzp_test_ToxTt3LBRWuIsJ";


const payButton =
    document.getElementById("manage-btn");


// ============================================
// CREATE ORDER
// ============================================

async function createOrder() {

    const productElement =
        document.querySelector(
            ".domain-info strong"
        );


    if (!productElement) {

        console.error(
            "Product/Subdomain element not found."
        );

        return;
    }


    const productId =
        String(productElement.textContent).trim();


    if (
        !RAZORPAY_KEY_ID ||
        RAZORPAY_KEY_ID ===
        "YOUR_RAZORPAY_TEST_KEY_ID"
    ) {

        console.error(
            "Razorpay Key ID is missing."
        );

        return;
    }


    if (payButton) {
        payButton.disabled = true;
    }


    try {

        // ============================================
        // STEP 1: CREATE ORDER
        // ============================================

        const orderResponse =
            await fetch(
                `${API_URL}/api/payment/create-order`,
                {
                    method: "POST",

                    credentials: "include",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body: JSON.stringify({
                        subd: productId
                    })
                }
            );


        const orderData =
            await orderResponse.json();


        if (!orderResponse.ok) {

            throw new Error(
                orderData.message ||
                orderData.title ||
                JSON.stringify(orderData)
            );
        }


        console.log(
            "Order created:",
            orderData
        );


        // ============================================
        // ORDER DETAILS
        // ============================================

        const order_id =
            orderData.id ??
            orderData.orderId;


        const amount =
            orderData.amount;


        const currency =
            orderData.currency ||
            "INR";


        if (!order_id) {

            throw new Error(
                "Order ID missing from API response."
            );
        }


        if (
            amount === undefined ||
            amount === null
        ) {

            throw new Error(
                "Amount missing from API response."
            );
        }


        // ============================================
        // STEP 2: RAZORPAY CHECKOUT
        // ============================================

        const options = {

            key:
                RAZORPAY_KEY_ID,

            order_id:
                order_id,

            amount:
                Number(amount),

            currency:
                currency,

            name:
                "MyiBase",

            description:
                "Subdomain Purchase",


            // ============================================
            // PAYMENT SUCCESS
            // ============================================

            handler:
                async function (paymentResponse) {

                    try {

                        console.log(
                            "Payment response:",
                            paymentResponse
                        );


                        // ============================================
                        // STEP 3: VERIFY PAYMENT
                        // ============================================

                        const verifyResponse =
                            await fetch(
                                `${API_URL}/api/payment/verify`,
                                {
                                    method: "POST",

                                    credentials: "include",

                                    headers: {
                                        "Content-Type":
                                            "application/json",

                                        "Accept":
                                            "application/json"
                                    },

                                    body:
                                        JSON.stringify({

                                            order_id:
                                                paymentResponse
                                                    .razorpay_order_id,

                                            payment_id:
                                                paymentResponse
                                                    .razorpay_payment_id,

                                            signature:
                                                paymentResponse
                                                    .razorpay_signature

                                        })
                                }
                            );


                        const verifyData =
                            await verifyResponse.json();


                        if (!verifyResponse.ok) {

                            throw new Error(
                                verifyData.message ||
                                verifyData.title ||
                                JSON.stringify(
                                    verifyData
                                )
                            );
                        }


                        console.log(
                            "Payment verified:",
                            verifyData
                        );


                        // SUCCESS

                        //alert(
                        //    "Payment successful!"
                        //);


                        // remove purcheged cart item
                        const domain = productId;

                        for (let i = 0; i < localStorage.length; i++) {

                            const key = localStorage.key(i);

                            if (key?.startsWith("subd_") &&
                                localStorage.getItem(key) === domain) {

                                localStorage.removeItem(key);
                                break;
                            }
                        }

                        // Reload dashboard
                        window.location.reload();


                    } catch (error) {

                        console.error(
                            "Payment verification error:",
                            error
                        );


                        alert(
                            error.message ||
                            "Payment verification failed."
                        );

                    } finally {

                        if (payButton) {
                            payButton.disabled = false;
                        }

                    }

                },


            // ============================================
            // MODAL DISMISSED
            // ============================================

            modal: {

                ondismiss:
                    function () {

                        if (payButton) {
                            payButton.disabled = false;
                        }

                    }

            },


            // ============================================
            // RAZORPAY THEME
            // ============================================

            theme: {

                color:
                    "#3399cc"

            }

        };


        // ============================================
        // OPEN RAZORPAY
        // ============================================

        const checkout =
            new Razorpay(options);


        checkout.on(
            "payment.failed",
            function (response) {

                console.error(
                    "Payment failed:",
                    response
                );


                alert(
                    "Payment failed. Please try again."
                );


                if (payButton) {
                    payButton.disabled = false;
                }

            }
        );


        checkout.open();


    } catch (error) {

        console.error(
            "Create order error:",
            error
        );


        alert(
            error.message ||
            "Unable to create payment order."
        );


        if (payButton) {
            payButton.disabled = false;
        }

    }

}


async function loadCurrentUser() {

    try {

        const response = await fetch(
            "https://localhost:7181/api/Auth/me",
            {
                method: "GET",

                credentials: "include",

                headers: {
                    "Accept": "application/json"
                }
            }
        );


        console.log(
            "Auth API Status:",
            response.status
        );


        // ============================================
        // NOT LOGGED IN
        // ============================================

        if (response.status === 401) {

            console.log(
                "User is not authenticated."
            );

            window.location.href =
                "/home/login";

            return;
        }


        // ============================================
        // OTHER ERROR
        // ============================================

        if (!response.ok) {

            throw new Error(
                `Unable to load user information.Status: ${ response.status } `
            );
        }


        // ============================================
        // GET USER
        // ============================================

        const user =
            await response.json();


        console.log(
            "Logged-in User:",
            user
        );


        // ============================================
        // USER NAME
        // ============================================

        const name =
            user.name ??
            user.userName ??
            user.fullName ??
            "User";


        // ============================================
        // USER EMAIL
        // ============================================

        const email =
            user.email ??
            "";


        // ============================================
        // INITIALS
        // ============================================

        const initials =
            name
                .trim()
                .split(/\s+/)
                .map(word => word.charAt(0))
                .join("")
                .substring(0, 2)
                .toUpperCase();


        // ============================================
        // SIDEBAR
        // ============================================

        const sidebarName =
            document.getElementById(
                "sidebarName"
            );

        const sidebarEmail =
            document.getElementById(
                "sidebarEmail"
            );

        const sidebarAvatar =
            document.getElementById(
                "sidebarAvatar"
            );


        if (sidebarName) {
            sidebarName.textContent = name;
        }

        if (sidebarEmail) {
            sidebarEmail.textContent = email;
        }

        if (sidebarAvatar) {
            sidebarAvatar.textContent = initials;
        }


        // ============================================
        // TOP USER
        // ============================================

        const topUserName =
            document.getElementById(
                "topUserName"
            );

        const topAvatar =
            document.getElementById(
                "topAvatar"
            );


        if (topUserName) {
            topUserName.textContent = name;
        }

        if (topAvatar) {
            topAvatar.textContent = initials;
        }


        // ============================================
        // WELCOME
        // ============================================

        const welcomeName =
            document.getElementById(
                "welcomeName"
            );


        if (welcomeName) {
            welcomeName.textContent = name;
        }


        // ============================================
        // PROFILE
        // ============================================

        const profileName =
            document.getElementById(
                "profileName"
            );

        const profileEmail =
            document.getElementById(
                "profileEmail"
            );


        if (profileName) {
            profileName.textContent = name;
        }

        if (profileEmail) {
            profileEmail.textContent = email;
        }


        // ============================================
        // PROFILE FORM
        // ============================================

        const profileFullName =
            document.getElementById(
                "profileFullName"
            );

        const profileEmailInput =
            document.getElementById(
                "profileEmailInput"
            );


        if (profileFullName) {
            profileFullName.value = name;
        }

        if (profileEmailInput) {
            profileEmailInput.value = email;
        }


    } catch (error) {

        console.error(
            "Current user error:",
            error
        );

    }
}


