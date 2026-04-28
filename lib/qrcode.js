import QRCode from 'qrcode';

export async function generateQRCodeDataURL(url, options = {}) {
  return await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: { dark: '#1f2937', light: '#ffffff' },
    ...options,
  });
}

export async function generateQRCodeSVG(url) {
  return await QRCode.toString(url, { type: 'svg' });
}
