package com.converter.config;

import java.io.File;

import org.jodconverter.core.office.OfficeManager;
import org.jodconverter.local.office.LocalOfficeManager;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OfficeConfig {

    @Bean(initMethod = "start", destroyMethod = "stop")
    public OfficeManager officeManager() {

        File officeHome;

        if (System.getProperty("os.name").toLowerCase().contains("win")) {

            officeHome = new File("C:\\Program Files\\LibreOffice");

        } else {

            officeHome = new File("/usr/lib/libreoffice");

        }

        return LocalOfficeManager.builder()
                .officeHome(officeHome)
                .install()
                .build();
    }
}