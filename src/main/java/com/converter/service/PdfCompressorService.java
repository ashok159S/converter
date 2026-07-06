package com.converter.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.Loader;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

@Service
public class PdfCompressorService {

        private static final String GHOSTSCRIPT_PATH = "C:\\Program Files\\gs\\gs10.07.1\\bin\\gswin64c.exe";

        public Map<String, Object> compressPdf(

                        MultipartFile[] pdfFiles,

                        String compressionLevel

        ) {
                deleteCompressedPdfs();

                Map<String, Object> result = new HashMap<>();

                try {

                        List<Map<String, Object>> files = new ArrayList<>();
                        /*
                         * ===========================
                         * OUTPUT FOLDER
                         * ===========================
                         */

                        File outputFolder = new File(
                                        System.getProperty("user.dir"),
                                        "compressed-pdfs");

                        if (!outputFolder.exists()) {

                                outputFolder.mkdirs();

                        }

                        /*
                         * ===========================
                         * TEMP FOLDER
                         * ===========================
                         */

                        File tempFolder = new File(
                                        System.getProperty("java.io.tmpdir"),
                                        "temp-pdfs");

                        if (!tempFolder.exists()) {

                                tempFolder.mkdirs();

                        }

                        /*
                         * ===========================
                         * PROCESS FILES
                         * ===========================
                         */

                        for (MultipartFile pdfFile : pdfFiles) {

                                String originalName = pdfFile.getOriginalFilename();

                                if (originalName == null
                                                ||
                                                originalName.isBlank()) {

                                        originalName = "document.pdf";

                                }

                                String baseName = originalName.replaceAll(
                                                "(?i)\\.pdf$",
                                                "");

                                /*
                                 * ===========================
                                 * TEMP INPUT FILE
                                 * ===========================
                                 */
                                File inputFile = null;

                                try {

                                        inputFile = File.createTempFile(
                                                        "pdf_",
                                                        ".pdf",
                                                        tempFolder);

                                        pdfFile.transferTo(
                                                        inputFile);

                                        /*
                                         * ===========================
                                         * PDF VALIDATION
                                         * ===========================
                                         */

                                        if (inputFile.length() == 0) {

                                                throw new RuntimeException(
                                                                "The file \""
                                                                                +
                                                                                originalName
                                                                                +
                                                                                "\" is empty.");

                                        }

                                        try {

                                                Loader.loadPDF(inputFile).close();

                                        } catch (Exception e) {

                                                throw new RuntimeException(
                                                                "The file \""
                                                                                +
                                                                                originalName
                                                                                +
                                                                                "\" is corrupted or is not a valid PDF.");

                                        }

                                        /*
                                         * ===========================
                                         * OUTPUT FILE
                                         * ===========================
                                         */

                                        String uniqueFileName = java.util.UUID.randomUUID()
                                                        +
                                                        "_"
                                                        +
                                                        baseName
                                                        +
                                                        "-compressed.pdf";

                                        File outputFile = new File(
                                                        outputFolder,
                                                        uniqueFileName);

                                        /*
                                         * ===========================
                                         * COMPRESSION LEVEL
                                         * ===========================
                                         */

                                        String pdfSetting;

                                        if ("LOW".equalsIgnoreCase(
                                                        compressionLevel)) {

                                                pdfSetting = "/prepress";

                                        } else if ("MEDIUM".equalsIgnoreCase(
                                                        compressionLevel)) {

                                                pdfSetting = "/ebook";

                                        } else if ("HIGH".equalsIgnoreCase(
                                                        compressionLevel)) {

                                                pdfSetting = "/screen";

                                        } else {

                                                throw new RuntimeException(
                                                                "Invalid compression level selected.");

                                        }

                                        /*
                                         * ===========================
                                         * GHOSTSCRIPT
                                         * ===========================
                                         */

                                        ProcessBuilder processBuilder = new ProcessBuilder(

                                                        GHOSTSCRIPT_PATH,

                                                        "-sDEVICE=pdfwrite",

                                                        "-dCompatibilityLevel=1.4",

                                                        "-dPDFSETTINGS="
                                                                        +
                                                                        pdfSetting,

                                                        "-dNOPAUSE",

                                                        "-dQUIET",

                                                        "-dBATCH",

                                                        "-sOutputFile="
                                                                        +
                                                                        outputFile.getAbsolutePath(),

                                                        inputFile.getAbsolutePath()

                                        );

                                        processBuilder.redirectErrorStream(
                                                        true);

                                        Process process = processBuilder.start();

                                        Scanner scanner = new Scanner(
                                                        process.getInputStream());

                                        StringBuilder output = new StringBuilder();

                                        while (scanner.hasNextLine()) {

                                                String line = scanner.nextLine();

                                                output.append(
                                                                line).append(
                                                                                "\n");

                                                System.out.println(
                                                                line);

                                        }

                                        int exitCode = process.waitFor();

                                        if (exitCode != 0) {

                                                throw new RuntimeException(
                                                                output.toString());

                                        }

                                        if (!outputFile.exists()) {

                                                throw new RuntimeException(
                                                                "Compressed file not created.");

                                        }

                                        /*
                                         * ===========================
                                         * RESPONSE FILE INFO
                                         * ===========================
                                         */

                                        Map<String, Object> fileInfo = new HashMap<>();

                                        double originalSize = inputFile.length()
                                                        /
                                                        1024.0
                                                        /
                                                        1024.0;

                                        double compressedSize = outputFile.length()
                                                        /
                                                        1024.0
                                                        /
                                                        1024.0;

                                        double saved = originalSize
                                                        -
                                                        compressedSize;

                                        double reduction = (saved / originalSize)
                                                        * 100;

                                        fileInfo.put(
                                                        "name",
                                                        outputFile.getName());

                                        fileInfo.put(
                                                        "originalSize",
                                                        String.format(
                                                                        "%.2f MB",
                                                                        originalSize));

                                        fileInfo.put(
                                                        "compressedSize",
                                                        String.format(
                                                                        "%.2f MB",
                                                                        compressedSize));

                                        fileInfo.put(
                                                        "saved",
                                                        String.format(
                                                                        "%.2f MB",
                                                                        saved));

                                        fileInfo.put(
                                                        "reduction",
                                                        String.format(
                                                                        "%.0f%%",
                                                                        reduction));

                                        files.add(
                                                        fileInfo);

                                } finally {

                                        if (inputFile != null
                                                        &&
                                                        inputFile.exists()) {
                                                                inputFile.delete();

                                        }

                                }

                                /*
                                 * ===========================
                                 * DELETE TEMP FILE
                                 * ===========================
                                 */

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
         * DELETE COMPRESSED PDFS
         * ===========================
         */

        public void deleteCompressedPdfs() {

                File outputFolder = new File(
                                System.getProperty("user.dir"),
                                "compressed-pdfs");

                if (!outputFolder.exists()) {

                        return;

                }

                File[] files = outputFolder.listFiles();

                if (files == null) {

                        return;

                }

                for (File file : files) {

                        if (file.isFile()) {

                                if (!file.delete()) {

                                        System.err.println(
                                                        "Unable to delete: "
                                                                        + file.getAbsolutePath());

                                }

                        }

                }

        }

}