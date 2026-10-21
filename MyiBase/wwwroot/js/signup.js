
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupForm");
    const message = document.getElementById("formMessage");

    const fields = {
        fullName: document.getElementById("fullName"),
        email: document.getElementById("email"),
        otp: document.getElementById("otp"),
        password: document.getElementById("password"),
        confirmPassword: document.getElementById("confirmPassword")
    };

    const SIGNUP_API_URL =
        "https://localhost:7181/api/Auth/register";

    const SEND_OTP_API_URL =
        "https://localhost:7181/api/email-otp/send";

    // Show/hide password
    document.querySelectorAll(".toggle").forEach(button => {
        button.addEventListener("click", () => {
            const input = document.getElementById(button.dataset.target);
            const visible = input.type === "text";

            input.type = visible ? "password" : "text";

            button.setAttribute(
                "aria-label",
                visible ? "Show password" : "Hide password"
            );

            button.textContent = visible ? "◉" : "◎";
        });
    });

    // Google signup placeholder
    document.getElementById("googleSignup")
        ?.addEventListener("click", () => {
            message.className = "message error";
            message.textContent =
                "Google sign-up is not configured yet.";
        });

    // Send OTP
    document.getElementById("sendOtp")
        .addEventListener("click", async () => {
            const email = fields.email.value.trim();
            const emailError = document.getElementById("emailError");
            const sendOtpBtn = document.getElementById("sendOtp");

            emailError.textContent = "";
            emailError.style.color = "red";

            if (!email || !fields.email.checkValidity()) {
                emailError.textContent =
                    "Please enter a valid email address.";
                fields.email.focus();
                return;
            }

            sendOtpBtn.disabled = true;
            sendOtpBtn.textContent = "Sending...";

            try {
                const response = await fetch(SEND_OTP_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email })
                });

                const result = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        result.title ||
                        "Failed to send OTP."
                    );
                }

                emailError.style.color = "green";
                emailError.textContent =
                    result.message || "OTP sent successfully.";

            } catch (err) {
                console.error("OTP Error:", err);

                emailError.style.color = "red";
                emailError.textContent =
                    err.message || "Unable to connect to the server.";
            } finally {
                sendOtpBtn.disabled = false;
                sendOtpBtn.textContent = "Send OTP";
            }
        });

    // Registration form submission
    form.addEventListener("submit", async event => {
        event.preventDefault();

        document.querySelectorAll(".field small:not(.hint)")
            .forEach(el => el.textContent = "");

        document.querySelectorAll(".input")
            .forEach(el => el.classList.remove("invalid"));

        message.textContent = "";
        message.className = "message";

        const name = fields.fullName.value.trim();
        const email = fields.email.value.trim();
        const otp = fields.otp.value.trim();
        const password = fields.password.value;
        const confirm = fields.confirmPassword.value;

        let valid = true;

        function showError(id, text, field) {
            document.getElementById(id).textContent = text;

            field.closest(".field")
                .querySelector(".input")
                .classList.add("invalid");

            valid = false;
        }

        if (name.length < 2) {
            showError(
                "nameError",
                "Please enter your full name.",
                fields.fullName
            );
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError(
                "emailError",
                "Enter a valid email address.",
                fields.email
            );
        }

        if (!/^[0-9]{6}$/.test(otp)) {
            showError(
                "otpError",
                "Enter the valid 6-digit OTP.",
                fields.otp
            );
        }

        if (password.length < 8) {
            showError(
                "passwordError",
                "Password must be at least 8 characters.",
                fields.password
            );
        }

        if (confirm !== password) {
            showError(
                "confirmError",
                "Passwords do not match.",
                fields.confirmPassword
            );
        }

        if (!valid) {
            message.className = "message error";
            message.textContent =
                "Please correct the highlighted fields.";
            return;
        }

        const submit = form.querySelector('[type="submit"]');
        const originalText = submit.textContent;

        submit.disabled = true;
        submit.textContent = "Creating account...";

        try {
            const response = await fetch(SIGNUP_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    //fullName: name,
                    email,
                    password,
                    otp
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.title ||
                    "Unable to create account or alredy exist."
                );
            }

            message.className = "message success";
            message.textContent =
                data.message || "Account created successfully.";

            form.reset();

            setTimeout(() => {
                window.location.href = "/home/login";
            }, 1000);

        } catch (err) {
            console.error("Registration Error:", err);

            message.className = "message error";
            message.textContent =
                err.message || "Could not connect to the server.";
        } finally {
            submit.disabled = false;
            submit.textContent = originalText;
        }
    });
});
