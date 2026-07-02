export type PaymentMode = "mock" | "stripe";

export type PaymentPlan = {
  count: 30 | 60 | 90 | 120;
  planId: "verb_30" | "verb_60" | "verb_90" | "verb_120";
  label: string;
  price: number;
  cumulativePrice: number;
  range: string;
  addRange: string;
  recommend: string;
  stripePriceEnvName: string;
  stripePriceId?: string;
};

export const PAYMENT_PLANS: PaymentPlan[] = [
  {
    count: 30,
    planId: "verb_30",
    label: "Step 1：30動詞パック",
    price: 500,
    cumulativePrice: 500,
    range: "1〜30",
    addRange: "4〜30",
    recommend: "無料3語の次に、まず基本30動詞まで使いたい人向け",
    stripePriceEnvName: "NEXT_PUBLIC_STRIPE_PRICE_30",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_30,
  },
  {
    count: 60,
    planId: "verb_60",
    label: "Step 2：60動詞パック",
    price: 500,
    cumulativePrice: 1000,
    range: "1〜60",
    addRange: "31〜60",
    recommend: "仕事と日常で使う基本動詞をさらに広げたい人向け",
    stripePriceEnvName: "NEXT_PUBLIC_STRIPE_PRICE_60",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_60,
  },
  {
    count: 90,
    planId: "verb_90",
    label: "Step 3：90動詞パック",
    price: 500,
    cumulativePrice: 1500,
    range: "1〜90",
    addRange: "61〜90",
    recommend: "主要動詞90語まで一通り学びたい人向け",
    stripePriceEnvName: "NEXT_PUBLIC_STRIPE_PRICE_90",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_90,
  },
  {
    count: 120,
    planId: "verb_120",
    label: "Step 4：120動詞パック",
    price: 500,
    cumulativePrice: 2000,
    range: "1〜120",
    addRange: "91〜120",
    recommend: "91〜120番まで含めて、全120動詞を学びたい人向け",
    stripePriceEnvName: "NEXT_PUBLIC_STRIPE_PRICE_120",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_120,
  },
];

export function getPaymentMode(): PaymentMode {
  return process.env.NEXT_PUBLIC_PAYMENT_MODE === "stripe" ? "stripe" : "mock";
}

export function getPaymentModeLabel(mode = getPaymentMode()) {
  return mode === "stripe" ? "Stripe決済モード" : "仮購入モード";
}

export function getPaymentPlan(count: number) {
  return PAYMENT_PLANS.find((item) => item.count === count) || PAYMENT_PLANS[0];
}

export function getPaymentReadiness() {
  const mode = getPaymentMode();
  const missingPublicPriceIds = PAYMENT_PLANS
    .filter((plan) => !plan.stripePriceId)
    .map((plan) => `${plan.label}: ${plan.stripePriceEnvName}`);

  return {
    mode,
    modeLabel: getPaymentModeLabel(mode),
    publishableKeyReady: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    priceIdsReady: missingPublicPriceIds.length === 0,
    missingPublicPriceIds,
    canUseMockCheckout: true,
    canTryStripeCheckout: mode === "stripe",
  };
}
