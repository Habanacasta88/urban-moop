export const LoadingSpinner = ({ message = "Cargando...", size = "md" }) => {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16"
    };

    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className={`${sizeClasses[size]} rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin mb-4`}></div>
            {message && <p className="text-sm text-muted font-medium">{message}</p>}
        </div>
    );
};
