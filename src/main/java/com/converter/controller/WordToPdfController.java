package com.converter.controller;

import com.converter.service.WordToPdfService;

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
public class WordToPdfController {

    @Autowired
    private WordToPdfService wordToPdfService;

    /* ===========================
       PAGE
    =========================== */

    @GetMapping("/word-to-pdf")
    public String wordToPdfPage(){

        return "word-to-pdf";

    }

    /* ===========================
       CONVERT WORD TO PDF
    =========================== */

    @PostMapping("/word-to-pdf-ajax")
    @ResponseBody
    public Map<String,Object> convertWordToPdf(

            @RequestParam("wordFiles")
            MultipartFile[] wordFiles

    ){

        return wordToPdfService.convertWordToPdf(
                wordFiles
        );

    }

    /* ===========================
       DOWNLOAD PDF
    =========================== */

    @GetMapping("/download-word-pdf")
    public ResponseEntity<Resource> downloadPdf(

            @RequestParam("fileName")
            String fileName

    ){

        try{

            File file =
                    new File(
                            "converted-pdfs",
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
                            + fileName +
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

    @GetMapping("/preview-word-pdf")
    public ResponseEntity<Resource> previewPdf(

            @RequestParam("fileName")
            String fileName

    ){

        try{

            File file =
                    new File(
                            "converted-pdfs",
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
                            + fileName +
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