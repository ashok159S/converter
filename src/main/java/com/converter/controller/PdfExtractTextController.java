package com.converter.controller;

import com.converter.service.PdfExtractTextService;

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
public class PdfExtractTextController {

    @Autowired
    private PdfExtractTextService pdfExtractTextService;

    /* ===========================
       PAGE
    =========================== */

    @GetMapping("/pdf-extract-text")
    public String pdfExtractTextPage(){

        return "pdf-extract-text";

    }

    /* ===========================
       EXTRACT TEXT
    =========================== */

    @PostMapping("/extract-text-ajax")
    @ResponseBody
    public Map<String,Object> extractText(

            @RequestParam("pdfFiles")
            MultipartFile[] pdfFiles,

            @RequestParam("extractType")
            String extractType,

            @RequestParam(
                    value = "pageRange",
                    required = false
            )
            String pageRange,

            @RequestParam("outputFormat")
            String outputFormat

    ){

        return pdfExtractTextService.extractText(

                pdfFiles,

                extractType,

                pageRange,

                outputFormat

        );

    }

    /* ===========================
       DOWNLOAD TEXT FILE
    =========================== */

    @GetMapping("/download-extracted-text")
    public ResponseEntity<Resource> downloadText(

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
                            "extracted-text"
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
                            MediaType.TEXT_PLAIN
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
       PREVIEW TEXT
    =========================== */

    @GetMapping("/preview-extracted-text")
    @ResponseBody
    public String previewText(

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
                            "extracted-text"
                            +
                            File.separator
                            +
                            fileName
                    );

            if(!file.exists()){

                return "File not found";

            }

            return java.nio.file.Files.readString(
                    file.toPath()
            );

        }
        catch(Exception e){

            return "Unable to load preview";

        }

    }

}

