"use client"

interface EmailSenderProps {
    email: string;
    setEmail: (email: string) => void;
    submitMessage: string;
    sentToEmail: string;
}

export default function EmailSender({
    email,
    setEmail,
    submitMessage,
    sentToEmail
}: EmailSenderProps) {
    return (
        <div className="space-y-4">
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
                <div className={`p-4 rounded-lg ${submitMessage === 'success' ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
                    {submitMessage === 'success' ? (
                        <div className="space-y-2">
                            <p className="text-green-700 font-semibold">Email sent successfully! 🎉</p>
                            <p className="text-green-600 text-sm">
                                Sent to: <span className="font-medium">{sentToEmail}</span>
                            </p>
                            <p className="text-green-600 text-xs italic">
                                This form will reset in 5 seconds...
                            </p>
                        </div>
                    ) : (
                        <p className="text-red-700 font-medium">{submitMessage}</p>
                    )}
                </div>
            )}
        </div>
    );
}