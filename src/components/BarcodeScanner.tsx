import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Camera, CameraOff, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface BarcodeScannerProps {
  onScan: (isbn: string) => void;
  onError?: (error: string) => void;
  bulkMode?: boolean;
  scannedCount?: number;
}

export function BarcodeScanner({ onScan, onError, bulkMode = false, scannedCount = 0 }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const scannedIsbnsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    
    readerRef.current.listVideoInputDevices().then((videoInputDevices) => {
      setDevices(videoInputDevices);
      if (videoInputDevices.length > 0) {
        const backCamera = videoInputDevices.find(
          (device) => device.label.toLowerCase().includes('back') || 
                      device.label.toLowerCase().includes('rear')
        );
        setSelectedDeviceId(backCamera?.deviceId || videoInputDevices[0].deviceId);
      }
    }).catch((err) => {
      console.error('Error listing devices:', err);
    });

    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    if (!readerRef.current || !videoRef.current || !selectedDeviceId) return;

    try {
      setIsActive(true);
      setHasPermission(true);
      scannedIsbnsRef.current.clear();

      await readerRef.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, error) => {
          if (result) {
            const text = result.getText();
            // Check if it's a valid ISBN (EAN-13 starting with 978/979 or ISBN-10)
            if (/^(978|979)\d{10}$/.test(text) || /^\d{10}$/.test(text)) {
              // Prevent duplicate scans of the same ISBN
              if (!scannedIsbnsRef.current.has(text)) {
                scannedIsbnsRef.current.add(text);
                setLastScanned(text);
                setShowSuccess(true);
                onScan(text);
                
                // Hide success indicator after a short delay
                setTimeout(() => setShowSuccess(false), 1500);
                
                // In single mode, stop scanning after one successful scan
                if (!bulkMode) {
                  stopScanning();
                }
              }
            }
          }
          if (error && !(error instanceof NotFoundException)) {
            console.error('Scan error:', error);
          }
        }
      );
    } catch (err: any) {
      console.error('Camera error:', err);
      setHasPermission(false);
      setIsActive(false);
      onError?.('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopScanning = () => {
    if (readerRef.current) {
      readerRef.current.reset();
    }
    setIsActive(false);
    scannedIsbnsRef.current.clear();
  };

  const switchCamera = () => {
    if (devices.length <= 1) return;
    
    const currentIndex = devices.findIndex(d => d.deviceId === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    setSelectedDeviceId(devices[nextIndex].deviceId);
    
    if (isActive) {
      stopScanning();
      setTimeout(startScanning, 100);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-square max-w-[300px] mx-auto overflow-hidden rounded-xl bg-muted border-2 border-dashed border-border">
        {isActive ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            {/* Scanning overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-8 border-2 border-bookhive-amber rounded-lg" />
              <div className="absolute inset-8 animate-pulse">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-bookhive-amber rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-bookhive-amber rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-bookhive-amber rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-bookhive-amber rounded-br-lg" />
              </div>
            </div>
            
            {/* Success flash overlay */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-bookhive-forest/80 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="bg-primary-foreground rounded-full p-4"
                  >
                    <Check className="w-8 h-8 text-bookhive-forest" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Bulk mode counter */}
            {bulkMode && scannedCount > 0 && (
              <div className="absolute top-3 right-3 bg-bookhive-amber text-bookhive-brown px-3 py-1 rounded-full text-sm font-semibold">
                {scannedCount} scanned
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
            {hasPermission === false ? (
              <>
                <CameraOff className="w-12 h-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  Camera access denied
                </p>
              </>
            ) : (
              <>
                <Camera className="w-12 h-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  {bulkMode ? 'Scan multiple book barcodes' : 'Point camera at book barcode'}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-2">
        {isActive ? (
          <>
            <Button variant="outline" onClick={stopScanning}>
              {bulkMode ? 'Done Scanning' : 'Stop Scanning'}
            </Button>
            {devices.length > 1 && (
              <Button variant="ghost" size="icon" onClick={switchCamera}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
          </>
        ) : (
          <Button variant="amber" onClick={startScanning} className="gap-2">
            <Camera className="w-4 h-4" />
            Start Camera
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {bulkMode 
          ? 'Keep scanning - each new barcode will be added automatically'
          : 'Position the ISBN barcode within the frame'
        }
      </p>
    </div>
  );
}
