/* ===========================
   ELEMENTS
=========================== */

const pdfFiles =
    document.getElementById(
        "pdfFiles"
    );

const dropZone =
    document.getElementById(
        "dropZone"
    );

const unlockForm =
    document.getElementById(
        "unlockForm"
    );

const summaryCard =
    document.getElementById(
        "summaryCard"
    );

const fileListContainer =
    document.getElementById(
        "fileListContainer"
    );

const passwordSection =
    document.getElementById(
        "passwordSection"
    );

const passwordContainer =
    document.getElementById(
        "passwordContainer"
    );

const totalFiles =
    document.getElementById(
        "totalFiles"
    );

const totalSize =
    document.getElementById(
        "totalSize"
    );

const progressSection =
    document.getElementById(
        "progressSection"
    );

const progressBar =
    document.getElementById(
        "progressBar"
    );

let selectedFiles = [];

/* ===========================
   FILE SELECT
=========================== */

pdfFiles.addEventListener(
    "change",
    function () {

        const newFiles =
            Array.from(this.files);

        const duplicateFiles = [];

        newFiles.forEach(file => {

            const exists =
                selectedFiles.some(

                    existingFile =>

                        existingFile.name === file.name
                        &&
                        existingFile.size === file.size

                );

            if (exists) {

                duplicateFiles.push(file.name);

            }
            else {

                selectedFiles.push(file);

            }

        });

        if (duplicateFiles.length > 0) {

            alert(

                "Duplicate file(s):\n\n"

                +

                duplicateFiles.join("\n")

            );

        }

        renderFiles();

        pdfFiles.value = "";

    }
);
/* ===========================
   DRAG & DROP
=========================== */

dropZone.addEventListener(
    "dragover",
    function (e) {

        e.preventDefault();

        dropZone.classList.add(
            "drag-active"
        );

    }
);

dropZone.addEventListener(
    "dragleave",
    function () {

        dropZone.classList.remove(
            "drag-active"
        );

    }
);

dropZone.addEventListener(
    "drop",
    function (e) {

        e.preventDefault();

        dropZone.classList.remove(
            "drag-active"
        );

        const newFiles =
            Array.from(
                e.dataTransfer.files
            );

        const duplicateFiles = [];

        newFiles.forEach(file => {

            const exists =
                selectedFiles.some(

                    existingFile =>

                        existingFile.name === file.name
                        &&
                        existingFile.size === file.size

                );

            if (exists) {

                duplicateFiles.push(file.name);

            }
            else {

                selectedFiles.push(file);

            }

        });

        if (duplicateFiles.length > 0) {

            alert(

                "Duplicate file(s):\n\n"

                +

                duplicateFiles.join("\n")

            );

        }

        renderFiles();

    }
);

/* ===========================
   RENDER FILES
=========================== */

function renderFiles() {

    if (selectedFiles.length === 0) {

        summaryCard.style.display =
            "none";

        passwordSection.style.display =
            "none";

        fileListContainer.innerHTML =
            "";

        passwordContainer.innerHTML =
            "";

        return;

    }

    summaryCard.style.display =
        "flex";

    passwordSection.style.display =
        "block";

    fileListContainer.innerHTML =
        "";

    passwordContainer.innerHTML =
        "";

    let totalBytes = 0;

    selectedFiles.forEach(
        (
            file,
            index
        ) => {

            totalBytes += file.size;

            fileListContainer.innerHTML += `

            <div class="card">

                <div class="card-body">

                    <div class="row align-items-center">

                        <div class="col-md-5 file-row-name">

                            <i class="bi bi-file-earmark-lock-fill"></i>

                            ${file.name}

                        </div>

                        <div class="col-md-2 text-center">

                            ${(file.size / 1024 / 1024).toFixed(2)} MB

                        </div>

                        <div class="col-md-2 text-center">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewPdf(${index})">

                                Preview

                            </button>

                        </div>

                        <div class="col-md-3 text-center">

                            <button
                                type="button"
                                class="btn btn-danger btn-sm"
                                onclick="deleteFile(${index})">

                                Delete

                            </button>

                        </div>

                    </div>

                </div>

            </div>

            `;

            passwordContainer.innerHTML += `

            <div class="password-row">

                <div class="password-file">

                    🔒 ${file.name}

                </div>

                <div>

                    <input
                        type="password"
                        class="form-control password-input"
                        id="password_${index}"
                        placeholder="Enter Password">

                </div>

            </div>

            `;

        }
    );

    totalFiles.innerHTML =
        selectedFiles.length;

    totalSize.innerHTML =
        (
            totalBytes
            /
            1024
            /
            1024
        ).toFixed(2)
        +
        " MB";

    document.getElementById(
        "unlockBtn"
    ).disabled = false;

}

/* ===========================
   DELETE FILE
=========================== */
function deleteFile(index) {

    selectedFiles.splice(index, 1);

    if (selectedFiles.length === 0) {

        summaryCard.style.display = "none";

        passwordSection.style.display = "none";

        fileListContainer.innerHTML = "";

        passwordContainer.innerHTML = "";

        pdfFiles.value = "";

        document.getElementById(
            "unlockBtn"
        ).disabled = true;

        return;

    }

    renderFiles();

}

