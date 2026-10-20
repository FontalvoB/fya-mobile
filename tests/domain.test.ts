import { test } from "node:test";
import assert from "node:assert/strict";
import {
  demoDraft,
  validateAccount,
  estimate,
  validateDocument,
  validateStep,
  validateLoan,
  validateAll,
  dateValue,
  policy,
} from "../src/domain/model";
import { DemoOtp, demoService } from "../src/services/demo";
function complete() {
  const d = demoDraft();
  d.loan.hasAdviser = false;
  d.declaration = {
    ...d.declaration,
    us: false,
    other: false,
    taxConsent: true,
    health: Array(9).fill(false),
    riskConsent: true,
    dataConsent: true,
    channels: ["Correo"],
    commercial: false,
    reviewed: true,
  };
  d.documents.utility = {
    name: "demo.pdf",
    uri: "demo",
    mimeType: "application/pdf",
    size: 100,
  };
  d.documents.payslip = { ...d.documents.utility };
  return d;
}
test("mandatory utility document cannot be bypassed", () => {
  const d = complete();
  delete d.documents.utility;
  assert.match(validateAll(d)!, /recibo/);
});
test("rejects wrong formats, empty, unknown and oversized documents", () => {
  const f = complete().documents.utility!;
  for (const bad of [
    { ...f, mimeType: "text/plain" },
    { ...f, size: 0 },
    { ...f, size: NaN },
    { ...f, size: policy.maxBytes + 1 },
  ])
    assert.ok(validateDocument(bad));
  assert.equal(validateDocument({ ...f, size: policy.maxBytes }), undefined);
});
test("tax positive answers require their details", () => {
  const d = complete();
  d.declaration.us = true;
  assert.ok(validateStep(d, 1));
  d.declaration.tin = "12345";
  assert.equal(validateStep(d, 1), undefined);
  d.declaration.other = true;
  assert.ok(validateStep(d, 1));
});
test("health affirmative needs details and all questions need answers", () => {
  const d = complete();
  d.declaration.health[1] = true;
  assert.ok(validateStep(d, 2));
  d.declaration.details[1] = "Detalle de prueba";
  assert.equal(validateStep(d, 2), undefined);
  d.declaration.health[8] = null;
  assert.ok(validateStep(d, 2));
});
test("rejects expired and future receipt dates", () => {
  const d = complete();
  for (const date of ["2020-01-01", "2099-01-01", "bad", "2026-02-31"]) {
    d.account.utilityDate = date;
    assert.ok(validateAccount(d));
  }
});
test("invalid calendar date does not throw", () => {
  assert.ok(Number.isNaN(dateValue("2026-99-99")));
});
test("advertising refusal is permitted independently", () => {
  assert.equal(validateStep(complete(), 3), undefined);
  const d = complete();
  d.declaration.channels = [];
  assert.ok(validateStep(d, 3));
});
test("amount and payment modes are reciprocal", () => {
  const d = complete();
  const e = estimate(d.loan);
  assert.ok(
    Math.abs(
      estimate({ ...d.loan, mode: "payment", payment: e.payment }).amount -
        e.amount,
    ) < 100,
  );
  assert.ok(validateLoan({ ...d.loan, months: 0 }));
  assert.ok(validateLoan({ ...d.loan, amount: NaN }));
});
test("OTP limits attempts, expiry and reuse", () => {
  const c = new DemoOtp();
  for (let i = 0; i < 3; i++) assert.ok(c.verify("000000"));
  assert.ok(c.verify(c.code));
  const b = new DemoOtp();
  assert.ok(b.verify(b.code, b.issued + policy.otpLifetime + 1));
  const a = new DemoOtp();
  assert.equal(a.verify(a.code), undefined);
  assert.ok(a.verify(a.code));
});
test("submit is validated, idempotent and yields distinct outcomes", async () => {
  const d = complete();
  const r = await demoService.submit(d, "a");
  assert.equal(r.favorable, true);
  assert.deepEqual(await demoService.submit(d, "a"), r);
  d.loan.income = 700000;
  const no = await demoService.submit(d, "b");
  assert.equal(no.favorable, false);
  delete d.documents.utility;
  await assert.rejects(demoService.submit(d, "c"));
});

test("account requires accreditation for the declared profile", () => {
  const d = complete();
  delete d.documents.accreditation;
  assert.match(validateAccount(d)!, /acredita/);
  d.documents.accreditation = { ...d.documents.utility! };
  d.account.customerType = "";
  assert.match(validateAccount(d)!, /pensionado o docente/);
});
test("non-owned housing requires a valid lease; owned housing does not", () => {
  const d = complete();
  assert.equal(validateAccount(d), undefined);
  d.account.ownsHome = false;
  assert.match(validateAccount(d)!, /arrendamiento/);
  d.documents.lease = { ...d.documents.utility!, mimeType: "text/plain" };
  assert.ok(validateAccount(d));
  d.documents.lease = { ...d.documents.utility! };
  assert.equal(validateAccount(d), undefined);
});
test("loan supports direct requests and requires a code only with adviser", () => {
  const d = complete();
  assert.equal(validateLoan(d.loan), undefined);
  d.loan.hasAdviser = true;
  assert.match(validateLoan(d.loan)!, /código/);
  d.loan.adviserCode = "ASESOR-DEMO";
  assert.equal(validateLoan(d.loan), undefined);
  d.loan.hasAdviser = false;
  assert.ok(validateLoan(d.loan));
});
test("utility belongs to account validation and payslip to application support", () => {
  const d = complete();
  delete d.documents.utility;
  assert.equal(validateStep(d, 4), undefined);
  assert.ok(validateAccount(d));
  d.documents.utility = { ...d.documents.payslip! };
  delete d.documents.payslip;
  assert.equal(validateAccount(d), undefined);
  assert.match(validateStep(d, 4)!, /desprendible/);
});
test("inconsistent residence and account simulation profiles are rejected", () => {
  const d = complete();
  d.profile.city = "Medellín";
  assert.ok(validateAccount(d));
  d.profile.city = "Bogotá";
  d.loan.type = "Docente";
  assert.match(validateAll(d)!, /perfil/);
});
test("adviser reference is preserved in the submitted snapshot", async () => {
  const d = complete();
  d.loan.hasAdviser = true;
  d.loan.adviserCode = "ASESOR-DEMO";
  const r = await demoService.submit(d, "adviser-snapshot");
  d.loan.adviserCode = "CHANGED";
  assert.equal(r.adviserCode, "ASESOR-DEMO");
});
