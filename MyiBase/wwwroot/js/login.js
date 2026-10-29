document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const message = document.getElementById("formMessage");

    const forgotPassword =
        document.getElementById("forgotPassword");

    const googleLogin =
        document.getElementById("googleLogin");

    const submit =
        form.querySelector(".submit");


    // ============================================
    // API URLS
    // ============================================

    const LOGIN_API_URL =
        "https://api.myibase.xyz/api/Auth/login";

    const SEND_OTP_API_URL =
        "https://api.myibase.xyz/api/email-otp/send";

    const FORGOT_PASSWORD_API_URL =
        "https://api.myibase.xyz/api/Auth/forget-password";


    // ============================================
    // STATE
    // ============================================

    let forgotMode = false;


    // ============================================
    // SHOW / HIDE PASSWORD
    // ============================================

    document.querySelectorAll(".toggle").forEach(button => {

        button.addEventListener("click", () => {

            const input =
                document.getElementById(button.dataset.target);

            if (!input) {
                return;
            }

            const visible =
                input.type === "text";

            input.type =
                visible ? "password" : "text";

            button.textContent =
                visible ? "◉" : "◎";

        });

    });


    // ============================================
    // GOOGLE LOGIN
    // ============================================

    if (googleLogin) {

        googleLogin.addEventListener("click", () => {

            message.className =
                "message error";

            message.textContent =
                "Google login is ready in UI. Connect Google OAuth in your backend.";

        });

    }


    // ============================================
    // CREATE OTP FIELD
    // ============================================

    function createOtpField() {

        const otpField =
            document.createElement("div");

        otpField.className =
            "field";

        otpField.id =
            "otpField";

        otpField.innerHTML = `
            <label for="otp">OTP <b>*</b></label>

            <div class="input">

                <span>
                     ▣
                </span>
                <input
                    type="text"
                    id="otp"
                    class="input"
                    placeholder="Enter OTP"
                    maxlength="6"
                    autocomplete="one-time-code"
                    required
                >

            </div>

            <small id="otpError"></small>
        `;

        return otpField;
    }


    // ============================================
    // CREATE NEW PASSWORD FIELD
    // ============================================

    function createNewPasswordField() {

        const newPasswordField =
            document.createElement("div");

        newPasswordField.className =
            "field";

        newPasswordField.id =
            "newPasswordField";

        newPasswordField.innerHTML = `
            <label for="newPassword">
                New Password <b>*</b>
            </label>

            <div class="input">

                 <span>
                     ▣
                 </span>

                <input
                    type="password"
                    id="newPassword"
                    class="input"
                    placeholder="Enter new password"
                    autocomplete="new-password"
                    required
                >

                <button
                    type="button"
                    class="toggle"
                    data-target="newPassword"
                >
                    ◉
                </button>

            </div>

            <small id="newPasswordError"></small>
        `;

        return newPasswordField;
    }


    // ============================================
    // ENTER FORGOT PASSWORD MODE
    // ============================================

    async function enterForgotPasswordMode() {

        const emailValue =
            email.value.trim();


        // ========================================
        // EMAIL VALIDATION
        // ========================================

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(emailValue)
        ) {

            const emailError =
                document.getElementById("emailError");

            if (emailError) {

                emailError.textContent =
                    "Enter a valid email address.";

            }

            email
                .closest(".field")
                .querySelector(".input")
                .classList.add("invalid");

            message.className =
                "message error";

            message.textContent =
                "Enter your email address first.";

            email.focus();

            return;
        }


        // ========================================
        // SEND OTP
        // ========================================

        const originalButtonText =
            submit.innerHTML;

        submit.disabled = true;

        submit.innerHTML =
            "<span>Sending OTP...</span>";

        message.className =
            "message";

        message.textContent =
            "Sending OTP to your email...";


        try {

            const response =
                await fetch(
                    SEND_OTP_API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Accept":
                                "*/*"
                        },

                        body: JSON.stringify({

                            email: emailValue

                        })
                    }
                );


            const data =
                await response
                    .json()
                    .catch(() => ({}));


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    data.title ||
                    "Unable to send OTP."
                );

            }


            // ====================================
            // OTP SENT SUCCESSFULLY
            // ====================================

            forgotMode = true;


            // Hide normal password

            const passwordField =
                password.closest(".field");

            passwordField.style.display =
                "none";


            // ====================================
            // ADD OTP FIELD
            // ====================================

            const otpField =
                createOtpField();

            passwordField.parentNode.insertBefore(
                otpField,
                passwordField
            );


            // ====================================
            // ADD NEW PASSWORD FIELD
            // ====================================

            const newPasswordField =
                createNewPasswordField();

            passwordField.parentNode.insertBefore(
                newPasswordField,
                passwordField
            );


            // ====================================
            // CHANGE BUTTON
            // ====================================

            submit.innerHTML =
                "<span>Change Password</span>";


            // ====================================
            // HIDE GOOGLE LOGIN
            // ====================================

            if (googleLogin) {

                googleLogin.style.display =
                    "none";

            }


            // ====================================
            // CHANGE FORGOT LINK
            // ====================================

            forgotPassword.textContent =
                "Back to Login";


            // ====================================
            // SUCCESS MESSAGE
            // ====================================

            message.className =
                "message success";

            message.textContent =
                data.message ||
                "OTP sent successfully. Check your email.";


            // ====================================
            // NEW PASSWORD TOGGLE
            // ====================================

            const newPasswordToggle =
                newPasswordField.querySelector(".toggle");


            newPasswordToggle.addEventListener(
                "click",
                () => {

                    const newPassword =
                        document.getElementById(
                            "newPassword"
                        );

                    const visible =
                        newPassword.type === "text";

                    newPassword.type =
                        visible
                            ? "password"
                            : "text";

                    newPasswordToggle.textContent =
                        visible
                            ? "◉"
                            : "◎";

                }
            );


            // Focus OTP

            document
                .getElementById("otp")
                .focus();


        }
        catch (error) {

            message.className =
                "message error";

            message.textContent =
                error.message ||
                "Could not connect to the server.";

        }
        finally {

            submit.disabled = false;

            if (!forgotMode) {

                submit.innerHTML =
                    originalButtonText;

            }

        }

    }


    // ============================================
    // BACK TO LOGIN
    // ============================================

    function backToLogin() {

        forgotMode = false;


        // Remove OTP

        const otpField =
            document.getElementById("otpField");

        if (otpField) {

            otpField.remove();

        }


        // Remove new password

        const newPasswordField =
            document.getElementById(
                "newPasswordField"
            );

        if (newPasswordField) {

            newPasswordField.remove();

        }


        // Show password

        password
            .closest(".field")
            .style.display = "";


        // Restore login button

        submit.innerHTML =
            "<span>Login</span>";


        // Show Google login

        if (googleLogin) {

            googleLogin.style.display =
                "";

        }


        // Restore forgot link

        forgotPassword.textContent =
            "Forgot Password?";


        // Clear message

        message.textContent = "";

        message.className =
            "message";


        // Clear OTP/new password if any

        password.value = "";

    }


    // ============================================
    // FORGOT PASSWORD CLICK
    // ============================================

    forgotPassword.addEventListener(
        "click",
        async event => {

            event.preventDefault();


            // If already in forgot mode,
            // go back to login

            if (forgotMode) {

                backToLogin();

                return;

            }


            // Otherwise send OTP

            await enterForgotPasswordMode();

        }
    );


    // ============================================
    // LOGIN / CHANGE PASSWORD SUBMIT
    // ============================================

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            // ========================================
            // CLEAR ERRORS
            // ========================================

            document
                .querySelectorAll(".field small")
                .forEach(element => {

                    element.textContent = "";

                });


            document
                .querySelectorAll(".input")
                .forEach(element => {

                    element.classList.remove(
                        "invalid"
                    );

                });


            message.textContent = "";

            message.className =
                "message";


            const emailValue =
                email.value.trim();


            // ========================================
            // FORGOT PASSWORD MODE
            // ========================================

            if (forgotMode) {

                const otp =
                    document
                        .getElementById("otp")
                        .value
                        .trim();


                const newPassword =
                    document
                        .getElementById(
                            "newPassword"
                        )
                        .value;


                let valid = true;


                // ====================================
                // EMAIL VALIDATION
                // ====================================

                if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        .test(emailValue)
                ) {

                    document
                        .getElementById("emailError")
                        .textContent =
                        "Enter a valid email address.";

                    email
                        .closest(".field")
                        .querySelector(".input")
                        .classList.add("invalid");

                    valid = false;

                }


                // ====================================
                // OTP VALIDATION
                // ====================================

                if (!otp) {

                    document
                        .getElementById("otpError")
                        .textContent =
                        "OTP is required.";

                    document
                        .getElementById("otp")
                        .classList.add("invalid");

                    valid = false;

                }
                else if (!/^\d{6}$/.test(otp)) {

                    document
                        .getElementById("otpError")
                        .textContent =
                        "OTP must be 6 digits.";

                    document
                        .getElementById("otp")
                        .classList.add("invalid");

                    valid = false;

                }


                // ====================================
                // NEW PASSWORD VALIDATION
                // ====================================

                if (!newPassword) {

                    document
                        .getElementById(
                            "newPasswordError"
                        )
                        .textContent =
                        "New password is required.";

                    document
                        .getElementById("newPassword")
                        .classList.add("invalid");

                    valid = false;

                }
                else if (newPassword.length < 6) {

                    document
                        .getElementById(
                            "newPasswordError"
                        )
                        .textContent =
                        "Password must be at least 6 characters.";

                    document
                        .getElementById("newPassword")
                        .classList.add("invalid");

                    valid = false;

                }


                // ====================================
                // STOP IF INVALID
                // ====================================

                if (!valid) {

                    message.className =
                        "message error";

                    message.textContent =
                        "Please correct the highlighted fields.";

                    return;

                }


                // ====================================
                // CHANGE PASSWORD API
                // ====================================

                const original =
                    submit.innerHTML;

                submit.disabled = true;

                submit.innerHTML =
                    "<span>Changing Password...</span>";


                try {

                    const response =
                        await fetch(
                            FORGOT_PASSWORD_API_URL,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    "Accept":
                                        "*/*"
                                },

                                body: JSON.stringify({

                                    email: emailValue,

                                    otp: otp,

                                    newPassword:
                                        newPassword

                                })
                            }
                        );


                    const data =
                        await response
                            .json()
                            .catch(() => ({}));


                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            data.title ||
                            "Unable to change password."
                        );

                    }


                    // =================================
                    // PASSWORD CHANGED
                    // =================================

                    message.className =
                        "message success";

                    message.textContent =
                        data.message ||
                        "Password changed successfully.";


                    // =================================
                    // REFRESH LOGIN PAGE
                    // =================================

                    setTimeout(() => {

                        window.location.reload();

                    }, 1000);

                }
                catch (error) {

                    message.className =
                        "message error";

                    message.textContent =
                        error.message ||
                        "Could not connect to the server.";

                }
                finally {

                    submit.disabled = false;

                    submit.innerHTML =
                        original;

                }


                return;

            }


            // ========================================
            // NORMAL LOGIN
            // ========================================

            const passwordValue =
                password.value;


            let valid = true;


            // ========================================
            // EMAIL VALIDATION
            // ========================================

            if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(emailValue)
            ) {

                document
                    .getElementById("emailError")
                    .textContent =
                    "Enter a valid email address.";


                email
                    .closest(".field")
                    .querySelector(".input")
                    .classList.add("invalid");


                valid = false;

            }


            // ========================================
            // PASSWORD VALIDATION
            // ========================================

            if (!passwordValue) {

                document
                    .getElementById("passwordError")
                    .textContent =
                    "Password is required.";


                password
                    .closest(".field")
                    .querySelector(".input")
                    .classList.add("invalid");


                valid = false;

            }


            // ========================================
            // STOP IF INVALID
            // ========================================

            if (!valid) {

                message.className =
                    "message error";

                message.textContent =
                    "Please correct the highlighted fields.";

                return;

            }


            // ========================================
            // LOGIN API
            // ========================================

            const original =
                submit.innerHTML;

            submit.disabled = true;

            submit.innerHTML =
                "<span>Signing in...</span>";


            try {

                const response =
                    await fetch(
                        LOGIN_API_URL,
                        {
                            method: "POST",

                            credentials: "include",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "*/*"
                            },

                            body: JSON.stringify({

                                email:
                                    emailValue,

                                password:
                                    passwordValue

                            })
                        }
                    );


                const data =
                    await response
                        .json()
                        .catch(() => ({}));


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        data.title ||
                        "Invalid email or password."
                    );

                }


                // =================================
                // LOGIN SUCCESS
                // =================================

                message.className =
                    "message success";

                message.textContent =
                    data.message ||
                    "Login successful.";

                window.location.href = 'https://myibase.xyz/user/mydashboard';

            }
            catch (error) {

                message.className =
                    "message error";

                message.textContent =
                    error.message ||
                    "Could not connect to the server.";

            }
            finally {

                submit.disabled = false;

                submit.innerHTML =
                    original;

            }

        }
    );

});