"use client"
import { useState } from 'react';
import Button from './UI/Button';

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface CoordinateCheckerProps {
    coordinates: Coordinates | null;
    setCoordinates: (coords: Coordinates | null) => void;
}

export default function CoordinateChecker({ coordinates, setCoordinates }: CoordinateCheckerProps) {
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const getCoordinates = () => {
        setLoading(true);
        setError("");

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoordinates({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setLoading(false);
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setError("Location permission denied");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setError("Location information unavailable");
                        break;
                    case error.TIMEOUT:
                        setError("Location request timed out");
                        break;
                    default:
                        setError("An unknown error occurred");
                }
                setLoading(false);
            }
        );
    };

    return (
        <div className="space-y-3">
            <p className="font-semibold pt-4">Check your coordinates</p>

            {coordinates && (
                <div className="p-3 rounded-lg bg-brand-light/20 border border-brand-light">
                    <p className="text-sm font-medium">Latitude: {coordinates.latitude.toFixed(6)}</p>
                    <p className="text-sm font-medium">Longitude: {coordinates.longitude.toFixed(6)}</p>
                </div>
            )}

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}

            <Button onClick={getCoordinates} disabled={loading} type="button">
                {loading ? "Getting Location..." : "Check Coordinates"}
            </Button>
        </div>
    );
}