package com.converter.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PdfUnlockerService {

        public Map<String, Object> unlockPdf(

                        MultipartFile[] pdfFiles,
                        String[] passwords

        ) {

                Map<String, Object> result = new HashMap<>();

                try {

                        List<Map<String, String>> files = new ArrayList<>();

                        File uploadFolder = new File(
                                        System.getProperty("user.dir")
                                                        +
                                                        File.separator
                                                        +
                                                        "uploaded-pdfs");

                        if (!uploadFolder.exists()) {

                                uploadFolder.mkdirs();

                        }

                        File unlockedFolder = new File(
                                        System.getProperty("user.dir")
                                                        +
                                                        File.separator
                                                        +
                                                        "unlocked-pdfs");

                        if (!unlockedFolder.exists()) {

                                unlockedFolder.mkdirs();

                        }

                        for (int i = 0; i < pdfFiles.length; i++) {

                                MultipartFile pdfFile = pdfFiles[i];

                                String password = passwords[i];

                                String originalName = pdfFile.getOriginalFilename();

                                if (originalName == null
                                                ||
                                                originalName.isBlank()) {

                                        originalName = "document.pdf";

                                }

                                File uploadedPdf = new File(
                                                uploadFolder,
                                                originalName);

                                pdfFile.transferTo(
                                                uploadedPdf);

                                PDDocument document;

                                try {

                                        document = Loader.loadPDF(
                                                        uploadedPdf,
                                                        password);

                                } catch (Exception ex) {

                                        result.put(
                                                        "success",
                                                        false);

                                        result.put(
                                                        "message",
                                                        "Invalid password or corrupted PDF: "
                                                                        + originalName);

                                        return result;

                                }

                                String outputName = originalName
                                                .replace(
                                                                ".pdf",
                                                                "")
                                                +
                                                "-unlocked.pdf";

                                File unlockedPdf = new File(
                                                unlockedFolder,
                                                outputName);

                                document.setAllSecurityToBeRemoved(
                                                true);

                                document.save(
                                                unlockedPdf);

                                document.close();

                                Map<String, String> fileInfo = new HashMap<>();

                                fileInfo.put(
                                                "name",
                                                outputName);

                                long fileSize = unlockedPdf.length();

                                if (fileSize < 1024 * 1024) {

                                        fileInfo.put(
                                                        "size",
                                                        String.format(
                                                                        "%.2f KB",
                                                                        fileSize / 1024.0));

                                } else {

                                        fileInfo.put(
                                                        "size",
                                                        String.format(
                                                                        "%.2f MB",
                                                                        fileSize
                                                                                        /
                                                                                        1024.0
                                                                                        /
                                                                                        1024.0));

                                }

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
                                        "Failed to unlock PDF.");
                }

                return result;

        }

        /*
         * ===========================
         * DELETE TEMP FILES
         * ===========================
         */

        public void deleteTemporaryFiles() {

                deleteFolder(
                                new File(
                                                "uploaded-pdfs"));

                deleteFolder(
                                new File(
                                                "unlocked-pdfs"));

        }

        private void deleteFolder(File folder) {

                if (folder == null || !folder.exists()) {

                        return;

                }

                File[] files = folder.listFiles();

                if (files == null) {

                        return;

                }

                for (File file : files) {

                        if (file.isFile()) {

                                file.delete();

                        }

                }

        }

}
