package com.converter.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(
            MaxUploadSizeExceededException.class
    )
    public ResponseEntity<Map<String,Object>>
    handleMaxUploadSize(){

        Map<String,Object> result =
                new HashMap<>();

        result.put(
                "success",
                false
        );

        result.put(
                "message",
                "Maximum file size is 50 MB."
        );

        return ResponseEntity
                .badRequest()
                .body(result);

    }

}
