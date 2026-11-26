import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { isSafeMediaUrl } from '../context/SchoolContext';

interface SchoolImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const SchoolImage: React.FC<SchoolImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackTitle,
}) => {
  const [failed, setFailed] = useState(false);
  const valid = Boolean(src && isSafeMediaUrl(src) && !failed);

  if (!valid) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full bg-gradient-to-br from-[#081C3E] via-[#0E3168] to-[#081326] flex flex-col items-center justify-center p-6 text-center text-white"
      >
        <ImageIcon className="w-8 h-8 text-[#F0C95A] mb-2" aria-hidden="true" />
        <p className="text-xs font-medium tracking-wide text-slate-200 max-w-xs">
          {fallbackTitle || alt}
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
