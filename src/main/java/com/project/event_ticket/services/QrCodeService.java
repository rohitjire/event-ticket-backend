package com.project.event_ticket.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.project.event_ticket.domain.entity.QrCode;
import com.project.event_ticket.domain.entity.Ticket;
import com.project.event_ticket.domain.enums.QrCodeStatus;
import com.project.event_ticket.exceptions.QrCodeGenerationException;
import com.project.event_ticket.exceptions.QrCodeNotFoundException;
import com.project.event_ticket.repository.QrCodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class QrCodeService {

    private static final int QR_CODE_HEIGHT = 250;
    private static final int QR_CODE_WIDTH = 250;

    private final QRCodeWriter qrCodeWriter;
    private final QrCodeRepository qrCodeRepository;

    public QrCode generateQrCode(Ticket ticket) {
        UUID uniqueId = UUID.randomUUID();

        try {
            String qrCodeImage = generateQrCodeImage(uniqueId);

            QrCode qrCode = new QrCode();
            qrCode.setId(uniqueId);
            qrCode.setStatus(QrCodeStatus.ACTIVE);
            qrCode.setValue(qrCodeImage);
            qrCode.setTicket(ticket);

            return qrCodeRepository.saveAndFlush(qrCode);


        } catch (IOException | WriterException ex) {
            throw new QrCodeGenerationException("Failed to generate QR code", ex);
        }
    }

    private String generateQrCodeImage(UUID uniqueId) throws WriterException, IOException {
        BitMatrix bitMatrix = qrCodeWriter
                .encode(uniqueId.toString(), BarcodeFormat.QR_CODE, QR_CODE_WIDTH, QR_CODE_HEIGHT);

        BufferedImage bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix);

        try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {
            ImageIO.write(bufferedImage, "png", byteArrayOutputStream);
            byte[] imageByteArray = byteArrayOutputStream.toByteArray();
            return Base64.getEncoder().encodeToString(imageByteArray);
        }
    }

    public byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId) {
        QrCode qrCode = qrCodeRepository.findByTicketIdAndTicketPurchaserId(ticketId, userId)
                .orElseThrow(QrCodeNotFoundException::new);

        try {
            return Base64.getDecoder().decode(qrCode.getValue());
        } catch (IllegalArgumentException ex) {
            log.error("Invalid base64 QR Code for ticket ID: {}", ticketId, ex);
            throw new QrCodeNotFoundException();
        }
    }
}
