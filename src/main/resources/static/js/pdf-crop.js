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

const pdfCropForm =
document.getElementById(
    "pdfCropForm"
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

            totalBytes += file.size;

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

    renderFiles();

}

/* ===========================
   PDF PREVIEW
=========================== */

function previewPdf(index){

    const file =
    selectedFiles[index];

    const url =
    URL.createObjectURL(
        file
    );

    let modal =
    document.getElementById(
        "previewModal"
    );

    if(!modal){

        document.body.insertAdjacentHTML(
            "beforeend",

            `
            <div class="modal fade"
                 id="previewModal">

                <div class="modal-dialog modal-xl">

                    <div class="modal-content">

                        <div class="modal-header">

                            <h5 class="modal-title">

                                PDF Preview

                            </h5>

                            <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal">
                            </button>

                        </div>

                        <div class="modal-body p-0">

                            <iframe
                                id="previewFrame"
                                width="100%"
                                height="750"
                                style="border:none;">
                            </iframe>

                        </div>

                    </div>

                </div>

            </div>
            `
        );

    }

    document.getElementById(
        "previewFrame"
    ).src =
    url;

    const bsModal =
    new bootstrap.Modal(
        document.getElementById(
            "previewModal"
        )
    );

    bsModal.show();

}

/* ===========================
   SUBMIT
=========================== */

pdfCropForm.addEventListener(
    "submit",
    function(e){

        e.preventDefault();

        
         if(
            !validateFiles(selectedFiles)
        ){
            return;
        }
        if(selectedFiles.length === 0){

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
            "cropAmount",
            document.querySelector(
                'input[name="cropAmount"]:checked'
            ).value
        );

        formData.append(
            "applyTo",
            document.querySelector(
                'input[name="applyTo"]:checked'
            ).value
        );

        fetch(
            "/crop-pdf-ajax",
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

    showResults(
        result.files
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
                    "Crop failed"
                );

            }
        );

    }
);



function showResults(files){

    document.getElementById(
        "pdfCropForm"
    ).style.display =
    "none";

    let html = `

    <div class="alert alert-success">

        <h4>
            ✅ PDF Cropped Successfully
        </h4>

    </div>

    <table class="table table-bordered text-center">

        <thead>

            <tr>

                <th>File Name</th>

                <th>Size</th>

                <th>Download</th>

            </tr>

        </thead>

        <tbody>

    `;

    files.forEach(file => {

        html += `

        <tr>

            <td>${file.name}</td>

            <td>${file.size}</td>

            <td>

                <a href="/download-cropped-pdf?fileName=${file.name}"
                   class="btn btn-success btn-sm">

                    Download

                </a>

            </td>

        </tr>

        `;

    });

    html += `

        </tbody>

    </table>

    <div class="text-center mt-4">

        <button
            class="btn btn-primary"
            onclick="location.reload()">

            Crop More

        </button>

    </div>

    `;

    document.querySelector(
        ".converter-card"
    ).innerHTML = html;

}

