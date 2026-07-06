/* ===========================
   ELEMENTS
=========================== */

const imageFiles =
    document.getElementById(
        "imageFiles"
    );

const compressionLevel =
    document.getElementById(
        "compressionLevel"
    );

const dropZone =
    document.getElementById(
        "dropZone"
    );

const compressForm =
    document.getElementById(
        "compressForm"
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

const quality =
    document.getElementById(
        "quality"
    );

const qualityValue =
    document.getElementById(
        "qualityValue"
    );

const settingsSection =
    document.getElementById(
        "settingsSection"
    );

let selectedFiles = [];

/* ===========================
   QUALITY
=========================== */

quality.addEventListener(
    "input",
    function () {

        qualityValue.innerHTML =
            this.value + "%";

    }
);

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

        const duplicateNames = [];
        const invalidFiles = [];
        const filesToAdd = [];

        newFiles.forEach(
            file => {

                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    invalidFiles.push(
                        file.name
                    );

                    return;
                }

                const alreadyExists =
                    selectedFiles.some(
                        existingFile =>
                            existingFile.name === file.name
                    );

                if (
                    alreadyExists
                ) {

                    duplicateNames.push(
                        file.name
                    );

                }
                else {

                    filesToAdd.push(
                        file
                    );

                }

            }
        );

        selectedFiles.push(
            ...filesToAdd
        );

        if (
            invalidFiles.length > 0
        ) {

            alert(
                "Invalid files:\n\n"
                +
                invalidFiles.join(
                    "\n"
                )
            );

        }

        if (
            duplicateNames.length > 0
        ) {

            alert(
                "Duplicate files:\n\n"
                +
                duplicateNames.join(
                    "\n"
                )
            );

        }

        showFiles();

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

        const newFiles =
            Array.from(
                e.dataTransfer.files
            );

        const duplicateNames = [];
        const invalidFiles = [];
        const filesToAdd = [];

        newFiles.forEach(
            file => {

                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    invalidFiles.push(
                        file.name
                    );

                    return;
                }

                const alreadyExists =
                    selectedFiles.some(
                        existingFile =>
                            existingFile.name === file.name
                    );

                if (
                    alreadyExists
                ) {

                    duplicateNames.push(
                        file.name
                    );

                }
                else {

                    filesToAdd.push(
                        file
                    );

                }

            }
        );

        selectedFiles.push(
            ...filesToAdd
        );

        if (
            invalidFiles.length > 0
        ) {

            alert(
                "Invalid files:\n\n"
                +
                invalidFiles.join(
                    "\n"
                )
            );

        }

        if (
            duplicateNames.length > 0
        ) {

            alert(
                "Duplicate files:\n\n"
                +
                duplicateNames.join(
                    "\n"
                )
            );

        }

        if (
            filesToAdd.length > 0
        ) {

            showFiles();

        }

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

            totalBytes +=
                file.size;

            fileListContainer.innerHTML += `

            <div class="card">

                <div class="card-body">

                    <div class="row align-items-center">

                        <div class="col-md-5 file-row-name">

                            <i class="bi bi-image-fill"></i>

                            ${file.name}

                        </div>

                        <div class="col-md-2 text-center file-row-size">

                            ${(file.size / 1024 / 1024).toFixed(2)} MB

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
        URL.createObjectURL(
            file
        );

    document.getElementById(
        "previewImage"
    ).src = url;

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "imagePreviewModal"
            )
        );

    modal.show();

}

/* ===========================
   PREVIEW COMPRESSED IMAGE
=========================== */

function previewCompressedImage(
    fileName
) {

    document.getElementById(
        "previewImage"
    ).src =
        "/preview-compressed-image?fileName="
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
   COMPRESS IMAGES
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
                "Please select images"
            );

            return;

        }

        const formData =
            new FormData();

        selectedFiles.forEach(
            file => {

                formData.append(
                    "imageFiles",
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

        formData.append(
            "quality",
            quality.value
        );
        /* Freeze UI */

        imageFiles.disabled =
            true;

        quality.disabled =
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

        document.getElementById(
            "dropZone"
        ).style.display =
            "none";

        document.getElementById(
            "uploadSection"
        ).style.display =
            "none";

        progressSection.style.display =
            "block";

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


                        document.getElementById(
                            "uploadSection"
                        ).style.display =
                            "none";
                        progressBar.style.width =
                            "100%";

                        progressBar.innerHTML =
                            "100%";

                        setTimeout(() => {

                            progressSection.style.display =
                                "none";

                            progressBar.style.width =
                                "0%";

                            progressBar.innerHTML =
                                "0%";

                            document.getElementById(
                                "resultCard"
                            ).style.display =
                                "block";

                        }, 500);

                        buildResultTable(
                            result
                        );

                    }
                    else {

                        imageFiles.disabled =
                            false;

                        quality.disabled =
                            false;

                        document.getElementById(
                            "dropZone"
                        ).style.display =
                            "block";

                        summaryCard.style.display =
                            "flex";

                        fileListContainer.style.display =
                            "block";
                        settingsSection.style.display =
                            "block";

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

                        progressSection.style.display =
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

            };

        xhr.onerror =
            function () {

                imageFiles.disabled =
                    false;

                quality.disabled =
                    false;

                document.getElementById(
                    "dropZone"
                ).style.display =
                    "block";

                summaryCard.style.display =
                    "flex";

                fileListContainer.style.display =
                    "block";
                fileListContainer.style.display =
                    "block";

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

                progressSection.style.display =
                    "none";

                progressBar.style.width =
                    "0%";

                progressBar.innerHTML =
                    "0%";

                alert(
                    "Compression failed. Please try again."
                );

            };

        xhr.open(
            "POST",
            "/image-compressor-ajax"
        );

        xhr.send(
            formData
        );

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
            "compressedFilesContainer"
        );

    container.innerHTML =
        "";

    let totalOriginal = 0;
    let totalCompressed = 0;

    result.files.forEach(
        file => {

            totalOriginal +=
                parseFloat(
                    file.originalSize
                );

            totalCompressed +=
                parseFloat(
                    file.compressedSize
                );

            container.innerHTML += `

            <div class="card mb-2">

                <div class="card-body">

                    <div class="row text-center align-items-center">

                        <div class="col-md-3">

                            ${file.name}

                        </div>

                        <div class="col-md-2">

                            ${file.originalSize}

                        </div>

                        <div class="col-md-2">

                            ${file.compressedSize}

                        </div>

                        <div class="col-md-1">

                            ${file.saved}

                        </div>

                        <div class="col-md-1">

                            ${file.reduction}

                        </div>

                        <div class="col-md-1">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewCompressedImage('${file.name}')">

                                Preview

                            </button>

                        </div>

                        <div class="col-md-2">

                            <a
                                class="btn btn-success btn-sm"
                                href="/download-compressed-image?fileName=${file.name}">

                                Download

                            </a>

                        </div>

                    </div>

                </div>

            </div>

            `;

        }
    );

    const saved =
        totalOriginal
        -
        totalCompressed;

    const reduction =
        totalOriginal > 0
            ? (
                saved
                /
                totalOriginal
            ) * 100
            : 0;

    document.getElementById(
        "resultFiles"
    ).innerHTML =
        result.files.length;

    document.getElementById(
        "resultOriginalSize"
    ).innerHTML =
        totalOriginal.toFixed(2)
        + " MB";

    document.getElementById(
        "resultCompressedSize"
    ).innerHTML =
        totalCompressed.toFixed(2)
        + " MB";

    document.getElementById(
        "resultSaved"
    ).innerHTML =
        saved.toFixed(2)
        + " MB";

    document.getElementById(
        "resultReduction"
    ).innerHTML =
        reduction.toFixed(0)
        + "%";

}

/* ===========================
   COMPRESS MORE
=========================== */
document.getElementById(
    "compressMoreBtn"
).addEventListener(
    "click",
    function () {

        fetch(
            "/delete-image-temp-files",
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

window.addEventListener(
    "beforeunload",
    function () {

        navigator.sendBeacon(
            "/delete-image-temp-files"
        );

    }
);