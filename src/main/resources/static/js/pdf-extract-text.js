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

const extractTextForm =
document.getElementById(
    "extractTextForm"
);

const uploadSection =
document.getElementById(
    "uploadSection"
);

const settingsSection =
document.getElementById(
    "settingsSection"
);

const extractBtn =
document.getElementById(
    "extractBtn"
);

const progressSection =
document.getElementById(
    "progressSection"
);

const progressBar =
document.getElementById(
    "progressBar"
);

const resultCard =
document.getElementById(
    "resultCard"
);

const resultFilesContainer =
document.getElementById(
    "resultFilesContainer"
);

const resultFiles =
document.getElementById(
    "resultFiles"
);

const resultSuccess =
document.getElementById(
    "resultSuccess"
);

const extractMoreBtn =
document.getElementById(
    "extractMoreBtn"
);

const pageRangeSection =
document.getElementById(
    "pageRangeSection"
);

const pageRange =
document.getElementById(
    "pageRange"
);

const previewTextArea =
document.getElementById(
    "previewTextArea"
);

const darkModeBtn =
document.getElementById(
    "darkModeBtn"
);

let selectedFiles = [];
/* ===========================
   FILE SELECT
=========================== */

pdfFiles.addEventListener(
    "change",
    function () {

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

    }
);

dropZone.addEventListener(
    "drop",
    function (e) {

        e.preventDefault();

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

function addFiles(files) {

    let duplicateFiles = [];

    files.forEach(file => {

        const exists =
            selectedFiles.some(

                existingFile =>

                    existingFile.name === file.name
                    &&
                    existingFile.size === file.size

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

    if (duplicateFiles.length > 0) {

        alert(

            "Duplicate files skipped:\n\n"

            +

            duplicateFiles.join("\n")

        );

    }

    renderFiles();

}

/* ===========================
   EXTRACTION OPTION
=========================== */

document
.querySelectorAll(
    'input[name="extractType"]'
)
.forEach(

    radio => {

        radio.addEventListener(
            "change",
            function () {

                if (

                    this.value ===
                    "RANGE"

                ) {

                    pageRangeSection.style.display =
                        "block";

                }
                else {

                    pageRangeSection.style.display =
                        "none";

                }

            }
        );

    }

);
/* ===========================
   FILE LIST
=========================== */

function renderFiles() {

    if (
        selectedFiles.length === 0
    ) {

        summaryCard.style.display =
            "none";

        fileListContainer.innerHTML =
            "";

        return;

    }

    summaryCard.style.display =
        "flex";

    let totalBytes = 0;

    fileListContainer.innerHTML =
        "";

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

        <div class="row align-items-center">

            <div class="col-md-5 file-row-name">

                <i class="bi bi-file-earmark-pdf-fill text-danger me-2"></i>

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

}

/* ===========================
   DELETE FILE
=========================== */

function deleteFile(index) {

    selectedFiles.splice(
        index,
        1
    );

    renderFiles();

}
/* ===========================
   PDF PREVIEW
=========================== */

function previewPdf(index){

    const file =
    selectedFiles[index];

    const fileURL =
    URL.createObjectURL(
        file
    );

    const modalHtml = `

        <div class="modal fade"
             id="pdfPreviewModal">

            <div class="modal-dialog modal-xl">

                <div class="modal-content">

                    <div class="modal-header">

                        <h5 class="modal-title">

                            PDF Preview

                        </h5>

                        <button type="button"
                                class="btn-close"
                                data-bs-dismiss="modal">
                        </button>

                    </div>

                    <div class="modal-body p-0">

                        <iframe
                            src="${fileURL}"
                            width="100%"
                            height="750"
                            style="border:none;">
                        </iframe>

                    </div>

                </div>

            </div>

        </div>

    `;

    document.body.insertAdjacentHTML(
        "beforeend",
        modalHtml
    );

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
        function(){

            URL.revokeObjectURL(
                fileURL
            );

            this.remove();

        }
    );

}
/* ===========================
   SUBMIT
=========================== */

extractTextForm.addEventListener(
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
            file => {

                formData.append(
                    "pdfFiles",
                    file
                );

            }
        );

        formData.append(
            "extractType",
            document.querySelector(
                'input[name="extractType"]:checked'
            ).value
        );

        formData.append(
            "pageRange",
            pageRange.value
        );

        formData.append(
            "outputFormat",
            document.querySelector(
                'input[name="outputFormat"]:checked'
            ).value
        );

        /* ===========================
           FREEZE UI
        ============================ */

        settingsSection.style.display =
            "none";

        summaryCard.style.display =
            "none";

        fileListContainer.style.display =
            "none";

        dropZone.style.display =
            "none";

        extractBtn.style.display =
            "none";

        progressSection.style.display =
            "block";

        extractBtn.disabled =
            true;

        pdfFiles.disabled =
            true;

        dropZone.style.pointerEvents =
            "none";

        /* ===========================
           AJAX
        ============================ */

        const xhr =
            new XMLHttpRequest();

        xhr.upload.onprogress =
            function (e) {

                if (
                    e.lengthComputable
                ) {

                    const percent =
                        Math.round(

                            (
                                e.loaded
                                /
                                e.total
                            )
                            *
                            100

                        );

                    progressBar.style.width =
                        percent + "%";

                    progressBar.innerHTML =
                        percent + "%";

                }

            };

        xhr.onreadystatechange =
            function () {

                if (
                    xhr.readyState === 4
                ) {

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

                            progressSection.style.display =
                                "none";

                            uploadSection.style.display =
                                "none";

                            resultCard.style.display =
                                "block";

                            buildResult(
                                result
                            );

                        }
                        else {

                            settingsSection.style.display =
                                "block";

                            summaryCard.style.display =
                                "flex";

                            fileListContainer.style.display =
                                "block";

                            dropZone.style.display =
                                "block";

                            extractBtn.style.display =
                                "inline-block";

                            progressSection.style.display =
                                "none";

                            extractBtn.disabled =
                                false;

                            pdfFiles.disabled =
                                false;

                            dropZone.style.pointerEvents =
                                "auto";

                            alert(
                                result.message
                            );

                        }

                    }

                }

            };

        xhr.onerror =
            function () {

                settingsSection.style.display =
                    "block";

                summaryCard.style.display =
                    "flex";

                fileListContainer.style.display =
                    "block";

                dropZone.style.display =
                    "block";

                extractBtn.style.display =
                    "inline-block";

                progressSection.style.display =
                    "none";

                extractBtn.disabled =
                    false;

                pdfFiles.disabled =
                    false;

                dropZone.style.pointerEvents =
                    "auto";

                alert(
                    "Text extraction failed. Please try again."
                );

            };

        xhr.open(
            "POST",
            "/extract-text-ajax"
        );

        xhr.send(
            formData
        );

    }
);
/* ===========================
   RESULT
=========================== */

