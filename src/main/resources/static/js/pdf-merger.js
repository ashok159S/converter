const fileInput =
    document.getElementById("pdfFiles");

const fileList =
    document.getElementById("fileList");

const dropZone =
    document.getElementById("dropZone");

const addMoreBtn =
    document.getElementById("addMoreBtn");

const summaryCard =
    document.getElementById("summaryCard");

const totalFiles =
    document.getElementById("totalFiles");

const totalSize =
    document.getElementById("totalSize");

const mergeForm =
    document.getElementById("mergeForm");

const progressSection =
    document.getElementById("progressSection");

const progressBar =
    document.getElementById("progressBar");


    const uploadSection =
    document.getElementById("uploadSection");

const mergeButtonSection =
    document.getElementById("mergeButtonSection");

const resultCard =
    document.getElementById("resultCard");

const mergeBtn =
    document.getElementById("mergeBtn");

const convertMoreBtn =
    document.getElementById("convertMoreBtn");

const downloadBtn =
    document.getElementById("downloadBtn");

const previewBtn =
    document.getElementById("previewBtn");

const pdfName =
    document.getElementById("pdfName");

const pdfSize =
    document.getElementById("pdfSize");

let selectedFiles = [];

/* ===========================
   ADD MORE
=========================== */

addMoreBtn.addEventListener(
    "click",
    () => {

        fileInput.value = "";

        fileInput.click();

    }
);

/* ===========================
   FILE INPUT
=========================== */

fileInput.addEventListener(
    "change",
    function () {

        const incoming =
            Array.from(this.files);

        let duplicateFiles = [];

        let invalidFiles = [];

        incoming.forEach(file => {

            if (
                file.type !== "application/pdf"
            ) {

                invalidFiles.push(file.name);

                return;

            }

            const duplicate =
                selectedFiles.some(existingFile =>

                    existingFile.name === file.name &&
                    existingFile.size === file.size

                );

            if (duplicate) {

                duplicateFiles.push(file.name);

            } else {

                selectedFiles.push(file);

            }

        });

        if (invalidFiles.length > 0) {

            alert(
                "Only PDF files are allowed.\n\n" +
                invalidFiles.join("\n")
            );

        }

        if (duplicateFiles.length > 0) {

            alert(
                "Duplicate file(s) skipped:\n\n" +
                duplicateFiles.join("\n")
            );

        }

        renderFiles();

        fileInput.value = "";

    }
);
/* ===========================
   DRAG DROP
=========================== */

dropZone.addEventListener(
    "dragover",
    e => {

        e.preventDefault();

        dropZone.classList.add(
            "drag-active"
        );

    }
);

dropZone.addEventListener(
    "dragleave",
    () => {

        dropZone.classList.remove(
            "drag-active"
        );

    }
);

