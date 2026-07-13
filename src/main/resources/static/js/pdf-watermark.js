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

const watermarkText =
    document.getElementById(
        "watermarkText"
    );

const textSize =
    document.getElementById(
        "textSize"
    );

const imageSize =
    document.getElementById(
        "imageSize"
    );

const watermarkImage =
    document.getElementById(
        "watermarkImage"
    );

const watermarkPreviewBox =
    document.getElementById(
        "watermarkPreviewBox"
    );

const opacity =
    document.getElementById(
        "opacity"
    );

const opacityValue =
    document.getElementById(
        "opacityValue"
    );

const watermarkForm =
    document.getElementById(
        "watermarkForm"
    );

const uploadSection =
    document.getElementById(
        "uploadSection"
    );

const progressSection =
    document.getElementById(
        "progressSection"
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

pdfFiles.addEventListener(
    "change",
    function () {

        addFiles(
            Array.from(this.files)
        );

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

        renderFiles();

    }
);

/* ===========================
   ADD FILES
=========================== */

function addFiles(newFiles) {

    const duplicateFiles = [];

    newFiles.forEach(file => {

        if (file.type !== "application/pdf") {

            alert(file.name + " is not a PDF file.");

            return;

        }

        if (file.size > 50 * 1024 * 1024) {

            alert(file.name + " exceeds the 50 MB limit.");

            return;

        }

        const alreadyExists =
            selectedFiles.some(
                existingFile =>
                    existingFile.name === file.name &&
                    existingFile.size === file.size
            );

        if (alreadyExists) {

            duplicateFiles.push(file.name);

        }
        else {

            selectedFiles.push(file);

        }

    });

    if (duplicateFiles.length > 0) {

        alert(
            "Duplicate file(s) skipped:\n\n" +
            duplicateFiles.join("\n")
        );

    }

    renderFiles();

}

/* ===========================
   FILE RENDER
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
        +
        " MB";

}


document
    .querySelectorAll(
        'input[name="watermarkType"]'
    )
    .forEach(
        radio => {

            radio.addEventListener(
                "change",
                function () {

                    if (this.value === "text") {

                        document.getElementById(
                            "textWatermarkSection"
                        ).style.display =
                            "block";

                        document.getElementById(
                            "imageWatermarkSection"
                        ).style.display =
                            "none";

                    }
                    else {

                        document.getElementById(
                            "textWatermarkSection"
                        ).style.display =
                            "none";

                        document.getElementById(
                            "imageWatermarkSection"
                        ).style.display =
                            "block";

                    }

                }
            );

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

    renderFiles();

}

/* ===========================
   PDF PREVIEW
=========================== */

function previewPdf(index) {

    const file =
        selectedFiles[index];

    const url =
        URL.createObjectURL(file);

    document.getElementById(
        "pdfPreviewFrame"
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


watermarkText.addEventListener(
    "input",
    function () {

        watermarkPreviewBox.innerHTML =
            this.value;

        watermarkPreviewBox.style.fontSize =
            textSize.value + "px";

    }
);

textSize.addEventListener(
    "input",
    function () {

        watermarkPreviewBox.style.fontSize =
            this.value + "px";

    }
);

watermarkImage.addEventListener(
    "change",
    function () {

        const file = this.files[0];

        if (!file) return;

        const reader =
            new FileReader();

        reader.onload =
            function (e) {

                watermarkPreviewBox.innerHTML =
                    `<img src="${e.target.result}"
                   style="max-width:${imageSize.value}px;">`;

            };

        reader.readAsDataURL(file);

    }
);

/* ===========================
   OPACITY
=========================== */

opacity.addEventListener(
    "input",
    function () {

        opacityValue.innerHTML =
            this.value
            +
            "%";

    }
);
/* ===========================
   FORM SUBMIT
=========================== */

watermarkForm.addEventListener(
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
                "Please select PDF files."
            );

            return;

        }

        convertBtn.disabled = true;

        uploadSection.style.display =
            "none";

        progressSection.style.display =
            "block";

        document.body.classList.add(
            "conversion-active"
        );

        progressSection.style.display = "block";

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
                    "pdfFiles",
                    file
                );

            }
        );

        formData.append(
            "watermarkText",
            watermarkText.value
        );

        formData.append(
            "textSize",
            textSize.value
        );

        formData.append(
            "imageSize",
            imageSize.value
        );

        formData.append(
            "opacity",
            opacity.value
        );

        const imageFile =
            watermarkImage.files[0];

        if (imageFile) {

            formData.append(
                "watermarkImage",
                imageFile
            );

        }

        formData.append(
            "position",
            document.querySelector(
                'input[name="position"]:checked'
            ).value
        );

        formData.append(
            "watermarkType",
            document.querySelector(
                'input[name="watermarkType"]:checked'
            ).value
        );

        fetch(
            "/watermark-pdf-ajax",
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

                        buildResult(result);

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
   RESULT
=========================== */

function buildResult(result) {

    uploadSection.style.display =
        "none";

    progressSection.style.display =
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

                            <a
                              href="/preview-watermarked-pdf?fileName=${file.name}"
                              target="_blank"
                              class="btn btn-primary btn-sm">

                              Preview

                            </a>

                        </div>

                        <div class="col-md-3">

                            <a
                              href="/download-watermarked-pdf?fileName=${file.name}"
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
   WATERMARK MORE
=========================== */

document.getElementById(
    "watermarkMoreBtn"
).addEventListener(
    "click",
    function () {

        selectedFiles = [];

        conversionCompleted = false;

        fetch(
            "/delete-watermark-files",
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

