const emailInput =
    document.getElementById("footerEmail");

const emailError =
    document.getElementById("emailError");

const subscribeBtn =
    document.getElementById("subscribeBtn");

const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

emailInput.addEventListener(
    "input",
    function () {

        const email =
            emailInput.value.trim();

        if (email === "") {

            emailError.innerHTML = "";

            return;

        }

        if (!emailPattern.test(email)) {

            emailError.innerHTML =
                "Please enter a valid email address.";

        }
        else {

            emailError.innerHTML = "";

        }

    }
);

subscribeBtn.addEventListener(
    "click",
    function () {

        const email =
            emailInput.value.trim();

        if (email === "") {

            emailError.innerHTML =
                "Email is required.";

            emailInput.focus();

            return;

        }

        if (!emailPattern.test(email)) {

            emailError.innerHTML =
                "Please enter a valid email address.";

            emailInput.focus();

            return;

        }

        window.location.href =
            "/contact-us?email="
            +
            encodeURIComponent(email);

    }
);