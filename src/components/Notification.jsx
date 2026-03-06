export default function Notification({ notice, onClose }) {
  if (!notice) return null;

  return (
    <div className={`notice ${notice.type}`}>
      <span>{notice.message}</span>
      <button type="button" onClick={onClose}>
        Закрыть
      </button>
    </div>
  );
}
