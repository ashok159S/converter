package com.converter.service;

import org.apache.pdfbox.Loader;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;

import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.Color;

import java.io.File;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PdfWatermarkService {

        public Map<String, Object> watermarkPdf(

                        MultipartFile[] pdfFiles,

                        String watermarkType,

                        String watermarkText,

                        int textSize,

                        int imageSize,

                        int opacity,

                        String position,

                        MultipartFile watermarkImage

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
                                                        "watermarked-pdfs");

                        if (!outputFolder.exists()) {

                                outputFolder.mkdirs();

                        }

                        File imageFile = null;

                        if (watermarkImage != null
                                        &&
                                        !watermarkImage.isEmpty()) {

                                String imageName = watermarkImage.getOriginalFilename();

                                if (imageName == null
                                                ||
                                                !(imageName.toLowerCase().endsWith(".png")
                                                                ||
                                                                imageName.toLowerCase().endsWith(".jpg")
                                                                ||
                                                                imageName.toLowerCase().endsWith(".jpeg"))) {

                                        result.put(
                                                        "success",
                                                        false);

                                        result.put(
                                                        "message",
                                                        "Only PNG, JPG and JPEG watermark images are allowed.");

                                        return result;

                                }

                                imageFile = new File(

                                                outputFolder,

                                                imageName

                                );

                                watermarkImage.transferTo(
                                                imageFile);

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

                                PDDocument document;

                                try {

                                        document = Loader.loadPDF(
                                                        uploadedPdf);

                                } catch (Exception ex) {

                                        result.put(
                                                        "success",
                                                        false);

                                        result.put(
                                                        "message",
                                                        originalName +
                                                                        " is corrupted or not a valid PDF.");

                                        return result;

                                }

                                if ("text".equalsIgnoreCase(watermarkType)
                                                &&
                                                (watermarkText == null
                                                                ||
                                                                watermarkText.isBlank())) {

                                        result.put(
                                                        "success",
                                                        false);

                                        result.put(
                                                        "message",
                                                        "Please enter watermark text.");

                                        return result;

                                }

                                for (PDPage page : document.getPages()) {

                                        float pageWidth = page.getMediaBox()
                                                        .getWidth();

                                        float pageHeight = page.getMediaBox()
                                                        .getHeight();

                                        float x = pageWidth / 2;

                                        float y = pageHeight / 2;

                                        switch (position) {

                                                case "TOP_LEFT":

                                                        x = 50;
                                                        y = pageHeight - 50;

                                                        break;

                                                case "TOP_RIGHT":

                                                        x = pageWidth - 200;
                                                        y = pageHeight - 50;

                                                        break;

                                                case "BOTTOM_LEFT":

                                                        x = 50;
                                                        y = 50;

                                                        break;

                                                case "BOTTOM_RIGHT":

                                                        x = pageWidth - 200;
                                                        y = 50;

                                                        break;

                                                default:

                                                        x = pageWidth / 2;
                                                        y = pageHeight / 2;

                                        }

                                        PDPageContentStream contentStream = new PDPageContentStream(

                                                        document,

                                                        page,

                                                        PDPageContentStream.AppendMode.APPEND,

                                                        true,

                                                        true

                                        );

                                        if ("text".equalsIgnoreCase(
                                                        watermarkType)) {

                                                contentStream.beginText();

                                                contentStream.setFont(

                                                                new PDType1Font(
                                                                                Standard14Fonts.FontName.HELVETICA_BOLD),

                                                                textSize

                                                );

                                                contentStream.setNonStrokingColor(
                                                                Color.LIGHT_GRAY);

                                                contentStream.newLineAtOffset(
                                                                x,
                                                                y);

                                                contentStream.showText(
                                                                watermarkText);

                                                contentStream.endText();

                                        } else if (imageFile != null) {

                                                PDImageXObject image = PDImageXObject.createFromFile(

                                                                imageFile.getAbsolutePath(),

                                                                document

                                                );

                                                contentStream.drawImage(

                                                                image,

                                                                x,

                                                                y,

                                                                imageSize,

                                                                imageSize

                                                );

                                        }

                                        contentStream.close();

                                }

                                String outputName = originalName.replace(
                                                ".pdf",
                                                "")
                                                +
                                                "-watermarked.pdf";

                                File outputFile = new File(
                                                outputFolder,
                                                outputName);

                                document.save(
                                                outputFile);

                                document.close();

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
                                                                                1024.0

                                                ));

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
                                        "Unable to watermark the selected PDF(s).");

                }

                return result;

        }

        /*
         * ===========================
         * DELETE TEMP FILES
         * ===========================
         */

        public void deleteTempFiles() {

                deleteFolder(

                                new File(
                                                System.getProperty("user.dir")
                                                                +
                                                                File.separator
                                                                +
                                                                "uploaded-pdfs")

                );

                deleteFolder(

                                new File(
                                                System.getProperty("user.dir")
                                                                +
                                                                File.separator
                                                                +
                                                                "watermarked-pdfs")

                );

        }

        private void deleteFolder(File folder) {

                if (folder.exists()) {

                        File[] files = folder.listFiles();

                        if (files != null) {

                                for (File file : files) {

                                        file.delete();

                                }

                        }

                }

        }

}
