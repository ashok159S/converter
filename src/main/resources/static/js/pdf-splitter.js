const pdfFile =
    document.getElementById(
        "pdfFile"
    );

const dropZone =
    document.getElementById(
        "dropZone"
    );

const splitForm =
    document.getElementById(
        "splitForm"
    );

const selectedFileCard =
    document.getElementById(
        "selectedFileCard"
    );

const selectedFileName =
    document.getElementById(
        "selectedFileName"
    );

const selectedFileSize =
    document.getElementById(
        "selectedFileSize"
    );

const progressSection =
    document.getElementById(
        "progressSection"
    );

const progressBar =
    document.getElementById(
        "progressBar"
    );

let currentFile = null;

/* ===========================
   FILE SELECT
=========================== */

pdfFile.addEventListener(
    "change",
    function(){

        if(this.files.length > 0){

            currentFile =
                this.files[0];

            showFileInfo();

        }

    }
);

/* ===========================
   SHOW FILE
=========================== */

function showFileInfo(){

    selectedFileCard.style.display =
        "block";

    selectedFileName.innerHTML =
        currentFile.name;

    selectedFileSize.innerHTML =
        (
            currentFile.size
            /1024
            /1024
        ).toFixed(2)
        + " MB";

}

/* ===========================
   DRAG DROP
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

        const file = e.dataTransfer.files[0];

if(file.type !== "application/pdf"){
    alert("Please upload a PDF file.");
    return;
}

currentFile = file;
showFileInfo();

    }
);

/* ===========================
   PREVIEW ORIGINAL PDF
=========================== */

document
.getElementById(
    "previewSourceBtn"
)
.addEventListener(
    "click",
    function(){

        const url =
            URL.createObjectURL(
                currentFile
            );

        document
        .getElementById(
            "previewFrame"
        )
        .src = url;

        const modal =
            new bootstrap.Modal(
                document.getElementById(
                    "pdfPreviewModal"
                )
            );

        modal.show();

    }
);

document
.getElementById(
    "selectedFileName"
)
.addEventListener(
    "click",
    function(e){

        e.preventDefault();

        previewSelectedPdf();

    }
);

/* ===========================
   SPLIT PDF
=========================== */

splitForm.addEventListener(
    "submit",
    function(e){

        e.preventDefault();

       if(
    !validateFiles([currentFile])
){
    return;
}
        if(currentFile == null){

            alert(
                "Please select a PDF file"
            );

            return;

        }

        const formData =
            new FormData();

        formData.append(
            "pdfFile",
            currentFile
        );

        progressSection.style.display =
            "block";

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

                    if(
                        result.success
                    ){

                        displayResults(
                            result.files
                        );

                    }

                }

            };

        xhr.open(
            "POST",
            "/pdf-splitter-ajax"
        );

        xhr.send(
            formData
        );

    }
);

/* ===========================
   DISPLAY RESULTS
=========================== */

function displayResults(files){

    document.getElementById(
        "resultCard"
    ).style.display =
        "block";

    document.getElementById(
        "dropZone"
    ).style.display =
        "none";

    document.getElementById(
        "splitBtn"
    ).style.display =
        "none";

    selectedFileCard.style.display =
        "none";

    progressSection.style.display =
        "none";

    const downloads =
        document.getElementById(
            "pdfDownloads"
        );

    downloads.innerHTML = "";

    files.forEach(
        file => {

            downloads.innerHTML += `

            <div class="card">

                <div class="card-body">

                    <div class="row align-items-center">

                        <div class="col-md-4">

                            <input
                                type="text"
                                class="form-control rename-file"
                                value="${file.name}"
                                id="rename_${file.name.replace('.pdf','')}">

                        </div>

                        <div class="col-md-2">

                            ${file.size}

                        </div>

                        <div class="col-md-3 text-center">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewPdf('${file.name}')">

                                Preview

                            </button>

                        </div>

                        <div class="col-md-3 text-center">

                            <button
                                type="button"
                                class="btn btn-success btn-sm"
                                onclick="downloadPdf('${file.name}')">

                                Download

                            </button>

                        </div>

                    </div>

                </div>

            </div>

            `;

        }
    );

}

/* ===========================
   PREVIEW SPLIT PDF
=========================== */

function previewPdf(fileName){

    document
    .getElementById(
        "previewFrame"
    )
    .src =
        "/preview-split-pdf?fileName="
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
   SPLIT MORE
=========================== */

document
.getElementById(
    "splitMoreBtn"
)
.addEventListener(
    "click",
    function(){

        location.reload();

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
    function(){

        document.body.classList.toggle(
            "dark-mode"
        );

    }
);


function previewSelectedPdf(){

    const url =
        URL.createObjectURL(
            currentFile
        );

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

document
.getElementById(
    "deleteSourceBtn"
)
.addEventListener(
    "click",
    function(){

        currentFile = null;

        pdfFile.value = "";

        selectedFileCard.style.display =
            "none";

    }
);


function downloadPdf(fileName){

    const input =
        document.getElementById(
            "rename_" +
            fileName.replace(".pdf","")
        );

    let newName =
        input.value.trim();

    if(!newName.toLowerCase().endsWith(".pdf")){

        newName += ".pdf";

    }

    window.location.href =
        "/download-split-pdf?fileName="
        + encodeURIComponent(fileName)
        + "&downloadName="
        + encodeURIComponent(newName);

}