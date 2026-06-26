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

const removeForm =
document.getElementById(
    "removeForm"
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

let selectedFiles = [];

/* ===========================
   FILE SELECT
=========================== */

pdfFiles.addEventListener(
    "change",
    function(){

        selectedFiles =
        Array.from(
            this.files
        );

        showFiles();

    }
);

/* ===========================
   DRAG & DROP
=========================== */

dropZone.addEventListener(
    "dragover",
    function(e){

        e.preventDefault();

        dropZone.classList.add(
            "drag-active"
        );

    }
);

dropZone.addEventListener(
    "dragleave",
    function(){

        dropZone.classList.remove(
            "drag-active"
        );

    }
);

dropZone.addEventListener(
    "drop",
    function(e){

        e.preventDefault();

        dropZone.classList.remove(
            "drag-active"
        );

        selectedFiles =
        Array.from(
            e.dataTransfer.files
        );

        showFiles();

    }
);

/* ===========================
   SHOW FILES
=========================== */

function showFiles(){

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
    +
    " MB";

}

/* ===========================
   DELETE FILE
=========================== */

function deleteFile(index){

    selectedFiles.splice(
        index,
        1
    );

    if(
        selectedFiles.length === 0
    ){

        summaryCard.style.display =
        "none";

        fileListContainer.innerHTML =
        "";

        pdfFiles.value =
        "";

        return;

    }

    showFiles();

}

/* ===========================
   PREVIEW ORIGINAL PDF
=========================== */

function previewPdf(index){

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
   PREVIEW PROCESSED PDF
=========================== */

function previewProcessedPdf(fileName){

    document.getElementById(
        "previewFrame"
    ).src =
    "/preview-processed-pdf?fileName="
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
   REMOVE PAGES
=========================== */

removeForm.addEventListener(
    "submit",
    function(e){

        e.preventDefault();

        
         if(
            !validateFiles(selectedFiles)
        ){
            return;
        }

        if(
            selectedFiles.length === 0
        ){

            alert(
                "Please select PDF files"
            );

            return;

        }

        const pagesToRemove =
        document.getElementById(
            "pagesToRemove"
        ).value.trim();

        if(
            pagesToRemove === ""
        ){

            alert(
                "Enter pages to remove"
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

        formData.append(
            "pagesToRemove",
            pagesToRemove
        );

        progressSection.style.display =
        "block";

        progressBar.style.width =
        "0%";

        progressBar.innerHTML =
        "0%";

        const xhr =
        new XMLHttpRequest();

        xhr.upload.addEventListener(
            "progress",
            function(event){

                if(
                    event.lengthComputable
                ){

                    const percent =
                    Math.round(
                        (
                            event.loaded
                            /
                            event.total
                        )
                        *
                        100
                    );

                    progressBar.style.width =
                    percent + "%";

                    progressBar.innerHTML =
                    percent + "%";

                }

            }
        );

        xhr.onreadystatechange =
        function(){

            if(
                xhr.readyState === 4
                &&
                xhr.status === 200
            ){

                const result =
                JSON.parse(
                    xhr.responseText
                );

                if(
                    result.success
                ){

                    document.getElementById(
                        "uploadSection"
                    ).style.display =
                    "none";

                    document.getElementById(
                        "resultCard"
                    ).style.display =
                    "block";

                    buildResultTable(
                        result
                    );

                }
                else{

                    alert(
                        result.message
                    );

                }

            }

        };

        xhr.open(
            "POST",
            "/pdf-page-remover-ajax"
        );

        xhr.send(
            formData
        );

    }
);

/* ===========================
   RESULT TABLE
=========================== */

function buildResultTable(result){

    const container =
    document.getElementById(
        "processedFilesContainer"
    );

    container.innerHTML =
    "";

    let totalRemoved = 0;
    let totalRemaining = 0;

    result.files.forEach(
        file => {

            totalRemoved +=
            parseInt(
                file.removedPages
            );

            totalRemaining +=
            parseInt(
                file.finalPages
            );

            container.innerHTML += `

            <div class="card mb-2">

                <div class="card-body">

                    <div class="row align-items-center text-center">

                        <div class="col-md-3">

                            ${file.name}

                        </div>

                        <div class="col-md-2">

                            ${file.originalPages}

                        </div>

                        <div class="col-md-2">

                            ${file.removedPages}

                        </div>

                        <div class="col-md-2">

                            ${file.finalPages}

                        </div>

                        <div class="col-md-1">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewProcessedPdf('${file.name}')">

                                Preview

                            </button>

                        </div>

                        <div class="col-md-2">

                            <a
                                class="btn btn-success btn-sm"
                                href="/download-processed-pdf?fileName=${file.name}">

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
        "resultRemovedPages"
    ).innerHTML =
    totalRemoved;

    document.getElementById(
        "resultRemainingPages"
    ).innerHTML =
    totalRemaining;

}

/* ===========================
   REMOVE MORE
=========================== */

document.getElementById(
    "removeMoreBtn"
).addEventListener(
    "click",
    function(){

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
    function(){

        document.body.classList.toggle(
            "dark-mode"
        );

    }
);