/* ===========================
   PDF PREVIEW
=========================== */

function previewPdf(index) {

    const file =
        selectedFiles[index];

    const fileURL =
        URL.createObjectURL(
            file
        );

    document.getElementById(
        "previewFrame"
    ).src =
        fileURL;

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "pdfPreviewModal"
            )
        );

    modal.show();

    document
        .getElementById(
            "pdfPreviewModal"
        )
        .addEventListener(
            "hidden.bs.modal",
            function () {

                URL.revokeObjectURL(
                    fileURL
                );

            },
            {
                once: true
            }
        );

}

/* ===========================
   UNLOCK PDF
=========================== */
unlockForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        if (
            !validateFiles(selectedFiles)
        ) {
            return;
        }

        if (
            selectedFiles.length === 0
        ) {

            alert(
                "Please select PDF files."
            );

            return;

        }

        const formData =
            new FormData();

        selectedFiles.forEach(

            (
                file,
                index
            ) => {

                formData.append(
                    "pdfFiles",
                    file
                );

                formData.append(
                    "passwords",
                    document.getElementById(
                        `password_${index}`
                    ).value
                );

            }

        );

        document.getElementById(
            "uploadSection"
        ).classList.add(
            "converting"
        );

        summaryCard.style.display =
            "none";

        fileListContainer.style.display =
            "none";

        passwordSection.style.display =
            "none";

        dropZone.style.display =
            "none";

        document.getElementById(
            "unlockBtn"
        ).style.display =
            "none";

        progressSection.style.display =
            "block";

        progressBar.style.width =
            "0%";

        progressBar.innerHTML =
            "0%";

        progressBar.setAttribute(
            "aria-valuenow",
            "0"
        );

        const xhr =
            new XMLHttpRequest();

        xhr.upload.addEventListener(

            "progress",

            function (event) {

                if (
                    event.lengthComputable
                ) {

                    const percent =
                        Math.round(

                            (
                                event.loaded
                                /
                                event.total
                            )
                            *
                            100

                        );

                    progressBar.style.width =
                        percent + "%";

                    progressBar.innerHTML =
                        percent + "%";

                    progressBar.setAttribute(
                        "aria-valuenow",
                        percent
                    );

                }

            }

        );

        xhr.onreadystatechange =
            function () {

                if (
                    xhr.readyState === 4
                ) {

                    document.getElementById(
                        "uploadSection"
                    ).classList.remove(
                        "converting"
                    );

                    if (
                        xhr.status === 200
                    ) {

                        const result =
                            JSON.parse(
                                xhr.responseText
                            );

                        if (
                            result.success
                        ) {

                            buildResult(
                                result
                            );

                        }
                        else {

                            progressSection.style.display =
                                "none";

                            summaryCard.style.display =
                                "flex";

                            fileListContainer.style.display =
                                "block";

                            passwordSection.style.display =
                                "block";

                            dropZone.style.display =
                                "block";

                            document.getElementById(
                                "unlockBtn"
                            ).style.display =
                                "inline-block";

                            alert(
                                result.message
                            );

                        }

                    }

                    else {

                        progressSection.style.display =
                            "none";

                        summaryCard.style.display =
                            "flex";

                        fileListContainer.style.display =
                            "block";

                        passwordSection.style.display =
                            "block";

                        dropZone.style.display =
                            "block";

                        document.getElementById(
                            "unlockBtn"
                        ).style.display =
                            "inline-block";

                        alert(
                            "Unlock failed. Please try again."
                        );

                    }

                }

            };

        xhr.open(
            "POST",
            "/unlock-pdf-ajax"
        );

        xhr.send(
            formData
        );

    }
);

/* ===========================
   RESULT PAGE
=========================== */

function buildResult(result) {

    document.getElementById(
        "uploadSection"
    ).style.display =
        "none";

    document.getElementById(
        "resultCard"
    ).style.display =
        "block";

    const container =
        document.getElementById(
            "unlockedFilesContainer"
        );

    container.innerHTML =
        "";

    result.files.forEach(
        file => {

            container.innerHTML += `

            <div class="card">

                <div class="card-body">

                    <div class="row text-center align-items-center">

                        <div class="col-md-4">

                            ${file.name}

                        </div>

                        <div class="col-md-2">

                            ${file.size}

                        </div>

                        <div class="col-md-2">

                            Success

                        </div>

                        <div class="col-md-4">

                            <a
                               href="/download-unlocked-pdf?fileName=${file.name}"
                               class="btn btn-success btn-sm">

                               Download

                            </a>

                        </div>

                    </div>

                </div>

            </div>

            `;

        }
    );

    document.getElementById(
        "resultFiles"
    ).innerHTML =
        result.files.length;

    document.getElementById(
        "resultSuccess"
    ).innerHTML =
        result.files.length;

}

/* ===========================
   UNLOCK MORE
=========================== */

document.getElementById(
    "unlockMoreBtn"
).addEventListener(
    "click",
    function () {

        fetch(
            "/delete-pdf-unlocker-temp-files",
            {
                method: "POST"
            }
        )
            .finally(() => {

                location.reload();

            });

    }
);

/* ===========================
   DARK MODE
=========================== */

document.getElementById(
    "darkModeBtn"
).addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark-mode"
        );

    }
);

