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

const protectForm =
document.getElementById(
    "protectForm"
);

const summaryCard =
document.getElementById(
    "summaryCard"
);

const fileListContainer =
document.getElementById(
    "fileListContainer"
);

const passwordSection =
document.getElementById(
    "passwordSection"
);

const passwordContainer =
document.getElementById(
    "passwordContainer"
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

        passwordSection.style.display =
        "none";

        fileListContainer.innerHTML =
        "";

        passwordContainer.innerHTML =
        "";

        return;

    }

    summaryCard.style.display =
    "flex";

    passwordSection.style.display =
    "block";

    fileListContainer.innerHTML =
    "";

    passwordContainer.innerHTML =
    "";

    let totalBytes = 0;

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

                            <i class="bi bi-file-earmark-pdf"></i>

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

            passwordContainer.innerHTML += `

            <div class="password-row">

                <div class="password-file">

                    📄 ${file.name}

                </div>

                <div>

                    <input
                        type="password"
                        class="form-control password-input"
                        id="password_${index}"
                        placeholder="Enter Password">

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

    document.getElementById(
        "previewFrame"
    ).src =
    fileURL;

    const modal =
    new bootstrap.Modal(
        document.getElementById(
            "pdfPreviewModal"
        )
    );

    modal.show();

}

/* ===========================
   PROTECT PDF
=========================== */

protectForm.addEventListener(
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
            (
                file,
                index
            ) => {

                formData.append(
                    "pdfFiles",
                    file
                );

                formData.append(
                    "passwords",
                    document.getElementById(
                        `password_${index}`
                    ).value
                );

            }
        );

        progressSection.style.display =
        "block";

        const xhr =
        new XMLHttpRequest();

        xhr.upload.addEventListener(
            "progress",
            function(event){

                if(event.lengthComputable){

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

        };

        xhr.open(
            "POST",
            "/protect-pdf-ajax"
        );

        xhr.send(
            formData
        );

    }
);

/* ===========================
   RESULT PAGE
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
        "protectedFilesContainer"
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

                        <div class="col-md-2">

                            Protected

                        </div>

                        <div class="col-md-4">

                            <a
                               href="/download-protected-pdf?fileName=${file.name}"
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
   PROTECT MORE
=========================== */

document.getElementById(
    "protectMoreBtn"
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

