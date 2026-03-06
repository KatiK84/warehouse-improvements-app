import { useRef } from 'react';

export default function ImportExportBar({ onExportJson, onImportJson, onExportIdeas, onExportRanking, onExportRedemptions }) {
  const inputRef = useRef(null);

  return (
    <div className="io-bar">
      <div className="io-actions">
        <button type="button" onClick={onExportJson}>Экспорт JSON</button>
        <button type="button" onClick={() => inputRef.current?.click()}>Импорт JSON</button>
        <button type="button" onClick={onExportIdeas}>Идеи в CSV</button>
        <button type="button" onClick={onExportRanking}>Рейтинг в CSV</button>
        <button type="button" onClick={onExportRedemptions}>Обмены в CSV</button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        className="hidden-input"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onImportJson(file);
          event.target.value = '';
        }}
      />
    </div>
  );
}
