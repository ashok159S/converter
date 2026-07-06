package com.converter.controller;

import com.converter.service.PdfCompressorService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.io.File;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Controller
public class PdfCompressorController {

        @Autowired
        private PdfCompressorService pdfCompressorService;

        /*
         * ===========================
         * PAGE
         * ===========================
         */

        @GetMapping("/pdf-compressor")
        public String pdfCompressorPage() {

                return "pdf-compressor";

        }

        /*
         * ===========================
         * COMPRESS PDFS
         * ===========================
         */

        @PostMapping("/pdf-compressor-ajax")
        @ResponseBody
        public Map<String, Object> compressPdf(

                        @RequestParam("pdfFiles") MultipartFile[] pdfFiles,

                        @RequestParam("compressionLevel") String compressionLevel

        ) {

                if (pdfFiles == null
                                ||
                                pdfFiles.length == 0) {

                        return Map.of(
                                        "success",
                                        false,
                                        "message",
                                        "Please upload at least one PDF.");

                }

                if (compressionLevel == null
                                ||
                                compressionLevel.isBlank()) {

                        return Map.of(
                                        "success",
                                        false,
                                        "message",
                                        "Please select a compression level.");

                }

                try {

                        return pdfCompressorService.compressPdf(
                                        pdfFiles,
                                        compressionLevel);

                } catch (Exception e) {

                        e.printStackTrace();

                        return Map.of(
                                        "success",
                                        false,
                                        "message",
                                        "PDF compression failed.");

                }

        }

        @GetMapping("/download-compressed-pdf")
        public ResponseEntity<Resource> downloadCompressedPdf(

                        @RequestParam("fileName") String fileName

        ) {

                try {

                        File file = new File(
                                        "compressed-pdfs",
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

        @GetMapping("/preview-compressed-pdf")
        public ResponseEntity<Resource> previewCompressedPdf(

                        @RequestParam("fileName") String fileName

        ) {

                try {

                        File file = new File(
                                        "compressed-pdfs",
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

        @PostMapping("/delete-compressed-pdfs")
        @ResponseBody
        public Map<String, Object> deleteCompressedPdfs() {

                pdfCompressorService.deleteCompressedPdfs();

                return Map.of(
                                "success",
                                true);

        }

}