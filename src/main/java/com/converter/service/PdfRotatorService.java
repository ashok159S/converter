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

        public Map<String, Object> rotatePdf(

                        MultipartFile[] pdfFiles,

                        int rotation

        ) {

                Map<String, Object> result = new HashMap<>();

                try {

                        List<Map<String, String>> files = new ArrayList<>();

                        File outputFolder = new File(
                                        "rotated-pdfs");

                        if (!outputFolder.exists()) {

                                outputFolder.mkdirs();

                        }

                        for (MultipartFile pdfFile : pdfFiles) {

                                String originalName = pdfFile.getOriginalFilename();

                                if (originalName == null
                                                ||
                                                originalName.isBlank()) {

                                        originalName = "document.pdf";

                                }

                                String baseName = originalName.replace(
                                                ".pdf",
                                                "");

                                File tempInput = null;

                                PDDocument document = null;

                                try {

                                        tempInput = File.createTempFile(
                                                        UUID.randomUUID().toString(),
                                                        ".pdf");

                                        pdfFile.transferTo(
                                                        tempInput);

                                        document = Loader.loadPDF(
                                                        tempInput);

                                        for (PDPage page : document.getPages()) {

                                                int currentRotation = page.getRotation();

                                                page.setRotation(
                                                                currentRotation
                                                                                +
                                                                                rotation);

                                        }

                                        File outputFile = new File(
                                                        outputFolder,
                                                        baseName
                                                                        +
                                                                        "-rotated.pdf");

                                        document.save(
                                                        outputFile);

                                        document.close();

                                        Map<String, String> fileInfo = new HashMap<>();

                                        fileInfo.put(
                                                        "name",
                                                        outputFile.getName());

                                        fileInfo.put(
                                                        "size",
                                                        String.format(
                                                                        "%.2f MB",
                                                                        outputFile.length()
                                                                                        /
                                                                                        1024.0
                                                                                        /
                                                                                        1024.0));

                                        fileInfo.put(
                                                        "rotation",
                                                        rotation + "°");

                                        files.add(
                                                        fileInfo);

                                } catch (Exception e) {

                                        throw new RuntimeException(
                                                        originalName,
                                                        e);

                                } finally {

                                        if (document != null) {

                                                document.close();

                                        }

                                        if (tempInput != null
                                                        &&
                                                        tempInput.exists()) {

                                                tempInput.delete();

                                        }

                                }

                        }

                        result.put(
                                        "success",
                                        true);

                        result.put(
                                        "files",
                                        files);

                } catch (Exception e) {

                        e.printStackTrace();

                        result.put(
                                        "success",
                                        false);

                        String fileName = "Unknown PDF";

                        if (e.getMessage() != null) {

                                fileName = e.getMessage();

                        }

                        result.put(
                                        "message",
                                        "The following PDF file(s) are corrupted, damaged, or invalid and cannot be processed:\n\n• "
                                                        +
                                                        fileName);
                }

                return result;

        }

        /*
         * ===========================
         * DELETE TEMP FILES
         * ===========================
         */

        public void deleteTemporaryFiles() {

                File folder = new File(
                                "rotated-pdfs");

                if (folder.exists()
                                &&
                                folder.isDirectory()) {

                        File[] files = folder.listFiles();

                        if (files != null) {

                                for (File file : files) {

                                        file.delete();

                                }

                        }

                }

        }

}