function buildResult(result) {

    uploadSection.style.display =
        "none";

    resultCard.style.display =
        "block";

    resultFilesContainer.innerHTML =
        "";

    result.files.forEach(
        file => {

            resultFilesContainer.innerHTML += `

<div class="card mb-2">

    <div class="card-body">

        <div class="row align-items-center text-center">

            <div class="col-md-3">

                <i class="bi bi-file-earmark-text-fill text-primary me-2"></i>

                ${file.name}

            </div>

            <div class="col-md-2">

                ${file.pages}

            </div>

            <div class="col-md-2">

                ${file.format}

            </div>

            <div class="col-md-2">

                <button
                    class="btn btn-primary btn-sm"
                    onclick="previewExtractedText('${file.name}')">

                    Preview

                </button>

            </div>

            <div class="col-md-3">

                <a
                    href="/download-extracted-text?fileName=${file.name}"
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
   EXTRACT MORE
=========================== */

extractMoreBtn.addEventListener(
    "click",
    function () {

        fetch(
            "/delete-extracted-files",
            {
                method: "POST"
            }
        )
        .finally(
            function () {

                location.reload();

            }
        );

    }
);

/* ===========================
   DELETE FILES ON REFRESH
=========================== */

window.addEventListener(
    "beforeunload",
    function () {

        navigator.sendBeacon(
            "/delete-extracted-files"
        );

    }
);

/* ===========================
   DARK MODE
=========================== */

darkModeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark-mode"
        );

    }
);

/* ===========================
   PREVIEW EXTRACTED TEXT
=========================== */

function previewExtractedText(fileName) {

    fetch(

        "/preview-extracted-text?fileName="
        +
        encodeURIComponent(fileName)

    )

    .then(

        response => {

            if (!response.ok) {

                throw new Error();

            }

            return response.text();

        }

    )

    .then(

        text => {

            previewTextArea.value =
                text;

            const modal =
                new bootstrap.Modal(

                    document.getElementById(
                        "textPreviewModal"
                    )

                );

            modal.show();

        }

    )

    .catch(

        function () {

            alert(
                "Unable to preview the extracted text."
            );

        }

    );

}