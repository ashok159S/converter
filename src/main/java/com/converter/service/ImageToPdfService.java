package com.converter.service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.util.List;

@Service
public class ImageToPdfService {

    private static final String PDF_FILE_NAME = "merged.pdf";

    private static final String OUTPUT_FOLDER = "generated-pdf";

    /*
     * ===========================
     * CONVERT IMAGES
     * ===========================
     */

    public Map<String, Object> convertImages(

            MultipartFile[] images,

            String pageSize,

            String quality,

            String conversionMode

    ) {

        Map<String, Object> response = new HashMap<>();

        try {

            /*
             * ===========================
             * VALIDATION
             * ===========================
             */

            if (images == null
                    ||
                    images.length == 0) {

                response.put(
                        "success",
                        false);

                response.put(
                        "message",
                        "Please upload at least one image.");

                return response;

            }

            for (MultipartFile image : images) {

                if (image.isEmpty()) {

                    response.put(
                            "success",
                            false);

                    response.put(
                            "message",
                            "Empty image detected.");

                    return response;

                }

            }

            File outputFolder = new File(
                    OUTPUT_FOLDER);

            if (!outputFolder.exists()) {

                outputFolder.mkdirs();

            }

            /*
             * ===========================
             * CONVERSION MODE
             * ===========================
             */

            if ("separate".equalsIgnoreCase(
                    conversionMode)) {

                return convertSeparatePdf(

                        images,

                        pageSize,

                        quality

                );

            }

            return convertMergedPdf(

                    images,

                    pageSize,

                    quality

            );

        } catch (Exception e) {

            e.printStackTrace();

            response.put(
                    "success",
                    false);

            response.put(
                    "message",
                    e.getMessage());

            return response;

        }

    }

    /*
     * ===========================
     * MERGE PDF
     * ===========================
     */

    private Map<String, Object> convertMergedPdf(

            MultipartFile[] images,

            String pageSize,

            String quality

    ) throws Exception {

        Map<String, Object> response = new HashMap<>();

        PDDocument document = new PDDocument();

        int pageCount = 0;

        try {

            for (

            MultipartFile image : images

            ) {
                String originalName = image.getOriginalFilename();

                if (originalName == null
                        ||
                        originalName.isBlank()) {

                    originalName = "image.jpg";

                }

                int dotIndex = originalName.lastIndexOf(".");

                String extension = ".jpg";

                if (dotIndex != -1) {

                    extension = originalName.substring(
                            dotIndex);

                }

                File tempFile = File.createTempFile(
                        "img",
                        extension);

                try {

                    image.transferTo(
                            tempFile);

                    BufferedImage bufferedImage = ImageIO.read(
                            tempFile);

                    if (bufferedImage == null) {

                        throw new RuntimeException(
                                "Corrupted or unsupported image: "
                                        +
                                        image.getOriginalFilename());

                    }

                    double qualityScale = getQualityScale(
                            quality);

                    PDRectangle pageRectangle = getPageRectangle(

                            pageSize,

                            bufferedImage

                    );

                    PDPage page = new PDPage(
                            pageRectangle);

                    document.addPage(
                            page);

                    PDImageXObject pdImage = PDImageXObject.createFromFile(

                            tempFile.getAbsolutePath(),

                            document

                    );

                    PDPageContentStream stream = new PDPageContentStream(

                            document,

                            page

                    );

                    float pageWidth = page.getMediaBox().getWidth();

                    float pageHeight = page.getMediaBox().getHeight();

                    float imageWidth = bufferedImage.getWidth();

                    float imageHeight = bufferedImage.getHeight();

                    float widthScale = pageWidth
                            /
                            imageWidth;

                    float heightScale = pageHeight
                            /
                            imageHeight;

                    float scale = Math.min(

                            widthScale,

                            heightScale

                    );

                    float scaledWidth = imageWidth
                            *
                            scale
                            *
                            (float) qualityScale;

                    float scaledHeight = imageHeight
                            *
                            scale
                            *
                            (float) qualityScale;

                    float x = (pageWidth
                            -
                            scaledWidth)
                            /
                            2;

                    float y = (pageHeight
                            -
                            scaledHeight)
                            /
                            2;

                    stream.drawImage(

                            pdImage,

                            x,

                            y,

                            scaledWidth,

                            scaledHeight

                    );

                    stream.close();

                    pageCount++;

                } finally {

                    if (

                    tempFile.exists()

                    ) {

                        tempFile.delete();

                    }

                }

            }

            File mergedPdf = new File(

                    OUTPUT_FOLDER,

                    PDF_FILE_NAME

            );

            document.save(
                    mergedPdf);

            response.put(
                    "success",
                    true);

            response.put(
                    "pages",
                    pageCount);

            response.put(
                    "size",
                    String.format(

                            "%.2f MB",

                            mergedPdf.length()
                                    /
                                    1024.0
                                    /
                                    1024.0

                    ));

            response.put(
                    "fileName",
                    PDF_FILE_NAME);

            response.put(
                    "separateMode",
                    false);

        } finally {

            document.close();

        }

        return response;

    }
    /*
     * ===========================
     * SEPARATE PDF
     * ===========================
     */

