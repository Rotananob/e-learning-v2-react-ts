import { useEffect, useRef } from 'react';

interface VideoModalProps {
  src: string;
  onClose: () => void;
}

export default function VideoModal({ src, onClose }: VideoModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const autoSrc = src.includes('autoplay=1') ? src : src + (src.includes('?') ? '&' : '?') + 'autoplay=1';

  return (
    <div
      className="video-modal active"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="video-modal-content">
        <button className="close-btn" onClick={onClose} aria-label="Close">×</button>
        <div id="videoContainer">
          <iframe
            src={autoSrc}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Video Player"
          />
        </div>
      </div>
    </div>
  );
}
