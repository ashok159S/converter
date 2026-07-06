package com.converter.controller;

import com.converter.service.PdfMergerService;

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
public class PdfMergerController {

        @Autowired
        private PdfMergerService pdfMergerService;

        @GetMapping("/pdf-merger")
        public String pdfMergerPage() {

                return "pdf-merger";

        }

        @PostMapping("/pdf-merger-ajax")
        @ResponseBody
        public Map<String, Object> mergePdfs(

                        @RequestParam("pdfFiles") MultipartFile[] pdfFiles

        ) {
                if (pdfFiles == null || pdfFiles.length == 0) {

                        return Map.of(
                                        "success", false,
                                        "message", "Please upload PDF files.");

                }

                return pdfMergerService.mergePdfFiles(
                                pdfFiles);

        }

        @GetMapping("/download-merged-pdf")
        public ResponseEntity<Resource> downloadMergedPdf(

                        @RequestParam(required = false) String downloadName

        ) {

                try {

                        File file = new File(
                                        "merged.pdf");
                        if (!file.exists()) {

                                return ResponseEntity.notFound()
                                                .build();

                        }

                        Resource resource = new FileSystemResource(
                                        file);

                        if (!resource.exists()) {

                                return ResponseEntity.notFound()
                                                .build();

                        }

                        String finalName = (downloadName != null &&
                                        !downloadName.isEmpty())
                                                        ? downloadName
                                                        : "merged.pdf";

                        return ResponseEntity.ok()
                                        .header(
                                                        HttpHeaders.CONTENT_DISPOSITION,
                                                        "attachment; filename=\"" +
                                                                        finalName +
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

        @GetMapping("/preview-merged-pdf")
        public ResponseEntity<Resource> previewMergedPdf() {

                try {

                        File file = new File("merged.pdf");

                        if (!file.exists()) {

                                return ResponseEntity.notFound().build();

                        }

                        Resource resource = new FileSystemResource(file);

                        return ResponseEntity.ok()
                                        .header(
                                                        HttpHeaders.CONTENT_DISPOSITION,
                                                        "inline; filename=\"merged.pdf\"")
                                        .contentType(
                                                        MediaType.APPLICATION_PDF)
                                        .body(resource);

                } catch (Exception e) {

                        e.printStackTrace();

                        return ResponseEntity.notFound().build();

                }

        }

        @PostMapping("/delete-merged-pdf")
        @ResponseBody
        public void deleteMergedPdf() {

                File file = new File("merged.pdf");

                if (file.exists()) {

                        boolean deleted = file.delete();

                        if (!deleted) {

                                System.err.println(
                                                "Unable to delete merged.pdf");

                        }

                }

        }
}