    private Map<String, Object> convertSeparatePdf(

            MultipartFile[] images,

            String pageSize,

            String quality

    ) throws Exception {

        Map<String, Object> response = new HashMap<>();

        List<Map<String, String>> generatedFiles = new ArrayList<>();

        for (

        MultipartFile image : images

        ) {

            String originalName = image.getOriginalFilename();

            if (

            originalName == null
                    ||
                    originalName.isBlank()

            ) {

                originalName = "image.jpg";

            }

            int dotIndex = originalName.lastIndexOf(".");

            if (dotIndex == -1) {

                throw new RuntimeException(
                        "Invalid file name: "
                                + originalName);

            }

            String pdfName = originalName.substring(
                    0,
                    dotIndex)
                    +
                    ".pdf";

            String extension = originalName.substring(
                    dotIndex);
            File outputPdf = new File(

                    OUTPUT_FOLDER,

                    pdfName

            );

            File tempFile = File.createTempFile(
                    "img",
                    extension);

            try {

                image.transferTo(
                        tempFile);

                BufferedImage bufferedImage = ImageIO.read(
                        tempFile);

                if (

                bufferedImage == null

                ) {

                    throw new RuntimeException(

                            "Corrupted or unsupported image: "
                                    +
                                    originalName

                    );

                }

                PDDocument document = new PDDocument();

                try {

                    PDRectangle pageRectangle = getPageRectangle(

                            pageSize,

                            bufferedImage

                    );

                    PDPage page = new PDPage(
                            pageRectangle);

                    document.addPage(
                            page);

                    PDImageXObject pdImage = PDImageXObject.createFromFile(

                            tempFile.getAbsolutePath(),

                            document

                    );

                    PDPageContentStream stream = new PDPageContentStream(

                            document,

                            page

                    );

                    float pageWidth = page.getMediaBox().getWidth();

                    float pageHeight = page.getMediaBox().getHeight();

                    float imageWidth = bufferedImage.getWidth();

                    float imageHeight = bufferedImage.getHeight();

                    float widthScale = pageWidth
                            /
                            imageWidth;

                    float heightScale = pageHeight
                            /
                            imageHeight;

                    float scale = Math.min(

                            widthScale,

                            heightScale

                    );

                    double qualityScale = getQualityScale(
                            quality);

                    float scaledWidth = imageWidth
                            *
                            scale
                            *
                            (float) qualityScale;

                    float scaledHeight = imageHeight
                            *
                            scale
                            *
                            (float) qualityScale;

                    float x = (pageWidth
                            -
                            scaledWidth)
                            /
                            2;

                    float y = (pageHeight
                            -
                            scaledHeight)
                            /
                            2;

                    stream.drawImage(

                            pdImage,

                            x,

                            y,

                            scaledWidth,

                            scaledHeight

                    );

                    stream.close();

                    document.save(
                            outputPdf);

                } finally {

                    document.close();

                }

                Map<String, String> fileInfo = new HashMap<>();

                fileInfo.put(
                        "name",
                        pdfName);

                fileInfo.put(

                        "size",

                        String.format(

                                "%.2f MB",

                                outputPdf.length()
                                        /
                                        1024.0
                                        /
                                        1024.0

                        )

                );

                generatedFiles.add(
                        fileInfo);

            } finally {

                if (

                tempFile.exists()

                ) {

                    tempFile.delete();

                }

            }

        }

        response.put(
                "success",
                true);

        response.put(
                "separateMode",
                true);

        response.put(
                "files",
                generatedFiles);

        return response;

    }

    /*
     * ===========================
     * QUALITY SCALE
     * ===========================
     */

    private double getQualityScale(

            String quality

    ) {

        if (

        quality == null

        ) {

            return 1.0;

        }

        switch (

        quality.toLowerCase()

        ) {

            case "medium":

                return 0.8;

            case "low":

                return 0.6;

            default:

                return 1.0;

        }

    }

    /*
     * ===========================
     * PAGE SIZE
     * ===========================
     */

    private PDRectangle getPageRectangle(

            String pageSize,

            BufferedImage bufferedImage

    ) {

        if (

        pageSize == null

        ) {

            pageSize = "original";

        }

        switch (

        pageSize.toLowerCase()

        ) {

            case "a4":

                return PDRectangle.A4;

            case "letter":

                return PDRectangle.LETTER;

            default:

                return new PDRectangle(

                        bufferedImage.getWidth(),

                        bufferedImage.getHeight()

                );

        }

    }
    /*
     * ===========================
     * DELETE TEMP FILES
     * ===========================
     */

    public void deleteTempFiles() {

        File outputFolder = new File(
                OUTPUT_FOLDER);

        if (outputFolder.exists()
                &&
                outputFolder.isDirectory()) {

            File[] files = outputFolder.listFiles();

            if (files != null) {

                for (File file : files) {

                    if (file.isFile()) {

                        file.delete();

                    }

                }

            }

        }

    }

    /*
     * ===========================
     * DELETE MERGED PDF
     * ===========================
     */

    public void deleteMergedPdf() {

        File mergedPdf = new File(

                OUTPUT_FOLDER,

                PDF_FILE_NAME

        );

        if (mergedPdf.exists()) {

            mergedPdf.delete();

        }

    }

    /*
     * ===========================
     * GET MERGED PDF
     * ===========================
     */

    public File getMergedPdf() {

        return new File(

                OUTPUT_FOLDER,

                PDF_FILE_NAME

        );

    }

    /*
     * ===========================
     * GET SEPARATE PDF
     * ===========================
     */

    public File getSeparatePdf(

            String fileName

    ) {

        return new File(

                OUTPUT_FOLDER,

                fileName

        );

    }

}