/* ===========================
   ELEMENTS
=========================== */

const pdfFile =
    document.getElementById(
        "pdfFile"
    );

const dropZone =
    document.getElementById(
        "dropZone"
    );

const compressForm =
    document.getElementById(
        "compressForm"
    );

const uploadSection =
    document.getElementById(
        "uploadSection"
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

const compressBtn =
    document.getElementById(
        "compressBtn"
    );

const progressSection =
    document.getElementById(
        "progressSection"
    );

const settingsSection =
    document.getElementById("settingsSection");

const progressBar =
    document.getElementById(
        "progressBar"
    );

const resultCard =
    document.getElementById(
        "resultCard"
    );

const compressMoreBtn =
    document.getElementById(
        "compressMoreBtn"
    );

const previewFrame =
    document.getElementById(
        "previewFrame"
    );

const darkModeBtn =
    document.getElementById(
        "darkModeBtn"
    );


let selectedFiles = [];

/* ===========================
   FILE SELECT
=========================== */

pdfFile.addEventListener(
    "change",
    function () {

        const newFiles =
            Array.from(
                this.files
            );

        const duplicateFiles = [];

        newFiles.forEach(file => {

            /* File Type Validation */

            const fileName =
                file.name.toLowerCase();

            if (
                !fileName.endsWith(".pdf")
            ) {

                alert(
                    `"${file.name}" is not a valid PDF file.\n\nOnly PDF files are allowed.`
                );

                return;

            }

            /* File Size Validation */

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

            const isDuplicate =
                selectedFiles.some(
                    existingFile =>

                        existingFile.name === file.name &&
                        existingFile.size === file.size &&
                        existingFile.lastModified === file.lastModified
                );

            if (isDuplicate) {

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

        /* Duplicate Alert */

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

        /* Reset Input */

        this.value = "";

        /* Refresh UI */

        showFiles();

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

            /* File Type Validation */

            const fileName =
                file.name.toLowerCase();

            if (
                !fileName.endsWith(".pdf")
            ) {

                alert(
                    `"${file.name}" is not a valid PDF file.\n\nOnly PDF files are allowed.`
                );

                return;

            }

            /* File Size Validation */

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

            const isDuplicate =
                selectedFiles.some(
                    existingFile =>

                        existingFile.name === file.name &&
                        existingFile.size === file.size &&
                        existingFile.lastModified === file.lastModified
                );

            if (isDuplicate) {

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

        /* Duplicate Alert */

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

        showFiles();

    }
);
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

        totalFiles.innerHTML =
            "0";

        totalSize.innerHTML =
            "0 MB";

        pdfFile.value =
            "";

        return;

    }

    showFiles();

}
/* ===========================
PREVIEW ORIGINAL PDF
=========================== */

function previewPdf(index) {


    const file =
        selectedFiles[index];

    const url =
        URL.createObjectURL(file);

    document.getElementById(
        "previewFrame"
    ).src = url;

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "pdfPreviewModal"
            )
        );

    modal.show();


}

/* ===========================
PREVIEW COMPRESSED PDF
=========================== */

function previewCompressedPdf(
    fileName
) {


    document.getElementById(
        "previewFrame"
    ).src =
        "/preview-compressed-pdf?fileName="
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

    const container =
        document.getElementById(
            "compressedFilesContainer"
        );

    container.innerHTML =
        "";

    result.files.forEach(
        file => {

            container.innerHTML += `

<div class="card mb-2">

    <div class="card-body">

        <div class="row align-items-center text-center">

            <div class="col-md-3">

                <i class="bi bi-file-earmark-pdf-fill text-danger me-2"></i>

                ${file.name}

            </div>

            <div class="col-md-2">

                ${file.originalSize}

            </div>

            <div class="col-md-2">

                ${file.compressedSize}

            </div>

            <div class="col-md-1 text-success fw-bold">

                ${file.saved}

            </div>

            <div class="col-md-1 text-primary fw-bold">

                ${file.reduction}

            </div>

            <div class="col-md-1">

                <button
                    class="btn btn-primary btn-sm"
                    onclick="previewCompressedPdf('${file.name}')">

                    Preview

                </button>

            </div>

            <div class="col-md-2">

                <a
                    href="/download-compressed-pdf?fileName=${file.name}"
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
   COMPRESS PDF
=========================== */


compressForm.addEventListener(
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

        compressBtn.disabled =
            true;

        pdfFile.disabled =
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

        compressBtn.style.display =
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
            "compressionLevel",
            document.getElementById(
                "compressionLevel"
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
                            * 100
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

                            compressBtn.style.display =
                                "inline-block";

                            compressBtn.disabled =
                                false;

                            pdfFile.disabled =
                                false;

                            dropZone.style.pointerEvents =
                                "auto";

                            alert(
                                result.message
                            );

                        }

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

                        compressBtn.style.display =
                            "inline-block";

                        compressBtn.disabled =
                            false;

                        pdfFile.disabled =
                            false;

                        dropZone.style.pointerEvents =
                            "auto";

                        alert(
                            "Server Error (" +
                            xhr.status +
                            "). Please try again."
                        );

                    }

                }

            };

        xhr.onerror =
            function () {

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

                compressBtn.style.display =
                    "inline-block";

                compressBtn.disabled =
                    false;

                pdfFile.disabled =
                    false;

                dropZone.style.pointerEvents =
                    "auto";

                alert(
                    "Compression failed. Please try again."
                );

            };
        xhr.open(
            "POST",
            "/pdf-compressor-ajax"
        );

        xhr.send(
            formData
        );

    }
);
/* ===========================
   SHOW FILES
=========================== */

function showFiles() {

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
   COMPRESS MORE
=========================== */

compressMoreBtn.addEventListener(
    "click",
    function () {

        fetch(
            "/delete-compressed-pdfs",
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
