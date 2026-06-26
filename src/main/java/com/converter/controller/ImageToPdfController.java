package com.converter.controller;

import java.awt.image.BufferedImage;
import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import javax.imageio.ImageIO;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

@Controller
public class ImageToPdfController {

    private static final String PDF_FILE_NAME =
            "merged.pdf";

    @GetMapping("/image-to-pdf")
    public String jpgToPdfPage(Model model) {

        model.addAttribute(
                "pdfReady",
                false
        );

        return "image-to-pdf";
    }

    @PostMapping("/image-to-pdf")
public String convertToPdf(

        @RequestParam("images")
        MultipartFile[] images,

        @RequestParam(value="pageSize", defaultValue="original")
        String pageSize,

        @RequestParam(value="quality", defaultValue="high")
        String quality,

        @RequestParam(value="conversionMode", defaultValue="merge")
        String conversionMode,

        Model model){


    System.out.println("Page Size : " + pageSize);
    System.out.println("Quality : " + quality);
    System.out.println("Mode : " + conversionMode);

        try {

            if(images == null ||
               images.length == 0){

                model.addAttribute(
                        "pdfReady",
                        false
                );

                return "image-to-pdf";
            }

            if(conversionMode.equals("separate")){

                for(MultipartFile image : images){

                        System.out.println(
                        "Creating PDF for: "
                        + image.getOriginalFilename()
                        );

                }

                }
                else{

                System.out.println(
                        "Merge Mode Selected"
                );

                }

            PDDocument document =
                    new PDDocument();

            int pageCount = 0;

            for(MultipartFile image : images){

                if(image.isEmpty()){
                    continue;
                }

                File tempFile =
                        File.createTempFile(
                                "upload",
                                ".jpg"
                        );

                image.transferTo(
                        tempFile
                );

                BufferedImage bufferedImage =
                        ImageIO.read(
                                tempFile
                        );

                double qualityScale = 1.0;

                if(quality.equals("medium")){

                    qualityScale = 0.8;

                }
                else if(quality.equals("low")){

                    qualityScale = 0.6;

                }

                if(bufferedImage == null){
                    continue;
                }
                
                PDRectangle pageRectangle;

                if(pageSize.equals("a4")){

                    pageRectangle =
                            PDRectangle.A4;

                }
                else if(pageSize.equals("letter")){

                    pageRectangle =
                            PDRectangle.LETTER;

                }
                else{

                    pageRectangle =
                            new PDRectangle(
                                    bufferedImage.getWidth(),
                                    bufferedImage.getHeight()
                            );

                }

                PDPage page =
                        new PDPage(
                                pageRectangle
                        );

                document.addPage(page);

                PDImageXObject pdImage =
                        PDImageXObject.createFromFile(
                                tempFile.getAbsolutePath(),
                                document
                        );

                PDPageContentStream contentStream =
                        new PDPageContentStream(
                                document,
                                page
                        );

                float pageWidth =
                        page.getMediaBox().getWidth();

                float pageHeight =
                        page.getMediaBox().getHeight();

                float imageWidth =
                        bufferedImage.getWidth();

                float imageHeight =
                        bufferedImage.getHeight();

                float widthScale =
                        pageWidth / imageWidth;

                float heightScale =
                        pageHeight / imageHeight;

                float scale =
                        (float) Math.min(
                        widthScale,
                        heightScale
                        );

                float scaledWidth =
                        imageWidth *
                        scale *
                        (float)qualityScale;

                float scaledHeight =
                        imageHeight *
                        scale *
                        (float)qualityScale;

                float x =
                        (pageWidth - scaledWidth) / 2;

                float y =
                        (pageHeight - scaledHeight) / 2;

                contentStream.drawImage(
                        pdImage,
                        x,
                        y,
                        scaledWidth,
                        scaledHeight
                );

                contentStream.close();

                tempFile.delete();

                pageCount++;
            }

            document.save(
                    PDF_FILE_NAME
            );

            document.close();

            File pdfFile =
                    new File(
                            PDF_FILE_NAME
                    );

            double pdfSize =
                    (double) pdfFile.length()
                            /1024
                            /1024;

            model.addAttribute(
                    "pdfReady",
                    true
            );

            model.addAttribute(
                    "pdfName",
                    PDF_FILE_NAME
            );

            model.addAttribute(
                    "pageCount",
                    pageCount
            );

            model.addAttribute(
                    "pdfSize",
                    String.format(
                            "%.2f MB",
                            pdfSize
                    )
            );

        }
        catch (Exception e){

            e.printStackTrace();

            model.addAttribute(
                    "pdfReady",
                    false
            );
        }

        return "image-to-pdf";
    }

