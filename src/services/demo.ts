import { Draft, Result, estimate, policy, validateAll } from "../domain/model";
export interface ApplicationService {
  submit(draft: Draft, key: string): Promise<Result>;
}
const results = new Map<string, Result>();
export const demoService: ApplicationService = {
  async submit(draft, key) {
    const error = validateAll(draft);
    if (error) throw new Error(error);
    if (results.has(key)) return results.get(key)!;
    await new Promise((r) => setTimeout(r, 1000));
    const e = estimate(draft.loan);
    const result: Result = {
      id: "DEMO-" + Date.now().toString(36).toUpperCase(),
      date: new Date().toISOString(),
      favorable: e.payment <= e.capacity,
      ...e,
      months: draft.loan.months,
      adviserCode: draft.loan.hasAdviser ? draft.loan.adviserCode.trim() : "",
      healthReview: draft.declaration.health.some(Boolean),
    };
    results.set(key, result);
    return result;
  },
};
export class DemoOtp {
  attempts = 0;
  used = false;
  issued = Date.now();
  code: string;
  constructor(code = "482913") {
    this.code = code;
  }
  verify(value: string, now = Date.now()) {
    if (this.used) return "Este código ya fue utilizado.";
    if (now - this.issued > policy.otpLifetime)
      return "El código venció. Genera otro código de prueba.";
    if (this.attempts >= policy.otpAttempts)
      return "Agotaste los 3 intentos. Genera otro código después de la espera.";
    this.attempts++;
    if (value !== this.code)
      return `Código incorrecto. Quedan ${policy.otpAttempts - this.attempts} intentos.`;
    this.used = true;
    return undefined;
  }
}
