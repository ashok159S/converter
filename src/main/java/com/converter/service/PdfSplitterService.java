package com.converter.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.multipdf.Splitter;
import org.apache.pdfbox.pdmodel.PDDocument;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PdfSplitterService {

    public Map<String, Object> splitPdf(
            MultipartFile pdfFile
    ) {

        Map<String, Object> response =
                new HashMap<>();

        List<Map<String,String>> files =
                new ArrayList<>();

        try {

            File outputDir =
                    new File(
                            "split-pdfs"
                    );

            if(!outputDir.exists()){

                outputDir.mkdirs();

            }

            File tempPdf =
                    File.createTempFile(
                            "upload",
                            ".pdf"
                    );

            pdfFile.transferTo(
                    tempPdf
            );

            PDDocument document =
                    Loader.loadPDF(
                            tempPdf
                    );

            Splitter splitter =
                    new Splitter();

            List<PDDocument> pages =
                    splitter.split(
                            document
                    );

            int pageNumber = 1;

            for(PDDocument pageDoc : pages){

                String fileName =
                        "page-"
                        + pageNumber
                        + ".pdf";

                File outputFile =
                        new File(
                                outputDir,
                                fileName
                        );

                pageDoc.save(
                        outputFile
                );

                pageDoc.close();

                Map<String,String> fileInfo =
                        new HashMap<>();

                fileInfo.put(
                        "name",
                        fileName
                );

                fileInfo.put(
                        "size",
                        String.format(
                                "%.2f MB",
                                outputFile.length()
                                        /1024.0
                                        /1024.0
                        )
                );

                files.add(
                        fileInfo
                );

                pageNumber++;

            }

            document.close();

            tempPdf.delete();

            response.put(
                    "success",
                    true
            );

            response.put(
                    "files",
                    files
            );

        }
        catch(Exception e){

            e.printStackTrace();

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    e.getMessage()
            );

        }

        return response;

    }

}