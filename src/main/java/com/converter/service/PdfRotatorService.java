package com.converter.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PdfRotatorService {

    public Map<String,Object> rotatePdf(

            MultipartFile[] pdfFiles,

            int rotation

    ){

        Map<String,Object> result =
                new HashMap<>();

        try{

            List<Map<String,String>> files =
                    new ArrayList<>();

            File outputFolder =
                    new File(
                            "rotated-pdfs"
                    );

            if(!outputFolder.exists()){

                outputFolder.mkdirs();

            }

            for(
                    MultipartFile pdfFile
                    :
                    pdfFiles
            ){

                String originalName =
                        pdfFile.getOriginalFilename();

                if(
                        originalName == null
                        ||
                        originalName.isBlank()
                ){

                    originalName =
                            "document.pdf";

                }

                String baseName =
                        originalName.replace(
                                ".pdf",
                                ""
                        );

                File tempInput =
                        File.createTempFile(
                                UUID.randomUUID().toString(),
                                ".pdf"
                        );

                pdfFile.transferTo(
                        tempInput
                );

                PDDocument document =
                        Loader.loadPDF(
                                tempInput
                        );

                for(
                        PDPage page
                        :
                        document.getPages()
                ){

                    int currentRotation =
                            page.getRotation();

                    page.setRotation(
                            currentRotation
                            +
                            rotation
                    );

                }

                File outputFile =
                        new File(
                                outputFolder,
                                baseName
                                +
                                "-rotated.pdf"
                        );

                document.save(
                        outputFile
                );

                document.close();

                Map<String,String> fileInfo =
                        new HashMap<>();

                fileInfo.put(
                        "name",
                        outputFile.getName()
                );

                fileInfo.put(
                        "size",
                        String.format(
                                "%.2f MB",
                                outputFile.length()
                                /
                                1024.0
                                /
                                1024.0
                        )
                );

                fileInfo.put(
                        "rotation",
                        rotation + "°"
                );

                files.add(
                        fileInfo
                );

                tempInput.delete();

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