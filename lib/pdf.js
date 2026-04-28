'use client';

export async function generateMerchantQRPDF({ merchantName, merchantId, logoUrl, appUrl }) {
  const { jsPDF } = await import('jspdf');

  const profileUrl = `${appUrl}/merchants/${merchantId}`;
  const { generateQRCodeDataURL } = await import('./qrcode');
  const qrDataUrl = await generateQRCodeDataURL(profileUrl);

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();

  // Background
  doc.setFillColor(249, 115, 22);
  doc.rect(0, 0, pageW, 60, 'F');

  // App name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('StockAlerte', pageW / 2, 30, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Plateforme anti-gaspillage', pageW / 2, 42, { align: 'center' });

  // Merchant name
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(merchantName, pageW / 2, 85, { align: 'center' });

  // QR Code
  const qrSize = 100;
  const qrX = (pageW - qrSize) / 2;
  doc.addImage(qrDataUrl, 'PNG', qrX, 95, qrSize, qrSize);

  // Instructions
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Scannez pour voir nos offres', pageW / 2, 205, { align: 'center' });

  // URL
  doc.setFontSize(10);
  doc.setTextColor(156, 163, 175);
  doc.text(profileUrl, pageW / 2, 215, { align: 'center' });

  // Footer
  doc.setFillColor(249, 115, 22);
  doc.rect(0, 270, pageW, 27, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('www.stockalerte.dz', pageW / 2, 284, { align: 'center' });

  doc.save(`stockalerte-qr-${merchantId}.pdf`);
}
