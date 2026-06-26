package com.converter.controller;

import com.converter.service.PdfCropService;

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
public class PdfCropController {

    @Autowired
    private PdfCropService pdfCropService;

    /* ===========================
       PAGE
    =========================== */

    @GetMapping("/pdf-crop")
    public String pdfCropPage(){

        return "pdf-crop";

    }

    /* ===========================
       CROP PDF
    =========================== */

    @PostMapping("/crop-pdf-ajax")
    @ResponseBody
    public Map<String,Object> cropPdf(

            @RequestParam("pdfFiles")
            MultipartFile[] pdfFiles,

            @RequestParam("cropAmount")
            String cropAmount,

            @RequestParam("applyTo")
            String applyTo

    ){

        return pdfCropService.cropPdf(

                pdfFiles,

                cropAmount,

                applyTo

        );

    }

    /* ===========================
       DOWNLOAD PDF
    =========================== */

    @GetMapping("/download-cropped-pdf")
    public ResponseEntity<Resource> downloadPdf(

            @RequestParam("fileName")
            String fileName

    ){

        try{

            File file =
                    new File(

                            System.getProperty("user.dir")
                            +
                            File.separator
                            +
                            "cropped-pdfs"
                            +
                            File.separator
                            +
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
                            file.getName()
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
       PREVIEW PDF
    =========================== */

    @GetMapping("/preview-cropped-pdf")
    public ResponseEntity<Resource> previewPdf(

            @RequestParam("fileName")
            String fileName

    ){

        try{

            File file =
                    new File(

                            System.getProperty("user.dir")
                            +
                            File.separator
                            +
                            "cropped-pdfs"
                            +
                            File.separator
                            +
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
                            file.getName()
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

