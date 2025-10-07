'use client'

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
};

export default function Button({ children, onClick, disabled = false, type = "button" }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            type={type}
            className="px-4 py-2 rounded-lg font-medium shadow-md transition-colors w-full bg-accent-blue text-brand-deep hover:bg-secondary-medium/90 hover:text-brand-deep active:bg-accent-blue/80 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent-blue"
        >
            {children}
        </button>
    );
}