package com.converter.controller;

import com.converter.service.PdfPageRemoverService;

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
public class PdfPageRemoverController {

    @Autowired
    private PdfPageRemoverService pdfPageRemoverService;

    /* ===========================
       PAGE
    =========================== */

    @GetMapping("/pdf-page-remover")
    public String pdfPageRemoverPage(){

        return "pdf-page-remover";

    }

    /* ===========================
       REMOVE PAGES
    =========================== */

    @PostMapping("/pdf-page-remover-ajax")
    @ResponseBody
    public Map<String,Object> removePages(

            @RequestParam("pdfFiles")
            MultipartFile[] pdfFiles,

            @RequestParam("pagesToRemove")
            String pagesToRemove

    ){

        return pdfPageRemoverService.removePages(

                pdfFiles,

                pagesToRemove

        );

    }

    /* ===========================
       DOWNLOAD PROCESSED PDF
    =========================== */

    @GetMapping("/download-processed-pdf")
    public ResponseEntity<Resource> downloadProcessedPdf(

            @RequestParam("fileName")
            String fileName

    ){

        try{

            File file =
                    new File(
                            "processed-pdfs",
                            fileName
                    );

            if(!file.exists()){

                return ResponseEntity
                        .notFound()
                        .build();

            }

            Resource resource =
                    new FileSystemResource(
                            file
                    );

            return ResponseEntity.ok()

                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\""
                            +
                            fileName
                            +
                            "\""
                    )

                    .contentLength(
                            file.length()
                    )

                    .contentType(
                            MediaType.APPLICATION_PDF
                    )

                    .body(
                            resource
                    );

        }
        catch(Exception e){

            return ResponseEntity
                    .notFound()
                    .build();

        }

    }

    /* ===========================
       PREVIEW PROCESSED PDF
    =========================== */

    @GetMapping("/preview-processed-pdf")
    public ResponseEntity<Resource> previewProcessedPdf(

            @RequestParam("fileName")
            String fileName

    ){

        try{

            File file =
                    new File(
                            "processed-pdfs",
                            fileName
                    );

            if(!file.exists()){

                return ResponseEntity
                        .notFound()
                        .build();

            }

            Resource resource =
                    new FileSystemResource(
                            file
                    );

            return ResponseEntity.ok()

                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\""
                            +
                            fileName
                            +
                            "\""
                    )

                    .contentLength(
                            file.length()
                    )

                    .contentType(
                            MediaType.APPLICATION_PDF
                    )

                    .body(
                            resource
                    );

        }
        catch(Exception e){

            return ResponseEntity
                    .notFound()
                    .build();

        }

    }

}

