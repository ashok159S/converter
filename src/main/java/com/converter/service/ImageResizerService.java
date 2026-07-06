package com.converter.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;

import java.io.File;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ImageResizerService {

        public Map<String, Object> resizeImages(

                        MultipartFile[] imageFiles,

                        int width,

                        int height,

                        boolean maintainAspectRatio

        ) {

                if (width <= 0
                                ||
                                height <= 0) {

                        Map<String, Object> result = new HashMap<>();

                        result.put(
                                        "success",
                                        false);

                        result.put(
                                        "message",
                                        "Width and Height must be greater than 0.");

                        return result;

                }

                Map<String, Object> result = new HashMap<>();

                try {

                        List<Map<String, String>> files = new ArrayList<>();

                        File outputFolder = new File(
                                        "resized-images");

                        if (!outputFolder.exists()) {

                                outputFolder.mkdirs();

                        }

                        for (MultipartFile imageFile : imageFiles) {

                                if (imageFile.isEmpty()) {

                                        throw new RuntimeException(
                                                        "Empty file detected.");

                                }

                                String originalName = imageFile.getOriginalFilename();

                                if (originalName == null
                                                ||
                                                originalName.isBlank()) {

                                        originalName = "image.jpg";

                                }

                                String extension = originalName.substring(
                                                originalName.lastIndexOf(".") + 1);

                                String baseName = originalName.substring(
                                                0,
                                                originalName.lastIndexOf("."));

                                File tempInput = null;

                                try {

                                        tempInput = File.createTempFile(
                                                        UUID.randomUUID().toString(),
                                                        "." + extension);

                                        imageFile.transferTo(
                                                        tempInput);

                                        BufferedImage originalImage = ImageIO.read(
                                                        tempInput);

                                        if (originalImage == null) {

                                                throw new RuntimeException(
                                                                "Corrupted or unsupported image: "
                                                                                + originalName);

                                        }

                                        int targetWidth = width;

                                        int targetHeight = height;

                                        if (maintainAspectRatio) {

                                                double ratio = (double) originalImage.getWidth()
                                                                /
                                                                originalImage.getHeight();

                                                targetHeight = (int) (targetWidth
                                                                /
                                                                ratio);

                                        }

                                        BufferedImage resizedImage = new BufferedImage(
                                                        targetWidth,
                                                        targetHeight,
                                                        BufferedImage.TYPE_INT_RGB);

                                        Graphics2D graphics = resizedImage.createGraphics();

                                        graphics.setRenderingHint(
                                                        RenderingHints.KEY_INTERPOLATION,
                                                        RenderingHints.VALUE_INTERPOLATION_BILINEAR);

                                        graphics.setRenderingHint(
                                                        RenderingHints.KEY_RENDERING,
                                                        RenderingHints.VALUE_RENDER_QUALITY);

                                        graphics.setRenderingHint(
                                                        RenderingHints.KEY_ANTIALIASING,
                                                        RenderingHints.VALUE_ANTIALIAS_ON);

                                        graphics.drawImage(
                                                        originalImage,
                                                        0,
                                                        0,
                                                        targetWidth,
                                                        targetHeight,
                                                        null);

                                        graphics.dispose();

                                        File outputFile = new File(
                                                        outputFolder,
                                                        baseName
                                                                        +
                                                                        "-resized."
                                                                        +
                                                                        extension);

                                        String writeFormat = extension;

                                        if (extension.equalsIgnoreCase("jpg")
                                                        ||
                                                        extension.equalsIgnoreCase("jpeg")) {

                                                writeFormat = "jpg";

                                        }

                                        ImageIO.write(
                                                        resizedImage,
                                                        writeFormat,
                                                        outputFile);

                                        double originalSize = imageFile.getSize()
                                                        /
                                                        1024.0
                                                        /
                                                        1024.0;

                                        double resizedSize = outputFile.length()
                                                        /
                                                        1024.0
                                                        /
                                                        1024.0;

                                        Map<String, String> fileInfo = new HashMap<>();

                                        fileInfo.put(
                                                        "name",
                                                        outputFile.getName());

                                        fileInfo.put(
                                                        "originalSize",
                                                        String.format(
                                                                        "%.2f",
                                                                        originalSize));

                                        fileInfo.put(
                                                        "resizedSize",
                                                        String.format(
                                                                        "%.2f",
                                                                        resizedSize));

                                        fileInfo.put(
                                                        "dimensions",
                                                        targetWidth
                                                                        +
                                                                        " × "
                                                                        +
                                                                        targetHeight);

                                        files.add(
                                                        fileInfo);

                                } finally {

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

                        result.put(
                                        "message",
                                        e.getMessage());

                }

                return result;

        }

        /*
         * ===========================
         * DELETE TEMP FILES
         * ===========================
         */

        public void deleteTempFiles() {

                File outputFolder = new File(
                                "resized-images");

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

}