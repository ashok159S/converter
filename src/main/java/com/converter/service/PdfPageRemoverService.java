package com.converter.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class PdfPageRemoverService {

    public Map<String,Object> removePages(

            MultipartFile[] pdfFiles,

            String pagesToRemove

    ){

        Map<String,Object> result =
                new HashMap<>();

        try{

            List<Map<String,String>> files =
                    new ArrayList<>();

            File outputFolder =
                    new File(
                            "processed-pdfs"
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

                PDDocument sourceDocument =
                        Loader.loadPDF(
                                tempInput
                        );

                int originalPages =
                        sourceDocument.getNumberOfPages();

                Set<Integer> pages =
                        parsePages(
                                pagesToRemove
                        );

                PDDocument outputDocument =
                        new PDDocument();

                for(
                        int i = 0;
                        i < originalPages;
                        i++
                ){

                    int pageNumber =
                            i + 1;

                    if(
                            !pages.contains(
                                    pageNumber
                            )
                    ){

                        outputDocument.importPage(
                                sourceDocument.getPage(
                                        i
                                )
                        );

                    }

                }

                File outputFile =
                        new File(
                                outputFolder,
                                baseName
                                +
                                "-processed.pdf"
                        );

                outputDocument.save(
                        outputFile
                );

                int finalPages =
                        outputDocument.getNumberOfPages();

                int removedPages =
                        originalPages
                        -
                        finalPages;

                outputDocument.close();

                sourceDocument.close();

                Map<String,String> fileInfo =
                        new HashMap<>();

                fileInfo.put(
                        "name",
                        outputFile.getName()
                );

                fileInfo.put(
                        "originalPages",
                        String.valueOf(
                                originalPages
                        )
                );

                fileInfo.put(
                        "removedPages",
                        String.valueOf(
                                removedPages
                        )
                );

                fileInfo.put(
                        "finalPages",
                        String.valueOf(
                                finalPages
                        )
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

    /* ===========================
       PARSE PAGE INPUT
    =========================== */

    private Set<Integer> parsePages(

            String pageText

    ){

        Set<Integer> pages =
                new HashSet<>();

        String[] parts =
                pageText.split(",");

        for(
                String part
                :
                parts
        ){

            part =
                    part.trim();

            if(
                    part.contains("-")
            ){

                String[] range =
                        part.split("-");

                int start =
                        Integer.parseInt(
                                range[0].trim()
                        );

                int end =
                        Integer.parseInt(
                                range[1].trim()
                        );

                for(
                        int i = start;
                        i <= end;
                        i++
                ){

                    pages.add(
                            i
                    );

                }

            }
            else{

                pages.add(
                        Integer.parseInt(
                                part
                        )
                );

            }

        }

        return pages;

    }

}

