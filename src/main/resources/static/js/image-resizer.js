/* ===========================
   ELEMENTS
=========================== */

const imageFiles =
    document.getElementById(
        "imageFiles"
    );

const dropZone =
    document.getElementById(
        "dropZone"
    );

const resizeForm =
    document.getElementById(
        "resizeForm"
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

const widthInput =
    document.getElementById(
        "width"
    );

const heightInput =
    document.getElementById(
        "height"
    );

const maintainAspectRatio =
    document.getElementById(
        "maintainAspectRatio"
    );

let selectedFiles = [];

/* ===========================
   FILE SELECT
=========================== */

imageFiles.addEventListener(
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

                            <i class="bi bi-image-fill"></i>

                            ${file.name}

                        </div>

                        <div class="col-md-2 text-center file-row-size">

                            ${(file.size / 1024 / 1024).toFixed(2)} MB

                        </div>

                        <div class="col-md-2 text-center">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewImage(${index})">

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

        imageFiles.value =
            "";

        return;

    }

    showFiles();

}

/* ===========================
   PREVIEW ORIGINAL IMAGE
=========================== */

function previewImage(index){

    const file =
        selectedFiles[index];

    const url =
        URL.createObjectURL(
            file
        );

    document.getElementById(
        "previewImage"
    ).src =
        url;

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "imagePreviewModal"
            )
        );

    modal.show();

}

/* ===========================
   PREVIEW RESIZED IMAGE
=========================== */

function previewResizedImage(
    fileName
){

    document.getElementById(
        "previewImage"
    ).src =
        "/preview-resized-image?fileName="
        +
        encodeURIComponent(
            fileName
        );

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "imagePreviewModal"
            )
        );

    modal.show();

}

/* ===========================
   AUTO ASPECT RATIO
=========================== */

let originalWidth = 0;

let originalHeight = 0;

imageFiles.addEventListener(
    "change",
    function(){

        if(
            this.files.length > 0
        ){

            const file =
                this.files[0];

            const image =
                new Image();

            image.onload =
                function(){

                    originalWidth =
                        image.width;

                    originalHeight =
                        image.height;

                };

            image.src =
                URL.createObjectURL(
                    file
                );

        }

    }
);

widthInput.addEventListener(
    "input",
    function(){

        if(
            !maintainAspectRatio.checked
        ){

            return;

        }

        if(
            originalWidth === 0
            ||
            originalHeight === 0
        ){

            return;

        }

        const ratio =
            originalHeight
            /
            originalWidth;

        heightInput.value =
            Math.round(
                this.value
                *
                ratio
            );

    }
);

heightInput.addEventListener(
    "input",
    function(){

        if(
            !maintainAspectRatio.checked
        ){

            return;

        }

        if(
            originalWidth === 0
            ||
            originalHeight === 0
        ){

            return;

        }

        const ratio =
            originalWidth
            /
            originalHeight;

        widthInput.value =
            Math.round(
                this.value
                *
                ratio
            );

    }
);


/* ===========================
   RESIZE IMAGES
=========================== */

resizeForm.addEventListener(
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
                "Please select images"
            );

            return;

        }

        const formData =
            new FormData();

        selectedFiles.forEach(
            file => {

                formData.append(
                    "imageFiles",
                    file
                );

            }
        );

        formData.append(
            "width",
            widthInput.value
        );

        formData.append(
            "height",
            heightInput.value
        );

        formData.append(
            "maintainAspectRatio",
            maintainAspectRatio.checked
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
            "/image-resizer-ajax"
        );

        xhr.send(
            formData
        );

    }
);

/* ===========================
   RESULT TABLE
=========================== */

function buildResultTable(
    result
){

    const container =
        document.getElementById(
            "resizedFilesContainer"
        );

    container.innerHTML =
        "";

    let totalOriginal = 0;

    let totalResized = 0;

    result.files.forEach(
        file => {

            totalOriginal +=
                parseFloat(
                    file.originalSize
                );

            totalResized +=
                parseFloat(
                    file.resizedSize
                );

            container.innerHTML += `

            <div class="card mb-2">

                <div class="card-body">

                    <div class="row text-center align-items-center">

                        <div class="col-md-3">

                            ${file.name}

                        </div>

                        <div class="col-md-2">

                            ${file.originalSize}

                        </div>

                        <div class="col-md-2">

                            ${file.resizedSize}

                        </div>

                        <div class="col-md-2">

                            ${file.dimensions}

                        </div>

                        <div class="col-md-1">

                            <button
                                type="button"
                                class="btn btn-primary btn-sm"
                                onclick="previewResizedImage('${file.name}')">

                                Preview

                            </button>

                        </div>

                        <div class="col-md-2">

                            <a
                                class="btn btn-success btn-sm"
                                href="/download-resized-image?fileName=${file.name}">

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
        "resultOriginalSize"
    ).innerHTML =
        totalOriginal.toFixed(2)
        + " MB";

    document.getElementById(
        "resultResizedSize"
    ).innerHTML =
        totalResized.toFixed(2)
        + " MB";

}

/* ===========================
   RESIZE MORE
=========================== */

document.getElementById(
    "resizeMoreBtn"
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