document.addEventListener("DOMContentLoaded", () => {

    const searchInput =
        document.getElementById("toolSearch");

    const toolCards =
        document.querySelectorAll(".tool-card");

    const toolColumns =
        document.querySelectorAll(".tool-item");

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    /* ===============================
       SEARCH
    =============================== */

    if(searchInput){

        searchInput.addEventListener("input", () => {

            const value =
                searchInput.value.toLowerCase();

            toolColumns.forEach(card => {

                const text =
                    card.innerText.toLowerCase();

                if(text.includes(value)){

                    card.style.display = "block";

                }else{

                    card.style.display = "none";
                }

            });

        });

    }

    /* ===============================
       CATEGORY FILTER
    =============================== */

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            const category =
                button.dataset.category;

            toolColumns.forEach(card => {

                if(
                    category === "all" ||
                    card.dataset.category === category
                ){

                    card.style.display = "block";

                }else{

                    card.style.display = "none";
                }

            });

        });

    });

});