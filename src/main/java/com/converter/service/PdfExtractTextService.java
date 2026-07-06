package com.converter.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileWriter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PdfExtractTextService {

        public Map<String, Object> extractText(

                        MultipartFile[] pdfFiles,

                        String extractType,

                        String pageRange,

                        String outputFormat

        ) {

                Map<String, Object> result = new HashMap<>();

                try {

                        List<Map<String, String>> files = new ArrayList<>();

                        File uploadFolder = new File(
                                        System.getProperty("user.dir")
                                                        +
                                                        File.separator
                                                        +
                                                        "uploaded-pdfs");

                        if (!uploadFolder.exists()) {

                                uploadFolder.mkdirs();

                        }

                        File outputFolder = new File(
                                        System.getProperty("user.dir")
                                                        +
                                                        File.separator
                                                        +
                                                        "extracted-text");

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

                                File uploadedPdf = new File(
                                                uploadFolder,
                                                originalName);

                                pdfFile.transferTo(
                                                uploadedPdf);

                                PDDocument document = Loader.loadPDF(
                                                uploadedPdf);

                                PDFTextStripper stripper = new PDFTextStripper();

                                String extractedText = "";

                                if ("RANGE".equalsIgnoreCase(
                                                extractType)) {

                                        extractedText = extractPageRangeText(
                                                        document,
                                                        pageRange);

                                } else {

                                        extractedText = stripper.getText(
                                                        document);

                                }

                                String txtFileName = originalName.replace(
                                                ".pdf",
                                                "")
                                                +
                                                ".txt";

                                File outputFile = new File(
                                                outputFolder,
                                                txtFileName);

                                FileWriter writer = new FileWriter(
                                                outputFile);

                                writer.write(
                                                extractedText);

                                writer.close();

                                Map<String, String> fileInfo = new HashMap<>();

                                fileInfo.put(
                                                "name",
                                                txtFileName);

                                fileInfo.put(
                                                "pages",
                                                String.valueOf(
                                                                document.getNumberOfPages()));

                                fileInfo.put(
                                                "size",
                                                String.format(
                                                                "%.2f KB",
                                                                outputFile.length()
                                                                                /
                                                                                1024.0));

                                files.add(
                                                fileInfo);

                                document.close();

                                uploadedPdf.delete();

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

                        result.put(
                                        "message",
                                        e.getMessage());

                }

                return result;

        }

        private String extractPageRangeText(

                        PDDocument document,

                        String pageRange

        ) throws Exception {

                PDFTextStripper stripper = new PDFTextStripper();

                StringBuilder text = new StringBuilder();

                String[] parts = pageRange.split(",");

                for (String part : parts) {

                        part = part.trim();

                        if (part.contains("-")) {

                                String[] range = part.split("-");

                                int start = Integer.parseInt(
                                                range[0]);

                                int end = Integer.parseInt(
                                                range[1]);

                                stripper.setStartPage(
                                                start);

                                stripper.setEndPage(
                                                end);

                                text.append(
                                                stripper.getText(
                                                                document));

                        } else {

                                int page = Integer.parseInt(
                                                part);

                                stripper.setStartPage(
                                                page);

                                stripper.setEndPage(
                                                page);

                                text.append(
                                                stripper.getText(
                                                                document));

                        }

                }

                return text.toString();

        }

        public void deleteExtractedFiles() {

                File folder = new File(
                                System.getProperty("user.dir")
                                                +
                                                File.separator
                                                +
                                                "extracted-text");

                if (folder.exists()) {

                        File[] files = folder.listFiles();

                        if (files != null) {

                                for (File file : files) {

                                        if (file.isFile()) {

                                                file.delete();

                                        }

                                }

                        }

                }

        }

}
