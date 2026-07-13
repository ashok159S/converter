package com.converter.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.*;

@Service
public class PdfToImageService {

        public Map<String, Object> convertPdfToImages(

                        MultipartFile[] pdfFiles,

                        String quality,

                        String outputFormat

        ) {

                // Delete old converted images
                deleteTemporaryFiles();

                Map<String, Object> response = new HashMap<>();

                List<Map<String, String>> files = new ArrayList<>();

                try {

                        File uploadDir = new File(
                                        "converted-images");

                        if (!uploadDir.exists()) {

                                uploadDir.mkdirs();

                        }

                        float dpi = 300;

                        if ("medium".equalsIgnoreCase(quality)) {

                                dpi = 200;

                        } else if ("low".equalsIgnoreCase(quality)) {

                                dpi = 100;

                        }

                        for (

                        MultipartFile pdfFile : pdfFiles

                        ) {

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

                                        PDFRenderer renderer = new PDFRenderer(
                                                        document);

                                        String originalName = pdfFile.getOriginalFilename();

                                        if (

                                        originalName == null
                                                        ||
                                                        originalName.isBlank()

                                        ) {

                                                originalName = "document.pdf";

                                        }

                                        String baseName = originalName.replaceFirst(
                                                        "(?i)\\.pdf$",
                                                        "");

                                        for (

                                                        int page = 0;

                                                        page < document.getNumberOfPages();

                                                        page++

                                                        ) {

                                                BufferedImage image = renderer.renderImageWithDPI(

                                                                page,

                                                                dpi

                                                );

                                                String fileName = baseName
                                                                +
                                                                "-page-"
                                                                +
                                                                (page + 1)
                                                                +
                                                                "-"
                                                                +
                                                                UUID.randomUUID()
                                                                                .toString()
                                                                                .substring(0, 8)
                                                                +
                                                                "."
                                                                +
                                                                outputFormat;

                                                File outputFile = new File(

                                                                uploadDir,

                                                                fileName

                                                );

                                                ImageIO.write(

                                                                image,

                                                                outputFormat,

                                                                outputFile

                                                );

                                                image.flush();

                                                Map<String, String> fileInfo = new HashMap<>();

                                                fileInfo.put(
                                                                "name",
                                                                fileName);

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

                                } catch (Exception e) {

                                        throw new RuntimeException(

                                                        pdfFile.getOriginalFilename(),

                                                        e

                                        );

                                }

                                finally {

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
                                "converted-images");

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

                                File file : files

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
