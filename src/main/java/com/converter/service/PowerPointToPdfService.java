package com.converter.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PowerPointToPdfService {

        public Map<String, Object> convertPowerPointToPdf(

                        MultipartFile[] pptFiles,

                        String conversionMode,

                        String pdfLayout,

                        String orientation,

                        String quality

        ) {

                Map<String, Object> result = new HashMap<>();

                try {

                        List<Map<String, String>> files = new ArrayList<>();

                        File uploadFolder = new File(

                                        System.getProperty("user.dir")
                                                        +
                                                        File.separator
                                                        +
                                                        "uploaded-powerpoints"

                        );

                        if (!uploadFolder.exists()) {

                                uploadFolder.mkdirs();

                        }

                        File outputFolder = new File(

                                        System.getProperty("user.dir")
                                                        +
                                                        File.separator
                                                        +
                                                        "converted-pdfs"

                        );

                        if (!outputFolder.exists()) {

                                outputFolder.mkdirs();

                        }

                        for (

                        MultipartFile pptFile : pptFiles

                        ) {

                                String originalName = pptFile.getOriginalFilename();

                                if (

                                originalName == null
                                                ||
                                                originalName.isBlank()

                                ) {

                                        originalName = "presentation.pptx";

                                }

                                File uploadedFile = new File(

                                                uploadFolder,

                                                originalName

                                );

                                try {

                                        pptFile.transferTo(
                                                        uploadedFile);

                                } catch (Exception ex) {

                                        result.put(
                                                        "success",
                                                        false);

                                        result.put(
                                                        "message",
                                                        originalName +
                                                                        " is corrupted or could not be uploaded.");

                                        return result;

                                }

                                ProcessBuilder processBuilder = new ProcessBuilder(

                                                "C:\\Program Files\\LibreOffice\\program\\soffice.exe",

                                                "--headless",

                                                "--convert-to",

                                                "pdf",

                                                uploadedFile.getAbsolutePath(),

                                                "--outdir",

                                                outputFolder.getAbsolutePath()

                                );

                                processBuilder.redirectErrorStream(
                                                true);

                                Process process = processBuilder.start();

                                int exitCode = process.waitFor();

                                if (exitCode != 0) {

                                        result.put(
                                                        "success",
                                                        false);

                                        result.put(
                                                        "message",
                                                        originalName +
                                                                        " is corrupted or could not be converted.");

                                        return result;

                                }

                                String pdfName = originalName.replaceAll(
                                                "\\.(ppt|pptx)$",
                                                ".pdf");

                                File pdfFile = new File(
                                                outputFolder,
                                                pdfName);

                                if (!pdfFile.exists()) {

                                        throw new RuntimeException(
                                                        "PDF file not generated");

                                }

                                Map<String, String> fileInfo = new HashMap<>();

                                fileInfo.put(
                                                "name",
                                                pdfName);

                                fileInfo.put(

                                                "size",

                                                String.format(

                                                                "%.2f MB",

                                                                pdfFile.length()
                                                                                /
                                                                                1024.0
                                                                                /
                                                                                1024.0

                                                )

                                );

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
                                        "Unable to convert the selected PowerPoint file(s).");

                }

                return result;

        }

        /*
         * ===========================
         * DELETE TEMP FILES
         * ===========================
         */

        public void deleteTempFiles() {

                deleteFolder(

                                new File(
                                                System.getProperty("user.dir")
                                                                +
                                                                File.separator
                                                                +
                                                                "uploaded-powerpoints")

                );

                deleteFolder(

                                new File(
                                                System.getProperty("user.dir")
                                                                +
                                                                File.separator
                                                                +
                                                                "converted-pdfs")

                );

        }

        private void deleteFolder(File folder) {

                if (folder.exists()) {

                        File[] files = folder.listFiles();

                        if (files != null) {

                                for (File file : files) {

                                        file.delete();

                                }

                        }

                }

        }

}
