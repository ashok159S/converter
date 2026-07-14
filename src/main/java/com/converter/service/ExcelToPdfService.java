package com.converter.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ExcelToPdfService {

        public Map<String, Object> convertExcelToPdf(

                        MultipartFile[] excelFiles,
                        String orientation,
                        String paperSize,
                        String scaling,
                        String quality

        ) {

                Map<String, Object> result = new HashMap<>();

                List<Map<String, String>> files = new ArrayList<>();

                File uploadFolder = new File(
                                System.getProperty("user.dir")
                                                +
                                                File.separator
                                                +
                                                "uploaded-excel");

                File outputFolder = new File(
                                System.getProperty("user.dir")
                                                +
                                                File.separator
                                                +
                                                "converted-pdfs");

                try {

                        if (!uploadFolder.exists()) {
                                uploadFolder.mkdirs();
                        }

                        if (!outputFolder.exists()) {
                                outputFolder.mkdirs();
                        }

                        for (MultipartFile excelFile : excelFiles) {

                                String originalName = excelFile.getOriginalFilename();

                                if (originalName == null
                                                ||
                                                originalName.isBlank()) {

                                        originalName = "spreadsheet.xlsx";

                                }

                                String uniqueName = UUID.randomUUID()
                                                +
                                                "_"
                                                +
                                                originalName;

                                File uploadedFile = new File(
                                                uploadFolder,
                                                uniqueName);

                                excelFile.transferTo(
                                                uploadedFile);

                                String sofficeCommand;

                                if (System.getProperty("os.name").toLowerCase().contains("win")) {

                                        sofficeCommand = "C:\\Program Files\\LibreOffice\\program\\soffice.exe";

                                } else {

                                        sofficeCommand = "soffice";

                                }

                                ProcessBuilder processBuilder = new ProcessBuilder(

                                                sofficeCommand,

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

                                String output = new String(process.getInputStream().readAllBytes());

                                System.out.println(output);

                                if (exitCode != 0) {

                                        throw new RuntimeException(
                                                        "LibreOffice conversion failed.\n" + output);

                                }

                                String pdfName = uniqueName.replaceAll(
                                                "\\.(xlsx|xls)$",
                                                ".pdf");

                                File pdfFile = new File(
                                                outputFolder,
                                                pdfName);

                                if (!pdfFile.exists()) {

                                        throw new RuntimeException(
                                                        "PDF file not generated.");

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
                                                                                1024.0));

                                files.add(
                                                fileInfo);

                                Files.deleteIfExists(
                                                uploadedFile.toPath());

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
                                                                "uploaded-excel"));

                deleteFolder(
                                new File(
                                                System.getProperty("user.dir")
                                                                +
                                                                File.separator
                                                                +
                                                                "converted-pdfs"));

        }

        private void deleteFolder(
                        File folder) {

                if (folder == null
                                ||
                                !folder.exists()) {
                        return;
                }

                File[] files = folder.listFiles();

                if (files == null) {
                        return;
                }

                for (File file : files) {

                        try {

                                Files.deleteIfExists(
                                                file.toPath());

                        } catch (Exception e) {

                                e.printStackTrace();

                        }

                }

        }

}