import React, { useState, useEffect, useRef } from 'react';

export interface ModalConfig {
  type: 'prompt' | 'confirm';
  title: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  onConfirm: (value: string) => void;
  onCancel?: () => void;
}

interface CustomModalProps {
  config: ModalConfig;
  onClose: () => void;
}

export default function CustomModal({ config, onClose }: CustomModalProps) {
  const [value, setValue] = useState(config.defaultValue ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (config.type === 'prompt' && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [config.type]);

  const handleConfirm = () => {
    config.onConfirm(value);
    onClose();
  };

  const handleCancel = () => {
    if (config.onCancel) config.onCancel();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-[3px] animate-fade-in">
      <div
        className="bg-white rounded-xl shadow-xl border border-[var(--color-border)] w-[400px] max-w-[90%] overflow-hidden animate-scale-up"
        onKeyDown={handleKeyDown}
      >
        <div className="p-5">
          <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-1">
            {config.title}
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mb-4">
            {config.message}
          </p>

          {config.type === 'prompt' && (
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={config.placeholder}
              className="w-full text-sm border-b border-[var(--color-border-strong)] focus:border-[var(--color-primary)] outline-none py-1 bg-transparent font-mono transition-colors duration-100"
            />
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 py-3.5 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
          <button
            onClick={handleCancel}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors duration-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white transition-colors duration-100"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
