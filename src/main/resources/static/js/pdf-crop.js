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

const pdfCropForm =
    document.getElementById(
        "pdfCropForm"
    );

const uploadSection =
    document.getElementById(
        "uploadSection"
    );

const settingsSection =
    document.getElementById(
        "settingsSection"
    );

const cropBtn =
    document.getElementById(
        "cropBtn"
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

const croppedFilesContainer =
    document.getElementById(
        "croppedFilesContainer"
    );

const cropMoreBtn =
    document.getElementById(
        "cropMoreBtn"
    );

let selectedFiles = [];

/* ===========================
   FILE SELECT
=========================== */

pdfFiles.addEventListener(
    "change",
    function () {

        const newFiles =
            Array.from(
                this.files
            );

        const duplicateFiles = [];

        newFiles.forEach(file => {

            /* PDF Validation */

            if (
                !file.name.toLowerCase().endsWith(".pdf")
            ) {

                alert(
                    `"${file.name}" is not a valid PDF file.\n\nOnly PDF files are allowed.`
                );

                return;

            }

            /* Size Validation */

            if (
                file.size >
                50 * 1024 * 1024
            ) {

                alert(
                    `"${file.name}" exceeds the maximum file size of 50 MB.`
                );

                return;

            }

            /* Duplicate Validation */

            const duplicate =
                selectedFiles.some(
                    existingFile =>

                        existingFile.name === file.name &&
                        existingFile.size === file.size &&
                        existingFile.lastModified === file.lastModified
                );

            if (
                duplicate
            ) {

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

        if (
            duplicateFiles.length > 0
        ) {

            alert(

                "Duplicate PDF file(s) detected:\n\n"

                +

                duplicateFiles.join(
                    "\n"
                )

            );

        }

        this.value = "";

        renderFiles();

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

            /* PDF Validation */

            if (
                !file.name.toLowerCase().endsWith(".pdf")
            ) {

                alert(
                    `"${file.name}" is not a valid PDF file.\n\nOnly PDF files are allowed.`
                );

                return;

            }

            /* Size Validation */

            if (
                file.size >
                50 * 1024 * 1024
            ) {

                alert(
                    `"${file.name}" exceeds the maximum file size of 50 MB.`
                );

                return;

            }

            /* Duplicate Validation */

            const duplicate =
                selectedFiles.some(
                    existingFile =>

                        existingFile.name === file.name &&
                        existingFile.size === file.size &&
                        existingFile.lastModified === file.lastModified
                );

            if (
                duplicate
            ) {

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

        if (
            duplicateFiles.length > 0
        ) {

            alert(

                "Duplicate PDF file(s) detected:\n\n"

                +

                duplicateFiles.join(
                    "\n"
                )

            );

        }

        renderFiles();

    }
);
/* ===========================
   RENDER FILES
=========================== */

function renderFiles() {

    if (
        selectedFiles.length === 0
    ) {

        summaryCard.style.display =
            "none";

        fileListContainer.innerHTML =
            "";

        pdfFiles.value =
            "";

        return;

    }

    summaryCard.style.display =
        "flex";

    fileListContainer.innerHTML =
        "";

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

    if (
        selectedFiles.length === 0
    ) {

        summaryCard.style.display =
            "none";

        fileListContainer.innerHTML =
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

    const url =
        URL.createObjectURL(
            file
        );

    document.getElementById(
        "previewFrame"
    ).src =
        url;

    const modal =
        new bootstrap.Modal(

            document.getElementById(
                "pdfPreviewModal"
            )

        );

    modal.show();

}
/* ===========================
   CROP PDF
=========================== */

pdfCropForm.addEventListener(
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

        /* Freeze UI */

        cropBtn.disabled =
            true;

        pdfFiles.disabled =
            true;

        dropZone.style.pointerEvents =
            "none";

        summaryCard.style.display =
            "none";

        settingsSection.style.display =
            "none";

        fileListContainer.style.display =
            "none";

        dropZone.style.display =
            "none";

        cropBtn.style.display =
            "none";

        progressSection.style.display =
            "block";

        progressBar.style.width =
            "0%";

        progressBar.innerHTML =
            "0%";

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
            "cropAmount",
            document.querySelector(
                'input[name="cropAmount"]:checked'
            ).value
        );

        formData.append(
            "applyTo",
            document.querySelector(
                'input[name="applyTo"]:checked'
            ).value
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

                }

            }
        );

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

                            buildResultTable(
                                result
                            );

                        }
                        else {

                            progressSection.style.display =
                                "none";

                            settingsSection.style.display =
                                "block";

                            summaryCard.style.display =
                                "flex";

                            fileListContainer.style.display =
                                "block";

                            dropZone.style.display =
                                "block";

                            cropBtn.style.display =
                                "inline-block";

                            cropBtn.disabled =
                                false;

                            pdfFiles.disabled =
                                false;

                            dropZone.style.pointerEvents =
                                "auto";

                            alert(
                                "Server error. Please try again."
                            );

                        }

                    }

                }

            };

        xhr.onerror =
            function () {

                settingsSection.style.display =
                    "block";

                progressSection.style.display =
                    "none";

                summaryCard.style.display =
                    "flex";

                fileListContainer.style.display =
                    "block";

                dropZone.style.display =
                    "block";

                cropBtn.style.display =
                    "inline-block";

                cropBtn.disabled =
                    false;

                pdfFiles.disabled =
                    false;

                dropZone.style.pointerEvents =
                    "auto";

                alert(
                    "PDF cropping failed. Please try again."
                );

            };

        xhr.open(
            "POST",
            "/crop-pdf-ajax"
        );

        xhr.send(
            formData
        );

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

/* ===========================
   PREVIEW CROPPED PDF
=========================== */

function previewCroppedPdf(fileName) {

    document.getElementById(
        "previewFrame"
    ).src =
        "/preview-cropped-pdf?fileName="
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
   BUILD RESULT TABLE
=========================== */

function buildResultTable(result) {

    croppedFilesContainer.innerHTML =
        "";

    document.getElementById(
        "resultFiles"
    ).innerHTML =
        result.files.length;

    document.getElementById(
        "resultSuccess"
    ).innerHTML =
        result.files.length;

    result.files.forEach(
        file => {

            croppedFilesContainer.innerHTML += `

<div class="card mb-2">

    <div class="card-body">

        <div class="row align-items-center text-center">

            <div class="col-md-4">

                <i class="bi bi-file-earmark-pdf-fill text-danger me-2"></i>

                ${file.name}

            </div>

            <div class="col-md-2">

                ${file.pages}

            </div>

            <div class="col-md-2">

                ${file.cropAmount}

            </div>

            <div class="col-md-2">

                <button
                    class="btn btn-primary btn-sm"
                    onclick="previewCroppedPdf('${file.name}')">

                    Preview

                </button>

            </div>

            <div class="col-md-2">

                <a
                    href="/download-cropped-pdf?fileName=${file.name}"
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

}

/* ===========================
   CROP MORE
=========================== */

cropMoreBtn.addEventListener(

    "click",

    function () {

        fetch(

            "/delete-cropped-pdfs",

            {

                method: "POST"

            }

        )
            .finally(

                () => {

                    location.reload();

                }

            );

    }

);

