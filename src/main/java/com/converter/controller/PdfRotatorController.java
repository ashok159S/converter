package com.converter.controller;

import com.converter.service.PdfRotatorService;

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
public class PdfRotatorController {

    @Autowired
    private PdfRotatorService pdfRotatorService;

    /* ===========================
       PAGE
    =========================== */

    @GetMapping("/pdf-rotator")
    public String pdfRotatorPage(){

        return "pdf-rotator";

    }

    /* ===========================
       ROTATE PDF
    =========================== */

    @PostMapping("/pdf-rotator-ajax")
    @ResponseBody
    public Map<String,Object> rotatePdf(

            @RequestParam("pdfFiles")
            MultipartFile[] pdfFiles,

            @RequestParam("rotation")
            int rotation

    ){

        return pdfRotatorService.rotatePdf(

                pdfFiles,

                rotation

        );

    }

    /* ===========================
       DOWNLOAD ROTATED PDF
    =========================== */

    @GetMapping("/download-rotated-pdf")
    public ResponseEntity<Resource> downloadRotatedPdf(

            @RequestParam("fileName")
            String fileName

    ){

        try{

            File file =
                    new File(
                            "rotated-pdfs",
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
       PREVIEW ROTATED PDF
    =========================== */

    @GetMapping("/preview-rotated-pdf")
    public ResponseEntity<Resource> previewRotatedPdf(

            @RequestParam("fileName")
            String fileName

    ){

        try{

            File file =
                    new File(
                            "rotated-pdfs",
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