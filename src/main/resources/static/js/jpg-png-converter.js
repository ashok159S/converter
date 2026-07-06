/* ===========================
   ELEMENTS
=========================== */

const imageFiles =
    document.getElementById(
        "imageFiles"
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

const convertBtn =
document.getElementById(
    "convertBtn"
);

const uploadSection =
document.getElementById(
    "uploadSection"
);

const resultCard =
document.getElementById(
    "resultCard"
);

const darkModeBtn =
document.getElementById(
    "darkModeBtn"
);

let selectedFiles = [];

/* ===========================
   FILE SELECT
=========================== */

imageFiles.addEventListener(
    "change",
    function () {

        const newFiles =
            Array.from(
                this.files
            );

        const duplicateFiles = [];

        newFiles.forEach(file => {

            // File type validation

            const fileName =
                file.name.toLowerCase();

            if (
                !fileName.endsWith(".jpg") &&
                !fileName.endsWith(".jpeg") &&
                !fileName.endsWith(".png")
            ) {

                alert(
                    `"${file.name}" is not a valid image.\n\nOnly JPG, JPEG and PNG files are allowed.`
                );

                return;

            }

            // File size validation (50 MB)

            if (
                file.size >
                50 * 1024 * 1024
            ) {

                alert(
                    `"${file.name}" exceeds the maximum file size of 50 MB.`
                );

                return;

            }

            // Duplicate validation

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

        // Duplicate alert

        if (
            duplicateFiles.length > 0
        ) {

            alert(

                "Duplicate file(s) detected:\n\n"

                +

                duplicateFiles.join(
                    "\n"
                )

            );

        }

        // Reset file input

        this.value = "";

        // Refresh UI

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
                !fileName.endsWith(".jpg") &&
                !fileName.endsWith(".jpeg") &&
                !fileName.endsWith(".png")
            ) {

                alert(
                    `"${file.name}" is not a valid image.\n\nOnly JPG, JPEG and PNG files are allowed.`
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

                "Duplicate file(s) detected:\n\n"

                +

                duplicateFiles.join(
                    "\n"
                )

            );

        }

        /* Refresh Upload List */

        showFiles();

    }
);


/* ===========================
   SHOW FILES
=========================== */

function showFiles() {

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

            totalBytes += file.size;

            let defaultFormat =
                file.name.toLowerCase().endsWith(".png")
                    ?
                    "jpg"
                    :
                    "png";

            fileListContainer.innerHTML += `

            <div class="card">

                <div class="card-body">

                    <div class="row align-items-center">

                        <div class="col-md-3 file-row-name">

                            <i class="bi bi-image"></i>

                            ${file.name}

                        </div>

                        <div class="col-md-2 text-center">

                            ${(file.size / 1024 / 1024).toFixed(2)} MB

                        </div>

                        <div class="col-md-2 text-center">

                            <select
                                class="form-select convert-select"
                                id="format-${index}">

                                <option value="png"
                                ${defaultFormat === "png" ? "selected" : ""}>
                                PNG
                                </option>

                                <option value="jpg"
                                ${defaultFormat === "jpg" ? "selected" : ""}>
                                JPG
                                </option>

                            </select>

                        </div>

                        <div class="col-md-2 text-center">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewImage(${index})">

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

        imageFiles.value =
            "";

        return;

    }

    showFiles();

}

/* ===========================
   PREVIEW ORIGINAL IMAGE
=========================== */

function previewImage(index) {

    const file =
        selectedFiles[index];

    const url =
        URL.createObjectURL(file);

    document.getElementById(
        "previewImage"
    ).src =
        url;

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "imagePreviewModal"
            )
        );

    modal.show();

}

/* ===========================
   PREVIEW CONVERTED IMAGE
=========================== */

function previewConvertedImage(
    fileName
) {

    document.getElementById(
        "previewImage"
    ).src =
        "/preview-converted-image?fileName="
        +
        encodeURIComponent(
            fileName
        );

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "imagePreviewModal"
            )
        );

    modal.show();

}

/* ===========================
   CONVERT IMAGES
=========================== */

convertForm.addEventListener(
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
                "Please select images"
            );

            return;

        }
        /* Freeze UI */

        convertBtn.disabled = true;

        imageFiles.disabled = true;

        dropZone.style.pointerEvents =
            "none";

        summaryCard.style.display =
            "none";

        fileListContainer.style.display =
            "none";

        dropZone.style.display =
            "none";

        convertBtn.style.display =
            "none";

        progressSection.style.display =
            "block";

        const formData =
            new FormData();

        selectedFiles.forEach(
            (
                file,
                index
            ) => {

                formData.append(
                    "imageFiles",
                    file
                );

                formData.append(
                    "targetFormats",
                    document.getElementById(
                        `format-${index}`
                    ).value
                );

            }
        );


        progressBar.style.width =
            "0%";

        progressBar.innerHTML =
            "0%";

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
                    &&
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

                        summaryCard.style.display =
                            "flex";

                        fileListContainer.style.display =
                            "block";

                        dropZone.style.display =
                            "block";

                        convertBtn.style.display =
                            "inline-block";

                        convertBtn.disabled =
                            false;

                        imageFiles.disabled =
                            false;

                        dropZone.style.pointerEvents =
                            "auto";

                        alert(
                            result.message
                        );

                    }

                }

            };

        xhr.onerror =
            function () {

                progressSection.style.display =
                    "none";

                summaryCard.style.display =
                    "flex";

                fileListContainer.style.display =
                    "block";

                dropZone.style.display =
                    "block";

                convertBtn.style.display =
                    "inline-block";

                convertBtn.disabled =
                    false;

                imageFiles.disabled =
                    false;

                dropZone.style.pointerEvents =
                    "auto";

                alert(
                    "Conversion failed. Please try again."
                );

            };

        xhr.open(
            "POST",
            "/jpg-png-converter-ajax"
        );

        xhr.send(
            formData
        );

    }
);

/* ===========================
   RESULT TABLE
=========================== */

function buildResultTable(result) {

    const container =
        document.getElementById(
            "convertedFilesContainer"
        );

    container.innerHTML =
        "";

    result.files.forEach(
        file => {

            container.innerHTML += `

            <div class="card mb-2">

                <div class="card-body">

                    <div class="row text-center align-items-center">

                        <div class="col-md-3">

                            ${file.name}

                        </div>

                        <div class="col-md-2">

                            ${file.originalFormat}

                        </div>

                        <div class="col-md-2">

                            ${file.convertedFormat}

                        </div>

                        <div class="col-md-2">

                            ${file.size}

                        </div>

                        <div class="col-md-1">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewConvertedImage('${file.name}')">

                                Preview

                            </button>

                        </div>

                        <div class="col-md-2">

                            <a
                                class="btn btn-success btn-sm"
                                href="/download-converted-image?fileName=${file.name}">

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

        location.reload();

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