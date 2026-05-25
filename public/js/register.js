import { registerUser } from "./auth.js";


// ===================== ELEMENTS =====================
const registerForm = document.querySelector(".register__form");

//register inputs
const fullNameInput = document.querySelector('input[placeholder="Full Name"]');
const emailInput = document.querySelector('input[placeholder="Email Address"]');
const passwordInput = document.querySelector('input[placeholder="Password"]');
const confirmPasswordInput = document.querySelector('input[placeholder="Confirm Password"]');
const phoneInput = document.querySelector('input[placeholder="Phone Number (Optional)"]');
const addressInput = document.querySelector('input[placeholder="Address (Optional)"]');
const stateInput = document.querySelector('input[placeholder="State"]');
const countryInput = document.querySelector('input[placeholder="Country"]');
const genderSelect = document.querySelector(".register__select");
const newsletterCheckbox = document.querySelector('input[type="checkbox"]');
const registerMessage = document.querySelector('.register__p--message');

// ===================== FORM SUBMIT =====================
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (passwordInput.value !== confirmPasswordInput.value) {
        alert("Passwords do not match");
        return;
    }

    const registerPayload = {
        full_name: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
        phone: phoneInput.value.trim(),
        address: addressInput.value.trim(),
        state: stateInput.value.trim(),
        country: countryInput.value.trim(),
        gender: genderSelect.value || null,
        newsletter: newsletterCheckbox.checked
    };

    try {
        const registerResult = await registerUser(registerPayload);
        registerForm.reset();
        registerMessage.textContent = 
           registerResult.message;
        setTimeout(()=>{
            window.location = '/login'
        }, 2000)
        
        


    } catch (error) {
        console.log(error);
        alert(error.message || "Registration failed");
    }
});

