const fileInput =
    document.getElementById("images");

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

let selectedFiles = [];
let imageRotations = [];
let conversionCompleted = false;

/* ===========================
   ADD MORE FILES
=========================== */

addMoreBtn.addEventListener("click", () => {

    fileInput.click();

});

/* ===========================
   FILE INPUT
=========================== */

fileInput.addEventListener(
    "change",
    function () {

        const incoming =
            Array.from(
                this.files
            );

        const duplicateNames = [];

        const invalidFiles = [];

        const filesToAdd = [];

        incoming.forEach(file => {

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

            const exists =
                selectedFiles.some(
                    existing =>
                        existing.name === file.name
                );

            if (
                exists
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

        });

        filesToAdd.forEach(file => {

            selectedFiles.push(
                file
            );

            imageRotations.push(
                0
            );

        });

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

        renderFiles();

        this.value = "";

    }
);

/* ===========================
   DRAG & DROP
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

        const duplicateNames = [];

        const invalidFiles = [];

        const filesToAdd = [];

        incoming.forEach(file => {

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

            const exists =
                selectedFiles.some(
                    existing =>
                        existing.name === file.name
                );

            if (
                exists
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

        });

        filesToAdd.forEach(file => {

            selectedFiles.push(
                file
            );

            imageRotations.push(
                0
            );

        });

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

    let totalBytes = 0;

    selectedFiles.forEach(file => {

        totalBytes += file.size;

    });

    totalSize.innerHTML =
        (
            totalBytes /
            1024 /
            1024
        ).toFixed(2) + " MB";

    selectedFiles.forEach(
        (file, index) => {

            const reader =
                new FileReader();

            reader.onload =
                function (e) {

                    const card =
                        document.createElement(
                            "div"
                        );

                    card.className =
                        "card mb-3 shadow-sm draggable-card";

                    card.draggable = true;
                    card.dataset.index = index;

                    card.innerHTML = `
                <div class="card-body">

                    <div class="row align-items-center">

                        <div class="col-md-2 col-3 text-center">

                            <img src="${e.target.result}"
                                class="img-fluid rounded preview-image"
                                style="transform: rotate(${imageRotations[index]}deg);"
                                onclick="openPreview('${e.target.result}')">

                        </div>

                        <div class="col-md-7 col-5">

                            <span class="badge bg-primary mb-2">

                                #${index + 1}

                            </span>

                            <h6 class="mb-1 file-name">

                                ${file.name}

                            </h6>

                            <small class="text-muted">

                                ${(file.size / 1024 / 1024).toFixed(2)} MB

                            </small>

                        </div>
                            
                            <div class="col-md-3 col-4 text-end">

                                    <div class="d-flex align-items-center justify-content-end gap-2">

                                            ${!conversionCompleted ? `
                                            <button
                                                type="button"
                                                class="btn btn-outline-primary  rotate-left-btn"
                                                onclick="rotateLeft(${index})">

                                                ↺

                                            </button>

                                            <button
                                                type="button"
                                                class="btn btn-outline-success  rotate-right-btn"
                                                onclick="rotateRight(${index})">

                                                ↻

                                            </button>

                                            <span class="drag-handle">

                                                ☰ Drag

                                            </span>

                                            <button
                                                type="button"
                                                class="btn btn-outline-danger"
                                                onclick="removeFile(${index})">

                                                ❌

                                            </button>
                                            ` : ''}

                                    </div>
                            </div>
                            
                    </div>

                </div>
            `;
                    card.addEventListener(
                        "dragstart",
                        dragStart
                    );

                    card.addEventListener(
                        "dragover",
                        dragOver
                    );

                    card.addEventListener(
                        "drop",
                        dropCard
                    );

                    card.addEventListener(
                        "dragend",
                        dragEnd
                    );

                    fileList.appendChild(card);

                };

            reader.readAsDataURL(file);

        });

}


function rotateLeft(index) {

    imageRotations[index] -= 90;

    renderFiles();
}

function rotateRight(index) {

    imageRotations[index] += 90;

    renderFiles();
}

function removeFile(index) {

    selectedFiles.splice(index, 1);

    imageRotations.splice(index, 1);

    renderFiles();
}

let draggedIndex = null;

function dragStart() {

    draggedIndex =
        Number(
            this.dataset.index
        );

    this.classList.add(
        "dragging"
    );
}

function dragOver(e) {

    e.preventDefault();
}

function dropCard() {

    const targetIndex =
        Number(
            this.dataset.index
        );

    const draggedFile =
        selectedFiles.splice(
            draggedIndex,
            1
        )[0];

    const draggedRotation =
        imageRotations.splice(
            draggedIndex,
            1
        )[0];

    selectedFiles.splice(
        targetIndex,
        0,
        draggedFile
    );

    imageRotations.splice(
        targetIndex,
        0,
        draggedRotation
    );

    renderFiles();
}
function dragEnd() {

    document
        .querySelectorAll(
            ".draggable-card"
        )
        .forEach(card => {

            card.classList.remove(
                "dragging"
            );

        });
}


const form =
    document.getElementById(
        "convertForm"
    );

const progressSection =
    document.getElementById(
        "progressSection"
    );

const progressBar =
    document.getElementById(
        "progressBar"
    );

form.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        if (
            !validateFiles(selectedFiles)
        ) {
            return;
        }

        if (selectedFiles.length === 0) {

            alert("Please select files");

            return;
        }

        /* ===========================
   FREEZE UI
=========================== */

        fileInput.disabled = true;

        addMoreBtn.disabled = true;

        document.getElementById(
            "convertBtn"
        ).disabled = true;

        document.querySelectorAll(
            "#fileList button"
        ).forEach(btn => {

            btn.disabled = true;

        });

        summaryCard.style.display =
            "none";

        fileList.style.display =
            "none";

        dropZone.style.display =
            "none";

        document.getElementById(
            "settingsCard"
        ).style.display =
            "none";

        document.getElementById(
            "conversionModeSection"
        ).style.display =
            "none";

        progressSection.style.display =
            "block";

        progressBar.style.width = "0%";
        progressBar.innerHTML = "0%";

        const formData =
            new FormData();

        selectedFiles.forEach((file, index) => {

            formData.append(
                "images",
                file
            );

            formData.append(
                "rotations",
                imageRotations[index]
            );

        });
        formData.append(
            "pageSize",
            document.querySelector(
                '[name="pageSize"]'
            ).value
        );

        formData.append(
            "quality",
            document.querySelector(
                '[name="quality"]'
            ).value
        );

        formData.append(
            "conversionMode",
            document.querySelector(
                'input[name="conversionMode"]:checked'
            ).value
        );

        const xhr =
            new XMLHttpRequest();

        xhr.upload.addEventListener(
            "progress",
            function (event) {

                if (event.lengthComputable) {

                    const percent =
                        Math.round(
                            (event.loaded /
                                event.total) * 100
                        );

                    progressBar.style.width =
                        percent + "%";

                    progressBar.innerHTML =
                        percent + "%";

                    if (percent === 100) {

                        progressBar.classList.remove(
                            "progress-bar-animated"
                        );

                    }
                }
            }
        );



        xhr.onreadystatechange =
            function () {

                if (xhr.readyState === 4 &&
                    xhr.status === 200) {

                    const result =
                        JSON.parse(
                            xhr.responseText
                        );

                    if (result.success) {

                        conversionCompleted = true;
                        document.querySelectorAll(
                            "#fileList button"
                        ).forEach(btn => {

                            btn.style.display = "none";

                        });



                        document.querySelectorAll(
                            ".drag-handle"
                        ).forEach(handle => {

                            handle.style.display = "none";

                        });

                        progressBar.style.width =
                            "100%";

                        progressBar.innerHTML =
                            "100%";

                        document.getElementById(
                            "settingsCard"
                        ).style.display =
                            "none";

                        document.getElementById(
                            "conversionModeSection"
                        ).style.display =
                            "none";

                        document.getElementById(
                            "mergeInfoCard"
                        ).style.display =
                            "block";

                        if (result.separateMode) {

                            document.getElementById(
                                "mergeInfoCard"
                            ).style.display =
                                "none";
                        }
                        else {

                            document.getElementById(
                                "pdfName"
                            ).value =
                                result.fileName;

                        }


                        document.getElementById(
                            "pageCount"
                        ).innerHTML =
                            result.pages;

                        document.getElementById(
                            "pdfSize"
                        ).innerHTML =
                            result.size;


                        setTimeout(() => {

                            progressSection.style.display =
                                "none";

                            document.getElementById(
                                "resultCard"
                            ).style.display =
                                "block";

                        }, 800);

                        if (result.separateMode) {

                            document.getElementById(
                                "downloadBtn"
                            ).style.display =
                                "none";

                            const downloads =
                                document.getElementById(
                                    "separateDownloads"
                                );

                            downloads.innerHTML = "";

                            downloads.innerHTML = `
                            <div class="card mb-3 shadow-sm">

                                <div class="card-body fw-bold">

                                    <div class="row">

                                        <div class="col-md-6">

                                            File Name

                                        </div>

                                        <div class="col-md-2">

                                            File Size

                                        </div>

                                        <div class="col-md-4 text-end">

                                            Action

                                        </div>

                                    </div>

                                </div>

                            </div>
                            `;

                            result.files.forEach(file => {

                                downloads.innerHTML += `
                        <div class="card mb-2 shadow-sm">

                            <div class="card-body">

                                <div class="row align-items-center">

                                    <div class="col-md-6">

                                        <div style="
                                            font-size:20px;
                                            font-weight:600;
                                        ">

                                            ${file.name}

                                        </div>

                                    </div>

                                    <div class="col-md-2">

                                        ${file.size}

                                    </div>

                                    <div class="col-md-4 text-end">

                                        <button
                                                class="btn btn-primary btn-lg me-2"
                                                onclick="previewSeparatePdf('${file.name}')">

                                                Preview

                                            </button>

                                            <a href="/download-separate?fileName=${file.name}"
                                            class="btn btn-success btn-lg">

                                                Download

                                            </a>

                                    </div>

                                </div>

                            </div>

                        </div>
                        `;

                            });


                        }

                        document.getElementById(
                            "downloadBtn"
                        ).href =
                            "/download-pdf";

                        progressBar.style.width =
                            "100%";

                        progressBar.innerHTML =
                            "100%";

                        setTimeout(() => {

                            progressSection.style.display = "none";

                        }, 1500);

                        document.getElementById(
                            "dropZone"
                        ).style.display = "none";

                        document.getElementById(
                            "convertBtn"
                        ).style.display = "none";

                        document.getElementById(
                            "fileList"
                        ).style.display =
                            "none";

                    }
                    else {

                        fileInput.disabled = false;

                        addMoreBtn.disabled = false;

                        document.getElementById(
                            "convertBtn"
                        ).disabled = false;

                        summaryCard.style.display =
                            "";

                        fileList.style.display =
                            "block";

                        dropZone.style.display =
                            "block";

                        document.getElementById(
                            "settingsCard"
                        ).style.display =
                            "block";

                        document.getElementById(
                            "conversionModeSection"
                        ).style.display =
                            "block";

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

        xhr.open(
            "POST",
            "/image-to-pdf-ajax"
        );

        xhr.send(
            formData
        );

        xhr.onerror =
            function () {

                fileInput.disabled = false;

                addMoreBtn.disabled = false;

                document.getElementById(
                    "convertBtn"
                ).disabled = false;

                summaryCard.style.display =
                    "";

                fileList.style.display =
                    "block";

                dropZone.style.display =
                    "block";

                document.getElementById(
                    "settingsCard"
                ).style.display =
                    "block";

                document.getElementById(
                    "conversionModeSection"
                ).style.display =
                    "block";

                progressSection.style.display =
                    "none";

                progressBar.style.width =
                    "0%";

                progressBar.innerHTML =
                    "0%";

                alert(
                    "Image to PDF conversion failed. Please try again."
                );

            };

    }
);
document
    .getElementById(
        "convertMoreBtn"
    )
    .addEventListener(
        "click",
        function () {

            fetch(
                "/delete-image-to-pdf-temp-files",
                {
                    method: "POST"
                }
            )
                .finally(() => {

                    selectedFiles = [];

                    imageRotations = [];

                    conversionCompleted = false;

                    totalFiles.innerHTML = "0";

                    totalSize.innerHTML = "0 MB";

                    fileList.innerHTML = "";

                    fileInput.value = "";

                    summaryCard.classList.add(
                        "d-none"
                    );

                    document
                        .getElementById(
                            "resultCard"
                        )
                        .style.display =
                        "none";

                    document
                        .getElementById(
                            "fileList"
                        )
                        .style.display =
                        "block";

                    document
                        .getElementById(
                            "settingsCard"
                        )
                        .style.display =
                        "block";

                    document
                        .getElementById(
                            "conversionModeSection"
                        )
                        .style.display =
                        "block";

                    document
                        .getElementById(
                            "dropZone"
                        )
                        .style.display =
                        "block";

                    document
                        .getElementById(
                            "convertBtn"
                        )
                        .style.display =
                        "block";

                    document
                        .getElementById(
                            "convertBtn"
                        )
                        .disabled =
                        false;

                    fileInput.disabled =
                        false;

                    addMoreBtn.disabled =
                        false;

                    progressSection.style.display =
                        "none";

                    progressBar.style.width =
                        "0%";

                    progressBar.innerHTML =
                        "0%";

                    progressBar.classList.add(
                        "progress-bar-animated"
                    );

                    document
                        .getElementById(
                            "pdfName"
                        )
                        .value =
                        "merged.pdf";

                    document
                        .getElementById(
                            "pageCount"
                        )
                        .innerHTML =
                        "0";

                    document
                        .getElementById(
                            "pdfSize"
                        )
                        .innerHTML =
                        "0 MB";

                    document
                        .getElementById(
                            "mergeInfoCard"
                        )
                        .style.display =
                        "block";

                    document
                        .getElementById(
                            "downloadBtn"
                        )
                        .style.display =
                        "inline-block";

                    document
                        .getElementById(
                            "separateDownloads"
                        )
                        .innerHTML =
                        "";

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                });

        }
    );

function openPreview(imageSrc) {

    document.getElementById(
        "previewModalImage"
    ).src = imageSrc;

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "imagePreviewModal"
            )
        );

    modal.show();
}

const darkModeBtn =
    document.getElementById(
        "darkModeBtn"
    );

darkModeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );

    }
);

document.getElementById(
    "downloadBtn"
).addEventListener(
    "click",
    function (e) {

        e.preventDefault();

        const fileName =
            document.getElementById(
                "pdfName"
            ).value;

        window.location.href =
            "/download-pdf?fileName="
            + encodeURIComponent(
                fileName
            );

    }
);

function previewSeparatePdf(fileName) {

    document.getElementById(
        "previewFrame"
    ).src =
        "/preview-separate?fileName="
        + encodeURIComponent(fileName);

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "pdfPreviewModal"
            )
        );

    modal.show();
}

document.addEventListener(
    "click",
    function (e) {

        if (
            e.target &&
            e.target.id === "previewMergedBtn"
        ) {

            document.getElementById(
                "previewFrame"
            ).src =
                "/preview-pdf";

            const modal =
                new bootstrap.Modal(
                    document.getElementById(
                        "pdfPreviewModal"
                    )
                );

            modal.show();
        }
    }


);


