import React from 'react';
export default function Footer(){
  return (
    <footer className="footer">
      <div style={{maxWidth:1100,margin:'0 auto',display:'flex',flexDirection:'column',gap:6}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap'}}>
          <div style={{fontWeight:700}}>Livresedatarefa</div>
          <div style={{color:'#6b7280'}}>Contacto: suporte@livresedatarefa.tld</div>
        </div>
        <div style={{fontSize:13,color:'#6b7280'}}>© {new Date().getFullYear()} Livresedatarefa — Mpesa/Emola instructions included on invoice</div>
      </div>
    </footer>
  );
}
