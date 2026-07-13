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

const protectForm =
    document.getElementById(
        "protectForm"
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

const uploadSection =
    document.getElementById(
        "uploadSection"
    );

const resultCard =
    document.getElementById(
        "resultCard"
    );

const protectBtn =
    document.getElementById(
        "protectBtn"
    );

const protectMoreBtn =
    document.getElementById(
        "protectMoreBtn"
    );

const addMoreBtn =
    document.getElementById(
        "addMoreBtn"
    );

const protectedFilesContainer =
    document.getElementById(
        "protectedFilesContainer"
    );

const resultFiles =
    document.getElementById(
        "resultFiles"
    );

const resultSuccess =
    document.getElementById(
        "resultSuccess"
    );

const previewFrame =
    document.getElementById(
        "previewFrame"
    );

let selectedFiles = [];
/* ===========================
   FILE SELECT
=========================== */

pdfFiles.addEventListener(
    "change",
    function () {

        const incomingFiles =
            Array.from(this.files);

        let duplicateFiles = [];

        let invalidFiles = [];

        incomingFiles.forEach(file => {

            if (file.type !== "application/pdf") {

                invalidFiles.push(
                    file.name
                );

                return;

            }

            const duplicate =
                selectedFiles.some(
                    existingFile =>

                        existingFile.name === file.name &&
                        existingFile.size === file.size
                );

            if (duplicate) {

                duplicateFiles.push(
                    file.name
                );

            } else {

                selectedFiles.push(
                    file
                );

            }

        });

        if (invalidFiles.length > 0) {

            alert(
                "Only PDF files are allowed.\n\n"
                +
                invalidFiles.join("\n")
            );

        }

        if (duplicateFiles.length > 0) {

            alert(
                "Duplicate file(s) skipped:\n\n"
                +
                duplicateFiles.join("\n")
            );

        }

        renderFiles();

        pdfFiles.value = "";

    }
);

/* ===========================
   ADD MORE FILES
=========================== */

addMoreBtn.addEventListener(
    "click",
    function () {

        pdfFiles.value = "";

        pdfFiles.click();

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

        const incomingFiles =
            Array.from(
                e.dataTransfer.files
            );

        let duplicateFiles = [];

        let invalidFiles = [];

        incomingFiles.forEach(file => {

            if (file.type !== "application/pdf") {

                invalidFiles.push(
                    file.name
                );

                return;

            }

            const duplicate =
                selectedFiles.some(
                    existingFile =>

                        existingFile.name === file.name &&
                        existingFile.size === file.size
                );

            if (duplicate) {

                duplicateFiles.push(
                    file.name
                );

            } else {

                selectedFiles.push(
                    file
                );

            }

        });

        if (invalidFiles.length > 0) {

            alert(
                "Only PDF files are allowed.\n\n"
                +
                invalidFiles.join("\n")
            );

        }

        if (duplicateFiles.length > 0) {

            alert(
                "Duplicate file(s) skipped:\n\n"
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

    fileListContainer.innerHTML = "";

    passwordContainer.innerHTML = "";

    if (selectedFiles.length === 0) {

        summaryCard.style.display =
            "none";

        passwordSection.style.display =
            "none";

        return;

    }

    summaryCard.style.display =
        "flex";

    passwordSection.style.display =
        "block";

    let totalBytes = 0;

    selectedFiles.forEach(
        (
            file,
            index
        ) => {

            totalBytes +=
                file.size;

            fileListContainer.innerHTML += `

<div class="card mb-2">

    <div class="card-body">

        <div class="row align-items-center text-center">

            <div class="col-md-5 text-start file-row-name">

                <i class="bi bi-file-earmark-pdf-fill"></i>

                ${file.name}

            </div>

            <div class="col-md-2">

                ${(file.size / 1024 / 1024).toFixed(2)} MB

            </div>

            <div class="col-md-2">

                <button
                    type="button"
                    class="btn btn-primary btn-sm preview-btn"
                    onclick="previewPdf(${index})">

                    Preview

                </button>

            </div>

            <div class="col-md-3">

                <button
                    type="button"
                    class="btn btn-danger btn-sm delete-btn"
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

        <i class="bi bi-file-earmark-lock-fill me-2"></i>

        ${file.name}

    </div>

    <div>

        <input
            type="password"
            id="password_${index}"
            class="form-control password-input"
            placeholder="Enter PDF Password">

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

}/* ===========================
   DELETE FILE
=========================== */

function deleteFile(index) {

    selectedFiles.splice(
        index,
        1
    );

    if (
        selectedFiles.length === 0
    ) {

        summaryCard.style.display =
            "none";

        passwordSection.style.display =
            "none";

        fileListContainer.innerHTML =
            "";

        passwordContainer.innerHTML =
            "";

        pdfFiles.value =
            "";

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

}
/* ===========================
   PROTECT PDF
=========================== */

protectForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        if (selectedFiles.length === 0) {

            alert(
                "Please upload PDF files."
            );

            return;

        }

        if (
            !validateFiles(selectedFiles)
        ) {

            return;

        }

        const formData =
            new FormData();

        for (
            let i = 0;
            i < selectedFiles.length;
            i++
        ) {

            const password =
                document.getElementById(
                    `password_${i}`
                ).value.trim();

            if (
                password === ""
            ) {

                alert(
                    "Please enter a password for "
                    +
                    selectedFiles[i].name
                );

                return;

            }

            formData.append(
                "pdfFiles",
                selectedFiles[i]
            );

            formData.append(
                "passwords",
                password
            );

        }

        /* Freeze UI */

        document.body.classList.add(
            "conversion-active"
        );

        uploadSection.style.display =
            "none";

        summaryCard.style.display =
            "none";

        fileListContainer.style.display =
            "none";

        passwordSection.style.display =
            "none";

        progressSection.style.display =
            "block";

        progressBar.style.width =
            "0%";

        progressBar.innerHTML =
            "0%";

        protectBtn.disabled =
            true;

        protectBtn.innerHTML =
            '<span class="spinner-border spinner-border-sm"></span> Protecting...';

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
                                event.loaded /
                                event.total
                            ) * 100
                        );

                    progressBar.style.width =
                        percent + "%";

                    progressBar.innerHTML =
                        percent + "%";

                }

            }
        );

        let progress = 0;

        const fakeProgress =
            setInterval(() => {

                if (progress < 90) {

                    progress += 10;

                    progressBar.style.width =
                        progress + "%";

                    progressBar.innerHTML =
                        progress + "%";

                }

            }, 200);

        xhr.onreadystatechange =
            function () {

                if (
                    xhr.readyState !== 4
                ) {

                    return;

                }

                clearInterval(
                    fakeProgress
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

                        progressBar.style.width =
                            "100%";

                        progressBar.innerHTML =
                            "100%";

                        setTimeout(() => {

                            progressSection.style.display =
                                "none";

                            resultCard.style.display =
                                "block";

                            buildResult(
                                result
                            );

                        }, 500);

                    } else {

                        alert(
                            result.message ||
                            "Failed to protect PDF."
                        );

                        uploadSection.style.display =
                            "block";

                        summaryCard.style.display =
                            "";

                        fileListContainer.style.display =
                            "";

                        passwordSection.style.display =
                            "block";

                        progressSection.style.display =
                            "none";

                        progressBar.style.width =
                            "0%";

                        progressBar.innerHTML =
                            "0%";

                    }

                } else {

                    alert(
                        "Server error while processing PDF."
                    );

                    uploadSection.style.display =
                        "block";

                    summaryCard.style.display =
                        "";

                    fileListContainer.style.display =
                        "";

                    passwordSection.style.display =
                        "block";

                    progressSection.style.display =
                        "none";

                    progressBar.style.width =
                        "0%";

                    progressBar.innerHTML =
                        "0%";

                }

                protectBtn.disabled =
                    false;

                protectBtn.innerHTML =
                    "Protect PDF";

                document.body.classList.remove(
                    "conversion-active"
                );

            };

        xhr.open(
            "POST",
            "/protect-pdf-ajax"
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

    protectedFilesContainer.innerHTML =
        "";

    result.files.forEach(
        file => {

            protectedFilesContainer.innerHTML += `

<div class="card mb-2">

    <div class="card-body">

        <div class="row align-items-center text-center">

            <div class="col-md-4 file-row-name">

                <i class="bi bi-file-earmark-lock-fill"></i>

                ${file.name}

            </div>

            <div class="col-md-2">

                ${file.size}

            </div>

            <div class="col-md-2">

                <button
                    type="button"
                    class="btn btn-primary btn-sm preview-btn"
                    onclick="previewProtectedPdf('${file.name}')">

                    Preview

                </button>

            </div>

            <div class="col-md-4">
                    <a
                        href="/download-protected-pdf?downloadName=${encodeURIComponent(file.name)}"
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

    resultFiles.innerHTML =
        result.files.length;

    resultSuccess.innerHTML =
        result.files.length;

}

/* ===========================
   PROTECT MORE
=========================== */

protectMoreBtn.addEventListener(
    "click",
    function () {

        fetch(
            "/delete-protected-pdf",
            {
                method: "POST"
            }
        ).finally(() => {

            location.reload();

        });

    }
);


/* ===========================
   PREVIEW PROTECTED PDF
=========================== */

function previewProtectedPdf(fileName) {

    previewFrame.src =
        "/preview-protected-pdf?fileName="
        +
        encodeURIComponent(
            fileName
        );

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "pdfPreviewModal"
            )
        );

    modal.show();

}
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

