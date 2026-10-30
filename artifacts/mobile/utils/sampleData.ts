import { calculate } from "./calculations";
import type { Store, CalculationRecord } from "@/context/DataContext";

function uid() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export const SAMPLE_STORES: Store[] = [
  {
    id: "store-1",
    name: "DropShip Pro",
    currency: "USD",
    platform: "Shopify",
    notes: "Main US dropshipping store",
    createdAt: new Date("2024-01-10").toISOString(),
  },
  {
    id: "store-2",
    name: "Global Gadgets",
    currency: "USD",
    platform: "Amazon",
    notes: "Amazon FBA store",
    createdAt: new Date("2024-02-01").toISOString(),
  },
];

function makeCalc(
  id: string,
  storeId: string,
  productName: string,
  sku: string,
  adPlatform: string,
  date: string,
  inputs: {
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
  },
  notes = ""
): CalculationRecord {
  return {
    id,
    storeId,
    productName,
    sku,
    adPlatform,
    date,
    notes,
    ...inputs,
    results: calculate(inputs),
    createdAt: new Date(date).toISOString(),
    updatedAt: new Date(date).toISOString(),
  };
}

export const SAMPLE_CALCULATIONS: CalculationRecord[] = [
  makeCalc(
    "calc-1",
    "store-1",
    "Wireless Earbuds Pro",
    "WEP-001",
    "Meta",
    "2024-05-01",
    {
      sellingPrice: 49.99,
      productCost: 12.5,
      shippingCost: 4.5,
      packagingCost: 0.5,
      transactionFee: 0.3,
      paymentGatewayFee: 1.5,
      taxes: 0,
      refundRate: 3,
      chargebackRate: 0.5,
      discount: 0,
      adSpend: 450,
      numberOfOrders: 38,
      numberOfClicks: 1200,
      impressions: 32000,
      otherCosts: 20,
    },
    "Strong Meta campaign - lookalike audience"
  ),
  makeCalc(
    "calc-2",
    "store-1",
    "Portable Blender",
    "PB-007",
    "TikTok",
    "2024-05-08",
    {
      sellingPrice: 34.99,
      productCost: 8.0,
      shippingCost: 5.0,
      packagingCost: 0.75,
      transactionFee: 0.3,
      paymentGatewayFee: 1.05,
      taxes: 0,
      refundRate: 4,
      chargebackRate: 0.5,
      discount: 10,
      adSpend: 320,
      numberOfOrders: 52,
      numberOfClicks: 2100,
      impressions: 85000,
      otherCosts: 15,
    },
    "Viral TikTok video - organic boost"
  ),
  makeCalc(
    "calc-3",
    "store-2",
    "LED Ring Light",
    "LRL-201",
    "Google",
    "2024-05-12",
    {
      sellingPrice: 29.99,
      productCost: 9.0,
      shippingCost: 3.5,
      packagingCost: 0.5,
      transactionFee: 0.3,
      paymentGatewayFee: 0.9,
      taxes: 0,
      refundRate: 5,
      chargebackRate: 1,
      discount: 5,
      adSpend: 280,
      numberOfOrders: 31,
      numberOfClicks: 940,
      impressions: 18500,
      otherCosts: 10,
    },
    "Google Shopping - highly competitive"
  ),
  makeCalc(
    "calc-4",
    "store-1",
    "Phone Stand Adjustable",
    "PSA-033",
    "Meta",
    "2024-05-18",
    {
      sellingPrice: 24.99,
      productCost: 5.5,
      shippingCost: 3.0,
      packagingCost: 0.5,
      transactionFee: 0.3,
      paymentGatewayFee: 0.75,
      taxes: 0,
      refundRate: 2,
      chargebackRate: 0.2,
      discount: 0,
      adSpend: 180,
      numberOfOrders: 45,
      numberOfClicks: 1800,
      impressions: 42000,
      otherCosts: 5,
    },
    "Best performer this month"
  ),
  makeCalc(
    "calc-5",
    "store-2",
    "Resistance Bands Set",
    "RBS-099",
    "Google",
    "2024-05-22",
    {
      sellingPrice: 39.99,
      productCost: 7.5,
      shippingCost: 4.0,
      packagingCost: 1.0,
      transactionFee: 0.3,
      paymentGatewayFee: 1.2,
      taxes: 0,
      refundRate: 6,
      chargebackRate: 0.5,
      discount: 15,
      adSpend: 520,
      numberOfOrders: 28,
      numberOfClicks: 1100,
      impressions: 25000,
      otherCosts: 25,
    },
    "High refund rate - review product quality"
  ),
];
