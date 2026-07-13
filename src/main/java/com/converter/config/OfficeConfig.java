package com.converter.config;

import org.jodconverter.core.office.OfficeManager;
import org.jodconverter.local.office.LocalOfficeManager;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OfficeConfig {

    @Bean(initMethod = "start", destroyMethod = "stop")
    public OfficeManager officeManager() {

        String os = System.getProperty("os.name").toLowerCase();

        LocalOfficeManager.Builder builder = LocalOfficeManager.builder();

        // Only set officeHome on Windows
        if (os.contains("win")) {

            builder.officeHome("C:\\Program Files\\LibreOffice");

        }

        return builder
                .install()
                .build();
    }

}