package com.converter.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;

import org.apache.pdfbox.pdmodel.encryption.AccessPermission;
import org.apache.pdfbox.pdmodel.encryption.StandardProtectionPolicy;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PdfProtectorService {

        public Map<String, Object> protectPdf(

                        MultipartFile[] pdfFiles,
                        String[] passwords

        ) {

                Map<String, Object> result = new HashMap<>();

                List<Map<String, String>> files = new ArrayList<>();

                File uploadedPdf = null;

                PDDocument document = null;

                try {

                        File uploadFolder = new File(
                                        System.getProperty("user.dir")
                                                        +
                                                        File.separator
                                                        +
                                                        "uploaded-pdfs");

                        if (!uploadFolder.exists()) {

                                uploadFolder.mkdirs();

                        }

                        File protectedFolder = new File(
                                        System.getProperty("user.dir")
                                                        +
                                                        File.separator
                                                        +
                                                        "protected-pdfs");

                        if (!protectedFolder.exists()) {

                                protectedFolder.mkdirs();

                        }

                        for (int i = 0; i < pdfFiles.length; i++) {

                                MultipartFile pdfFile = pdfFiles[i];

                                if (pdfFile == null ||
                                                pdfFile.isEmpty()) {

                                        result.put(
                                                        "success",
                                                        false);

                                        result.put(
                                                        "message",
                                                        "One or more uploaded files are empty.");

                                        return result;

                                }

                                if (!"application/pdf".equalsIgnoreCase(
                                                pdfFile.getContentType())) {

                                        result.put(
                                                        "success",
                                                        false);

                                        result.put(
                                                        "message",
                                                        "Only PDF files are allowed.");

                                        return result;

                                }

                                String password = passwords[i];

                                if (password == null ||
                                                password.isBlank()) {

                                        result.put(
                                                        "success",
                                                        false);

                                        result.put(
                                                        "message",
                                                        "Password cannot be empty for "
                                                                        +
                                                                        pdfFile.getOriginalFilename());

                                        return result;

                                }

                                String originalName = pdfFile.getOriginalFilename();

                                if (originalName == null
                                                ||
                                                originalName.isBlank()) {

                                        originalName = "document.pdf";

                                }

                                uploadedPdf = new File(
                                                uploadFolder,
                                                originalName);

                                pdfFile.transferTo(
                                                uploadedPdf);

                                try {

                                        document = Loader.loadPDF(
                                                        uploadedPdf);

                                } catch (Exception ex) {

                                        uploadedPdf.delete();

                                        result.put(
                                                        "success",
                                                        false);

                                        result.put(
                                                        "message",
                                                        pdfFile.getOriginalFilename()
                                                                        +
                                                                        " is corrupted or not a valid PDF.");

                                        return result;

                                }

                                AccessPermission accessPermission = new AccessPermission();

                                StandardProtectionPolicy policy = new StandardProtectionPolicy(

                                                password,

                                                password,

                                                accessPermission

                                );

                                policy.setEncryptionKeyLength(
                                                256);

                                policy.setPermissions(
                                                accessPermission);

                                document.protect(
                                                policy);

                                String outputName = originalName.replace(
                                                ".pdf",
                                                "")
                                                +
                                                "-protected.pdf";

                                File protectedPdf = new File(
                                                protectedFolder,
                                                outputName);

                                document.save(
                                                protectedPdf);

                                Map<String, String> fileInfo = new HashMap<>();

                                fileInfo.put(
                                                "name",
                                                outputName);

                                fileInfo.put(
                                                "size",
                                                String.format(
                                                                "%.2f MB",
                                                                protectedPdf.length()
                                                                                /
                                                                                1024.0
                                                                                /
                                                                                1024.0));

                                files.add(
                                                fileInfo);

                                document.close();

                                uploadedPdf.delete();

                                document = null;

                                uploadedPdf = null;

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
                                        "Unable to protect PDF.");

                } finally {

                        try {

                                if (document != null) {

                                        document.close();

                                }

                        } catch (Exception ex) {

                                ex.printStackTrace();

                        }

                        if (uploadedPdf != null &&
                                        uploadedPdf.exists()) {

                                uploadedPdf.delete();

                        }

                }

                return result;

        }

}
