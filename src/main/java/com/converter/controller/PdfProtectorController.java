package com.converter.controller;

import com.converter.service.PdfProtectorService;

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
public class PdfProtectorController {

        @Autowired
        private PdfProtectorService pdfProtectorService;

        /*
         * ===========================
         * PAGE
         * ===========================
         */

        @GetMapping("/pdf-protector")
        public String pdfProtectorPage() {

                return "pdf-protector";

        }

        /*
         * ===========================
         * PROTECT PDF
         * ===========================
         */

        @PostMapping("/protect-pdf-ajax")
        @ResponseBody
        public Map<String, Object> protectPdf(

                        @RequestParam("pdfFiles") MultipartFile[] pdfFiles,

                        @RequestParam("passwords") String[] passwords

        ) {

                if (pdfFiles == null || pdfFiles.length == 0) {

                        return Map.of(
                                        "success",
                                        false,
                                        "message",
                                        "Please upload PDF files.");

                }

                return pdfProtectorService.protectPdf(
                                pdfFiles,
                                passwords);

        }

        /*
         * ===========================
         * DOWNLOAD PROTECTED PDF
         * ===========================
         */

        @GetMapping("/download-protected-pdf")
        public ResponseEntity<Resource> downloadProtectedPdf(

                        @RequestParam("downloadName") String downloadName

        ) {

                try {

                        File file = new File(
                                        System.getProperty("user.dir")
                                                        +
                                                        File.separator
                                                        +
                                                        "protected-pdfs"
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
         * PREVIEW PROTECTED PDF
         * ===========================
         */

        @GetMapping("/preview-protected-pdf")
        public ResponseEntity<Resource> previewProtectedPdf(

                        @RequestParam(required = false) String fileName

        ) {

                try {

                        if (fileName == null
                                        ||
                                        fileName.isBlank()) {

                                return ResponseEntity
                                                .notFound()
                                                .build();

                        }

                        File file = new File(
                                        System.getProperty("user.dir")
                                                        +
                                                        File.separator
                                                        +
                                                        "protected-pdfs"
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

        @PostMapping("/delete-protected-pdf")
        @ResponseBody
        public void deleteProtectedPdf() {

                File folder = new File(
                                System.getProperty("user.dir")
                                                +
                                                File.separator
                                                +
                                                "protected-pdfs");

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
