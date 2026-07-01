export interface PromoCode {
  id: string;
  code: string;
  type: "percent" | "nominal";
  value: number;
  min_purchase: number;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  applicable_categories: string[];
  created_at: string;
}

export const staticPromoCodes: PromoCode[] = [
  {
    id: "welcome10",
    code: "WELCOME10",
    type: "percent",
    value: 10,
    min_purchase: 0,
    max_uses: 100,
    used_count: 0,
    expires_at: null,
    is_active: true,
    applicable_categories: [],
    created_at: new Date().toISOString(),
  },
  {
    id: "disk50",
    code: "DISKON50",
    type: "nominal",
    value: 50000,
    min_purchase: 100000,
    max_uses: 50,
    used_count: 0,
    expires_at: null,
    is_active: true,
    applicable_categories: [],
    created_at: new Date().toISOString(),
  },
];
