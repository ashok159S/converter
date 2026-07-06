package com.converter.service;

import org.apache.pdfbox.multipdf.PDFMergerUtility;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import java.io.File;
import java.util.*;

@Service
public class PdfMergerService {

    public Map<String, Object> mergePdfFiles(
            MultipartFile[] pdfFiles
    ) {

        Map<String, Object> response =
                new HashMap<>();

        List<File> tempFiles =
                new ArrayList<>();

        try {

            PDFMergerUtility merger =
                    new PDFMergerUtility();

            File mergedFile =
                    new File("merged.pdf");

            if (mergedFile.exists()) {

                mergedFile.delete();

            }

            for (MultipartFile pdf : pdfFiles) {

                if (pdf == null || pdf.isEmpty()) {

                    response.put(
                            "success",
                            false
                    );

                    response.put(
                            "message",
                            "One or more uploaded files are empty."
                    );

                    return response;

                }

                if (!"application/pdf".equalsIgnoreCase(
                        pdf.getContentType()
                )) {

                    response.put(
                            "success",
                            false
                    );

                    response.put(
                            "message",
                            "Only PDF files are allowed."
                    );

                    return response;

                }

                File tempFile =
                        File.createTempFile(
                                "pdf-",
                                ".pdf"
                        );

                pdf.transferTo(
                        tempFile
                );

                try (
                        PDDocument document =
                                Loader.loadPDF(tempFile)
                ) {

                    // Valid PDF

                } catch (Exception ex) {

                    tempFile.delete();

                    response.put(
                            "success",
                            false
                    );

                    response.put(
                            "message",
                            pdf.getOriginalFilename()
                                    + " is corrupted or not a valid PDF."
                    );

                    return response;

                }

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

            merger.mergeDocuments(
                    null
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
                            mergedFile.length()
                                    / 1024.0
                                    / 1024.0
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    "Unable to merge PDF files."
            );

        } finally {

            for (File temp : tempFiles) {

                if (temp.exists()) {

                    temp.delete();

                }

            }

        }

        return response;

    }

}