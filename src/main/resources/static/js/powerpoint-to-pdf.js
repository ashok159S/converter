/* ===========================
   ELEMENTS
=========================== */

const pptFiles =
document.getElementById(
    "pptFiles"
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

const powerPointToPdfForm =
document.getElementById(
    "powerPointToPdfForm"
);

const uploadSection =
document.getElementById(
    "uploadSection"
);

const progressSection =
document.getElementById(
    "progressSection"
);

const progressBar =
document.getElementById(
    "progressBar"
);

const convertBtn =
document.getElementById(
    "convertBtn"
);

let conversionCompleted =
false;

let selectedFiles = [];

/* ===========================
   FILE SELECT
=========================== */

pptFiles.addEventListener(
    "change",
    function(){

        addFiles(
            Array.from(this.files)
        );

        this.value = "";

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

        addFiles(
            Array.from(
                e.dataTransfer.files
            )
        );

    }
);

/* ===========================
   ADD FILES
=========================== */

function addFiles(newFiles){

    const duplicateFiles = [];

    newFiles.forEach(file => {

        const fileName =
        file.name.toLowerCase();

        if(
            !(
                fileName.endsWith(".ppt")
                ||
                fileName.endsWith(".pptx")
            )
        ){

            alert(
                file.name +
                " is not a PowerPoint file."
            );

            return;

        }

        if(file.size > 50 * 1024 * 1024){

            alert(
                file.name +
                " exceeds the 50 MB limit."
            );

            return;

        }

        const alreadyExists =
        selectedFiles.some(
            existingFile =>
                existingFile.name === file.name &&
                existingFile.size === file.size
        );

        if(alreadyExists){

            duplicateFiles.push(
                file.name
            );

        }
        else{

            selectedFiles.push(
                file
            );

        }

    });

    if(duplicateFiles.length > 0){

        alert(
            "Duplicate file(s) skipped:\n\n"
            +
            duplicateFiles.join("\n")
        );

    }

    renderFiles();

}

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

                            <i class="bi bi-file-earmark-slides-fill"></i>

                            ${file.name}

                        </div>

                        <div class="col-md-2 text-center">

                            ${(file.size / 1024 / 1024).toFixed(2)} MB

                        </div>

                        <div class="col-md-2 text-center">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewPowerPoint(${index})">

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
   POWERPOINT PREVIEW
=========================== */

function previewPowerPoint(index){

    const file =
    selectedFiles[index];

    document.getElementById(
        "previewFileName"
    ).innerHTML =
    file.name;

    const modal =
    new bootstrap.Modal(
        document.getElementById(
            "pptPreviewModal"
        )
    );

    modal.show();

}
/* ===========================
   CONVERT
=========================== */

powerPointToPdfForm.addEventListener(
    "submit",
    function(e){

        e.preventDefault();

        if(convertBtn.disabled){

            return;

        }

        if(
            !validateFiles(selectedFiles)
        ){

            return;

        }

        if(selectedFiles.length === 0){

            alert(
                "Please select PowerPoint files."
            );

            return;

        }

        convertBtn.disabled = true;

        uploadSection.style.display =
        "none";

        progressSection.style.display =
        "block";

        document.body.classList.add(
            "conversion-active"
        );

        let progress = 0;

        progressBar.style.width =
        "0%";

        progressBar.innerHTML =
        "0%";

        const progressInterval =
        setInterval(function(){

            if(progress < 95){

                progress++;

                progressBar.style.width =
                progress + "%";

                progressBar.innerHTML =
                progress + "%";

            }

        },100);

        const formData =
        new FormData();

        selectedFiles.forEach(
            file => {

                formData.append(
                    "pptFiles",
                    file
                );

            }
        );

        formData.append(
            "conversionMode",
            document.querySelector(
                'input[name="conversionMode"]:checked'
            ).value
        );

        formData.append(
            "pdfLayout",
            document.querySelector(
                'input[name="pdfLayout"]:checked'
            ).value
        );

        formData.append(
            "orientation",
            document.querySelector(
                'input[name="orientation"]:checked'
            ).value
        );

        formData.append(
            "quality",
            document.querySelector(
                'input[name="quality"]:checked'
            ).value
        );

        fetch(
            "/powerpoint-to-pdf-ajax",
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

                clearInterval(
                    progressInterval
                );

                progressBar.style.width =
                "100%";

                progressBar.innerHTML =
                "100%";

                conversionCompleted =
                true;

                if(result.success){

                    buildResult(
                        result
                    );

                }
                else{

                    alert(
                        result.message
                    );

                    uploadSection.style.display =
                    "block";

                    progressSection.style.display =
                    "none";

                    convertBtn.disabled =
                    false;

                    document.body.classList.remove(
                        "conversion-active"
                    );

                }

            }
        )
        .catch(
            function(){

                clearInterval(
                    progressInterval
                );

                alert(
                    "Conversion failed. Please try again."
                );

                uploadSection.style.display =
                "block";

                progressSection.style.display =
                "none";

                convertBtn.disabled =
                false;

                document.body.classList.remove(
                    "conversion-active"
                );

            }
        );

    }
);

/* ===========================
   RESULT
=========================== */

function buildResult(result){

    uploadSection.style.display =
"none";

progressSection.style.display =
"none";

document.getElementById(
    "resultCard"
).style.display =
"block";

convertBtn.disabled =
false;

document.body.classList.remove(
    "conversion-active"
);

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

                    <div class="row align-items-center text-center">

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
                               href="/download-converted-ppt-pdf?fileName=${file.name}"
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
   PDF PREVIEW
=========================== */

function previewResultPdf(fileName){

    document.getElementById(
        "pdfPreviewFrame"
    ).src =
    "/preview-converted-ppt-pdf?fileName="
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
   CONVERT MORE
=========================== */

document.getElementById(
    "convertMoreBtn"
).addEventListener(
    "click",
    function(){

        selectedFiles = [];

        conversionCompleted = false;

        fetch(
            "/delete-powerpoint-pdf-files",
            {
                method:"POST"
            }
        )
        .finally(
            function(){

                location.reload();

            }
        );

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

