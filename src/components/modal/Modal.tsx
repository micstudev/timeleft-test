import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" onClick={handleOverlayClick}>
      {/* Overlay */}
      <div className="absolute inset-0  " onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 z-10">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>

        {/* Title */}
        {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
