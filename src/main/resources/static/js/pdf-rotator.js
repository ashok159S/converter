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

const rotateForm =
    document.getElementById(
        "rotateForm"
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

const settingsCard =
    document.getElementById("settingsCard");

const uploadAreaWrapper =
    document.getElementById(
        "uploadAreaWrapper"
    );

const rotateBtn =
    document.getElementById(
        "rotateBtn"
    );

const resultCard =
    document.getElementById(
        "resultCard"
    );

let selectedFiles = [];

let conversionCompleted =
    false;
/* ===========================
   FILE SELECT
=========================== */

pdfFiles.addEventListener(
    "change",
    function () {

        addFiles(
            Array.from(this.files)
        );

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

function addFiles(
    newFiles
) {

    let duplicateFiles = [];

    newFiles.forEach(
        file => {

            const exists =
                selectedFiles.some(
                    oldFile =>
                        oldFile.name === file.name
                        &&
                        oldFile.size === file.size
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

        }
    );

    if (
        duplicateFiles.length > 0
    ) {

        alert(

            "The following file(s) already exist:\n\n• "

            +

            duplicateFiles.join(
                "\n• "
            )

        );

    }

    showFiles();

}/* ===========================
   SHOW FILES
=========================== */

function showFiles() {

    if (selectedFiles.length === 0) {

        summaryCard.style.display =
            "none";

        fileListContainer.innerHTML =
            "";

        totalFiles.innerHTML =
            "0";

        totalSize.innerHTML =
            "0 MB";

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
        + " MB";

}

/* ===========================
   DELETE FILE
=========================== */

function deleteFile(
    index
) {

    selectedFiles.splice(
        index,
        1
    );

    pdfFiles.value =
        "";

    showFiles();

}

/* ===========================
   PREVIEW ORIGINAL PDF
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
   PREVIEW ROTATED PDF
=========================== */

function previewRotatedPdf(
    fileName
) {

    document.getElementById(
        "previewFrame"
    ).src =
        "/preview-rotated-pdf?fileName="
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
   ROTATE PDF
=========================== */

rotateForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        if (conversionCompleted) {

            return;

        }

        if (selectedFiles.length === 0) {

            alert("Please select one or more PDF files.");

            return;

        }

        if (!validateFiles(selectedFiles)) {

            return;

        }

        rotateBtn.disabled = true;

        rotateForm.classList.add("converting");

        /* ===========================
           SHOW PROGRESS PAGE
        =========================== */

        uploadSection.style.display = "none";

        resultCard.style.display = "none";

        progressSection.style.display = "block";

        progressBar.style.width = "5%";

        progressBar.innerHTML = "Preparing...";

        progressSection.offsetHeight;

        const formData = new FormData();

        selectedFiles.forEach(file => {

            formData.append("pdfFiles", file);

        });

        formData.append(
            "rotation",
            document.querySelector(
                'input[name="rotation"]:checked'
            ).value
        );

        const xhr = new XMLHttpRequest();

        let fakeProgress = 5;

        const timer = setInterval(() => {

            if (fakeProgress < 90) {

                fakeProgress += 5;

                progressBar.style.width = fakeProgress + "%";

                progressBar.innerHTML = fakeProgress + "%";

            }

        }, 200);

        xhr.onreadystatechange = function () {

            if (xhr.readyState !== 4) {

                return;

            }

            clearInterval(timer);

            rotateBtn.disabled = false;

            rotateForm.classList.remove("converting");

            if (xhr.status !== 200) {

                uploadSection.style.display = "block";

                progressSection.style.display = "none";

                alert("Conversion failed. Please try again.");

                return;

            }

            const result = JSON.parse(xhr.responseText);

            if (result.success) {

                progressBar.style.width = "100%";

                progressBar.innerHTML = "100%";

                setTimeout(() => {

                    conversionCompleted = true;

                    progressSection.style.display = "none";

                    uploadSection.style.display = "none";

                    resultCard.style.display = "block";

                    buildResultTable(result);

                }, 300);

            }
            else {

                uploadSection.style.display = "block";

                progressSection.style.display = "none";

                alert(result.message);

            }

        };

        xhr.onerror = function () {

            clearInterval(timer);

            rotateBtn.disabled = false;

            rotateForm.classList.remove("converting");

            uploadSection.style.display = "block";

            progressSection.style.display = "none";

            alert("Unable to connect to the server.");

        };

        xhr.open(
            "POST",
            "/pdf-rotator-ajax"
        );

        setTimeout(() => {

            xhr.send(formData);

        }, 150);

    }
);

/* ===========================
   RESULT TABLE
=========================== */

function buildResultTable(
    result
) {

    const container =
        document.getElementById(
            "rotatedFilesContainer"
        );

    container.innerHTML =
        "";

    result.files.forEach(
        file => {

            container.innerHTML += `

            <div class="card mb-2">

                <div class="card-body">

                    <div class="row text-center align-items-center">

                        <div class="col-md-4">

                            ${file.name}

                        </div>

                        <div class="col-md-2">

                            ${file.size}

                        </div>

                        <div class="col-md-2">

                            ${file.rotation}

                        </div>

                        <div class="col-md-2">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewRotatedPdf('${file.name}')">

                                Preview

                            </button>

                        </div>

                        <div class="col-md-2">

                            <a
                                class="btn btn-success btn-sm"
                                href="/download-rotated-pdf?fileName=${file.name}">

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

    if (
        result.files.length > 0
    ) {

        document.getElementById(
            "resultRotation"
        ).innerHTML =
            result.files[0].rotation;

    }

}

/* ===========================
   ROTATE MORE
=========================== */

document.getElementById(
    "rotateMoreBtn"
).addEventListener(
    "click",
    function () {

        fetch(
            "/delete-rotated-pdf-files",
            {
                method: "POST"
            }
        ).finally(
            () => {

                selectedFiles = [];

                conversionCompleted = false;

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