package com.converter.controller;

import com.converter.service.ImageCompressorService;

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
public class ImageCompressorController {

    @Autowired
    private ImageCompressorService imageCompressorService;

    /* ===========================
       PAGE
    =========================== */

    @GetMapping(
            "/image-compressor"
    )
    public String imageCompressorPage(){

        return "image-compressor";

    }

    /* ===========================
       COMPRESS IMAGES
    =========================== */

    @PostMapping(
            "/image-compressor-ajax"
    )
    @ResponseBody
    public Map<String,Object> compressImages(

            @RequestParam(
                    "imageFiles"
            )
            MultipartFile[] imageFiles,

            @RequestParam(
                    "compressionLevel"
            )
            String compressionLevel,

            @RequestParam(
                    "quality"
            )
            int quality

    ){

        return imageCompressorService
                .compressImages(
                        imageFiles,
                        compressionLevel,
                        quality
                );

    }

    /* ===========================
       DOWNLOAD
    =========================== */

    @GetMapping(
            "/download-compressed-image"
    )
    public ResponseEntity<Resource> downloadCompressedImage(

            @RequestParam(
                    "fileName"
            )
            String fileName

    ){

        try{

            File file =
                    new File(
                            "compressed-images",
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

                    .contentType(
                            MediaType.APPLICATION_OCTET_STREAM
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
       PREVIEW
    =========================== */

    @GetMapping(
            "/preview-compressed-image"
    )
    public ResponseEntity<Resource> previewCompressedImage(

            @RequestParam(
                    "fileName"
            )
            String fileName

    ){

        try{

            File file =
                    new File(
                            "compressed-images",
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

                    .contentType(
                            MediaType.IMAGE_JPEG
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

