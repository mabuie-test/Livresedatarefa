import React from 'react';

export default function PricePreview({ price }){
  if(!price) return <div>Calculando preço...</div>;
  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <div className="text-sm text-gray-500">Base</div>
      <div className="text-lg font-semibold">{price.basePriceMZN} MZN</div>
      {price.urgencySurchargeMZN > 0 && (
        <div className="text-sm text-red-600">Surcharge urgência: +{price.urgencySurchargeMZN} MZN</div>
      )}
      <div className="mt-2 text-xl">Total: <span className="font-bold">{price.totalPriceMZN} MZN</span></div>
    </div>
  );
}
