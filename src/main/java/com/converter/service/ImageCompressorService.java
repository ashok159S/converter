package com.converter.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;

import java.awt.image.BufferedImage;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ImageCompressorService {

    public Map<String,Object> compressImages(

            MultipartFile[] imageFiles,

            String compressionLevel,

            int quality

    ){

        Map<String,Object> result =
                new HashMap<>();

        try{

            List<Map<String,String>> files =
                    new ArrayList<>();

            File outputFolder =
                    new File(
                            "compressed-images"
                    );

            if(!outputFolder.exists()){

                outputFolder.mkdirs();

            }

            for(
                    MultipartFile imageFile
                    :
                    imageFiles
            ){

                String originalName =
                        imageFile.getOriginalFilename();

                if(
                        originalName == null
                ){

                    originalName =
                            "image.jpg";

                }

                String extension =
                        originalName.substring(
                                originalName.lastIndexOf(".") + 1
                        );

                String baseName =
                        originalName.substring(
                                0,
                                originalName.lastIndexOf(".")
                        );

                File tempInput =
                        File.createTempFile(
                                UUID.randomUUID().toString(),
                                "." + extension
                        );

                imageFile.transferTo(
                        tempInput
                );

                BufferedImage image =
                        ImageIO.read(
                                tempInput
                        );

                File outputFile =
                        new File(
                                outputFolder,
                                baseName
                                        +
                                        "-compressed."
                                        +
                                        extension
                        );

                float compressionQuality =
                        quality / 100f;

                if(
                        extension.equalsIgnoreCase("jpg")
                        ||
                        extension.equalsIgnoreCase("jpeg")
                ){

                    Iterator<ImageWriter> writers =
                            ImageIO.getImageWritersByFormatName(
                                    "jpg"
                            );

                    ImageWriter writer =
                            writers.next();

                    ImageOutputStream ios =
                            ImageIO.createImageOutputStream(
                                    outputFile
                            );

                    writer.setOutput(
                            ios
                    );

                    ImageWriteParam param =
                            writer.getDefaultWriteParam();

                    param.setCompressionMode(
                            ImageWriteParam.MODE_EXPLICIT
                    );

                    param.setCompressionQuality(
                            compressionQuality
                    );

                    writer.write(
                            null,
                            new IIOImage(
                                    image,
                                    null,
                                    null
                            ),
                            param
                    );

                    ios.close();

                    writer.dispose();

                }
                else{

                    ImageIO.write(
                            image,
                            extension,
                            outputFile
                    );

                }

                double originalSize =
                        imageFile.getSize()
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

                Map<String,String> fileInfo =
                        new HashMap<>();

                fileInfo.put(
                        "name",
                        outputFile.getName()
                );

                fileInfo.put(
                        "originalSize",
                        String.format(
                                "%.2f",
                                originalSize
                        )
                );

                fileInfo.put(
                        "compressedSize",
                        String.format(
                                "%.2f",
                                compressedSize
                        )
                );

                fileInfo.put(
                        "saved",
                        String.format(
                                "%.2f",
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