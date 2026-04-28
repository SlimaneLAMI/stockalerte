'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { QrCode, Download, Loader2, ExternalLink } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function QRCodePage() {
  const { data: session }       = useSession();
  const [merchant, setMerchant] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [loading, setLoading]   = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { fetchMerchant(); }, []);

  async function fetchMerchant() {
    try {
      const { data } = await axios.get('/api/merchants/me');
      setMerchant(data.merchant);
      await generateQR(data.merchant._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function generateQR(id) {
    const { generateQRCodeDataURL } = await import('@/lib/qrcode');
    const url = `${window.location.origin}/fr/merchants/${id}`;
    const dataUrl = await generateQRCodeDataURL(url);
    setQrDataUrl(dataUrl);
  }

  async function downloadPDF() {
    if (!merchant) return;
    setGenerating(true);
    try {
      const { generateMerchantQRPDF } = await import('@/lib/pdf');
      await generateMerchantQRPDF({
        merchantName: merchant.businessName,
        merchantId:   merchant._id,
        logoUrl:      merchant.logo,
        appUrl:       window.location.origin,
      });
      toast.success('PDF généré avec succès !');
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la génération du PDF');
    } finally {
      setGenerating(false);
    }
  }

  const profileUrl = merchant ? `${typeof window !== 'undefined' ? window.location.origin : ''}/fr/merchants/${merchant._id}` : '';

  return (
    <DashboardLayout>
      <div className="max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">QR Code PDF</h1>
          <p className="text-gray-500 text-sm mt-1">
            Générez et téléchargez votre QR code à afficher en magasin
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
        ) : !merchant ? (
          <div className="card p-8 text-center">
            <QrCode className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Créez d'abord votre profil commerçant</p>
          </div>
        ) : (
          <>
            {/* Preview */}
            <div className="card p-8 text-center">
              <div className="bg-primary-500 text-white py-3 px-6 rounded-t-xl -mt-8 -mx-8 mb-6">
                <p className="font-bold text-lg">StockAlerte</p>
                <p className="text-primary-100 text-sm">Plateforme anti-gaspillage</p>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{merchant.businessName}</h2>

              {qrDataUrl && (
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-white rounded-2xl shadow-lg">
                    <img src={qrDataUrl} alt="QR Code" className="w-48 h-48" />
                  </div>
                </div>
              )}

              <p className="text-gray-600 dark:text-gray-400 mb-2">Scannez pour voir nos offres</p>
              <p className="text-xs text-gray-400 break-all">{profileUrl}</p>

              <a
                href={profileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary-600 text-sm mt-3 hover:underline"
              >
                Voir mon profil public <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={downloadPDF}
                disabled={generating}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {generating ? 'Génération...' : 'Télécharger le PDF'}
              </button>

              {qrDataUrl && (
                <a
                  href={qrDataUrl}
                  download={`qr-${merchant._id}.png`}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> PNG
                </a>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-blue-800 dark:text-blue-400 text-sm">
                💡 Imprimez ce QR code et affichez-le à l'entrée de votre magasin pour que vos clients puissent accéder directement à vos offres.
              </p>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
