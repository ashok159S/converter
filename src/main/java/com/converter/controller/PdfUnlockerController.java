package com.converter.controller;

import com.converter.service.PdfUnlockerService;

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
public class PdfUnlockerController {

    @Autowired
    private PdfUnlockerService pdfUnlockerService;

    /* ===========================
       PAGE
    =========================== */

    @GetMapping("/pdf-unlocker")
    public String pdfUnlockerPage(){

        return "pdf-unlocker";

    }

    /* ===========================
       UNLOCK PDF
    =========================== */

    @PostMapping("/unlock-pdf-ajax")
    @ResponseBody
    public Map<String,Object> unlockPdf(

            @RequestParam("pdfFiles")
            MultipartFile[] pdfFiles,

            @RequestParam("passwords")
            String[] passwords

    ){

        return pdfUnlockerService.unlockPdf(
                pdfFiles,
                passwords
        );

    }

    /* ===========================
       DOWNLOAD UNLOCKED PDF
    =========================== */

    @GetMapping("/download-unlocked-pdf")
    public ResponseEntity<Resource> downloadUnlockedPdf(

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
                            "unlocked-pdfs"
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
       PDF PREVIEW
    =========================== */

    @GetMapping("/preview-unlock-pdf")
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
                            "uploaded-pdfs"
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

