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

const extractTextForm =
document.getElementById(
    "extractTextForm"
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

        renderFiles();

    }
);

/* ===========================
   DRAG & DROP
=========================== */

dropZone.addEventListener(
    "dragover",
    function(e){

        e.preventDefault();

    }
);

dropZone.addEventListener(
    "drop",
    function(e){

        e.preventDefault();

        selectedFiles =
        Array.from(
            e.dataTransfer.files
        );

        renderFiles();

    }
);

/* ===========================
   EXTRACTION OPTION
=========================== */

document
.querySelectorAll(
    'input[name="extractType"]'
)
.forEach(
    radio => {

        radio.addEventListener(
            "change",
            function(){

                if(
                    this.value ===
                    "RANGE"
                ){

                    document.getElementById(
                        "pageRangeSection"
                    ).style.display =
                    "block";

                }
                else{

                    document.getElementById(
                        "pageRangeSection"
                    ).style.display =
                    "none";

                }

            }
        );

    }
);

/* ===========================
   FILE LIST
=========================== */

function renderFiles(){

    if(
        selectedFiles.length === 0
    ){

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

                            ${(file.size/1024/1024).toFixed(2)} MB

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

    renderFiles();

}

/* ===========================
   PDF PREVIEW
=========================== */

function previewPdf(index){

    const file =
    selectedFiles[index];

    const fileURL =
    URL.createObjectURL(
        file
    );

    const modalHtml = `

        <div class="modal fade"
             id="pdfPreviewModal">

            <div class="modal-dialog modal-xl">

                <div class="modal-content">

                    <div class="modal-header">

                        <h5 class="modal-title">

                            PDF Preview

                        </h5>

                        <button type="button"
                                class="btn-close"
                                data-bs-dismiss="modal">
                        </button>

                    </div>

                    <div class="modal-body p-0">

                        <iframe
                            src="${fileURL}"
                            width="100%"
                            height="750"
                            style="border:none;">
                        </iframe>

                    </div>

                </div>

            </div>

        </div>

    `;

    document.body.insertAdjacentHTML(
        "beforeend",
        modalHtml
    );

    const modal =
    new bootstrap.Modal(
        document.getElementById(
            "pdfPreviewModal"
        )
    );

    modal.show();

    document
    .getElementById(
        "pdfPreviewModal"
    )
    .addEventListener(
        "hidden.bs.modal",
        function(){

            this.remove();

        }
    );

}

/* ===========================
   SUBMIT
=========================== */

extractTextForm.addEventListener(
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
            "extractType",
            document.querySelector(
                'input[name="extractType"]:checked'
            ).value
        );

        formData.append(
            "pageRange",
            document.getElementById(
                "pageRange"
            ).value
        );

        formData.append(
            "outputFormat",
            document.querySelector(
                'input[name="outputFormat"]:checked'
            ).value
        );

        fetch(
            "/extract-text-ajax",
            {
                method:"POST",
                body:formData
            }
        )
        .then(
            response =>
            response.json()
        )
        .then(
            result => {

                if(
                    result.success
                ){

                    buildResult(
                        result
                    );

                }
                else{

                    alert(
                        result.message
                    );

                }

            }
        );

    }
);

/* ===========================
   RESULT
=========================== */

function buildResult(result){

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

                            ${file.pages}

                        </div>

                        <div class="col-md-3">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewExtractedText('${file.name}')">

                                Preview

                            </button>

                        </div>

                        <div class="col-md-3">

                            <a href="/download-extracted-text?fileName=${file.name}"
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
   EXTRACT MORE
=========================== */

document.getElementById(
    "extractMoreBtn"
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


function previewExtractedText(fileName){

    fetch(
        "/preview-extracted-text?fileName="
        +
        encodeURIComponent(fileName)
    )
    .then(
        response => response.text()
    )
    .then(
        text => {

            document.getElementById(
                "previewTextArea"
            ).value =
            text;

            const modal =
            new bootstrap.Modal(
                document.getElementById(
                    "textPreviewModal"
                )
            );

            modal.show();

        }
    );

}