'use client';

import { ValidationResult } from '@/lib/validation';

interface Props {
  result: ValidationResult;
  onClose: () => void;
  onDownloadAnyway: () => void;
}

export default function ValidationPanel({ result, onClose, onDownloadAnyway }: Props) {
  const { errors, warnings } = result;

  return (
    <div className="validation-overlay">
      <div className="validation-modal">
        <div className="validation-header">
          <h2 className="validation-title">
            {errors.length > 0 ? '⚠️ Before you download' : '✅ Almost ready'}
          </h2>
          <button onClick={onClose} className="icon-btn">✕</button>
        </div>

        {errors.length > 0 && (
          <div className="validation-section">
            <h3 className="validation-section-label error">Required</h3>
            <ul className="validation-list">
              {errors.map((e, i) => (
                <li key={i} className="validation-item error">
                  <span className="validation-dot error" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="validation-section">
            <h3 className="validation-section-label warning">Suggestions</h3>
            <ul className="validation-list">
              {warnings.map((w, i) => (
                <li key={i} className="validation-item warning">
                  <span className="validation-dot warning" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="validation-actions">
          <button onClick={onClose} className="validation-btn-primary">
            {errors.length > 0 ? 'Fix Issues' : 'Review & Close'}
          </button>
          {warnings.length > 0 && errors.length === 0 && (
            <button onClick={onDownloadAnyway} className="validation-btn-secondary">
              Download Anyway
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
