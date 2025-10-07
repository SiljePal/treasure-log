"use client"
import { useState } from 'react';
import SubmitButton from './UI/SubmitButton';
import CoordinateChecker from './CoordinateChecker';
import PhotoCapture from './PhotoCapture';

interface Coordinates {
    latitude: number;
    longitude: number;
}

export default function TreasureCard() {
    const [image, setImage] = useState<string | null>(null);
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        if (!email) {
            setSubmitMessage('Please enter an email address');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/send-treasure', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    description,
                    coordinates,
                    image,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setSubmitMessage('Email sent successfully! 🎉');
                // Reset form
                setImage(null);
                setCoordinates(null);
                setDescription('');
                setEmail('');
            } else {
                setSubmitMessage('Failed to send email. Please try again.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            setSubmitMessage('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <article className="max-w-md mx-auto p-6 space-y-4 rounded-xl shadow-2xl bg-bg-base text-brand-deep border-2 border-brand-light/80">
                {/* Take Picture */}
                <PhotoCapture image={image} setImage={setImage} />

                {/* Write Description */}
                <p className="font-semibold pt-4">Write a description of your treasure</p>
                <textarea
                    name="treasure-description"
                    id="treasure-description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A detailed description..."
                    className="w-full p-3 rounded-lg border-2 bg-white text-brand-deep border-accent-blue/50 focus:ring-brand-medium focus:border-brand-medium"
                ></textarea>

                {/* Check Coordinates */}
                <CoordinateChecker coordinates={coordinates} setCoordinates={setCoordinates} />

                {/* Email Input */}
                <p className="font-semibold pt-4">Choose an email to send everything to</p>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                    className="w-full p-3 rounded-lg border-2 bg-white text-brand-deep border-accent-blue/50 focus:ring-brand-medium focus:border-brand-medium"
                />

                {/* Submit Message */}
                {submitMessage && (
                    <p className={`text-sm font-medium ${submitMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                        {submitMessage}
                    </p>
                )}

                {/* Submit Button */}
                <SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Email'}
                </SubmitButton>
            </article>
        </form>
    );
}