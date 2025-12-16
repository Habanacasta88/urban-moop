
import { useState } from 'react';

export const ImageWithFallback = ({ src, alt, className, ...props }) => {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div className={`flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-400 font-medium ${className}`} {...props}>
                <span>No Image</span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
            {...props}
        />
    );
};
