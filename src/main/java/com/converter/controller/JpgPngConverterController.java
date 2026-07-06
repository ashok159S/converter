package com.converter.controller;

import com.converter.service.JpgPngConverterService;

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
import java.util.List;
import java.util.Map;

@Controller
public class JpgPngConverterController {

        @Autowired
        private JpgPngConverterService jpgPngConverterService;

        /*
         * ===========================
         * PAGE
         * ===========================
         */

        @GetMapping("/jpg-png-converter")
        public String jpgPngConverterPage() {

                return "jpg-png-converter";

        }

        /*
         * ===========================
         * CONVERT IMAGES
         * ===========================
         */

        @PostMapping("/jpg-png-converter-ajax")
        @ResponseBody
        public Map<String, Object> convertImages(

                        @RequestParam("imageFiles") MultipartFile[] imageFiles,

                        @RequestParam("targetFormats") List<String> targetFormats

        ) {
                if (imageFiles == null || imageFiles.length == 0) {

                        return Map.of(
                                        "success", false,
                                        "message", "Please upload at least one image.");

                }

                if (targetFormats == null ||
                                targetFormats.size() != imageFiles.length) {

                        return Map.of(
                                        "success", false,
                                        "message", "Invalid conversion request.");

                }

                try {

                        return jpgPngConverterService.convertImages(
                                        imageFiles,
                                        targetFormats);

                } catch (Exception e) {

                        e.printStackTrace();

                        return Map.of(
                                        "success", false,
                                        "message", "Image conversion failed.");

                }

        }

        /*
         * ===========================
         * DOWNLOAD IMAGE
         * ===========================
         */

        @GetMapping("/download-converted-image")
        public ResponseEntity<Resource> downloadConvertedImage(

                        @RequestParam("fileName") String fileName

        ) {

                try {

                        File file = new File(
                                        "converted-images",
                                        fileName);

                        if (!file.exists()) {

                                return ResponseEntity
                                                .notFound()
                                                .build();

                        }

                        Resource resource = new FileSystemResource(
                                        file);

                        return ResponseEntity.ok()

                                        .header(
                                                        HttpHeaders.CONTENT_DISPOSITION,
                                                        "attachment; filename=\""
                                                                        +
                                                                        fileName
                                                                        +
                                                                        "\"")

                                        .contentLength(
                                                        file.length())

                                        .contentType(
                                                        MediaType.APPLICATION_OCTET_STREAM)

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
         * PREVIEW IMAGE
         * ===========================
         */

        @GetMapping("/preview-converted-image")
        public ResponseEntity<Resource> previewConvertedImage(

                        @RequestParam("fileName") String fileName

        ) {

                try {

                        File file = new File(
                                        "converted-images",
                                        fileName);

                        if (!file.exists()) {

                                return ResponseEntity
                                                .notFound()
                                                .build();

                        }

                        Resource resource = new FileSystemResource(
                                        file);

                        String lowerName = fileName.toLowerCase();

                        MediaType mediaType = lowerName.endsWith(".png")
                                        ? MediaType.IMAGE_PNG
                                        : MediaType.IMAGE_JPEG;

                        return ResponseEntity.ok()

                                        .header(
                                                        HttpHeaders.CONTENT_DISPOSITION,
                                                        "inline; filename=\""
                                                                        +
                                                                        fileName
                                                                        +
                                                                        "\"")

                                        .contentLength(
                                                        file.length())

                                        .contentType(
                                                        mediaType)

                                        .body(
                                                        resource);

                } catch (Exception e) {

                        return ResponseEntity
                                        .notFound()
                                        .build();

                }

        }

        @PostMapping("/delete-converted-images")
        @ResponseBody
        public Map<String, Object> deleteConvertedImages() {

                jpgPngConverterService.deleteConvertedImages();

                return Map.of(
                                "success", true);

        }

}