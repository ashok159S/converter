const fileInput =
    document.getElementById("pdfFile");

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

const form =
    document.getElementById("convertForm");

const progressSection =
    document.getElementById("progressSection");

const progressBar =
    document.getElementById("progressBar");

const uploadAreaWrapper =
    document.getElementById(
        "uploadAreaWrapper"
    );

const settingsCard =
    document.getElementById(
        "settingsCard"
    );

const convertBtn =
    document.getElementById(
        "convertBtn"
    );

const resultCard =
    document.getElementById(
        "resultCard"
    );

const imageDownloads =
    document.getElementById(
        "imageDownloads"
    );

let conversionCompleted =
    false;

let selectedFiles = [];
/* ===========================
   ADD MORE FILES
=========================== */

addMoreBtn.addEventListener(
    "click",
    function () {

        fileInput.click();

    }
);

/* ===========================
   FILE INPUT
=========================== */

fileInput.addEventListener(
    "change",
    function () {

        if (
            this.files.length === 0
        ) {

            return;

        }

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
   HELPER FUNCTIONS
=========================== */

function addFiles(newFiles) {

    let duplicateNames = [];

    newFiles.forEach(
        file => {

            if (
                file.type !==
                "application/pdf"
            ) {

                alert(
                    "Only PDF files are allowed."
                );

                return;

            }

            const exists =
                selectedFiles.some(
                    existingFile =>

                        existingFile.name === file.name
                        &&
                        existingFile.size === file.size
                );

            if (
                exists
            ) {

                duplicateNames.push(
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
        duplicateNames.length > 0
    ) {

        alert(

            "The following duplicate file(s) were skipped:\n\n• "
            +
            duplicateNames.join(
                "\n• "
            )

        );

    }

    renderFiles();

}/* ===========================
   RENDER FILES
=========================== */

function renderFiles() {

    fileList.innerHTML = "";

    if (

        selectedFiles.length === 0

    ) {

        summaryCard.classList.add(
            "d-none"
        );

        totalFiles.innerHTML = "0";

        totalSize.innerHTML = "0 MB";

        return;

    }

    summaryCard.classList.remove(
        "d-none"
    );

    let totalBytes = 0;

    selectedFiles.forEach(
        (
            file,
            index
        ) => {

            totalBytes += file.size;

            fileList.innerHTML += `

            <div class="card shadow-sm">

                <div class="card-body">

                    <div class="row align-items-center">

                        <div class="col-md-5">

                            <i class="bi bi-file-earmark-pdf-fill
                                      text-danger fs-2 me-2"
                               style="cursor:pointer"
                               onclick="previewSelectedPdf(${index})">
                            </i>

                            <a href="#"
                               onclick="previewSelectedPdf(${index});
                                        return false;">

                                ${file.name}

                            </a>

                        </div>

                        <div class="col-md-2">

                            ${(file.size / 1024 / 1024).toFixed(2)} MB

                        </div>

                        <div class="col-md-2">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm px-4"
                                onclick="previewSelectedPdf(${index})">

                                Preview

                            </button>

                        </div>

                        <div class="col-md-3">

                            <button
                                type="button"
                                class="btn btn-danger btn-sm px-4"
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

}/* ===========================
   CONVERT
=========================== */

form.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        if (
            conversionCompleted
        ) {
            return;
        }

        if (
            !validateFiles(selectedFiles)
        ) {
            return;
        }

        if (
            selectedFiles.length === 0
        ) {

            alert(
                "Please select one or more PDF files."
            );

            return;

        }

        uploadAreaWrapper.style.display = "none";

        summaryCard.style.display = "none";

        fileList.style.display = "none";

        settingsCard.style.display = "none";

        progressSection.style.display = "block";

        progressBar.style.width = "0%";
        progressBar.innerHTML = "Preparing...";

        document.body.classList.add("converting");

        convertBtn.disabled = true;

        /* Force browser to repaint */
        progressSection.offsetHeight;

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
            "quality",
            document.querySelector(
                '[name="quality"]'
            ).value
        );

        formData.append(
            "outputFormat",
            document.querySelector(
                '[name="outputFormat"]'
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
                            ) * 100
                        );

                    progressBar.style.width =
                        percent + "%";

                    progressBar.innerHTML =
                        "Uploading " + percent + "%";

                }

            }
        );

        xhr.onloadstart = function () {

            progressSection.style.display = "block";

            progressBar.style.width = "5%";

            progressBar.innerHTML = "Preparing...";

        };

        xhr.onreadystatechange = function () {

            if (xhr.readyState === 4) {

                if (xhr.status === 200) {
                    progressBar.style.width = "100%";

                    progressBar.innerHTML = "Finalizing...";

                    const result = JSON.parse(xhr.responseText);

                    console.log(result);
                    console.log(result.files);

                    if (result.success) {

                        console.log("SUCCESS");

                        conversionCompleted = true;

                        document.body.classList.remove("converting");

                        convertBtn.disabled = false;

                        /* ===========================
                           HIDE CONVERSION PAGE
                        =========================== */

                        uploadAreaWrapper.style.display = "none";
                        summaryCard.style.display = "none";
                        fileList.style.display = "none";
                        settingsCard.style.display = "none";
                        progressSection.style.display = "none";

                        /* ===========================
                           SHOW RESULT PAGE
                        =========================== */

                        resultCard.style.display = "block";

                        const downloads = imageDownloads;

                        downloads.innerHTML = "";

                        let html = "";

                        result.files.forEach((file, index) => {

                            console.log("Creating button for:", file.name);

                            html += `

                    <div class="card mb-2">

                        <div class="card-body">

                            <div class="row align-items-center text-center">

                                <div class="col-md-5 text-start">

                                    <input
                                        type="text"
                                        class="form-control"
                                        id="fileName${index}"
                                        value="${file.name}">

                                </div>

                                <div class="col-md-2">

                                    ${file.size}

                                </div>

                                <div class="col-md-2">

                                    <button
                                        type="button"
                                        class="btn btn-primary btn-sm px-4"
                                        onclick="previewImage('${file.name}')">

                                        Preview

                                    </button>

                                </div>

                                <div class="col-md-3">

                                    <button
                                        type="button"
                                        class="btn btn-success btn-sm px-4"
                                        onclick="downloadImage('${file.name}','fileName${index}')">

                                        Download

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                    `;

                        });

                        downloads.innerHTML = html;

                        resultCard.scrollIntoView({

                            behavior: "smooth",

                            block: "start"

                        });

                    } else {

                        alert(result.message);

                        uploadAreaWrapper.style.display = "";
                        summaryCard.style.display = "";
                        fileList.style.display = "";
                        settingsCard.style.display = "";

                        progressSection.style.display = "none";

                        document.body.classList.remove("converting");

                        convertBtn.disabled = false;

                    }

                } else {

                    alert("Conversion failed. Please try again.");

                    uploadAreaWrapper.style.display = "";
                    summaryCard.style.display = "";
                    fileList.style.display = "";
                    settingsCard.style.display = "";

                    progressSection.style.display = "none";

                    document.body.classList.remove("converting");

                    convertBtn.disabled = false;

                }

            }

        };

        xhr.onerror =
            function () {

                alert(
                    "Conversion failed. Please try again."
                );

                uploadAreaWrapper.style.display = "";

                summaryCard.style.display = "";

                fileList.style.display = "";

                settingsCard.style.display = "";

                progressSection.style.display =
                    "none";

                document.body.classList.remove(
                    "converting"
                );

                convertBtn.disabled =
                    false;

            };

        xhr.open(
            "POST",
            "/pdf-to-image-ajax"
        );

        setTimeout(function () {

            xhr.send(formData);

        }, 50);

    }
);
/* ===========================
   CONVERT MORE
=========================== */

document
    .getElementById(
        "convertMoreBtn"
    )
    .addEventListener(
        "click",
        function () {

            fetch(
                "/delete-pdf-to-image-files",
                {
                    method: "POST"
                }
            );

            conversionCompleted =
                false;

            selectedFiles = [];

            fileInput.value = "";

            fileList.innerHTML = "";

            imageDownloads.innerHTML = "";

            totalFiles.innerHTML =
                "0";

            totalSize.innerHTML =
                "0 MB";

            summaryCard.classList.add(
                "d-none"
            );



            progressBar.style.width =
                "0%";

            progressBar.innerHTML =
                "0%";
            resultCard.style.display = "none";

            uploadAreaWrapper.style.display = "";
            summaryCard.style.display = "";
            fileList.style.display = "";
            settingsCard.style.display = "";

            progressSection.style.display = "none";

            progressBar.style.width = "0%";
            progressBar.innerHTML = "0%";
            document.body.classList.remove(
                "converting"
            );

            convertBtn.disabled =
                false;

            resultCard.style.display =
                "none";

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

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



function previewImage(fileName) {

    document.getElementById(
        "resultPreviewImage"
    ).src =
        "/preview-image?fileName="
        + encodeURIComponent(fileName);

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "imageResultPreviewModal"
            )
        );

    modal.show();

}

function previewSelectedPdf(index) {

    const file =
        selectedFiles[index];

    if (!file) {

        return;

    }

    const fileUrl =
        URL.createObjectURL(
            file
        );

    document.getElementById(
        "pdfPreviewFrame"
    ).src =
        fileUrl;

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "pdfPreviewModal"
            )
        );

    modal.show();

}

function downloadImage(
    originalFileName,
    inputId
) {

    const newFileName =
        document.getElementById(
            inputId
        ).value;

    window.location.href =
        "/download-image?fileName="
        + encodeURIComponent(
            originalFileName
        )
        + "&downloadName="
        + encodeURIComponent(
            newFileName
        );

}

/* ===========================
   REMOVE FILE
=========================== */

function removeFile(index) {

    selectedFiles.splice(
        index,
        1
    );

    if (
        selectedFiles.length === 0
    ) {

        fileInput.value = "";

    }

    renderFiles();

    uploadAreaWrapper.classList.remove(
        "hide-during-conversion"
    );

    summaryCard.classList.remove(
        "hide-during-conversion"
    );

    fileList.classList.remove(
        "hide-during-conversion"
    );

    settingsCard.classList.remove(
        "hide-during-conversion"
    );

}