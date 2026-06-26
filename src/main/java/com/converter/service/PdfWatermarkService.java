package com.converter.service;

import org.apache.pdfbox.Loader;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;

import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.Color;

import java.io.File;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PdfWatermarkService {

    public Map<String,Object> watermarkPdf(

            MultipartFile[] pdfFiles,

            String watermarkType,

            String watermarkText,

            int textSize,

            int imageSize,

            int opacity,

            String position,

            MultipartFile watermarkImage

    ){

        Map<String,Object> result =
                new HashMap<>();

        try{

            List<Map<String,String>> files =
                    new ArrayList<>();

            File uploadFolder =
                    new File(
                            System.getProperty("user.dir")
                            +
                            File.separator
                            +
                            "uploaded-pdfs"
                    );

            if(!uploadFolder.exists()){

                uploadFolder.mkdirs();

            }

            File outputFolder =
                    new File(
                            System.getProperty("user.dir")
                            +
                            File.separator
                            +
                            "watermarked-pdfs"
                    );

            if(!outputFolder.exists()){

                outputFolder.mkdirs();

            }

            File imageFile = null;

            if(
                    watermarkImage != null
                    &&
                    !watermarkImage.isEmpty()
            ){

                imageFile =
                        new File(
                                outputFolder,
                                watermarkImage.getOriginalFilename()
                        );

                watermarkImage.transferTo(
                        imageFile
                );

            }

            for(
                    MultipartFile pdfFile
                    :
                    pdfFiles
            ){

                String originalName =
                        pdfFile.getOriginalFilename();

                if(
                        originalName == null
                        ||
                        originalName.isBlank()
                ){

                    originalName =
                            "document.pdf";

                }

                File uploadedPdf =
                        new File(
                                uploadFolder,
                                originalName
                        );

                pdfFile.transferTo(
                        uploadedPdf
                );

                PDDocument document =
                        Loader.loadPDF(
                                uploadedPdf
                        );

                for(
                        PDPage page
                        :
                        document.getPages()
                ){

                    float pageWidth =
                            page.getMediaBox()
                                    .getWidth();

                    float pageHeight =
                            page.getMediaBox()
                                    .getHeight();

                    float x =
                            pageWidth / 2;

                    float y =
                            pageHeight / 2;

                    switch(position){

                        case "TOP_LEFT":

                            x = 50;
                            y = pageHeight - 50;

                            break;

                        case "TOP_RIGHT":

                            x = pageWidth - 200;
                            y = pageHeight - 50;

                            break;

                        case "BOTTOM_LEFT":

                            x = 50;
                            y = 50;

                            break;

                        case "BOTTOM_RIGHT":

                            x = pageWidth - 200;
                            y = 50;

                            break;

                        default:

                            x = pageWidth / 2;
                            y = pageHeight / 2;

                    }

                    PDPageContentStream contentStream =
                            new PDPageContentStream(

                                    document,

                                    page,

                                    PDPageContentStream.AppendMode.APPEND,

                                    true,

                                    true

                            );

                    if(
                            "text".equalsIgnoreCase(
                                    watermarkType
                            )
                    ){

                        contentStream.beginText();

                        contentStream.setFont(

                                new PDType1Font(
                                        Standard14Fonts.FontName.HELVETICA_BOLD
                                ),

                                textSize

                        );

                        contentStream.setNonStrokingColor(
                                Color.LIGHT_GRAY
                        );

                        contentStream.newLineAtOffset(
                                x,
                                y
                        );

                        contentStream.showText(
                                watermarkText
                        );

                        contentStream.endText();

                    }
                    else if(
                            imageFile != null
                    ){

                        PDImageXObject image =
                                PDImageXObject.createFromFile(

                                        imageFile.getAbsolutePath(),

                                        document

                                );

                        contentStream.drawImage(

                                image,

                                x,

                                y,

                                imageSize,

                                imageSize

                        );

                    }

                    contentStream.close();

                }

                String outputName =
                        originalName.replace(
                                ".pdf",
                                ""
                        )
                        +
                        "-watermarked.pdf";

                File outputFile =
                        new File(
                                outputFolder,
                                outputName
                        );

                document.save(
                        outputFile
                );

                document.close();

                Map<String,String> fileInfo =
                        new HashMap<>();

                fileInfo.put(
                        "name",
                        outputName
                );

                fileInfo.put(
                        "size",
                        String.format(

                                "%.2f MB",

                                outputFile.length()
                                /
                                1024.0
                                /
                                1024.0

                        )
                );

                files.add(
                        fileInfo
                );

            }

            result.put(
                    "success",
                    true
            );

            result.put(
                    "files",
                    files
            );

        }
        catch(Exception e){

            e.printStackTrace();

            result.put(
                    "success",
                    false
            );

            result.put(
                    "message",
                    e.getMessage()
            );

        }

        return result;

    }

}