dropZone.addEventListener(
    "drop",
    e => {

        e.preventDefault();

        dropZone.classList.remove(
            "drag-active"
        );

        const incoming =
            Array.from(
                e.dataTransfer.files
            );

        let duplicateFiles = [];

        let invalidFiles = [];

        incoming.forEach(file => {

            if (
                file.type !== "application/pdf"
            ) {

                invalidFiles.push(file.name);

                return;

            }

            const duplicate =
                selectedFiles.some(existingFile =>

                    existingFile.name === file.name &&
                    existingFile.size === file.size

                );

            if (duplicate) {

                duplicateFiles.push(file.name);

            } else {

                selectedFiles.push(file);

            }

        });

        if (invalidFiles.length > 0) {

            alert(
                "Only PDF files are allowed.\n\n" +
                invalidFiles.join("\n")
            );

        }

        if (duplicateFiles.length > 0) {

            alert(
                "Duplicate file(s) skipped:\n\n" +
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

    fileList.innerHTML = "";

    if (selectedFiles.length === 0) {

        summaryCard.classList.add(
            "d-none"
        );

        return;

    }

    summaryCard.classList.remove(
        "d-none"
    );

    totalFiles.innerHTML =
        selectedFiles.length;

    let bytes = 0;

    selectedFiles.forEach(
        file => {

            bytes += file.size;

        }
    );

    totalSize.innerHTML =
        (
            bytes /
            1024 /
            1024
        ).toFixed(2) + " MB";

    selectedFiles.forEach(
        (file, index) => {

            fileList.innerHTML += `
<div class="card mb-2 file-row">

    <div class="card-body">

        <div class="row align-items-center text-center">

            <div class="col-3 text-start file-row-name">

                <i class="bi bi-file-earmark-pdf-fill"></i>

                ${file.name}

            </div>

            <div class="col-3 file-row-size">

                ${(file.size / 1024 / 1024).toFixed(2)} MB

            </div>

            <div class="col-3">

                <button
                    type="button"
                    class="btn btn-primary preview-btn"
                    onclick="previewSourcePdf(${index})">

                    Preview

                </button>

            </div>

            <div class="col-3">

                <button
                    type="button"
                    class="btn btn-danger delete-btn"
                    onclick="removeFile(${index})">

                    Delete

                </button>

            </div>

        </div>

    </div>

</div>
`;

        }
    );

}

function removeFile(index) {

    selectedFiles.splice(
        index,
        1
    );

    renderFiles();

}/* ===========================
   MERGE
=========================== */

mergeForm.addEventListener(
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

        if (selectedFiles.length < 2) {

            alert(
                "Please select at least 2 PDF files."
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

        /* Freeze UI */

        document.body.classList.add(
            "conversion-active"
        );

        uploadSection.style.display =
            "none";

        summaryCard.style.display =
            "none";

        fileList.style.display =
            "none";

        progressSection.style.display =
            "block";

        progressBar.style.width =
            "0%";

        progressBar.innerHTML =
            "0%";

        mergeBtn.disabled = true;

        mergeBtn.innerHTML =
            '<span class="spinner-border spinner-border-sm"></span> Merging...';

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

                        resultCard.style.display =
                            "block";

                        pdfName.value =
                            result.fileName;

                        pdfSize.innerHTML =
                            result.size;

                        setTimeout(() => {

                            progressSection.style.display =
                                "none";

                        }, 800);

                    } else {

                        alert(
                            result.message ||
                            "Merge failed."
                        );

                        uploadSection.style.display =
                            "block";

                        summaryCard.style.display =
                            "";

                        fileList.style.display =
                            "";

                        progressSection.style.display =
                            "none";

                    }

                } else {

                    alert(
                        "Server error while merging PDFs."
                    );

                    uploadSection.style.display =
                        "block";

                    summaryCard.style.display =
                        "";

                    fileList.style.display =
                        "";

                    progressSection.style.display =
                        "none";

                }

                mergeBtn.disabled =
                    false;

                mergeBtn.innerHTML =
                    "Merge PDFs";

                document.body.classList.remove(
                    "conversion-active"
                );

            };

        xhr.open(
            "POST",
            "/pdf-merger-ajax"
        );

        xhr.send(
            formData
        );

    }
);
/* ===========================
   DOWNLOAD
=========================== */

downloadBtn.addEventListener(
    "click",
    function (e) {

        e.preventDefault();

        const newName =
            pdfName.value;

        window.location.href =
            "/download-merged-pdf?downloadName="
            + encodeURIComponent(newName);

    }
);

/* ===========================
   PREVIEW
=========================== */

previewBtn.addEventListener(
    "click",
    function () {

        document.getElementById(
            "previewFrame"
        ).src =
            "/preview-merged-pdf";

        const modal =
            new bootstrap.Modal(
                document.getElementById(
                    "pdfPreviewModal"
                )
            );

        modal.show();

    }
);

/* ===========================
   MERGE MORE
=========================== */

convertMoreBtn.addEventListener(
    "click",
    function () {

        fetch(
            "/delete-merged-pdf",
            {
                method: "POST"
            }
        ).finally(() => {

            location.reload();

        });

    }
);

/* ===========================
   DELETE TEMP FILE
   ON RELOAD / TAB CLOSE
=========================== */

window.addEventListener(
    "beforeunload",
    function () {

        navigator.sendBeacon(
            "/delete-merged-pdf"
        );

    }
);

/* ===========================
   DARK MODE
=========================== */

document
.getElementById(
    "darkModeBtn"
)
.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );

    }
);

/* ===========================
   PREVIEW SOURCE PDF
=========================== */

function previewSourcePdf(index) {


    const file =
        selectedFiles[index];

    const url =
        URL.createObjectURL(file);

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