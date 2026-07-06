package com.converter.controller;

import com.converter.service.PdfExtractTextService;

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
public class PdfExtractTextController {

        @Autowired
        private PdfExtractTextService pdfExtractTextService;

        /*
         * ===========================
         * PAGE
         * ===========================
         */

        @GetMapping("/pdf-extract-text")
        public String pdfExtractTextPage() {

                return "pdf-extract-text";

        }

        /*
         * ===========================
         * EXTRACT TEXT
         * ===========================
         */

        @PostMapping("/extract-text-ajax")
        @ResponseBody
        public Map<String, Object> extractText(

                        @RequestParam("pdfFiles") MultipartFile[] pdfFiles,

                        @RequestParam("extractType") String extractType,

                        @RequestParam(value = "pageRange", required = false) String pageRange,

                        @RequestParam("outputFormat") String outputFormat

        ) {

                if (

                pdfFiles == null
                                ||
                                pdfFiles.length == 0

                ) {

                        return Map.of(

                                        "success",
                                        false,

                                        "message",
                                        "Please upload at least one PDF."

                        );

                }

                if (

                extractType == null
                                ||
                                extractType.isBlank()

                ) {

                        return Map.of(

                                        "success",
                                        false,

                                        "message",
                                        "Please select extraction type."

                        );

                }

                if (

                outputFormat == null
                                ||
                                outputFormat.isBlank()

                ) {

                        return Map.of(

                                        "success",
                                        false,

                                        "message",
                                        "Please select output format."

                        );

                }

                if (

                "RANGE".equalsIgnoreCase(extractType)
                                &&
                                (pageRange == null
                                                ||
                                                pageRange.isBlank())

                ) {

                        return Map.of(

                                        "success",
                                        false,

                                        "message",
                                        "Please enter page range."

                        );

                }

                try {

                        return pdfExtractTextService.extractText(

                                        pdfFiles,

                                        extractType,

                                        pageRange,

                                        outputFormat

                        );

                }

                catch (Exception e) {

                        e.printStackTrace();

                        return Map.of(

                                        "success",
                                        false,

                                        "message",
                                        "Text extraction failed."

                        );

                }

        }

        /*
         * ===========================
         * DOWNLOAD TEXT FILE
         * ===========================
         */

        @GetMapping("/download-extracted-text")
        public ResponseEntity<Resource> downloadText(

                        @RequestParam("fileName") String fileName

        ) {
                if (

                fileName.contains("..")
                                ||
                                fileName.contains("/")
                                ||
                                fileName.contains("\\")

                ) {

                        return ResponseEntity
                                        .badRequest()
                                        .build();

                }

                try {

                        File file = new File(
                                        System.getProperty("user.dir")
                                                        +
                                                        File.separator
                                                        +
                                                        "extracted-text"
                                                        +
                                                        File.separator
                                                        +
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
                                                        MediaType.TEXT_PLAIN)

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
         * PREVIEW TEXT
         * ===========================
         */

        @GetMapping("/preview-extracted-text")
        @ResponseBody
        public String previewText(

                        @RequestParam("fileName") String fileName

        ) {

                if (

                fileName.contains("..")
                                ||
                                fileName.contains("/")
                                ||
                                fileName.contains("\\")

                ) {

                        return "Invalid file.";

                }

                try {

                        File file = new File(
                                        System.getProperty("user.dir")
                                                        +
                                                        File.separator
                                                        +
                                                        "extracted-text"
                                                        +
                                                        File.separator
                                                        +
                                                        fileName);

                        if (!file.exists()) {

                                return "File not found";

                        }

                        return java.nio.file.Files.readString(
                                        file.toPath());

                } catch (Exception e) {

                        return "Unable to preview extracted text.";

                }

        }

        @PostMapping("/delete-extracted-files")
        @ResponseBody
        public Map<String, Object> deleteExtractedFiles() {

                pdfExtractTextService.deleteExtractedFiles();

                return Map.of(
                                "success",
                                true);

        }
}
