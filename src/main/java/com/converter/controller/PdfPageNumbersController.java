package com.converter.controller;

import com.converter.service.PdfPageNumbersService;

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
public class PdfPageNumbersController {

        @Autowired
        private PdfPageNumbersService pdfPageNumbersService;

        /*
         * ===========================
         * PAGE
         * ===========================
         */

        @GetMapping("/pdf-page-numbers")
        public String pdfPageNumbersPage() {

                return "pdf-page-numbers";

        }

        /*
         * ===========================
         * ADD PAGE NUMBERS
         * ===========================
         */

        @PostMapping("/page-numbers-pdf-ajax")
        @ResponseBody
        public Map<String, Object> addPageNumbers(

                        @RequestParam("pdfFiles") MultipartFile[] pdfFiles,

                        @RequestParam("startNumber") int startNumber,

                        @RequestParam("fontSize") int fontSize,

                        @RequestParam("position") String position,

                        @RequestParam("pageFormat") String pageFormat

        ) {

                if (pdfFiles == null || pdfFiles.length == 0) {

                        return Map.of(
                                        "success", false,
                                        "message", "Please upload PDF files.");

                }

                return pdfPageNumbersService.addPageNumbers(

                                pdfFiles,

                                startNumber,

                                fontSize,

                                position,

                                pageFormat

                );

        }

        /*
         * ===========================
         * DOWNLOAD NUMBERED PDF
         * ===========================
         */

        @GetMapping("/download-numbered-pdf")
        public ResponseEntity<Resource> downloadPdf(

                        @RequestParam("downloadName") String downloadName) {

                try {

                        File file = new File(
                                        System.getProperty("user.dir")
                                                        +
                                                        File.separator
                                                        +
                                                        "numbered-pdfs"
                                                        +
                                                        File.separator
                                                        +
                                                        downloadName);

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
                                                                        downloadName
                                                                        +
                                                                        "\"")

                                        .contentLength(
                                                        file.length())

                                        .contentType(
                                                        MediaType.APPLICATION_PDF)

                                        .body(
                                                        resource);

                } catch (Exception e) {

                        e.printStackTrace();

                        return ResponseEntity
                                        .notFound()
                                        .build();

                }

        }

        /*
         * ===========================
         * PREVIEW NUMBERED PDF
         * ===========================
         */

        @GetMapping("/preview-numbered-pdf")
        public ResponseEntity<Resource> previewPdf(

                        @RequestParam(required = false) String fileName

        ) {

                try {

                        if (fileName == null || fileName.isBlank()) {

                                return ResponseEntity
                                                .notFound()
                                                .build();

                        }

                        File file = new File(
                                        System.getProperty("user.dir")
                                                        +
                                                        File.separator
                                                        +
                                                        "numbered-pdfs"
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

                        e.printStackTrace();

                        return ResponseEntity
                                        .notFound()
                                        .build();

                }

        }

        @PostMapping("/delete-numbered-pdf")
        @ResponseBody
        public void deleteNumberedPdf() {

                File folder = new File(
                                System.getProperty("user.dir")
                                                +
                                                File.separator
                                                +
                                                "numbered-pdfs");

                if (!folder.exists()) {

                        return;

                }

                File[] files = folder.listFiles();

                if (files == null) {

                        return;

                }

                for (File file : files) {

                        if (file.isFile()) {

                                file.delete();

                        }

                }

        }

}
