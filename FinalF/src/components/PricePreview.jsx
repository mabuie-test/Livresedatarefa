import React from 'react';
export default function PricePreview({price}) {
  if(!price) return null;
  return (
    <div className="card">
      <div><strong>Base (MZN):</strong> {price.basePriceMZN}</div>
      <div><strong>Urgência (MZN):</strong> {price.urgencySurchargeMZN}</div>
      <div><strong>Total (MZN):</strong> {price.totalPriceMZN}</div>
    </div>
  );
}
