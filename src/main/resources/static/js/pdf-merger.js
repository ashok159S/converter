const fileInput =
    document.getElementById("pdfFiles");

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

const mergeForm =
    document.getElementById("mergeForm");

const progressSection =
    document.getElementById("progressSection");

const progressBar =
    document.getElementById("progressBar");

let selectedFiles = [];

/* ===========================
   ADD MORE
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

        const incoming =
            Array.from(this.files);

        incoming.forEach(file => {

            selectedFiles.push(file);

        });

        renderFiles();

    }
);

/* ===========================
   DRAG DROP
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

        incoming.forEach(file => {

            selectedFiles.push(file);

        });

        renderFiles();

    }
);

/* ===========================
   RENDER FILES
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

    let bytes = 0;

    selectedFiles.forEach(
        file => {

            bytes += file.size;

        }
    );

    totalSize.innerHTML =
        (
            bytes /
            1024 /
            1024
        ).toFixed(2) + " MB";

    selectedFiles.forEach(
        (file,index) => {
fileList.innerHTML += `
<div class="card mb-2 file-row">
    <div class="card-body">

        <div class="row align-items-center text-center">

            <div class="col-3 text-start file-row-name">
                <i class="bi bi-file-earmark-pdf-fill"></i>
                ${file.name}
            </div>

            <div class="col-3 file-row-size">
                ${(file.size / 1024 / 1024).toFixed(2)} MB
            </div>

            <div class="col-3">
                <button type="button"
                        class="btn btn-primary preview-btn"
                        onclick="previewSourcePdf(${index})">
                    Preview
                </button>
            </div>

            <div class="col-3">
                <button type="button"
                        class="btn btn-danger delete-btn"
                        onclick="removeFile(${index})">
                    Delete
                </button>
            </div>

        </div>

    </div>
</div>
`;

        }
    );

}

function removeFile(index){

    selectedFiles.splice(
        index,
        1
    );

    renderFiles();

}

/* ===========================
   MERGE
=========================== */

mergeForm.addEventListener(
    "submit",
    function(e){
        
        e.preventDefault();
        if(
            !validateFiles(selectedFiles)
        ){
            return;
        }

        if(selectedFiles.length < 2){

            alert(
                "Please select at least 2 PDF files"
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

                        mergeBtn.disabled = false;

                        mergeBtn.innerHTML =
                            "Merge PDFs";
                        clearInterval(fakeProgress);

                        progressBar.style.width = "100%";
                        progressBar.innerHTML = "100%";

                        document.getElementById(
                            "dropZone"
                        ).style.display = "none";

                        document.getElementById(
                            "mergeBtn"
                        ).style.display = "none";

                        document.getElementById(
                            "resultCard"
                        ).style.display =
                            "block";

                        summaryCard.style.display = "none";

                        fileList.style.display = "none";

                        document.getElementById(
                            "pdfName"
                        ).value =
                            result.fileName;

                        document.getElementById(
                            "pdfSize"
                        ).innerHTML =
                            result.size;

                        setTimeout(() => {

                            progressSection.style.display = "none";

                        }, 800);

                    }

                }

            };

        xhr.open(
            "POST",
            "/pdf-merger-ajax"
        );

        let progress = 0;

        progressSection.style.display = "block";

        progressBar.style.width = "0%";
        progressBar.innerHTML = "0%";

        const fakeProgress = setInterval(() => {

            if(progress < 90){

                progress += 10;

                progressBar.style.width =
                    progress + "%";

                progressBar.innerHTML =
                    progress + "%";
            }

        }, 200);

        const mergeBtn =
                document.getElementById("mergeBtn");

            mergeBtn.disabled = true;

            mergeBtn.innerHTML =
                '<span class="spinner-border spinner-border-sm"></span> Merging...';
        xhr.send(
            formData
        );

    }
);

/* ===========================
   DOWNLOAD
=========================== */

document
.getElementById(
    "downloadBtn"
)
.addEventListener(
    "click",
    function(e){

        e.preventDefault();

        const newName =
            document.getElementById(
                "pdfName"
            ).value;

        window.location.href =
            "/download-merged-pdf?downloadName="
            + encodeURIComponent(newName);
    }
);

/* ===========================
   PREVIEW
=========================== */

document
.getElementById(
    "previewBtn"
)
.addEventListener(
    "click",
    function(){

        document.getElementById(
            "previewFrame"
        ).src =
            "/preview-merged-pdf";

        const modal =
            new bootstrap.Modal(
                document.getElementById(
                    "pdfPreviewModal"
                )
            );

        modal.show();

    }
);

/* ===========================
   MERGE MORE
=========================== */

document
.getElementById(
    "convertMoreBtn"
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
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );

    }
);

function previewSourcePdf(index){

    event.preventDefault();

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