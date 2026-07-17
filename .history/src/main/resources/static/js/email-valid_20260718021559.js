const emailInput = document.getElementById("footerEmail");
const emailError = document.getElementById("emailError");
const subscribeBtn = document.getElementById("subscribeBtn");

const emailPattern =
/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function validateEmail() {

    const email = emailInput.value.trim();

    if (email === "") {

        emailError.textContent = "Email is required.";
        return false;

    }

    if (!emailPattern.test(email)) {

        emailError.textContent =
            "Please enter a valid email address.";
        return false;

    }

    emailError.textContent = "";
    return true;

}

emailInput.addEventListener("input", validateEmail);

subscribeBtn.addEventListener("click", function () {

    if (!validateEmail()) {

        emailInput.focus();
        return;

    }

    sessionStorage.setItem(
        "subscriberEmail",
        emailInput.value.trim()
    );

    window.location.href = "/contact-us";

});