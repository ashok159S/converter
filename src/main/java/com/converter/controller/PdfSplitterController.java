package com.converter.controller;

import com.converter.service.PdfSplitterService;

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
public class PdfSplitterController {

        @Autowired
        private PdfSplitterService pdfSplitterService;

        @GetMapping("/pdf-splitter")
        public String pdfSplitterPage() {

                return "pdf-splitter";

        }

        @PostMapping("/pdf-splitter-ajax")
        @ResponseBody
        public Map<String, Object> splitPdf(

                        @RequestParam("pdfFile") MultipartFile pdfFile

        ) {

                if (

                pdfFile == null

                ) {

                        return Map.of(

                                        "success", false,

                                        "message",
                                        "Please select a PDF file."

                        );

                }

                if (

                pdfFile.isEmpty()

                ) {

                        return Map.of(

                                        "success", false,

                                        "message",
                                        "The selected PDF file is empty."

                        );

                }

                String name = pdfFile.getOriginalFilename();

                if (

                name == null
                                ||

                                !name.toLowerCase().endsWith(".pdf")

                ) {

                        return Map.of(

                                        "success", false,

                                        "message",
                                        "Only PDF files are allowed."

                        );

                }

                return pdfSplitterService.splitPdf(
                                pdfFile);

        }

        @GetMapping("/download-split-pdf")
        public ResponseEntity<Resource> downloadSplitPdf(

                        @RequestParam String fileName,

                        @RequestParam(required = false) String downloadName

        ) {

                try {

                        File file = new File(
                                        "split-pdfs",
                                        fileName);

                        if (!file.exists()) {

                                return ResponseEntity.notFound()
                                                .build();

                        }

                        Resource resource = new FileSystemResource(
                                        file);

                        String finalName = (downloadName != null &&
                                        !downloadName.isEmpty())
                                                        ? downloadName
                                                        : file.getName();

                        return ResponseEntity.ok()

                                        .header(
                                                        HttpHeaders.CONTENT_DISPOSITION,
                                                        "attachment; filename=\"" +
                                                                        finalName +
                                                                        "\"")

                                        .contentLength(
                                                        file.length())

                                        .contentType(
                                                        MediaType.APPLICATION_PDF)

                                        .body(
                                                        resource);

                } catch (Exception e) {

                        return ResponseEntity.notFound()
                                        .build();

                }

        }

        @GetMapping("/preview-split-pdf")
        public ResponseEntity<Resource> previewSplitPdf(

                        @RequestParam String fileName

        ) {

                try {

                        File file = new File(
                                        "split-pdfs",
                                        fileName);

                        if (!file.exists()) {

                                return ResponseEntity.notFound()
                                                .build();

                        }

                        Resource resource = new FileSystemResource(
                                        file);

                        return ResponseEntity.ok()
                                        .header(
                                                        HttpHeaders.CONTENT_DISPOSITION,
                                                        "inline; filename=\"" +
                                                                        file.getName() +
                                                                        "\"")
                                        .contentType(
                                                        MediaType.APPLICATION_PDF)
                                        .body(
                                                        resource);

                } catch (Exception e) {

                        return ResponseEntity.notFound()
                                        .build();

                }

        }

        /*
         * ===========================
         * DELETE TEMP FILES
         * ===========================
         */

        @PostMapping("/delete-split-pdf-files")
        @ResponseBody
        public ResponseEntity<Void> deleteSplitPdfFiles() {

                pdfSplitterService.deleteTemporaryFiles();

                return ResponseEntity
                                .ok()
                                .build();

        }

}