package com.converter.controller;

import com.converter.service.PdfToWordService;

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
public class PdfToWordController {

        @Autowired
        private PdfToWordService pdfToWordService;

        /*
         * ===========================
         * PAGE
         * ===========================
         */

        @GetMapping("/pdf-to-word")
        public String pdfToWordPage() {

                return "pdf-to-word";

        }

        /*
         * ===========================
         * CONVERT PDF TO WORD
         * ===========================
         */
        @PostMapping("/pdf-to-word-ajax")
        @ResponseBody
        public Map<String, Object> convertPdfToWord(

                        @RequestParam("pdfFiles") MultipartFile[] pdfFiles

        ) {

                if (pdfFiles == null || pdfFiles.length == 0) {

                        return Map.of(

                                        "success", false,

                                        "message", "Please upload at least one PDF file."

                        );

                }

                for (MultipartFile file : pdfFiles) {

                        if (file.isEmpty()) {

                                return Map.of(

                                                "success", false,

                                                "message", "One or more uploaded files are empty."

                                );

                        }

                        if (!file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {

                                return Map.of(

                                                "success", false,

                                                "message", "Only PDF files are allowed."

                                );

                        }

                }

                return pdfToWordService.convertPdfToWord(
                                pdfFiles);

        }

        /*
         * ===========================
         * DOWNLOAD DOCX
         * ===========================
         */

        @GetMapping("/download-word-file")
        public ResponseEntity<Resource> downloadWordFile(

                        @RequestParam("fileName") String fileName

        ) {

                try {

                        File file = new File(
                                        "converted-word-files",
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
                                                                        + fileName +
                                                                        "\"")

                                        .contentLength(
                                                        file.length())

                                        .contentType(
                                                        MediaType.parseMediaType(
                                                                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"))

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
         * PDF PREVIEW
         * ===========================
         */

        @GetMapping("/preview-pdf-file")
        public ResponseEntity<Resource> previewPdf(

                        @RequestParam("fileName") String fileName

        ) {

                try {

                        File file = new File(
                                        "uploaded-pdfs",
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
                                                                        + fileName +
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

        @PostMapping("/delete-pdf-to-word-temp-files")
        @ResponseBody
        public void deleteTempFiles() {

                pdfToWordService.deleteTemporaryFiles();

        }

}
