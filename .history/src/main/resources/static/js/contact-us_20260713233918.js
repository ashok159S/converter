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