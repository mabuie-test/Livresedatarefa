function calcPrice(body) {
  const pageBase = {
    secundario: 100,
    licenciatura: 150,
    mestrado: 300,
    doutoramento: 450
  }[body.academicLevel] || 150;

  let basePrice = (Number(body.pages) || 1) * pageBase;
  let extras = Number(body.extras || 0);
  let urgencySurcharge = 0;
  if (body.urgent) {
    urgencySurcharge = Math.round(basePrice * 0.4);
  } else {
    if (Number(body.urgencyDays) <= 2) urgencySurcharge = Math.round(basePrice * 0.3);
  }
  const total = basePrice + urgencySurcharge + extras;
  return { basePriceMZN: basePrice, urgencySurchargeMZN: urgencySurcharge, totalPriceMZN: total };
}

module.exports = { calcPrice };
