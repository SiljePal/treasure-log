"use client"
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import SubmitButton from './UI/SubmitButton';
import CoordinateChecker from './CoordinateChecker';
import PhotoCapture from './PhotoCapture';
import EmailSender from './EmailSender';

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
    const [sentToEmail, setSentToEmail] = useState('');

    // Initialize EmailJS
    useEffect(() => {
        emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);
    }, []);

    // Timer to clear success message and reset form after 5 seconds
    useEffect(() => {
        if (submitMessage.includes('success')) {
            const timer = setTimeout(() => {
                setSubmitMessage('');
                setSentToEmail('');
                // Reset form
                setImage(null);
                setCoordinates(null);
                setDescription('');
                setEmail('');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [submitMessage]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');
        setSentToEmail('');

        // Validation
        if (!email) {
            setSubmitMessage('Please enter an email address');
            setIsSubmitting(false);
            return;
        }

        if (!image && !description && !coordinates) {
            setSubmitMessage('Please add at least a picture, description, or coordinates');
            setIsSubmitting(false);
            return;
        }

        try {
            // Prepare template parameters
            const templateParams = {
                to_email: email,
                description: description || 'No description provided',
                latitude: coordinates?.latitude?.toFixed(6) || 'N/A',
                longitude: coordinates?.longitude?.toFixed(6) || 'N/A',
                map_link: coordinates
                    ? `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`
                    : 'https://www.google.com/maps',
                image: image || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
            };

            // Send email using EmailJS
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                templateParams
            );

            setSentToEmail(email);
            setSubmitMessage('success');
        } catch (error) {
            console.error('Email send error:', error);

            // Provide specific error message
            if (error && typeof error === 'object') {
                const err = error as { text?: string; message?: string };
                let errorMessage = 'Failed to send email. ';
                if (err.text) {
                    errorMessage += err.text;
                } else if (err.message) {
                    errorMessage += err.message;
                } else {
                    errorMessage += 'Please try again.';
                }
                setSubmitMessage(errorMessage);
            } else {
                setSubmitMessage('Failed to send email. Please try again.');
            }
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

                {/* Email Sender */}
                <EmailSender
                    email={email}
                    setEmail={setEmail}
                    submitMessage={submitMessage}
                    sentToEmail={sentToEmail}
                />

                {/* Submit Button */}
                <SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Email'}
                </SubmitButton>
            </article>
        </form>
    );
}