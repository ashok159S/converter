package com.converter.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

@Service
public class PdfCompressorService {

    private static final String GHOSTSCRIPT_PATH =
            "C:\\Program Files\\gs\\gs10.07.1\\bin\\gswin64c.exe";

    public Map<String, Object> compressPdf(

            MultipartFile[] pdfFiles,

            String compressionLevel

    ) {

        Map<String, Object> result =
                new HashMap<>();

        try {

            List<Map<String,Object>> files =
        new ArrayList<>();
            /* ===========================
               OUTPUT FOLDER
            =========================== */

            File outputFolder =
                    new File(
                            System.getProperty("user.dir"),
                            "compressed-pdfs"
                    );

            if (!outputFolder.exists()) {

                outputFolder.mkdirs();

            }

            /* ===========================
               TEMP FOLDER
            =========================== */

            File tempFolder =
                    new File(
                            System.getProperty("java.io.tmpdir"),
                            "temp-pdfs"
                    );

            if (!tempFolder.exists()) {

                tempFolder.mkdirs();

            }

            /* ===========================
               PROCESS FILES
            =========================== */

            for (MultipartFile pdfFile : pdfFiles) {

                String originalName =
                        pdfFile.getOriginalFilename();

                if (
                        originalName == null
                                ||
                                originalName.isBlank()
                ) {

                    originalName =
                            "document.pdf";

                }

                String baseName =
                        originalName.replaceAll(
                                "(?i)\\.pdf$",
                                ""
                        );

                /* ===========================
                   TEMP INPUT FILE
                =========================== */

                File inputFile =
                        File.createTempFile(
                                "pdf_",
                                ".pdf",
                                tempFolder
                        );

                pdfFile.transferTo(
                        inputFile
                );

                /* ===========================
                   OUTPUT FILE
                =========================== */

                File outputFile =
                        new File(
                                outputFolder,
                                baseName
                                        +
                                        "-compressed.pdf"
                        );

                /* ===========================
                   COMPRESSION LEVEL
                =========================== */

                String pdfSetting =
                        "/ebook";

                if (
                        "LOW".equalsIgnoreCase(
                                compressionLevel
                        )
                ) {

                    pdfSetting =
                            "/prepress";

                }
                else if (
                        "HIGH".equalsIgnoreCase(
                                compressionLevel
                        )
                ) {

                    pdfSetting =
                            "/screen";

                }

                /* ===========================
                   GHOSTSCRIPT
                =========================== */

                ProcessBuilder processBuilder =
                        new ProcessBuilder(

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
                        true
                );

                Process process =
                        processBuilder.start();

                Scanner scanner =
                        new Scanner(
                                process.getInputStream()
                        );

                StringBuilder output =
                        new StringBuilder();

                while (
                        scanner.hasNextLine()
                ) {

                    String line =
                            scanner.nextLine();

                    output.append(
                            line
                    ).append(
                            "\n"
                    );

                    System.out.println(
                            line
                    );

                }

                int exitCode =
                        process.waitFor();

                if (
                        exitCode != 0
                ) {

                    inputFile.delete();

                    throw new RuntimeException(
                            output.toString()
                    );

                }

                if (
                        !outputFile.exists()
                ) {

                    throw new RuntimeException(
                            "Compressed file not created."
                    );

                }

                /* ===========================
                   RESPONSE FILE INFO
                =========================== */

                Map<String,Object> fileInfo =
        new HashMap<>();

double originalSize =
        inputFile.length()
        /
        1024.0
        /
        1024.0;

double compressedSize =
        outputFile.length()
        /
        1024.0
        /
        1024.0;

double saved =
        originalSize
        -
        compressedSize;

double reduction =
        (saved / originalSize)
        * 100;

fileInfo.put(
        "name",
        outputFile.getName()
);

fileInfo.put(
        "originalSize",
        String.format(
                "%.2f MB",
                originalSize
        )
);

fileInfo.put(
        "compressedSize",
        String.format(
                "%.2f MB",
                compressedSize
        )
);

fileInfo.put(
        "saved",
        String.format(
                "%.2f MB",
                saved
        )
);

fileInfo.put(
        "reduction",
        String.format(
                "%.0f%%",
                reduction
        )
);

                files.add(
                        fileInfo
                );

                /* ===========================
                   DELETE TEMP FILE
                =========================== */

                inputFile.delete();

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
        catch (Exception e) {

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