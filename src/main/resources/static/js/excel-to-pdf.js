/* ===========================
   ELEMENTS
=========================== */

const excelFiles =
document.getElementById(
    "excelFiles"
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

const excelToPdfForm =
document.getElementById(
    "excelToPdfForm"
);

let selectedFiles = [];

/* ===========================
   FILE SELECT
=========================== */

excelFiles.addEventListener(
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
   DRAG DROP
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
   RENDER FILES
=========================== */

function renderFiles(){

    if(selectedFiles.length === 0){

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

                            <i class="bi bi-file-earmark-excel-fill"></i>

                            ${file.name}

                        </div>

                        <div class="col-md-2 text-center">

                            ${(file.size / 1024 / 1024).toFixed(2)} MB

                        </div>

                        <div class="col-md-2 text-center">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewExcel(${index})">

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
   EXCEL PREVIEW
=========================== */

function previewExcel(index){

    const file =
    selectedFiles[index];

    document.getElementById(
        "pdfPreviewFrame"
    ).src =
    "";

    document.querySelector(
        "#pdfPreviewModal .modal-title"
    ).innerHTML =
    file.name;

    const modal =
    new bootstrap.Modal(
        document.getElementById(
            "pdfPreviewModal"
        )
    );

    modal.show();

}

/* ===========================
   SUBMIT
=========================== */

excelToPdfForm.addEventListener(
    "submit",
    function(e){
        e.preventDefault();

         if(
            !validateFiles(selectedFiles)){
            return;
        }
        if(selectedFiles.length === 0){

            alert(
                "Please select Excel files"
            );

            return;

        }

        const formData =
        new FormData();

        selectedFiles.forEach(
            file => {

                formData.append(
                    "excelFiles",
                    file
                );

            }
        );

        formData.append(
            "orientation",
            document.querySelector(
                'input[name="orientation"]:checked'
            ).value
        );

        formData.append(
            "paperSize",
            document.querySelector(
                'input[name="paperSize"]:checked'
            ).value
        );

        formData.append(
            "scaling",
            document.querySelector(
                'input[name="scaling"]:checked'
            ).value
        );

        formData.append(
            "quality",
            document.querySelector(
                'input[name="quality"]:checked'
            ).value
        );

        fetch(
            "/excel-to-pdf-ajax",
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

                if(result.success){

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
        )
        .catch(
            error => {

                alert(
                    "Conversion failed"
                );

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

                            ${file.size}

                        </div>

                        <div class="col-md-3">

                            <button
                                class="btn btn-primary btn-sm"
                                onclick="previewResultPdf('${file.name}')">

                                Preview

                            </button>

                        </div>

                        <div class="col-md-3">

                            <a
                               href="/download-converted-pdf?fileName=${file.name}"
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
   RESULT PREVIEW
=========================== */

function previewResultPdf(fileName){

    document.getElementById(
        "pdfPreviewFrame"
    ).src =
    "/preview-converted-pdf?fileName="
    +
    encodeURIComponent(fileName);

    const modal =
    new bootstrap.Modal(
        document.getElementById(
            "pdfPreviewModal"
        )
    );

    modal.show();

}

/* ===========================
   CONVERT MORE
=========================== */

document.getElementById(
    "convertMoreBtn"
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

