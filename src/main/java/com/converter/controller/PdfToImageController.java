package com.converter.controller;
import com.converter.service.PdfToImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.io.File;

@Controller
public class PdfToImageController {

    @Autowired
    private  PdfToImageService pdfToImageService;

    @GetMapping("/pdf-to-image")
    public String pdfToJpgPage() {

        return "pdf-to-image";

    }

    @PostMapping("/pdf-to-image-ajax")
    @ResponseBody
    public Map<String, Object> convertPdfToJpg(

            @RequestParam("pdfFile")
            MultipartFile pdfFile,

            @RequestParam("quality")
            String quality,

            @RequestParam("outputFormat")
            String outputFormat

    ) {

        return pdfToImageService.convertPdfToImages(
                pdfFile,
                quality,
                outputFormat
        );

    }

    @GetMapping("/download-image")
    public ResponseEntity<Resource> downloadImage(

            @RequestParam String fileName,

            @RequestParam(required = false)
            String downloadName

    ) {

        try {

            File file =
                    new File(
                            "converted-images",
                            fileName
                    );

            Resource resource =
                    new FileSystemResource(file);

            String finalName =
                    (downloadName != null &&
                    !downloadName.isEmpty())
                    ? downloadName
                    : file.getName();

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" +
                            finalName +
                            "\""
                    )
                    .contentType(
                            MediaType.APPLICATION_OCTET_STREAM
                    )
                    .body(resource);

        } catch (Exception e) {

            return ResponseEntity.notFound()
                    .build();

        }

    }

    @GetMapping("/preview-image")
    public ResponseEntity<Resource> previewImage(
            @RequestParam String fileName
    ) {

        try {

            File file =
                    new File(
                            "converted-images",
                            fileName
                    );

            if(!file.exists()){

                return ResponseEntity.notFound()
                        .build();

            }

            Resource resource =
                    new FileSystemResource(
                            file
                    );

            MediaType mediaType =
                    fileName.toLowerCase().endsWith(".png")
                            ? MediaType.IMAGE_PNG
                            : MediaType.IMAGE_JPEG;

            return ResponseEntity.ok()
                    .contentType(
                            mediaType
                    )
                    .body(
                            resource
                    );

        } catch (Exception e) {

            return ResponseEntity.notFound()
                    .build();

        }

    }
}