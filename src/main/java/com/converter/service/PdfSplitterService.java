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
                        MultipartFile pdfFile) {

                Map<String, Object> response = new HashMap<>();

                List<Map<String, String>> files = new ArrayList<>();

                try {

                        File outputDir = new File(
                                        "split-pdfs");

                        if (!outputDir.exists()) {

                                outputDir.mkdirs();

                        }

                        File tempPdf = null;

                        PDDocument document = null;

                        try {

                                tempPdf = File.createTempFile(
                                                "upload",
                                                ".pdf");

                                pdfFile.transferTo(
                                                tempPdf);

                                document = Loader.loadPDF(
                                                tempPdf);

                                Splitter splitter = new Splitter();

                                List<PDDocument> pages = splitter.split(
                                                document);

                                int pageNumber = 1;

                                for (PDDocument pageDoc : pages) {

                                        try {

                                                String fileName = "page-"
                                                                + pageNumber
                                                                + ".pdf";

                                                File outputFile = new File(
                                                                outputDir,
                                                                fileName);

                                                pageDoc.save(
                                                                outputFile);

                                                Map<String, String> fileInfo = new HashMap<>();

                                                fileInfo.put(
                                                                "name",
                                                                fileName);

                                                fileInfo.put(
                                                                "size",
                                                                String.format(
                                                                                "%.2f MB",
                                                                                outputFile.length()
                                                                                                / 1024.0
                                                                                                / 1024.0));

                                                files.add(
                                                                fileInfo);

                                                pageNumber++;

                                        } finally {

                                                pageDoc.close();

                                        }

                                }

                        } catch (Exception e) {

                                throw new RuntimeException(

                                                pdfFile.getOriginalFilename(),

                                                e

                                );

                        } finally {

                                if (

                                document != null

                                ) {

                                        document.close();

                                }

                                if (

                                tempPdf != null
                                                &&
                                                tempPdf.exists()

                                ) {

                                        tempPdf.delete();

                                }

                        }
                        response.put(
                                        "success",
                                        true);

                        response.put(
                                        "files",
                                        files);

                } catch (Exception e) {

                        e.printStackTrace();

                        response.put(
                                        "success",
                                        false);

                        String fileName = "Unknown PDF";

                        if (

                        e.getMessage() != null
                                        &&

                                        !e.getMessage().isBlank()

                        ) {

                                fileName = e.getMessage();

                        }

                        response.put(
                                        "message",
                                        "The following PDF file(s) are corrupted, damaged, or invalid and cannot be processed:\n\n• "
                                                        +
                                                        fileName);

                }

                return response;

        }
        /*
         * ===========================
         * DELETE TEMP FILES
         * ===========================
         */

        public void deleteTemporaryFiles() {

                File folder = new File(
                                "split-pdfs");

                if (

                folder.exists()
                                &&

                                folder.isDirectory()

                ) {

                        File[] files = folder.listFiles();

                        if (

                        files != null

                        ) {

                                for (

                                File file :

                                files

                                ) {

                                        if (

                                        file.isFile()

                                        ) {

                                                file.delete();

                                        }

                                }

                        }

                }

        }

}