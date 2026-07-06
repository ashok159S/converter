package com.converter.service;

import org.apache.pdfbox.Loader;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;

import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class PdfPageNumbersService {

        public Map<String, Object> addPageNumbers(

                        MultipartFile[] pdfFiles,

                        int startNumber,

                        int fontSize,

                        String position,

                        String pageFormat

        ) {

                ArrayList<Map<String, String>> files = new ArrayList<>();

                Map<String, Object> result = new HashMap<>();

                File uploadedPdf = null;

                PDDocument document = null;

                File outputFile = null;

                try {

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
                                                        "numbered-pdfs");

                        if (!outputFolder.exists()) {

                                outputFolder.mkdirs();

                        }
                        for (MultipartFile pdfFile : pdfFiles) {

                                if (pdfFile == null ||
                                                pdfFile.isEmpty()) {

                                        result.put(
                                                        "success",
                                                        false);

                                        result.put(
                                                        "message",
                                                        "One or more uploaded files are empty.");

                                        return result;

                                }

                                if (!"application/pdf".equalsIgnoreCase(
                                                pdfFile.getContentType())) {

                                        result.put(
                                                        "success",
                                                        false);

                                        result.put(
                                                        "message",
                                                        "Only PDF files are allowed.");

                                        return result;

                                }

                                String originalName = pdfFile.getOriginalFilename();

                                if (originalName == null ||
                                                originalName.isBlank()) {

                                        originalName = "document.pdf";

                                }

                                String outputName = originalName.replace(
                                                ".pdf",
                                                "")
                                                +
                                                "-numbered.pdf";

                                uploadedPdf = new File(
                                                uploadFolder,
                                                originalName);

                                pdfFile.transferTo(
                                                uploadedPdf);

                                try {

                                        document = Loader.loadPDF(
                                                        uploadedPdf);

                                } catch (Exception ex) {

                                        if (uploadedPdf.exists()) {

                                                uploadedPdf.delete();

                                        }

                                        result.put(
                                                        "success",
                                                        false);

                                        result.put(
                                                        "message",
                                                        originalName
                                                                        +
                                                                        " is corrupted or not a valid PDF.");

                                        return result;

                                }

                                int totalPages = document.getNumberOfPages();

                                int pageNumber = startNumber;

                                for (int i = 0; i < totalPages; i++) {

                                        PDPage page = document.getPage(i);

                                        float pageWidth = page.getMediaBox()
                                                        .getWidth();

                                        float pageHeight = page.getMediaBox()
                                                        .getHeight();

                                        String text;

                                        if ("PAGE_NUMBER".equalsIgnoreCase(
                                                        pageFormat)) {

                                                text = "Page "
                                                                +
                                                                pageNumber;

                                        } else if ("PAGE_OF_TOTAL".equalsIgnoreCase(
                                                        pageFormat)) {

                                                text = "Page "
                                                                +
                                                                pageNumber
                                                                +
                                                                " of "
                                                                +
                                                                totalPages;

                                        } else {

                                                text = String.valueOf(
                                                                pageNumber);

                                        }

                                        float x = 50;
                                        float y = 50;

                                        switch (position) {

                                                case "BOTTOM_CENTER":

                                                        x = pageWidth / 2;

                                                        y = 30;

                                                        break;

                                                case "BOTTOM_RIGHT":

                                                        x = pageWidth - 70;

                                                        y = 30;

                                                        break;

                                                case "BOTTOM_LEFT":

                                                        x = 30;

                                                        y = 30;

                                                        break;

                                                case "TOP_CENTER":

                                                        x = pageWidth / 2;

                                                        y = pageHeight - 30;

                                                        break;

                                                case "TOP_RIGHT":

                                                        x = pageWidth - 70;

                                                        y = pageHeight - 30;

                                                        break;

                                                case "TOP_LEFT":

                                                        x = 30;

                                                        y = pageHeight - 30;

                                                        break;

                                        }

                                        PDPageContentStream contentStream = new PDPageContentStream(

                                                        document,

                                                        page,

                                                        PDPageContentStream.AppendMode.APPEND,

                                                        true,

                                                        true

                                        );

                                        contentStream.beginText();

                                        contentStream.setFont(

                                                        new PDType1Font(
                                                                        Standard14Fonts.FontName.HELVETICA_BOLD),

                                                        fontSize

                                        );

                                        contentStream.newLineAtOffset(
                                                        x,
                                                        y);

                                        contentStream.showText(
                                                        text);

                                        contentStream.endText();

                                        contentStream.close();

                                        pageNumber++;

                                }
                                outputFile = new File(
                                                outputFolder,
                                                outputName);
                                document.save(
                                                outputFile);

                                Map<String, String> fileInfo = new HashMap<>();

                                fileInfo.put(
                                                "name",
                                                outputName);

                                fileInfo.put(
                                                "size",
                                                String.format(
                                                                "%.2f MB",
                                                                outputFile.length()
                                                                                /
                                                                                1024.0
                                                                                /
                                                                                1024.0));

                                files.add(
                                                fileInfo);

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
                                        "Unable to add page numbers.");

                } finally {

                        try {

                                if (document != null) {

                                        document.close();

                                }

                        } catch (Exception ex) {

                                ex.printStackTrace();

                        }

                        if (uploadedPdf != null &&
                                        uploadedPdf.exists()) {

                                uploadedPdf.delete();

                        }

                }

                return result;

        }

}
