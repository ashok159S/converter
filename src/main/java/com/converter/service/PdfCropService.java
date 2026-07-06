package com.converter.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.common.PDRectangle;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PdfCropService {

        public Map<String, Object> cropPdf(

                        MultipartFile[] pdfFiles,

                        String cropAmount,

                        String applyTo

        ) {

                Map<String, Object> result = new HashMap<>();

                try {

                        List<Map<String, String>> files = new ArrayList<>();

                        File uploadFolder = new File(

                                        System.getProperty("user.dir")
                                                        +
                                                        File.separator
                                                        +
                                                        "uploaded-pdfs"

                        );

                        if (!uploadFolder.exists()) {

                                uploadFolder.mkdirs();

                        }

                        File outputFolder = new File(

                                        System.getProperty("user.dir")
                                                        +
                                                        File.separator
                                                        +
                                                        "cropped-pdfs"

                        );

                        if (!outputFolder.exists()) {

                                outputFolder.mkdirs();

                        }

                        int cropValue = 20;

                        if ("SMALL".equalsIgnoreCase(
                                        cropAmount)) {

                                cropValue = 10;

                        } else if ("MEDIUM".equalsIgnoreCase(
                                        cropAmount)) {

                                cropValue = 20;

                        } else if ("LARGE".equalsIgnoreCase(
                                        cropAmount)) {

                                cropValue = 40;

                        }

                        for (

                        MultipartFile pdfFile : pdfFiles

                        ) {

                                String originalName = pdfFile.getOriginalFilename();

                                if (originalName == null
                                                ||
                                                originalName.isBlank()) {

                                        originalName = "document.pdf";

                                }

                                File uploadedFile = new File(
                                                uploadFolder,
                                                originalName);

                                pdfFile.transferTo(
                                                uploadedFile);

                                PDDocument document = Loader.loadPDF(
                                                uploadedFile);

                                for (

                                                int i = 0; i < document.getNumberOfPages(); i++

                                                ) {

                                        if (

                                        "FIRST".equalsIgnoreCase(
                                                        applyTo)
                                                        &&
                                                        i > 0

                                        ) {

                                                continue;

                                        }

                                        PDPage page = document.getPage(i);

                                        PDRectangle mediaBox = page.getMediaBox();

                                        float width = mediaBox.getWidth();

                                        float height = mediaBox.getHeight();

                                        PDRectangle cropBox = new PDRectangle(

                                                        cropValue,

                                                        cropValue,

                                                        width
                                                                        -
                                                                        (cropValue * 2),

                                                        height
                                                                        -
                                                                        (cropValue * 2)

                                        );

                                        page.setCropBox(
                                                        cropBox);

                                }

                                String outputName = originalName.replace(
                                                ".pdf",
                                                "")
                                                +
                                                "-cropped.pdf";

                                File outputFile = new File(
                                                outputFolder,
                                                outputName);

                                int pageCount = document.getNumberOfPages();

                                document.save(
                                                outputFile);

                                document.close();

                                uploadedFile.delete();

                                Map<String, String> fileInfo = new HashMap<>();

                                fileInfo.put(
                                                "name",
                                                outputName);

                                fileInfo.put(
                                                "size",
                                                String.format(
                                                                "%.2f MB",
                                                                outputFile.length()
                                                                                /
                                                                                1024.0
                                                                                /
                                                                                1024.0));

                                fileInfo.put(
                                                "pages",
                                                String.valueOf(
                                                                pageCount));

                                fileInfo.put(
                                                "cropAmount",
                                                cropAmount);

                                files.add(
                                                fileInfo);
                        }

                        result.put(
                                        "success",
                                        true);

                        result.put(
                                        "files",
                                        files);

                } catch (Exception e) {

                        e.printStackTrace();

                        result.put(
                                        "success",
                                        false);

                        result.put(
                                        "message",
                                        e.getMessage());

                }

                return result;

        }

        public void deleteCroppedPdfs() {

                File folder = new File(
                                System.getProperty("user.dir")
                                                +
                                                File.separator
                                                +
                                                "cropped-pdfs");

                if (folder.exists()) {

                        File[] files = folder.listFiles();

                        if (files != null) {

                                for (File file : files) {

                                        if (file.isFile()) {

                                                file.delete();

                                        }

                                }

                        }

                }

        }

}
