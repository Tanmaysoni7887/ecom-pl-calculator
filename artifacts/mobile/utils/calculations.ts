export interface CalculationInputs {
  sellingPrice: number;
  productCost: number;
  shippingCost: number;
  packagingCost: number;
  transactionFee: number;
  paymentGatewayFee: number;
  taxes: number;
  refundRate: number;
  chargebackRate: number;
  discount: number;
  adSpend: number;
  numberOfOrders: number;
  numberOfClicks: number;
  impressions: number;
  otherCosts: number;
}

export interface CalculationResults {
  revenue: number;
  adjustedRevenue: number;
  totalCOGS: number;
  totalFees: number;
  totalVariableCosts: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  roas: number;
  cpa: number;
  cpc: number;
  cpm: number;
  ctr: number;
  conversionRate: number;
  aov: number;
  breakevenROAS: number;
  contributionMargin: number;
}

export function calculate(inputs: CalculationInputs): CalculationResults {
  const {
    sellingPrice,
    productCost,
    shippingCost,
    packagingCost,
    transactionFee,
    paymentGatewayFee,
    taxes,
    refundRate,
    chargebackRate,
    discount,
    adSpend,
    numberOfOrders,
    numberOfClicks,
    impressions,
    otherCosts,
  } = inputs;

  const n = Math.max(0, numberOfOrders);
  const clicks = Math.max(0, numberOfClicks);
  const impr = Math.max(0, impressions);
  const spend = Math.max(0, adSpend);

  const revenue = sellingPrice * n * (1 - Math.min(Math.max(discount, 0), 100) / 100);
  const adjustedRevenue =
    revenue *
    (1 - Math.min(Math.max(refundRate, 0), 100) / 100) *
    (1 - Math.min(Math.max(chargebackRate, 0), 100) / 100);

  const totalCOGS = (productCost + shippingCost + packagingCost) * n;
  const totalFees = (transactionFee + paymentGatewayFee + taxes) * n;
  const totalVariableCosts = totalCOGS + totalFees + spend + otherCosts;

  const grossProfit = adjustedRevenue - totalCOGS;
  const netProfit = adjustedRevenue - totalVariableCosts;
  const profitMargin = adjustedRevenue > 0 ? (netProfit / adjustedRevenue) * 100 : 0;

  const roas = spend > 0 ? adjustedRevenue / spend : 0;
  const cpa = n > 0 ? spend / n : 0;
  const cpc = clicks > 0 ? spend / clicks : 0;
  const cpm = impr > 0 ? (spend / impr) * 1000 : 0;
  const ctr = impr > 0 ? (clicks / impr) * 100 : 0;
  const conversionRate = clicks > 0 ? (n / clicks) * 100 : 0;
  const aov = n > 0 ? adjustedRevenue / n : 0;

  const costsExcludingAds = totalVariableCosts - spend;
  const grossMarginFraction =
    adjustedRevenue > 0 ? (adjustedRevenue - costsExcludingAds) / adjustedRevenue : 0;
  const breakevenROAS = grossMarginFraction > 0 ? 1 / grossMarginFraction : 0;
  const contributionMargin = profitMargin;

  return {
    revenue,
    adjustedRevenue,
    totalCOGS,
    totalFees,
    totalVariableCosts,
    grossProfit,
    netProfit,
    profitMargin,
    roas,
    cpa,
    cpc,
    cpm,
    ctr,
    conversionRate,
    aov,
    breakevenROAS,
    contributionMargin,
  };
}
