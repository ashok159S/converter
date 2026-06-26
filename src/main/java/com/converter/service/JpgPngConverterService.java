package com.converter.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;

import java.awt.image.BufferedImage;

import java.io.File;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class JpgPngConverterService {

    public Map<String,Object> convertImages(

            MultipartFile[] imageFiles,

            List<String> targetFormats

    ){

        Map<String,Object> result =
                new HashMap<>();

        try{

            List<Map<String,String>> files =
                    new ArrayList<>();

            File outputFolder =
                    new File(
                            "converted-images"
                    );

            if(!outputFolder.exists()){

                outputFolder.mkdirs();

            }

            for(
                    int i = 0;
                    i < imageFiles.length;
                    i++
            ){

                MultipartFile imageFile =
                        imageFiles[i];

                String targetFormat =
                        targetFormats.get(i)
                                     .toLowerCase();

                String originalName =
                        imageFile.getOriginalFilename();

                if(
                        originalName == null
                        ||
                        originalName.isBlank()
                ){

                    originalName =
                            "image.jpg";

                }

                String originalFormat =
                        originalName.substring(
                                originalName.lastIndexOf(".")
                                + 1
                        ).toUpperCase();

                String baseName =
                        originalName.replaceAll(
                                "\\.[^.]+$",
                                ""
                        );

                File tempInput =
                        File.createTempFile(
                                UUID.randomUUID().toString(),
                                ".tmp"
                        );

                imageFile.transferTo(
                        tempInput
                );

                BufferedImage image =
                        ImageIO.read(
                                tempInput
                        );

                if(image == null){

                    throw new RuntimeException(
                            "Invalid image: "
                            + originalName
                    );

                }

                File outputFile =
                        new File(
                                outputFolder,
                                baseName
                                +
                                "."
                                +
                                targetFormat
                        );

                if(
                        "jpg".equals(
                                targetFormat
                        )
                        ||
                        "jpeg".equals(
                                targetFormat
                        )
                ){

                    BufferedImage rgbImage =
                            new BufferedImage(
                                    image.getWidth(),
                                    image.getHeight(),
                                    BufferedImage.TYPE_INT_RGB
                            );

                    rgbImage.createGraphics()
                            .drawImage(
                                    image,
                                    0,
                                    0,
                                    null
                            );

                    ImageIO.write(
                            rgbImage,
                            "jpg",
                            outputFile
                    );

                }
                else{

                    ImageIO.write(
                            image,
                            "png",
                            outputFile
                    );

                }

                Map<String,String> fileInfo =
                        new HashMap<>();

                fileInfo.put(
                        "name",
                        outputFile.getName()
                );

                fileInfo.put(
                        "originalFormat",
                        originalFormat
                );

                fileInfo.put(
                        "convertedFormat",
                        targetFormat.toUpperCase()
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

                tempInput.delete();

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