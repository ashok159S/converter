package com.converter.controller;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import com.converter.service.ImageToPdfService;
import java.io.File;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@Controller
public class ImageToPdfController {

        @Autowired
        private ImageToPdfService imageToPdfService;

        /*
         * ===========================
         * PAGE
         * ===========================
         */

        @GetMapping("/image-to-pdf")
        public String imageToPdfPage() {

                return "image-to-pdf";

        }

        /*
         * ===========================
         * CONVERT IMAGES
         * ===========================
         */

        @PostMapping("/image-to-pdf-ajax")
        @ResponseBody
        public Map<String, Object> convertImages(

                        @RequestParam("images") MultipartFile[] images,

                        @RequestParam("pageSize") String pageSize,

                        @RequestParam("quality") String quality,

                        @RequestParam("conversionMode") String conversionMode

        ) {

                return imageToPdfService.convertImages(

                                images,

                                pageSize,

                                quality,

                                conversionMode

                );

        }
        /*
         * ===========================
         * DOWNLOAD MERGED PDF
         * ===========================
         */

        @GetMapping("/download-pdf")
        public ResponseEntity<Resource> downloadMergedPdf() {

                try {

                        File file = imageToPdfService.getMergedPdf();

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
                                                                        file.getName()
                                                                        +
                                                                        "\"")

                                        .contentLength(
                                                        file.length())

                                        .contentType(
                                                        MediaType.APPLICATION_PDF)

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
         * DOWNLOAD SEPARATE PDF
         * ===========================
         */

        @GetMapping("/download-separate")
        public ResponseEntity<Resource> downloadSeparatePdf(

                        @RequestParam("fileName") String fileName

        ) {

                try {

                        File file = imageToPdfService.getSeparatePdf(
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
                                                                        file.getName()
                                                                        +
                                                                        "\"")

                                        .contentLength(
                                                        file.length())

                                        .contentType(
                                                        MediaType.APPLICATION_PDF)

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
         * PREVIEW MERGED PDF
         * ===========================
         */

        @GetMapping("/preview-pdf")
        public ResponseEntity<Resource> previewMergedPdf() {

                try {

                        File file = imageToPdfService.getMergedPdf();

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
                                                        "inline; filename=\""
                                                                        +
                                                                        file.getName()
                                                                        +
                                                                        "\"")

                                        .contentLength(
                                                        file.length())

                                        .contentType(
                                                        MediaType.APPLICATION_PDF)

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
         * PREVIEW SEPARATE PDF
         * ===========================
         */

        @GetMapping("/preview-separate")
        public ResponseEntity<Resource> previewSeparatePdf(

                        @RequestParam("fileName") String fileName

        ) {

                try {

                        File file = imageToPdfService.getSeparatePdf(
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
                                                        "inline; filename=\""
                                                                        +
                                                                        file.getName()
                                                                        +
                                                                        "\"")

                                        .contentLength(
                                                        file.length())

                                        .contentType(
                                                        MediaType.APPLICATION_PDF)

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

        @PostMapping("/delete-image-to-pdf-temp-files")
        @ResponseBody
        public void deleteTempFiles() {

                imageToPdfService.deleteTempFiles();

        }
}