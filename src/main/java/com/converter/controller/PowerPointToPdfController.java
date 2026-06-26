package com.converter.controller;

import com.converter.service.PowerPointToPdfService;

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
public class PowerPointToPdfController {

    @Autowired
    private PowerPointToPdfService powerPointToPdfService;

    /* ===========================
       PAGE
    =========================== */

    @GetMapping("/powerpoint-to-pdf")
    public String powerPointToPdfPage(){

        return "powerpoint-to-pdf";

    }

    /* ===========================
       CONVERT POWERPOINT TO PDF
    =========================== */

    @PostMapping("/powerpoint-to-pdf-ajax")
    @ResponseBody
    public Map<String,Object> convertPowerPointToPdf(

            @RequestParam("pptFiles")
            MultipartFile[] pptFiles,

            @RequestParam("conversionMode")
            String conversionMode,

            @RequestParam("pdfLayout")
            String pdfLayout,

            @RequestParam("orientation")
            String orientation,

            @RequestParam("quality")
            String quality

    ){

        return powerPointToPdfService.convertPowerPointToPdf(

                pptFiles,

                conversionMode,

                pdfLayout,

                orientation,

                quality

        );

    }

    /* ===========================
       DOWNLOAD PDF
    =========================== */

    @GetMapping("/download-converted-ppt-pdf")
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
       PDF PREVIEW
    =========================== */

    @GetMapping("/preview-converted-ppt-pdf")
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

