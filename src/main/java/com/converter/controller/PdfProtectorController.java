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

    /* ===========================
       PAGE
    =========================== */

    @GetMapping("/pdf-protector")
    public String pdfProtectorPage(){

        return "pdf-protector";

    }

    /* ===========================
       PROTECT PDF
    =========================== */

    @PostMapping("/protect-pdf-ajax")
    @ResponseBody
    public Map<String,Object> protectPdf(

            @RequestParam("pdfFiles")
            MultipartFile[] pdfFiles,

            @RequestParam("passwords")
            String[] passwords

    ){

        return pdfProtectorService.protectPdf(
                pdfFiles,
                passwords
        );

    }

    /* ===========================
       DOWNLOAD PROTECTED PDF
    =========================== */

    @GetMapping("/download-protected-pdf")
    public ResponseEntity<Resource> downloadProtectedPdf(

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
                            "protected-pdfs"
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

}

