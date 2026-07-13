package com.converter.config;

import org.jodconverter.core.office.OfficeManager;
import org.jodconverter.local.office.LocalOfficeManager;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OfficeConfig {

    @Bean(initMethod = "start", destroyMethod = "stop")
    public OfficeManager officeManager() {

        return LocalOfficeManager.builder()

                .officeHome(
                        "C:\\Program Files\\LibreOffice"
                )

                .install()

                .build();

    }

}