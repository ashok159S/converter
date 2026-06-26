/* ===========================
   ELEMENTS
=========================== */

const wordFiles =
document.getElementById(
    "wordFiles"
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

let selectedFiles = [];

/* ===========================
   FILE SELECT
=========================== */

wordFiles.addEventListener(
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

                            <i class="bi bi-file-earmark-word-fill"></i>

                            ${file.name}

                        </div>

                        <div class="col-md-2 text-center">

                            ${(file.size / 1024 / 1024).toFixed(2)} MB

                        </div>

                        <div class="col-md-2 text-center">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewWordFile(${index})">

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

        wordFiles.value =
        "";

        return;

    }

    showFiles();

}

/* ===========================
   PREVIEW WORD FILE
=========================== */


function previewWordFile(index){

    const file = selectedFiles[index];

    const size =
    (file.size / 1024 / 1024).toFixed(2);

    const extension =
    file.name.split(".").pop().toUpperCase();

    document.getElementById(
        "previewModalBody"
    ).innerHTML = `

        <div class="text-center">

            <i class="bi bi-file-earmark-word-fill"
               style="font-size:90px;color:#2563eb;"></i>

            <h4 class="mt-3">
                ${file.name}
            </h4>

            <hr>

            <p><strong>File Type:</strong> ${extension}</p>

            <p><strong>File Size:</strong> ${size} MB</p>

        </div>

    `;

    const modal =
    new bootstrap.Modal(
        document.getElementById(
            "wordPreviewModal"
        )
    );

    modal.show();

}


/* ===========================
   PREVIEW PDF
=========================== */

function previewPdf(fileName){

    document.getElementById(
        "previewFrame"
    ).src =
    "/preview-word-pdf?fileName="
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
   CONVERT
=========================== */

convertForm.addEventListener(
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
                "Please select Word files"
            );

            return;

        }

        const formData =
        new FormData();

        selectedFiles.forEach(
            file => {

                formData.append(
                    "wordFiles",
                    file
                );

            }
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
            "/word-to-pdf-ajax"
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
        "convertedFilesContainer"
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

                            ${file.originalSize}

                        </div>

                        <div class="col-md-2">

                            ${file.pdfSize}

                        </div>

                        <div class="col-md-2">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewPdf('${file.name}')">

                                Preview

                            </button>

                        </div>

                        <div class="col-md-2">

                            <a
                                href="/download-word-pdf?fileName=${file.name}"
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