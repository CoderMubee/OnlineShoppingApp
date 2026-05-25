import { loginUser } from "./auth.js"

const loginForm = document.querySelector(".login__form");
//login inputs
const loginUsername = document.querySelector('.login__input--username');
const loginPassword = document.querySelector('.login__input--password');
const loginMessage = document.querySelector('.login__p--message');

//eventlistener
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const loginPayload = {
        email: loginUsername.value.trim(),
        password: loginPassword.value
    }
    try {
        const loginResult = await loginUser(loginPayload);
        sessionStorage.setItem("token", loginResult.token);
        localStorage.setItem("ummuMujahid_user", JSON.stringify(loginResult.user));
        loginForm.reset();
        loginMessage.textContent =
            loginResult.message;
        setTimeout(() => {
            if (loginResult.user.role === "admin") {
                window.location.href = "/admin/dashboard.html";
            } else {
                window.location.href = "/";
            }
        }, 2000)

    }
    catch (error) {
        console.log(error);
        alert(error.message || 'login failed')
    }
})