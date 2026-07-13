package com.converter.controller;

import com.converter.service.PdfWatermarkService;

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
public class PdfWatermarkController {

        @Autowired
        private PdfWatermarkService pdfWatermarkService;

        /*
         * ===========================
         * PAGE
         * ===========================
         */

        @GetMapping("/pdf-watermark")
        public String pdfWatermarkPage() {

                return "pdf-watermark";

        }

        /*
         * ===========================
         * WATERMARK PDF
         * ===========================
         */

        @PostMapping("/watermark-pdf-ajax")
        @ResponseBody
        public Map<String, Object> watermarkPdf(

                        @RequestParam("pdfFiles") MultipartFile[] pdfFiles,

                        @RequestParam("watermarkType") String watermarkType,

                        @RequestParam("watermarkText") String watermarkText,

                        @RequestParam("textSize") int textSize,

                        @RequestParam("imageSize") int imageSize,

                        @RequestParam("opacity") int opacity,

                        @RequestParam("position") String position,

                        @RequestParam(value = "watermarkImage", required = false) MultipartFile watermarkImage

        ) {

                if (pdfFiles == null || pdfFiles.length == 0) {

                        return Map.of(

                                        "success",
                                        false,

                                        "message",
                                        "Please upload at least one PDF."

                        );

                }

                for (MultipartFile pdf : pdfFiles) {

                        if (pdf.isEmpty()) {

                                return Map.of(

                                                "success",
                                                false,

                                                "message",
                                                "One of the uploaded PDFs is empty."

                                );

                        }

                        String fileName = pdf.getOriginalFilename();

                        if (fileName == null ||
                                        !fileName.toLowerCase().endsWith(".pdf")) {

                                return Map.of(

                                                "success",
                                                false,

                                                "message",
                                                "Only PDF files are allowed."

                                );

                        }

                }

                return pdfWatermarkService.watermarkPdf(

                                pdfFiles,

                                watermarkType,

                                watermarkText,

                                textSize,

                                imageSize,

                                opacity,

                                position,

                                watermarkImage

                );

        }

        /*
         * ===========================
         * DOWNLOAD WATERMARKED PDF
         * ===========================
         */

        @GetMapping("/download-watermarked-pdf")
        public ResponseEntity<Resource> downloadWatermarkedPdf(

                        @RequestParam("fileName") String fileName

        ) {

                try {

                        File file = new File(
                                        System.getProperty("user.dir")
                                                        +
                                                        File.separator
                                                        +
                                                        "watermarked-pdfs"
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
         * PREVIEW WATERMARKED PDF
         * ===========================
         */

        @GetMapping("/preview-watermarked-pdf")
        public ResponseEntity<Resource> previewWatermarkedPdf(

                        @RequestParam("fileName") String fileName

        ) {

                try {

                        File file = new File(
                                        System.getProperty("user.dir")
                                                        +
                                                        File.separator
                                                        +
                                                        "watermarked-pdfs"
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

        @PostMapping("/delete-watermark-files")
        @ResponseBody
        public void deleteTempFiles() {

                pdfWatermarkService.deleteTempFiles();

        }

}
