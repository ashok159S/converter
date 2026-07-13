package com.converter.controller;

import com.converter.service.ImageCompressorService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Map;

@Controller
public class ImageCompressorController {

        @Autowired
        private ImageCompressorService imageCompressorService;

        /*
         * ===========================
         * PAGE
         * ===========================
         */

        @GetMapping("/image-compressor")
        public String imageCompressorPage() {

                return "image-compressor";

        }

        /*
         * ===========================
         * COMPRESS IMAGES
         * ===========================
         */

        @PostMapping("/image-compressor-ajax")
        @ResponseBody
        public Map<String, Object> compressImages(

                        @RequestParam("imageFiles") MultipartFile[] imageFiles,

                        @RequestParam("compressionLevel") String compressionLevel,

                        @RequestParam("quality") int quality

        ) {

                if (imageFiles == null
                                ||
                                imageFiles.length == 0) {
                        throw new RuntimeException(
                                        "Please upload at least one image.");
                }

                for (MultipartFile file : imageFiles) {
                        if (file.isEmpty()) {
                                throw new RuntimeException(
                                                "Empty file uploaded.");
                        }

                        String contentType = file.getContentType();

                        if (contentType == null
                                        ||
                                        !contentType.startsWith(
                                                        "image/")) {
                                throw new RuntimeException(
                                                "Invalid image file: "
                                                                +
                                                                file.getOriginalFilename());
                        }
                }

                if (quality < 10
                                ||
                                quality > 100) {
                        throw new RuntimeException(
                                        "Quality must be between 10 and 100.");
                }

                if (!compressionLevel.equals("LOW")
                                &&
                                !compressionLevel.equals("MEDIUM")
                                &&
                                !compressionLevel.equals("HIGH")) {
                        throw new RuntimeException(
                                        "Invalid compression level.");
                }

                return imageCompressorService
                                .compressImages(
                                                imageFiles,
                                                compressionLevel,
                                                quality);

        }

        /*
         * ===========================
         * DOWNLOAD
         * ===========================
         */

        @GetMapping("/download-compressed-image")
        public ResponseEntity<Resource> downloadCompressedImage(

                        @RequestParam("fileName") String fileName

        ) {

                try {

                        if (fileName.contains("..")) {
                                return ResponseEntity
                                                .badRequest()
                                                .build();
                        }

                        File file = new File(
                                        System.getProperty("user.dir")
                                                        + File.separator
                                                        + "compressed-images"
                                                        + File.separator
                                                        + fileName);

                        System.out.println("Looking for: " + file.getAbsolutePath());
                        System.out.println("Exists: " + file.exists());

                        if (!file.exists()) {

                                return ResponseEntity
                                                .notFound()
                                                .build();

                        }

                        Resource resource = new FileSystemResource(
                                        file);

                        String contentType = java.nio.file.Files
                                        .probeContentType(
                                                        file.toPath());

                        if (contentType == null) {
                                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
                        }

                        return ResponseEntity.ok()

                                        .header(
                                                        HttpHeaders.CONTENT_DISPOSITION,
                                                        "attachment; filename=\""
                                                                        +
                                                                        fileName
                                                                        +
                                                                        "\"")

                                        .contentType(
                                                        MediaType.parseMediaType(
                                                                        contentType))

                                        .body(
                                                        resource);

                } catch (Exception e) {

                        return ResponseEntity
                                        .notFound()
                                        .build();

                }

        }

        /*
         * ===========================
         * PREVIEW
         * ===========================
         */

        @GetMapping("/preview-compressed-image")
        public ResponseEntity<Resource> previewCompressedImage(

                        @RequestParam("fileName") String fileName

        ) {

                try {

                        if (fileName.contains("..")) {
                                return ResponseEntity
                                                .badRequest()
                                                .build();
                        }

                        File file = new File(
                                        System.getProperty("user.dir")
                                                        + File.separator
                                                        + "compressed-images"
                                                        + File.separator
                                                        + fileName);

                        System.out.println("Looking for: " + file.getAbsolutePath());
                        System.out.println("Exists: " + file.exists());

                        if (!file.exists()) {

                                return ResponseEntity
                                                .notFound()
                                                .build();

                        }

                        Resource resource = new FileSystemResource(
                                        file);

                        String contentType = java.nio.file.Files
                                        .probeContentType(
                                                        file.toPath());

                        if (contentType == null) {
                                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
                        }

                        return ResponseEntity.ok()

                                        .header(
                                                        HttpHeaders.CONTENT_DISPOSITION,
                                                        "inline; filename=\""
                                                                        +
                                                                        fileName
                                                                        +
                                                                        "\"")

                                        .contentType(
                                                        MediaType.parseMediaType(
                                                                        contentType))

                                        .body(
                                                        resource);

                } catch (Exception e) {

                        return ResponseEntity
                                        .notFound()
                                        .build();

                }

        }

        /*
         * ===========================
         * DELETE TEMP FILES
         * ===========================
         */

        @PostMapping("/delete-image-temp-files")
        @ResponseBody
        public void deleteTempFiles() {

                imageCompressorService
                                .deleteTempFiles();

        }
}
