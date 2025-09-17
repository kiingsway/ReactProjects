import React from 'react';

export default function Header(): React.JSX.Element {

  const style: React.CSSProperties = {
    padding: 8,
    backgroundColor: '#3B3B3B'
  };

  return (
    <div style={style}>
      <h1 style={{ padding: 0, margin: 0 }}>Addct App</h1>
    </div>
  );
}