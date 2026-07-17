window.addEventListener(
    "DOMContentLoaded",
    function () {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const email =
            params.get("email");

        if (email) {

            document.getElementById("email").value =
                email;

        }

    }
);

document.addEventListener("DOMContentLoaded", function () {

    const emailField =
        document.getElementById("email");

    const savedEmail =
        sessionStorage.getItem("subscriberEmail");

    if (savedEmail && emailField) {

        emailField.value = savedEmail;

    }

});