import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { X } from 'lucide-react';

interface BarcodeScannerModalProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      },
      false
    );

    let isScanning = true;

    scanner.render(
      (text) => {
        if (isScanning) {
          isScanning = false;
          onScan(text);
          scanner.clear();
          onClose();
        }
      },
      (err) => {
        // Ignorar erros normais de leitura por frame
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [onScan, onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
      <div className="bg-[#0A0A0A] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-[#27272A] flex justify-between items-center bg-[#0A0A0A]">
          <h3 className="text-xl font-bold text-[#FFFFFF]">Escanear Código</h3>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-[#B4B4B4] transition-colors bg-[#0A0A0A] rounded-md border border-[#27272A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 bg-[#000000] text-white flex flex-col items-center">
          <div id="reader" className="w-full max-w-sm rounded overflow-hidden"></div>
          {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
          <p className="text-sm mt-4 text-slate-400 text-center">
            Aponte a câmera para o código de barras ou QR code do produto.
          </p>
        </div>
      </div>
    </div>
  );
};
