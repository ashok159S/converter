package com.converter.controller;

import com.converter.service.ImageResizerService;

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
public class ImageResizerController {

    @Autowired
    private ImageResizerService imageResizerService;

    /* ===========================
       PAGE
    =========================== */

    @GetMapping("/image-resizer")
    public String imageResizerPage() {

        return "image-resizer";

    }

    /* ===========================
       RESIZE IMAGES
    =========================== */

    @PostMapping("/image-resizer-ajax")
    @ResponseBody
    public Map<String,Object> resizeImages(

            @RequestParam("imageFiles")
            MultipartFile[] imageFiles,

            @RequestParam("width")
            int width,

            @RequestParam("height")
            int height,

            @RequestParam("maintainAspectRatio")
            boolean maintainAspectRatio

    ) {

        return imageResizerService.resizeImages(

                imageFiles,

                width,

                height,

                maintainAspectRatio

        );

    }

    /* ===========================
       DOWNLOAD RESIZED IMAGE
    =========================== */

    @GetMapping("/download-resized-image")
    public ResponseEntity<Resource> downloadResizedImage(

            @RequestParam("fileName")
            String fileName

    ) {

        try {

            File file =
                    new File(
                            "resized-images",
                            fileName
                    );

            if(!file.exists()) {

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
                            MediaType.APPLICATION_OCTET_STREAM
                    )

                    .body(
                            resource
                    );

        }
        catch(Exception e) {

            return ResponseEntity
                    .notFound()
                    .build();

        }

    }

    /* ===========================
       PREVIEW RESIZED IMAGE
    =========================== */

    @GetMapping("/preview-resized-image")
    public ResponseEntity<Resource> previewResizedImage(

            @RequestParam("fileName")
            String fileName

    ) {

        try {

            File file =
                    new File(
                            "resized-images",
                            fileName
                    );

            if(!file.exists()) {

                return ResponseEntity
                        .notFound()
                        .build();

            }

            Resource resource =
                    new FileSystemResource(
                            file
                    );

            String lowerName =
                    fileName.toLowerCase();

            MediaType mediaType =
                    MediaType.IMAGE_JPEG;

            if(lowerName.endsWith(".png")) {

                mediaType =
                        MediaType.IMAGE_PNG;

            }
            else if(lowerName.endsWith(".gif")) {

                mediaType =
                        MediaType.IMAGE_GIF;

            }

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
                            mediaType
                    )

                    .body(
                            resource
                    );

        }
        catch(Exception e) {

            return ResponseEntity
                    .notFound()
                    .build();

        }

    }

}