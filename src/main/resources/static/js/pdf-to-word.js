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

const convertForm =
    document.getElementById(
        "convertForm"
    );

const summaryCard =
    document.getElementById(
        "summaryCard"
    );

const fileListContainer =
    document.getElementById(
        "fileListContainer"
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

const chooseFilesBtn =
    document.getElementById(
        "chooseFilesBtn"
    );

const convertBtn =
    document.getElementById(
        "convertBtn"
    );

let selectedFiles = [];

let conversionCompleted = false;

let isConverting = false;

/* ===========================
   FILE SELECT
=========================== */

pdfFiles.addEventListener(
    "change",
    function () {

        if (isConverting) {
            return;
        }

        addFiles(
            Array.from(this.files)
        );

        this.value = "";

    }
);

/* ===========================
   DRAG & DROP
=========================== */

dropZone.addEventListener(
    "dragover",
    function (e) {

        e.preventDefault();

        if (isConverting) {
            return;
        }

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

        if (isConverting) {
            return;
        }

        addFiles(
            Array.from(
                e.dataTransfer.files
            )
        );

    }
);

/* ===========================
   ADD FILES
=========================== */

function addFiles(newFiles) {

    const duplicateFiles = [];

    newFiles.forEach(file => {

        const exists =
            selectedFiles.some(oldFile =>

                oldFile.name === file.name &&

                oldFile.size === file.size &&

                oldFile.lastModified === file.lastModified

            );

        if (exists) {

            duplicateFiles.push(
                file.name
            );

        }
        else {

            selectedFiles.push(
                file
            );

        }

    });

    if (duplicateFiles.length) {

        alert(

            "Duplicate file(s):\n\n"

            +

            duplicateFiles.join("\n")

        );

    }

    showFiles();

    convertBtn.disabled =
        selectedFiles.length === 0;

}/* ===========================
   SHOW FILES
=========================== */

function showFiles() {

    fileListContainer.innerHTML = "";

    if (selectedFiles.length === 0) {

        summaryCard.style.display = "none";

        totalFiles.innerHTML = "0";

        totalSize.innerHTML = "0 MB";

        convertBtn.disabled = true;

        return;

    }

    summaryCard.style.display = "flex";

    convertBtn.disabled = false;

    let totalBytes = 0;

    selectedFiles.forEach(

        (file, index) => {

            totalBytes += file.size;

            fileListContainer.innerHTML += `

            <div class="card">

                <div class="card-body">

                    <div class="row align-items-center">

                        <div class="col-md-5 file-row-name">

                            <i class="bi bi-file-earmark-pdf-fill"></i>

                            ${file.name}

                        </div>

                        <div class="col-md-2 text-center">

                            ${(file.size / 1024 / 1024).toFixed(2)} MB

                        </div>

                        <div class="col-md-2 text-center">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewPdf(${index})"
                                ${isConverting ? "disabled" : ""}>

                                Preview

                            </button>

                        </div>

                        <div class="col-md-3 text-center">

                            <button
                                type="button"
                                class="btn btn-danger btn-sm"
                                onclick="deleteFile(${index})"
                                ${isConverting ? "disabled" : ""}>

                                Delete

                            </button>

                        </div>

                    </div>

                </div>

            </div>

            `;

        }

    );

    totalFiles.innerHTML = selectedFiles.length;

    totalSize.innerHTML =
        (totalBytes / 1024 / 1024).toFixed(2) + " MB";

}
/* ===========================
   DELETE FILE
=========================== */

function deleteFile(index) {

    if (isConverting) {

        return;

    }

    selectedFiles.splice(
        index,
        1
    );

    pdfFiles.value = "";

    showFiles();

}
/* ===========================
   PDF PREVIEW
=========================== */

function previewPdf(index) {

    if (isConverting) {

        return;

    }

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

}/* ===========================
   CONVERT
=========================== */

convertForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        if (isConverting) {
            return;
        }

        if (selectedFiles.length === 0) {

            alert(
                "Please select at least one PDF file."
            );

            return;

        }

        if (
            !validateFiles(selectedFiles)
        ) {
            return;
        }

        isConverting = true;

        chooseFilesBtn.disabled = true;

        convertBtn.disabled = true;

        uploadSection.classList.add(
            "converting"
        );

        dropZone.classList.add(
            "hide-during-convert"
        );

        fileListContainer.classList.add(
            "hide-during-convert"
        );

        summaryCard.classList.add(
            "hide-during-convert"
        );

        convertBtn.parentElement.classList.add(
            "hide-during-convert"
        );

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

        const formData =
            new FormData();

        selectedFiles.forEach(

            file => {

                formData.append(
                    "pdfFiles",
                    file
                );

            }

        );

        const xhr =
            new XMLHttpRequest();

        xhr.upload.addEventListener(
            "progress",

            function (event) {

                if (event.lengthComputable) {

                    const percent =
                        Math.round(

                            (event.loaded / event.total)

                            * 100

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

                if (xhr.readyState !== 4) {
                    return;
                }

                isConverting = false;

                uploadSection.classList.remove(
                    "converting"
                );

                chooseFilesBtn.disabled = false;

                if (xhr.status === 200) {

                    const result =
                        JSON.parse(
                            xhr.responseText
                        );

                    if (result.success) {

                        conversionCompleted = true;

                        progressBar.style.width = "100%";

                        progressBar.innerHTML = "100%";

                        progressBar.setAttribute(
                            "aria-valuenow",
                            "100"
                        );

                        document.getElementById(
                            "uploadSection"
                        ).style.display =
                            "none";

                        document.getElementById(
                            "resultCard"
                        ).style.display =
                            "block";

                        buildResultTable(
                            result
                        );

                    }
                    else {

                        progressSection.style.display =
                            "none";

                        dropZone.classList.remove(
                            "hide-during-convert"
                        );

                        fileListContainer.classList.remove(
                            "hide-during-convert"
                        );

                        summaryCard.classList.remove(
                            "hide-during-convert"
                        );

                        convertBtn.parentElement.classList.remove(
                            "hide-during-convert"
                        );

                        chooseFilesBtn.disabled = false;

                        convertBtn.disabled =
                            selectedFiles.length === 0;

                        alert(
                            result.message
                        );

                    }

                }
                else {

                    progressSection.style.display =
                        "none";

                    dropZone.classList.remove(
                        "hide-during-convert"
                    );

                    fileListContainer.classList.remove(
                        "hide-during-convert"
                    );

                    summaryCard.classList.remove(
                        "hide-during-convert"
                    );

                    convertBtn.parentElement.classList.remove(
                        "hide-during-convert"
                    );

                    chooseFilesBtn.disabled = false;

                    convertBtn.disabled =
                        selectedFiles.length === 0;

                    alert(
                        "Conversion failed. Please try again."
                    );

                }

            };

        xhr.open(
            "POST",
            "/pdf-to-word-ajax"
        );

        xhr.send(
            formData
        );

    }

);/* ===========================
   RESULT TABLE
=========================== */

function buildResultTable(result) {

    const container =
        document.getElementById(
            "convertedFilesContainer"
        );

    container.innerHTML = "";

    if (!result.files || result.files.length === 0) {

        return;

    }

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

                            ${file.pdfSize}

                        </div>

                        <div class="col-md-2">

                            ${file.docxSize}

                        </div>

                        <div class="col-md-2">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewConvertedPdf('${file.originalPdf}')">

                                Preview

                            </button>

                        </div>

                        <div class="col-md-2">

                            <a
                                href="/download-word-file?fileName=${encodeURIComponent(file.name)}"
                                class="btn btn-success btn-sm"
                                download>

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
   RESULT PREVIEW
=========================== */

function previewConvertedPdf(fileName) {

    document.getElementById(
        "previewFrame"
    ).src =
        "/preview-pdf-file?fileName="
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
   CONVERT MORE
=========================== */

document.getElementById(
    "convertMoreBtn"
).addEventListener(
    "click",
    function () {

        fetch(
            "/delete-pdf-to-word-temp-files",
            {
                method: "POST"
            }
        ).finally(() => {

            selectedFiles = [];

            pdfFiles.value = "";

            conversionCompleted = false;

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

