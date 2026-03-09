export function AchModal({ pending, onSend, onClose }) {
  if (!pending) return null;

  const { id, name, amount } = pending;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0c1117',
          border: '1px solid rgba(30,58,95,.3)',
          borderRadius: 16,
          padding: 24,
          margin: 20,
          maxWidth: 320,
          width: '100%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
          Send ACH Form
        </div>
        <div style={{ fontSize: 12, color: '#475569', marginBottom: 20 }}>
          {name}
        </div>

        <button
          style={{
            width: '100%',
            padding: 16,
            background: 'rgba(74,222,128,.1)',
            border: '1px solid rgba(74,222,128,.25)',
            color: '#4ade80',
            fontSize: 15,
            fontWeight: 700,
            borderRadius: 10,
            marginBottom: 10,
            cursor: 'pointer',
          }}
          onClick={() => onSend(id, name, amount, true)}
        >
          With Balance ({amount})
        </button>

        <button
          style={{
            width: '100%',
            padding: 16,
            background: 'rgba(56,189,248,.1)',
            border: '1px solid rgba(56,189,248,.25)',
            color: '#38bdf8',
            fontSize: 15,
            fontWeight: 700,
            borderRadius: 10,
            marginBottom: 10,
            cursor: 'pointer',
          }}
          onClick={() => onSend(id, name, amount, false)}
        >
          Send Blank
        </button>

        <button
          style={{
            width: '100%',
            padding: 12,
            background: 'transparent',
            border: '1px solid rgba(30,58,95,.3)',
            color: '#475569',
            fontSize: 13,
            borderRadius: 10,
            cursor: 'pointer',
          }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
