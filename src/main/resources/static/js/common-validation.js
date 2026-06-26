const MAX_FILE_SIZE =
50 * 1024 * 1024;

function validateFiles(files){

    for(let file of files){

        if(
            file.size >
            MAX_FILE_SIZE
        ){

            alert(
                "Maximum file size is 50 MB."
            );

            location.reload();

            return false;

        }

    }

    return true;

}