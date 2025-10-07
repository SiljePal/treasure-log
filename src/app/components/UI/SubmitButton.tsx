'use client'

type SubmitButtonProps = {
    children: React.ReactNode;
    type?: "submit" | "button" | "reset";
    disabled?: boolean;
};

export default function SubmitButton({ children, type = "submit", disabled = false }: SubmitButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled}
            className="px-6 py-3 rounded-xl font-bold text-lg shadow-xl transition-colors w-full bg-brand-deep text-bg-base hover:bg-brand-medium hover:shadow-2xl active:bg-brand-medium/90 focus:outline-none focus:ring-2 focus:ring-brand-deep focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-deep disabled:hover:shadow-xl mt-6"
        >
            {children}
        </button>
    );
}