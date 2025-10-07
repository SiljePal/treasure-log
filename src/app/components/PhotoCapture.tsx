"use client"
import { useRef, useState } from 'react';
import Image from 'next/image';
import Button from './UI/Button';

interface PhotoCaptureProps {
    image: string | null;
    setImage: (image: string | null) => void;
}

// EmailJS has a 50KB limit for ALL variables, so we need aggressive compression
const MAX_IMAGE_SIZE = 35 * 1024; // 35KB to leave room for other email content
const MAX_WIDTH = 600;
const MAX_HEIGHT = 600;
const JPEG_QUALITY = 0.6;

export default function PhotoCapture({ image, setImage }: PhotoCaptureProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [compressionInfo, setCompressionInfo] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleTakePicture = () => {
        fileInputRef.current?.click();
    };

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const originalSizeKB = Math.round(file.size / 1024);
            const reader = new FileReader();

            reader.onload = (e) => {
                const result = e.target?.result;
                if (!result || typeof result !== 'string') {
                    reject(new Error('Failed to read file'));
                    return;
                }

                const img = new window.Image();

                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;

                        // Calculate new dimensions while maintaining aspect ratio
                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height = Math.round((height * MAX_WIDTH) / width);
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width = Math.round((width * MAX_HEIGHT) / height);
                                height = MAX_HEIGHT;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;

                        const ctx = canvas.getContext('2d');
                        if (!ctx) {
                            reject(new Error('Failed to get canvas context'));
                            return;
                        }

                        ctx.drawImage(img, 0, 0, width, height);

                        // Convert to JPEG with compression
                        let quality = JPEG_QUALITY;
                        let compressedImage = canvas.toDataURL('image/jpeg', quality);

                        // If still too large, reduce quality further
                        let attempts = 0;
                        while (compressedImage.length > MAX_IMAGE_SIZE && quality > 0.2 && attempts < 15) {
                            quality -= 0.03;
                            compressedImage = canvas.toDataURL('image/jpeg', quality);
                            attempts++;
                        }

                        if (compressedImage.length > MAX_IMAGE_SIZE) {
                            reject(new Error('Unable to compress image small enough. Please try a different photo or take a simpler picture.'));
                            return;
                        }

                        const finalSizeKB = Math.round((compressedImage.length * 0.75) / 1024);
                        setCompressionInfo(`${originalSizeKB}KB → ${finalSizeKB}KB (quality: ${Math.round(quality * 100)}%)`);

                        resolve(compressedImage);
                    } catch (err) {
                        reject(err);
                    }
                };

                img.onerror = () => {
                    reject(new Error('Failed to load image'));
                };

                img.src = result;
            };

            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);

        try {
            const compressedImage = await compressImage(file);
            setImage(compressedImage);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to process image. Please try a different photo.';
            alert(errorMessage);
            setCompressionInfo('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRetake = () => {
        setImage(null);
        setCompressionInfo('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-3">
            <p className="font-semibold pt-4">Take a picture of your treasure</p>

            {isProcessing && (
                <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-700">Processing image...</p>
                </div>
            )}

            {image && !isProcessing && (
                <div className="space-y-2">
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border-2 border-brand-light">
                        <Image
                            src={image}
                            alt="Captured treasure"
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleRetake}
                            className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600 transition-colors z-10"
                        >
                            Retake
                        </button>
                    </div>
                    {compressionInfo && (
                        <p className="text-xs text-gray-600 italic">
                            📦 Image optimized: {compressionInfo}
                        </p>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
            />

            <Button onClick={handleTakePicture} type="button" disabled={isProcessing}>
                {isProcessing ? "Processing..." : image ? "Change Picture" : "Take Picture"}
            </Button>
        </div>
    );
}