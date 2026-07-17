window.addEventListener(
    "DOMContentLoaded",
    function () {

        const emailField =
            document.getElementById("email");

        if (!emailField) {
            return;
        }

        const params =
            new URLSearchParams(window.location.search);

        const email =
            params.get("email");

        if (email) {

            emailField.value =
                decodeURIComponent(email);

        }

    }
);