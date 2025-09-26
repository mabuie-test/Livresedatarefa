import React from 'react';
export default function PricePreview({ price }){
  if(!price) return <div className="card small">Preço indisponível</div>;
  return (
    <div className="card small">
      <div style={{display:'flex',justifyContent:'space-between'}}><div className="small">Base</div><div>{price.basePriceMZN} MZN</div></div>
      {price.urgencySurchargeMZN > 0 && <div style={{display:'flex',justifyContent:'space-between'}}><div className="small">Urgência</div><div>+{price.urgencySurchargeMZN} MZN</div></div>}
      <hr style={{margin:'8px 0'}} />
      <div style={{display:'flex',justifyContent:'space-between',fontWeight:700}}>Total<div>{price.totalPriceMZN} MZN</div></div>
    </div>
  );
}
