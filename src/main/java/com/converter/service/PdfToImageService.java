package com.converter.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.util.UUID;
import java.io.File;
import java.util.*;

@Service
public class PdfToImageService {

public Map<String, Object> convertPdfToImages(
        MultipartFile pdfFile,
        String quality,
        String outputFormat) {

    Map<String, Object> response =
            new HashMap<>();

    List<Map<String, String>> files =
            new ArrayList<>();

    try {

        File uploadDir =
                new File("converted-images");

        if (!uploadDir.exists()) {

            uploadDir.mkdirs();

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

        PDFRenderer renderer =
                new PDFRenderer(
                        document
                );

        float dpi = 300;

        if ("medium".equalsIgnoreCase(quality)) {

            dpi = 200;

        } else if ("low".equalsIgnoreCase(quality)) {

            dpi = 100;

        }

        for (int page = 0;
             page < document.getNumberOfPages();
             page++) {

            BufferedImage image =
                    renderer.renderImageWithDPI(
                            page,
                            dpi
                    );

            String fileName =
                    "page-"
                            + (page + 1)
                            + "."
                            + outputFormat;

            File outputFile =
                    new File(
                            uploadDir,
                            fileName
                    );

            ImageIO.write(
                    image,
                    outputFormat,
                    outputFile
            );

            Map<String, String> fileInfo =
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
                                    / 1024.0
                                    / 1024.0
                    )
            );

            files.add(
                    fileInfo
            );

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

    } catch (Exception e) {

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
