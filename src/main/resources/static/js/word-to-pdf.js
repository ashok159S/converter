/* ===========================
   ELEMENTS
=========================== */

const wordFiles =
    document.getElementById(
        "wordFiles"
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

const uploadSection =
    document.getElementById(
        "uploadSection"
    );

const progressBar =
    document.getElementById(
        "progressBar"
    );

const convertBtn =
    document.getElementById(
        "convertBtn"
    );

let conversionCompleted =
    false;

let selectedFiles = [];

/* ===========================
   FILE SELECT
=========================== */

wordFiles.addEventListener(
    "change",
    function () {

        addFiles(
            Array.from(
                this.files
            )
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

        const fileName =
            file.name.toLowerCase();

        if (
            !(
                fileName.endsWith(".doc")
                ||
                fileName.endsWith(".docx")
            )
        ) {

            alert(
                file.name +
                " is not a Word document."
            );

            return;

        }

        if (file.size > 50 * 1024 * 1024) {

            alert(
                file.name +
                " exceeds the 50 MB limit."
            );

            return;

        }

        const alreadyExists =
            selectedFiles.some(
                existingFile =>
                    existingFile.name === file.name &&
                    existingFile.size === file.size
            );

        if (alreadyExists) {

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
            "Duplicate file(s) skipped:\n\n"
            +
            duplicateFiles.join("\n")
        );

    }

    showFiles();

}

/* ===========================
   SHOW FILES
=========================== */
function showFiles() {

    if (selectedFiles.length === 0) {

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

            <div class="card">

                <div class="card-body">

                    <div class="row align-items-center">

                        <div class="col-md-5 file-row-name">

                            <i class="bi bi-file-earmark-word-fill"></i>

                            ${file.name}

                        </div>

                        <div class="col-md-2 text-center">

                            ${(file.size / 1024 / 1024).toFixed(2)} MB

                        </div>

                        <div class="col-md-2 text-center">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewWordFile(${index})">

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

    showFiles();

}

/* ===========================
   PREVIEW WORD FILE
=========================== */


function previewWordFile(index) {

    const file = selectedFiles[index];

    const size =
        (file.size / 1024 / 1024).toFixed(2);

    const extension =
        file.name.split(".").pop().toUpperCase();

    document.getElementById(
        "previewModalBody"
    ).innerHTML = `

        <div class="text-center">

            <i class="bi bi-file-earmark-word-fill"
               style="font-size:90px;color:#2563eb;"></i>

            <h4 class="mt-3">
                ${file.name}
            </h4>

            <hr>

            <p><strong>File Type:</strong> ${extension}</p>

            <p><strong>File Size:</strong> ${size} MB</p>

        </div>

    `;

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "wordPreviewModal"
            )
        );

    modal.show();

}


/* ===========================
   PREVIEW PDF
=========================== */

function previewPdf(fileName) {

    document.getElementById(
        "previewFrame"
    ).src =
        "/preview-word-pdf?fileName="
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
   CONVERT
=========================== */

convertForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        if (convertBtn.disabled) {

            return;

        }

        if (
            !validateFiles(selectedFiles)
        ) {

            return;

        }

        if (selectedFiles.length === 0) {

            alert(
                "Please select Word files."
            );

            return;

        }

        convertBtn.disabled =
            true;

        uploadSection.style.display =
            "none";

        document.getElementById(
            "dropZone"
        ).style.display =
            "none";

        summaryCard.style.display =
            "none";

        fileListContainer.style.display =
            "none";

        convertBtn.style.display =
            "none";

        progressSection.style.display =
            "block";
        let progress = 0;

        progressBar.style.width =
            "0%";

        progressBar.innerHTML =
            "0%";

        const progressInterval =
            setInterval(function () {

                if (progress < 95) {

                    progress++;

                    progressBar.style.width =
                        progress + "%";

                    progressBar.innerHTML =
                        progress + "%";

                }

            }, 100);

        const formData =
            new FormData();

        selectedFiles.forEach(
            file => {

                formData.append(
                    "wordFiles",
                    file
                );

            }
        );

        fetch(
            "/word-to-pdf-ajax",
            {
                method: "POST",
                body: formData
            }
        )
            .then(
                response =>
                    response.json()
            )
            .then(
                result => {

                    clearInterval(
                        progressInterval
                    );

                    progressBar.style.width =
                        "100%";

                    progressBar.innerHTML =
                        "100%";

                    conversionCompleted =
                        true;

                    if (result.success) {

                        setTimeout(function () {

                            buildResultTable(result);

                        }, 3000);

                    }
                    else {

                        alert(
                            result.message
                        );

                        uploadSection.style.display =
                            "block";

                        progressSection.style.display =
                            "none";

                        convertBtn.disabled =
                            false;

                        document.body.classList.remove(
                            "conversion-active"
                        );

                    }

                }
            )
            .catch(
                function () {

                    clearInterval(
                        progressInterval
                    );

                    alert(
                        "Conversion failed. Please try again."
                    );

                    uploadSection.style.display =
                        "block";

                    progressSection.style.display =
                        "none";

                    convertBtn.disabled =
                        false;

                    document.body.classList.remove(
                        "conversion-active"
                    );

                }
            );

    }
);
/* ===========================
   RESULT TABLE
=========================== */
function buildResultTable(result) {

    progressSection.style.display =
        "none";

    uploadSection.style.display =
        "none";

    document.getElementById(
        "resultCard"
    ).style.display =
        "block";

    convertBtn.disabled =
        false;

    document.body.classList.remove(
        "conversion-active"
    );

    const container =
        document.getElementById(
            "convertedFilesContainer"
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

                            ${file.originalSize}

                        </div>

                        <div class="col-md-2">

                            ${file.pdfSize}

                        </div>

                        <div class="col-md-2">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewPdf('${file.name}')">

                                Preview

                            </button>

                        </div>

                        <div class="col-md-2">

                            <a
                                href="/download-word-pdf?fileName=${file.name}"
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
   CONVERT MORE
=========================== */

document.getElementById(
    "convertMoreBtn"
).addEventListener(
    "click",
    function () {

        selectedFiles = [];

        conversionCompleted = false;

        fetch(
            "/delete-word-pdf-files",
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