// export function Button({ children, onClick }) {
//   return (
//     <button className="px-4 py-2 bg-white text-black rounded" onClick={onClick}>
//       {children}
//     </button>
//   );
// }

// En components/ui/button.js
export function Button({ children, onClick, variant = "primary" }) {
  const style = {
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    border: 'none',
    ...variant === "primary" 
      ? { background: '#000000', color: '#FFFFFF' } 
      : { background: '#FFFFFF', color: '#000000', border: '1px solid #E0E0E0' }
  };
  
  return (
    <button style={style} onClick={onClick}>
      {children}
    </button>
  );
}