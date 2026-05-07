/**
 * Payment Provider Abstraction Layer
 *
 * To add a payment provider:
 * 1. Create a new file: src/lib/payment/providers/your-provider.ts
 * 2. Implement the PaymentProvider interface
 * 3. Register it below in getPaymentProvider()
 *
 * Supported providers (when configured):
 * - mock    : For development/testing
 * - tranzila: Tranzila payment gateway
 * - meshulam: Meshulam payment gateway
 * - payplus : PayPlus payment gateway
 */

import type { PaymentProvider, PaymentInitParams, PaymentInitResult, PaymentCallbackResult } from "@/types";

// ============================================================
// MOCK PROVIDER (development)
// ============================================================
class MockPaymentProvider implements PaymentProvider {
  name = "mock";

  async initiate(params: PaymentInitParams): Promise<PaymentInitResult> {
    console.log("[MockPayment] Initiating payment:", params);
    return {
      success: true,
      redirectUrl: `/checkout/mock-payment?orderId=${params.orderId}&amount=${params.amount}`,
      transactionId: `MOCK-${Date.now()}`,
    };
  }

  async handleCallback(data: unknown): Promise<PaymentCallbackResult> {
    const payload = data as Record<string, string>;
    return {
      success: true,
      orderId: parseInt(payload.orderId),
      transactionId: payload.transactionId ?? `MOCK-${Date.now()}`,
      amount: parseFloat(payload.amount),
      status: "paid",
    };
  }

  verifySignature(_data: unknown, _signature: string): boolean {
    // Mock always passes
    return true;
  }
}

// ============================================================
// PROVIDER REGISTRY
// ============================================================
const providers: Record<string, PaymentProvider> = {
  mock: new MockPaymentProvider(),
};

export function getPaymentProvider(name?: string): PaymentProvider {
  const providerName = name ?? process.env.PAYMENT_PROVIDER ?? "mock";
  const provider = providers[providerName];
  if (!provider) {
    console.warn(`[Payment] Unknown provider "${providerName}", falling back to mock`);
    return providers.mock;
  }
  return provider;
}

export function registerPaymentProvider(name: string, provider: PaymentProvider) {
  providers[name] = provider;
}

export type { PaymentProvider, PaymentInitParams, PaymentInitResult, PaymentCallbackResult };
