package com.converter.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class FileCleanupService {

    // Delete files older than 30 minutes
    private static final long FILE_EXPIRY_TIME =
            30 * 60 * 1000;

    // Runs every 30 minutes
    @Scheduled(fixedRate = 30 * 60 * 1000)
    public void cleanupOldFiles() {

        System.out.println("========== File Cleanup Started ==========");

        deleteOldFiles("uploaded-images");
        deleteOldFiles("compressed-images");

        deleteOldFiles("uploaded-pdfs");
        deleteOldFiles("converted-pdfs");

        deleteOldFiles("uploaded-word");
        deleteOldFiles("converted-word");

        deleteOldFiles("uploaded-excel");
        deleteOldFiles("converted-excel");

        deleteOldFiles("uploaded-powerpoint");
        deleteOldFiles("converted-powerpoint");

        deleteOldFiles("merged-pdfs");
        deleteOldFiles("split-pdfs");
        deleteOldFiles("rotated-pdfs");

        deleteOldFiles("cropped-images");
        deleteOldFiles("resized-images");

        System.out.println("========== File Cleanup Finished ==========");

    }

    private void deleteOldFiles(String folderName) {

        File folder = new File(
                System.getProperty("user.dir")
                        + File.separator
                        + folderName
        );

        if (!folder.exists()) {
            return;
        }

        File[] files = folder.listFiles();

        if (files == null) {
            return;
        }

        long currentTime = System.currentTimeMillis();

        for (File file : files) {

            if (!file.isFile()) {
                continue;
            }

            long age =
                    currentTime - file.lastModified();

            if (age > FILE_EXPIRY_TIME) {

                System.out.println(
                        "Deleting : "
                                + file.getAbsolutePath()
                );

                boolean deleted = file.delete();

                if (!deleted) {
                    file.deleteOnExit();
                }

            }

        }

    }

}