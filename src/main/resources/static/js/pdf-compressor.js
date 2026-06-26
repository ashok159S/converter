const pdfFile =
document.getElementById("pdfFile");

const dropZone =
document.getElementById("dropZone");

const compressForm =
document.getElementById("compressForm");

const summaryCard =
document.getElementById("summaryCard");

const fileListContainer =
document.getElementById("fileListContainer");

const totalFiles =
document.getElementById("totalFiles");

const totalSize =
document.getElementById("totalSize");

const progressSection =
document.getElementById("progressSection");

const progressBar =
document.getElementById("progressBar");

let selectedFiles = [];

/* ===========================
FILE SELECT
=========================== */

pdfFile.addEventListener(
"change",
function(){


    selectedFiles =
        Array.from(this.files);

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
    "block";

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

        <div class="card mb-2">

            <div class="card-body">

                <div class="row align-items-center">

                    <div class="col-md-5 file-row-name">

                        <i class="bi bi-file-earmark-pdf-fill text-danger me-2"></i>

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

    pdfFile.value =
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
    URL.createObjectURL(file);

document.getElementById(
    "previewFrame"
).src = url;

const modal =
    new bootstrap.Modal(
        document.getElementById(
            "pdfPreviewModal"
        )
    );

modal.show();


}

/* ===========================
PREVIEW COMPRESSED PDF
=========================== */

function previewCompressedPdf(
fileName
){


document.getElementById(
    "previewFrame"
).src =
    "/preview-compressed-pdf?fileName="
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
COMPRESS PDF
=========================== */

compressForm.addEventListener(
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
        "compressionLevel",
        document.getElementById(
            "compressionLevel"
        ).value
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

                if(result.success){

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
                            "compressedFilesContainer"
                        );

                    container.innerHTML =
                        "";

                    result.files.forEach(
                        file => {

                          container.innerHTML += `

<div class="card mb-2">

    <div class="card-body">

        <div class="row align-items-center text-center">

            <div class="col-md-3">

                <i class="bi bi-file-earmark-pdf-fill text-danger me-2"></i>

                ${file.name}

            </div>

            <div class="col-md-2">

                ${file.originalSize}

            </div>

            <div class="col-md-2">

                ${file.compressedSize}

            </div>

            <div class="col-md-1 text-success fw-bold">

                ${file.saved}

            </div>

            <div class="col-md-1 text-primary fw-bold">

                ${file.reduction}

            </div>

            <div class="col-md-1">

                <button
                    class="btn btn-primary btn-sm"
                    onclick="previewCompressedPdf('${file.name}')">

                    Preview

                </button>

            </div>

            <div class="col-md-2">

                <a
                    href="/download-compressed-pdf?fileName=${file.name}"
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
        "/pdf-compressor-ajax"
    );

    xhr.send(
        formData
    );

}


);

/* ===========================
COMPRESS MORE
=========================== */

document.getElementById(
"compressMoreBtn"
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
