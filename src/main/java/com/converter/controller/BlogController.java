package com.converter.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BlogController {

    @GetMapping("/blog")
    public String blog() {
        return "blog";
    }

    @GetMapping("/blog/pdf-merger-guide")
    public String pdfMergerGuide() {
        return "blog/pdf-merger-guide";
    }

    @GetMapping("/blog/pdf-splitter-guide")
    public String pdfSplitterGuide() {
        return "blog/pdf-splitter-guide";
    }

    @GetMapping("/blog/pdf-compressor-guide")
    public String pdfCompressorGuide() {
        return "blog/pdf-compressor-guide";
    }

    @GetMapping("/blog/pdf-to-word-guide")
    public String pdfToWordGuide() {
        return "blog/pdf-to-word-guide";
    }

    @GetMapping("/blog/word-to-pdf-guide")
    public String wordToPdfGuide() {
        return "blog/word-to-pdf-guide";
    }

    @GetMapping("/blog/pdf-to-image-guide")
    public String pdfToImageGuide() {
        return "blog/pdf-to-image-guide";
    }

    @GetMapping("/blog/image-to-pdf-guide")
    public String imageToPdfGuide() {
        return "blog/image-to-pdf-guide";
    }

    @GetMapping("/blog/pdf-crop-guide")
    public String pdfCropGuide() {
        return "blog/pdf-crop-guide";
    }

    @GetMapping("/blog/pdf-rotator-guide")
    public String pdfRotatorGuide() {
        return "blog/pdf-rotator-guide";
    }

    @GetMapping("/blog/pdf-page-remover-guide")
    public String pdfPageRemoverGuide() {
        return "blog/pdf-page-remover-guide";
    }

    @GetMapping("/blog/pdf-page-numbers-guide")
    public String pdfPageNumbersGuide() {
        return "blog/pdf-page-numbers-guide";
    }

    @GetMapping("/blog/pdf-watermark-guide")
    public String pdfWatermarkGuide() {
        return "blog/pdf-watermark-guide";
    }

    @GetMapping("/blog/pdf-unlocker-guide")
    public String pdfUnlockerGuide() {
        return "blog/pdf-unlocker-guide";
    }

    @GetMapping("/blog/pdf-protector-guide")
    public String pdfProtectorGuide() {
        return "blog/pdf-protector-guide";
    }

    @GetMapping("/blog/pdf-extract-text-guide")
    public String pdfExtractTextGuide() {
        return "blog/pdf-extract-text-guide";
    }

    @GetMapping("/blog/image-compressor-guide")
    public String imageCompressorGuide() {
        return "blog/image-compressor-guide";
    }

    @GetMapping("/blog/image-resizer-guide")
    public String imageResizerGuide() {
        return "blog/image-resizer-guide";
    }

    @GetMapping("/blog/jpg-png-converter-guide")
    public String jpgPngConverterGuide() {
        return "blog/jpg-png-converter-guide";
    }

    @GetMapping("/blog/excel-to-pdf-guide")
    public String excelToPdfGuide() {
        return "blog/excel-to-pdf-guide";
    }

    @GetMapping("/blog/powerpoint-to-pdf-guide")
    public String powerpointToPdfGuide() {
        return "blog/powerpoint-to-pdf-guide";
    }

}