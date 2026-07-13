/* ===========================
   ELEMENTS
=========================== */

const excelFiles =
    document.getElementById(
        "excelFiles"
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

const excelToPdfForm =
    document.getElementById(
        "excelToPdfForm"
    );

const convertBtn =
    document.getElementById(
        "convertBtn"
    );

const progressContainer =
    document.getElementById(
        "progressContainer"
    );

const progressBar =
    document.getElementById(
        "progressBar"
    );

let selectedFiles = [];

/* ===========================
   FILE SELECT
=========================== */

excelFiles.addEventListener(
    "change",
    function () {

        let duplicateFiles = [];

        Array.from(this.files)
            .forEach(file => {

                const exists =
                    selectedFiles.some(
                        f =>
                            f.name === file.name
                            &&
                            f.size === file.size
                    );

                if (exists) {

                    duplicateFiles.push(
                        file.name
                    );

                    return;
                }

                selectedFiles.push(file);

            });

        if (
            duplicateFiles.length > 0
        ) {

            alert(
                "These files already exist:\n\n"
                +
                [...new Set(duplicateFiles)]
                    .join("\n")
            );

        }

        renderFiles();

        this.value = "";

    }
);

/* ===========================
   DRAG DROP
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

        let duplicateFiles = [];

        Array.from(
            e.dataTransfer.files
        )
            .forEach(file => {

                const exists =
                    selectedFiles.some(
                        f =>
                            f.name === file.name
                            &&
                            f.size === file.size
                    );

                if (exists) {

                    duplicateFiles.push(
                        file.name
                    );

                    return;
                }

                selectedFiles.push(file);

            });

        if (
            duplicateFiles.length > 0
        ) {

            alert(
                "These files already exist:\n\n"
                +
                [...new Set(duplicateFiles)]
                    .join("\n")
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

            <div class="card">

                <div class="card-body">

                    <div class="row align-items-center">

                        <div class="col-md-5 file-row-name">

                            <i class="bi bi-file-earmark-excel-fill"></i>

                            ${file.name}

                        </div>

                        <div class="col-md-2 text-center">

                            ${(file.size / 1024 / 1024).toFixed(2)} MB

                        </div>

                        <div class="col-md-2 text-center">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewExcel(${index})">

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

    if (
        selectedFiles.length === 0
    ) {
        excelFiles.value = "";
    }

}

/* ===========================
   EXCEL PREVIEW
=========================== */

function previewExcel(index) {

    const file = selectedFiles[index];

    const reader = new FileReader();

    reader.onload = function (e) {

        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data, {
            type: "array"
        });

        const firstSheet =
            workbook.SheetNames[0];

        const worksheet =
            workbook.Sheets[firstSheet];

        const html =
            XLSX.utils.sheet_to_html(worksheet);

        document.querySelector(
            "#pdfPreviewModal .modal-title"
        ).innerHTML =
            file.name;

        document.getElementById(
            "excelPreviewContainer"
        ).style.display = "block";

        document.getElementById(
            "pdfPreviewFrame"
        ).style.display = "none";

        document.getElementById(
            "excelPreviewContainer"
        ).innerHTML =
            html;

        new bootstrap.Modal(
            document.getElementById(
                "pdfPreviewModal"
            )
        ).show();

    };

    reader.readAsArrayBuffer(file);

}
/* ===========================
   SUBMIT
=========================== */

excelToPdfForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        if (selectedFiles.length === 0) {

            alert(
                "Please select Excel files"
            );

            return;

        }

        if (
            !validateFiles(
                selectedFiles
            )
        ) {
            return;
        }

        const formData =
            new FormData();

        selectedFiles.forEach(
            file => {

                formData.append(
                    "excelFiles",
                    file
                );

            }
        );

        formData.append(
            "orientation",
            document.querySelector(
                'input[name="orientation"]:checked'
            ).value
        );

        formData.append(
            "paperSize",
            document.querySelector(
                'input[name="paperSize"]:checked'
            ).value
        );

        formData.append(
            "scaling",
            document.querySelector(
                'input[name="scaling"]:checked'
            ).value
        );

        formData.append(
            "quality",
            document.querySelector(
                'input[name="quality"]:checked'
            ).value
        );

        /* Freeze UI */

        convertBtn.disabled =
            true;

        excelFiles.disabled =
            true;

        document
            .querySelectorAll(
                ".btn-danger"
            )
            .forEach(
                btn =>
                    btn.disabled =
                    true
            );

        document
            .querySelectorAll(
                ".btn-primary"
            )
            .forEach(
                btn =>
                    btn.disabled =
                    true
            );

        /* Hide upload section */

        document.getElementById(
            "uploadSection"
        ).style.display =
            "none";

        progressContainer.style.display =
            "block";
        progressBar.style.width =
            "25%";

        progressBar.innerHTML =
            "25%";

        setTimeout(() => {
            fetch(
                "/excel-to-pdf-ajax",
                {
                    method: "POST",
                    body: formData
                }
            )
                .then(
                    response => {

                        if (
                            !response.ok
                        ) {
                            throw new Error(
                                "Server error"
                            );
                        }

                        return response.json();

                    }
                )
                .then(
                    result => {

                        progressBar.style.width =
                            "75%";

                        progressBar.innerHTML =
                            "75%";

                        if (
                            result.success
                        ) {
                            progressBar.style.width =
                                "100%";

                            progressBar.innerHTML =
                                "100%";

                            setTimeout(() => {

                                progressContainer.style.display =
                                    "none";

                            }, 500);
                            buildResult(
                                result
                            );

                        }
                        else {

                            convertBtn.disabled =
                                false;

                            excelFiles.disabled =
                                false;

                            document
                                .querySelectorAll(
                                    ".btn-danger"
                                )
                                .forEach(
                                    btn =>
                                        btn.disabled =
                                        false
                                );

                            document
                                .querySelectorAll(
                                    ".btn-primary"
                                )
                                .forEach(
                                    btn =>
                                        btn.disabled =
                                        false
                                );

                            document.getElementById(
                                "uploadSection"
                            ).style.display =
                                "block";

                            progressContainer.style.display =
                                "none";

                            progressBar.style.width =
                                "0%";

                            progressBar.innerHTML =
                                "0%";

                            alert(
                                result.message
                            );

                        }

                    }
                )
                .catch(
                    error => {

                        convertBtn.disabled =
                            false;

                        excelFiles.disabled =
                            false;

                        document
                            .querySelectorAll(
                                ".btn-danger"
                            )
                            .forEach(
                                btn =>
                                    btn.disabled =
                                    false
                            );

                        document
                            .querySelectorAll(
                                ".btn-primary"
                            )
                            .forEach(
                                btn =>
                                    btn.disabled =
                                    false
                            );

                        document.getElementById(
                            "uploadSection"
                        ).style.display =
                            "block";
                        progressContainer.style.display =
                            "none";

                        progressBar.style.width =
                            "0%";

                        progressBar.innerHTML =
                            "0%";
                        alert(
                            error.message ||
                            "Conversion failed."
                        );

                    }
                );
        }, 100);

    }
);



/* ===========================
   RESULT
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
            "resultFilesContainer"
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

                        <div class="col-md-3">

                            <button
                                class="btn btn-primary btn-sm"
                                onclick="previewResultPdf('${file.name}')">

                                Preview

                            </button>

                        </div>

                        <div class="col-md-3">

                            <a
                               href="/download-converted-pdf?fileName=${file.name}"
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
   RESULT PREVIEW
=========================== */
function previewResultPdf(fileName){

    document.getElementById(
        "excelPreviewContainer"
    ).style.display = "none";

    document.getElementById(
        "pdfPreviewFrame"
    ).style.display = "block";

    document.getElementById(
        "pdfPreviewFrame"
    ).src =
        "/preview-converted-pdf?fileName="
        +
        encodeURIComponent(fileName);

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
            "/delete-temp-files",
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



function validateFiles(files) {

    for (const file of files) {

        const fileName =
            file.name.toLowerCase();

        if (
            file.size >
            50 * 1024 * 1024
        ) {
            alert(
                file.name +
                " exceeds 50 MB."
            );

            return false;
        }

        const validType =
            file.type ===
            "application/vnd.ms-excel"
            ||
            file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        const validExtension =
            fileName.endsWith(".xls")
            ||
            fileName.endsWith(".xlsx");

        if (
            !validType &&
            !validExtension
        ) {
            alert(
                file.name +
                " is not a valid Excel file."
            );

            return false;
        }
    }

    return true;
}