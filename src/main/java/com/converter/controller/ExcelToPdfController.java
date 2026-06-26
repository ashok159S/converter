package com.converter.controller;

import com.converter.service.ExcelToPdfService;

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
public class ExcelToPdfController {

    @Autowired
    private ExcelToPdfService excelToPdfService;

    /* ===========================
       PAGE
    =========================== */

    @GetMapping("/excel-to-pdf")
    public String excelToPdfPage(){

        return "excel-to-pdf";

    }

    /* ===========================
       CONVERT EXCEL TO PDF
    =========================== */

    @PostMapping("/excel-to-pdf-ajax")
    @ResponseBody
    public Map<String,Object> convertExcelToPdf(

            @RequestParam("excelFiles")
            MultipartFile[] excelFiles,

            @RequestParam("orientation")
            String orientation,

            @RequestParam("paperSize")
            String paperSize,

            @RequestParam("scaling")
            String scaling,

            @RequestParam("quality")
            String quality

    ){

        return excelToPdfService.convertExcelToPdf(

                excelFiles,

                orientation,

                paperSize,

                scaling,

                quality

        );

    }

    /* ===========================
       DOWNLOAD PDF
    =========================== */

    @GetMapping("/download-converted-pdf")
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
                            "converted-pdfs"
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

    @GetMapping("/preview-converted-pdf")
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
                            "converted-pdfs"
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