        @GetMapping("/download-pdf")
        public ResponseEntity<Resource>
        downloadPdf(

        @RequestParam(
                value = "fileName",
                defaultValue = "merged.pdf"
        )
        String fileName

        ) throws Exception {

        File file =
                new File(
                        PDF_FILE_NAME
                );

        if(!file.exists()){

            return ResponseEntity
                    .notFound()
                    .build();
        }

        Resource resource =
                new UrlResource(
                        file.toURI()
                );

        return ResponseEntity.ok()
                .header(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\""
                + fileName +
                "\""
              )
                .contentType(
                        MediaType.APPLICATION_PDF
                )
                .body(resource);
    }

        @GetMapping("/download-separate")
        public ResponseEntity<Resource>
        downloadSeparate(

                @RequestParam("fileName")
                String fileName

        ) throws Exception {

        File file =
                new File(
                        fileName
                );

        if(!file.exists()){

                return ResponseEntity
                        .notFound()
                        .build();
        }

        Resource resource =
                new UrlResource(
                        file.toURI()
                );

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\""
                        + file.getName()
                        + "\""
                )
                .contentType(
                        MediaType.APPLICATION_PDF
                )
                .body(resource);
        }

    @PostMapping("/image-to-pdf-ajax")
    @ResponseBody
    public Map<String,Object> convertAjax(

        @RequestParam("images")
        MultipartFile[] images,

        @RequestParam(value="pageSize", defaultValue="original")
        String pageSize,

        @RequestParam(value="quality", defaultValue="high")
        String quality,

        @RequestParam(value="conversionMode", defaultValue="merge")
        String conversionMode

    ) throws Exception {

    Map<String,Object> response =
            new HashMap<>();

        System.out.println(
            "Page Size : " + pageSize
        );

        System.out.println(
            "Quality : " + quality
        );

if(quality.equals("high")){

    System.out.println(
        "High Quality Selected"
    );

}
else if(quality.equals("medium")){

    System.out.println(
        "Medium Quality Selected"
    );

}
else{

    System.out.println(
        "Low Quality Selected"
    );

}

        System.out.println(
            "Mode : " + conversionMode
        );

if(conversionMode.equals("separate")){

         List<Map<String,String>> generatedFiles = new ArrayList<>();
    for(MultipartFile image : images){

        String pdfName =
        image.getOriginalFilename()
             .replace(".jpg", ".pdf")
             .replace(".jpeg", ".pdf");
             
        PDDocument separateDocument =
        new PDDocument();

        System.out.println(
                "Creating PDF : "
                + pdfName
        );

        File temp =
                File.createTempFile(
                "img",
                ".jpg"
                );

        image.transferTo(
                temp
        );

        BufferedImage bufferedImage =
        ImageIO.read(
            temp
        );

        PDPage page =
                new PDPage(
                new PDRectangle(
                        bufferedImage.getWidth(),
                        bufferedImage.getHeight()
                )
        );
                separateDocument.addPage(page);

        PDImageXObject pdImage =
        PDImageXObject.createFromFile(
            temp.getAbsolutePath(),
            separateDocument
        );

        PDPageContentStream stream =
        new PDPageContentStream(
            separateDocument,
            page
        );

        stream.drawImage(
        pdImage,
        0,
        0,
        bufferedImage.getWidth(),
        bufferedImage.getHeight()
        );

        stream.close();

        separateDocument.save(
                pdfName
        );

        File generatedPdf =
        new File(pdfName);

        Map<String,String> fileInfo =
                new HashMap<>();

        fileInfo.put(
                "name",
                pdfName
        );

        fileInfo.put(
                "size",
                String.format(
                "%.2f MB",
                generatedPdf.length()
                /
                1024.0
                /
                1024.0
                )
        );

        generatedFiles.add(
                fileInfo
        );

        separateDocument.close();

        temp.delete();
}

        response.put(
                "success",
                true
        );

        response.put(
                "separateMode",
                true
        );

        response.put(
                "files",
                generatedFiles
        );

        return response;        

}
else{

    System.out.println(
            "Merge Mode Selected"
    );

}


    PDDocument document =
            new PDDocument();

    int pageCount = 0;

    for(MultipartFile image : images){

        File temp =
                File.createTempFile(
                        "img",
                        ".jpg"
                );

        image.transferTo(temp);

        BufferedImage bufferedImage =
                ImageIO.read(temp);

        double qualityScale = 1.0;

        if(quality.equals("medium")){

            qualityScale = 0.8;

        }
        else if(quality.equals("low")){

            qualityScale = 0.6;

        }

PDRectangle pageRectangle;

if(pageSize.equals("a4")){

    pageRectangle =
            PDRectangle.A4;

}
else if(pageSize.equals("letter")){

    pageRectangle =
            PDRectangle.LETTER;

}
else{

    pageRectangle =
            new PDRectangle(
                    bufferedImage.getWidth(),
                    bufferedImage.getHeight()
            );

}

        PDPage page =
                new PDPage(
                         pageRectangle
                );

        document.addPage(page);

        PDImageXObject pdImage =
                PDImageXObject.createFromFile(
                        temp.getAbsolutePath(),
                        document
                );

        PDPageContentStream stream =
                new PDPageContentStream(
                        document,
                        page
                );

                float pageWidth =
                        page.getMediaBox().getWidth();

                float pageHeight =
                        page.getMediaBox().getHeight();

                float imageWidth =
                        bufferedImage.getWidth();

                float imageHeight =
                        bufferedImage.getHeight();

                float widthScale =
                        pageWidth / imageWidth;

                float heightScale =
                        pageHeight / imageHeight;

                float scale =
                        (float) Math.min(
                            widthScale,
                            heightScale
                        );

                float scaledWidth =
                        imageWidth *
                        scale *
                        (float)qualityScale;

                float scaledHeight =
                        imageHeight *
                        scale *
                        (float)qualityScale;

                float x =
                        (pageWidth - scaledWidth) / 2;

                float y =
                        (pageHeight - scaledHeight) / 2;

                stream.drawImage(
                        pdImage,
                        x,
                        y,
                        scaledWidth,
                        scaledHeight
                );

        stream.close();

        temp.delete();

        pageCount++;
    }

    document.save("merged.pdf");
    document.close();

    File pdf =
            new File("merged.pdf");

    response.put(
            "success",
            true
    );

    response.put(
            "pages",
            pageCount
    );

    response.put(
            "size",
            String.format(
                    "%.2f MB",
                    pdf.length()/1024.0/1024.0
            )
    );

    response.put(
            "fileName",
            "merged.pdf"
    );

    return response;
}

@GetMapping("/preview-pdf")
public ResponseEntity<Resource>
previewPdf() throws Exception {

    File file =
        new File("merged.pdf");

    Resource resource =
        new FileSystemResource(
            file
        );

    return ResponseEntity.ok()
            .contentType(
                MediaType.APPLICATION_PDF
            )
            .body(resource);
}

@GetMapping("/preview-separate")
public ResponseEntity<Resource>
previewSeparatePdf(
    @RequestParam String fileName
) throws Exception {

    File file =
        new File(fileName);

    Resource resource =
        new FileSystemResource(file);

    return ResponseEntity.ok()
        .contentType(
            MediaType.APPLICATION_PDF
        )
        .body(resource);
}
}