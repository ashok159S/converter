package com.converter.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PdfToWordService {

    public Map<String,Object> convertPdfToWord(
            MultipartFile[] pdfFiles
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
                            "converted-word-files"
                    );

            if(!outputFolder.exists()){

                outputFolder.mkdirs();

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

                String baseName =
                        originalName.replaceAll(
                                "\\.[^.]+$",
                                ""
                        );

                File uploadedPdf =
                        new File(
                                uploadFolder,
                                originalName
                        );

                pdfFile.transferTo(
                        uploadedPdf
                );

                PDDocument pdfDocument =
                        Loader.loadPDF(
                                uploadedPdf
                        );

                PDFTextStripper stripper =
                        new PDFTextStripper();

                String extractedText =
                        stripper.getText(
                                pdfDocument
                        );

                pdfDocument.close();

                File docxFile =
                        new File(
                                outputFolder,
                                baseName
                                +
                                ".docx"
                        );

                XWPFDocument wordDocument =
                        new XWPFDocument();

                XWPFParagraph paragraph =
                        wordDocument.createParagraph();

                XWPFRun run =
                        paragraph.createRun();

                run.setText(
                        extractedText
                );

                FileOutputStream outputStream =
                        new FileOutputStream(
                                docxFile
                        );

                wordDocument.write(
                        outputStream
                );

                outputStream.close();

                wordDocument.close();

                Map<String,String> fileInfo =
                        new HashMap<>();

                fileInfo.put(
                        "name",
                        docxFile.getName()
                );

                fileInfo.put(
                        "originalPdf",
                        uploadedPdf.getName()
                );

                fileInfo.put(
                        "pdfSize",
                        String.format(
                                "%.2f MB",
                                uploadedPdf.length()
                                /
                                1024.0
                                /
                                1024.0
                        )
                );

                fileInfo.put(
                        "docxSize",
                        String.format(
                                "%.2f MB",
                                docxFile.length()
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

