package com.converter.service;

import org.apache.pdfbox.multipdf.PDFMergerUtility;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.*;

@Service
public class PdfMergerService {

    public Map<String,Object> mergePdfFiles(
            MultipartFile[] pdfFiles
    ) {

        Map<String,Object> response =
                new HashMap<>();

        try {

            PDFMergerUtility merger =
                    new PDFMergerUtility();

            List<File> tempFiles =
                    new ArrayList<>();

            for(MultipartFile pdf : pdfFiles){

                if(pdf.isEmpty()){

                    continue;

                }

                File tempFile =
                        File.createTempFile(
                                "pdf-",
                                ".pdf"
                        );

                pdf.transferTo(
                        tempFile
                );

                merger.addSource(
                        tempFile
                );

                tempFiles.add(
                        tempFile
                );

            }

            merger.setDestinationFileName(
                    "merged.pdf"
            );

            merger.mergeDocuments(null);

            File mergedPdf =
                    new File(
                            "merged.pdf"
                    );

            response.put(
                    "success",
                    true
            );

            response.put(
                    "fileName",
                    "merged.pdf"
            );

            response.put(
                    "size",
                    String.format(
                            "%.2f MB",
                            mergedPdf.length()
                                    /1024.0
                                    /1024.0
                    )
            );

            for(File temp : tempFiles){

                temp.delete();

            }

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