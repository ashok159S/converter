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

let selectedFiles = [];

/* ===========================
   ADD MORE FILES
=========================== */

addMoreBtn.addEventListener(
    "click",
    () => {

        fileInput.click();

    }
);

/* ===========================
   FILE INPUT
=========================== */

fileInput.addEventListener(
    "change",
    function(){

        selectedFiles =
            Array.from(this.files);

        renderFiles();

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

        selectedFiles =
            Array.from(
                e.dataTransfer.files
            );

        renderFiles();

    }
);

/* ===========================
   RENDER FILE
=========================== */
function renderFiles(){

    fileList.innerHTML = "";

    if(selectedFiles.length === 0){

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

    totalSize.innerHTML =
        (
            selectedFiles[0].size /
            1024 /
            1024
        ).toFixed(2) + " MB";

    const file =
        selectedFiles[0];

    fileList.innerHTML = `

    <div class="card shadow-sm">

        <div class="card-body">

            <div class="row align-items-center">

                <div class="col-md-5">

                    <i class="bi bi-file-earmark-pdf-fill
                              text-danger fs-2 me-2"
                       style="cursor:pointer"
                       onclick="previewSelectedPdf()">
                    </i>

                    <a href="#"
                       onclick="previewSelectedPdf();
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
                        onclick="previewSelectedPdf()">

                        Preview

                    </button>

                </div>

                <div class="col-md-3">

                    <button
                        type="button"
                        class="btn btn-danger btn-sm px-4"
                        onclick="removeFile()">

                        Delete

                    </button>

                </div>

            </div>

        </div>

    </div>

    `;

}

function removeFile(){

    selectedFiles = [];

    fileInput.value = "";

    renderFiles();

}

/* ===========================
   CONVERT
=========================== */

form.addEventListener(
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
                "Please select a PDF file"
            );

            return;
        }

        progressSection.style.display =
            "block";

        const formData =
            new FormData();

        formData.append(
            "pdfFile",
            selectedFiles[0]
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
            function(event){

                if(event.lengthComputable){

                    const percent =
                        Math.round(
                            (
                                event.loaded /
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
                    xhr.readyState === 4 &&
                    xhr.status === 200
                ){

                    const result =
                        JSON.parse(
                            xhr.responseText
                        );

                    if(result.success){
                        document.getElementById(
                            "dropZone"
                        ).style.display = "none";

                        document.getElementById(
                            "settingsCard"
                        ).style.display = "none";

                        document.getElementById(
                            "convertBtn"
                        ).style.display = "none";

                        document.getElementById(
                            "fileList"
                        ).style.display = "none";
                        document.getElementById(
                                "resultCard"
                            ).style.display =
                                "block";
                        setTimeout(() => {

                            progressSection.style.display =
                                "none";

                        }, 1000);

                        const downloads =
                            document.getElementById(
                                "imageDownloads"
                            );

                        downloads.innerHTML =
                            "";

                        result.files.forEach(
                            (file,index)=> {

                                    downloads.innerHTML += `

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
                                                        class="btn btn-primary btn-sm px-4"
                                                        onclick="previewImage('${file.name}')">

                                                        Preview

                                                    </button>

                                                </div>

                                                <div class="col-md-3">

                                                    <button
                                                        class="btn btn-success btn-sm px-4"
                                                        onclick="downloadImage(
                                                            '${file.name}',
                                                            'fileName${index}'
                                                        )">

                                                        Download

                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    `;
                        });

                    }

                }

            };

        xhr.open(
            "POST",
            "/pdf-to-image-ajax"
        );

        xhr.send(
            formData
        );

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
    function(){

        selectedFiles = [];

        fileInput.value = "";

        fileList.innerHTML = "";

        summaryCard.classList.add(
            "d-none"
        );

        document.getElementById(
            "imageDownloads"
        ).innerHTML = "";

        progressSection.style.display =
            "none";

        progressBar.style.width =
            "0%";

        progressBar.innerHTML =
            "0%";

        document.getElementById(
            "dropZone"
        ).style.display =
            "block";

        document.getElementById(
            "settingsCard"
        ).style.display =
            "block";

        document.getElementById(
            "convertBtn"
        ).style.display =
            "block";

        document.getElementById(
            "fileList"
        ).style.display =
            "block";

        document.getElementById(
            "resultCard"
        ).style.display =
            "none";

        window.scrollTo({
            top:0,
            behavior:"smooth"
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



function previewImage(fileName){

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

function previewSelectedPdf(){

    if(selectedFiles.length === 0){

        return;

    }

    const fileUrl =
        URL.createObjectURL(
            selectedFiles[0]
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
){

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