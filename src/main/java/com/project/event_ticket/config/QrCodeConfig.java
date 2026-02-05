package com.project.event_ticket.config;

import com.google.zxing.qrcode.QRCodeWriter;
import com.project.event_ticket.services.QrCodeService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QrCodeConfig {

    @Bean
    public QRCodeWriter qrCodeWriter() {
        return new QRCodeWriter();
    }
}
