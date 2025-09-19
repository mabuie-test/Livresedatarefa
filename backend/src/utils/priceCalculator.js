// Função simples de cálculo de preço (pode ser ajustada)
const levelBase = {
  'secundario': 150,
  'licenciatura': 350,
  'mestrado': 800,
  'doutoramento': 1500
};

const styleMultiplier = {
  'argumentacao': 1.0,
  'persuasao': 1.1,
  'reflexivo': 0.95,
  'normativo': 1.05
};

function calcPrice({ pages=1, level='licenciatura', style='argumentacao', methodology='qualitativa', urgencyDays=7, extras=0 }) {
  const base = levelBase[level] || levelBase['licenciatura'];
  const styleMult = styleMultiplier[style] || 1.0;
  let methodologyPct = 0;
  if (methodology === 'quantitativa') methodologyPct = 0.20;
  if (methodology === 'qualitativa') methodologyPct = 0.10;
  if (methodology === 'mista') methodologyPct = 0.30;

  let urgencyPct = 0;
  if (urgencyDays <= 2) urgencyPct = 1.00;      // +100%
  else if (urgencyDays <= 3) urgencyPct = 0.75;
  else if (urgencyDays <= 7) urgencyPct = 0.25;

  const basePrice = pages * base * styleMult;
  const price = Math.round( basePrice * (1 + methodologyPct) * (1 + urgencyPct) + extras );

  const urgencySurchargeMZN = Math.round(basePrice * urgencyPct);
  return {
    basePriceMZN: Math.round(basePrice),
    urgencySurchargeMZN,
    totalPriceMZN: price
  };
}

module.exports = { calcPrice };
