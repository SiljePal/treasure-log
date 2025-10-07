"use client"
import { useRef } from 'react';
import Image from 'next/image';
import Button from './UI/Button';

interface PhotoCaptureProps {
    image: string | null;
    setImage: (image: string | null) => void;
}

export default function PhotoCapture({ image, setImage }: PhotoCaptureProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTakePicture = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRetake = () => {
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-3">
            <p className="font-semibold pt-4">Take a picture of your treasure</p>

            {image && (
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
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
            />

            <Button onClick={handleTakePicture} type="button">
                {image ? "Change Picture" : "Take Picture"}
            </Button>
        </div>
    );
}