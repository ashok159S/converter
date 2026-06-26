package com.converter.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class WordToPdfService {

    private static final String LIBRE_OFFICE_PATH =
            "C:\\Program Files\\LibreOffice\\program\\soffice.exe";

    public Map<String,Object> convertWordToPdf(

            MultipartFile[] wordFiles

    ){

        Map<String,Object> result =
                new HashMap<>();

        try{

            List<Map<String,String>> files =
                    new ArrayList<>();

            File outputFolder =
                    new File(
                            "converted-pdfs"
                    );

            if(!outputFolder.exists()){

                outputFolder.mkdirs();

            }

            for(
                    MultipartFile wordFile
                    :
                    wordFiles
            ){

                String originalName =
                        wordFile.getOriginalFilename();

                if(
                        originalName == null
                        ||
                        originalName.isBlank()
                ){

                    originalName =
                            "document.docx";

                }

                String baseName =
                        originalName.replaceAll(
                                "\\.[^.]+$",
                                ""
                        );

                File inputFile =
                        File.createTempFile(
                                UUID.randomUUID().toString(),
                                ".docx"
                        );

                wordFile.transferTo(
                        inputFile
                );

                ProcessBuilder processBuilder =
                        new ProcessBuilder(

                                LIBRE_OFFICE_PATH,

                                "--headless",

                                "--convert-to",

                                "pdf",

                                "--outdir",

                                outputFolder.getAbsolutePath(),

                                inputFile.getAbsolutePath()

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
                            "Word to PDF conversion failed"
                    );

                }

                File generatedPdf =
                        new File(
                                outputFolder,
                                inputFile.getName()
                                         .replaceAll(
                                                 "\\.[^.]+$",
                                                 ".pdf"
                                         )
                        );

                File finalPdf =
                        new File(
                                outputFolder,
                                baseName
                                +
                                ".pdf"
                        );

                generatedPdf.renameTo(
                        finalPdf
                );

                Map<String,String> fileInfo =
                        new HashMap<>();

                fileInfo.put(
                        "name",
                        finalPdf.getName()
                );

                fileInfo.put(
                        "originalSize",
                        String.format(
                                "%.2f MB",
                                wordFile.getSize()
                                /
                                1024.0
                                /
                                1024.0
                        )
                );

                fileInfo.put(
                        "pdfSize",
                        String.format(
                                "%.2f MB",
                                finalPdf.length()
                                /
                                1024.0
                                /
                                1024.0
                        )
                );

                files.add(
                        fileInfo
                );

                inputFile.delete();

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