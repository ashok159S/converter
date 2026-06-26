package com.converter.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExcelToPdfService {

    public Map<String,Object> convertExcelToPdf(

            MultipartFile[] excelFiles,

            String orientation,

            String paperSize,

            String scaling,

            String quality

    ){

        Map<String,Object> result =
                new HashMap<>();

        try{

            List<Map<String,String>> files =
                    new ArrayList<>();

            File uploadFolder =
                    new File(

                            System.getProperty("user.dir")
                            +
                            File.separator
                            +
                            "uploaded-excel"

                    );

            if(!uploadFolder.exists()){

                uploadFolder.mkdirs();

            }

            File outputFolder =
                    new File(

                            System.getProperty("user.dir")
                            +
                            File.separator
                            +
                            "converted-pdfs"

                    );

            if(!outputFolder.exists()){

                outputFolder.mkdirs();

            }

            for(

                    MultipartFile excelFile
                    :
                    excelFiles

            ){

                String originalName =
                        excelFile.getOriginalFilename();

                if(

                        originalName == null
                        ||
                        originalName.isBlank()

                ){

                    originalName =
                            "spreadsheet.xlsx";

                }

                File uploadedFile =
                        new File(

                                uploadFolder,

                                originalName

                        );

                excelFile.transferTo(
                        uploadedFile
                );

                ProcessBuilder processBuilder =
                        new ProcessBuilder(

                                "C:\\Program Files\\LibreOffice\\program\\soffice.exe",

                                "--headless",

                                "--convert-to",

                                "pdf",

                                uploadedFile.getAbsolutePath(),

                                "--outdir",

                                outputFolder.getAbsolutePath()

                        );

                processBuilder.redirectErrorStream(
                        true
                );

                Process process =
                        processBuilder.start();

                int exitCode =
                        process.waitFor();

                if(exitCode != 0){

                    throw new RuntimeException(
                            "LibreOffice conversion failed"
                    );

                }

                String pdfName =
                        originalName.replaceAll(
                                "\\.(xlsx|xls)$",
                                ".pdf"
                        );

                File pdfFile =
                        new File(
                                outputFolder,
                                pdfName
                        );

                if(!pdfFile.exists()){

                    throw new RuntimeException(
                            "PDF file not generated"
                    );

                }

                Map<String,String> fileInfo =
                        new HashMap<>();

                fileInfo.put(
                        "name",
                        pdfName
                );

                fileInfo.put(

                        "size",

                        String.format(

                                "%.2f MB",

                                pdfFile.length()
                                /
                                1024.0
                                /
                                1024.0

                        )

                );

                files.add(
                        fileInfo
                );

            }

            result.put(
                    "success",
                    true
            );

            result.put(
                    "files",
                    files
            );

        }
        catch(Exception e){

            e.printStackTrace();

            result.put(
                    "success",
                    false
            );

            result.put(
                    "message",
                    e.getMessage()
            );

        }

        return result;

    }

}