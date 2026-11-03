import { test } from "node:test";
import assert from "node:assert/strict";
import { demoDraft, Result } from "../src/domain/model";
import {
  activeFilingSteps,
  changeFilingValues,
  createFilingReceipt,
  fieldOptions,
  filingCalculations,
  filingSteps,
  freshFiling,
  pepRelationships,
  validateFiling,
  validateFilingStep,
  visibleFilingFields,
} from "../src/domain/filing";

const result: Result = {
  id: "DEMO-FILING",
  date: new Date().toISOString(),
  favorable: true,
  amount: 30000000,
  payment: 650000,
  months: 96,
  capacity: 2200000,
  healthReview: false,
  adviserCode: "",
};
function complete() {
  const draft = demoDraft();
  let filing = freshFiling(draft, result);
  for (const step of filingSteps)
    for (const field of step.fields)
      if (!field.locked && (!field.when || field.when(filing.values)))
        filing = changeFilingValues(filing, { [field.key]: field.demo || "" });
  filing.values.bankCertificateDate = new Date().toISOString().slice(0, 10);
  filing.values.accountOwner = "Sí";
  filing.values.reviewed = "Sí";
  const file = {
    name: "prueba.pdf",
    uri: "demo://test",
    size: 128,
    mimeType: "application/pdf",
    demo: true,
  };
  filing.documents = {
    front: { ...file },
    back: { ...file },
    income: { ...file },
    bank: { ...file },
  };
  return { draft, filing };
}
const step = (id: string) => filingSteps.find((item) => item.id === id)!;
test("filing has unique steps across eight sections and completes after preapproval", () => {
  const { draft, filing } = complete();
  assert.equal(
    new Set(filingSteps.map((item) => item.id)).size,
    filingSteps.length,
  );
  assert.equal(new Set(filingSteps.map((item) => item.section)).size, 8);
  assert.equal(validateFiling(filing, result, draft.profile), undefined);
  assert.ok(validateFiling(filing, { ...result, favorable: false }));
  assert.ok(validateFiling(filing, { ...result, id: "OTHER" }));
  filing.values.firstName = "Alterado";
  assert.match(validateFiling(filing, result, draft.profile)!, /identidad/);
});
test("PEP relationship uses image fields and validates every required field", () => {
  const { filing } = complete();
  filing.values.pepLink = "Sí";
  assert.deepEqual(
    fieldOptions(
      step("pep").fields.find((field) => field.key === "pepRelationship")!,
      filing.values,
    ),
    pepRelationships,
  );
  assert.ok(
    pepRelationships.includes("Abuelos") &&
      pepRelationships.includes("Nietos") &&
      pepRelationships.includes("Suegros"),
  );
  for (const key of [
    "pepRelationship",
    "pepDocType",
    "pepDocNumber",
    "pepName",
  ]) {
    const original = filing.values[key];
    filing.values[key] = "";
    assert.ok(validateFilingStep(filing, step("pep"), result));
    filing.values[key] = original;
  }
  filing.values.pepDocNumber = "ABC123";
  assert.ok(validateFilingStep(filing, step("pep"), result));
  filing.values.pepDocType = "Pasaporte";
  assert.equal(validateFilingStep(filing, step("pep"), result), undefined);
  assert.ok(
    !visibleFilingFields(step("pep"), filing).some(
      (field) => field.key === "cargoVinculo",
    ),
  );
  const cleared = changeFilingValues(filing, { pepLink: "No" });
  assert.equal(cleared.values.pepName, "");
  assert.equal(cleared.values.pepDocNumber, "");
  assert.equal(validateFilingStep(cleared, step("pep"), result), undefined);
  cleared.values.pep = "Sí";
  assert.ok(validateFilingStep(cleared, step("pep"), result));
});
test("spouse and employment requirements follow their conditions without stale data", () => {
  const { filing } = complete();
  const married = changeFilingValues(filing, { civil: "Casado(a)" });
  assert.equal(
    activeFilingSteps(married).filter((item) => item.section === 3).length,
    3,
  );
  married.values.spouseName = "Persona de prueba";
  const single = changeFilingValues(married, { civil: "Soltero(a)" });
  assert.equal(
    activeFilingSteps(single).filter((item) => item.section === 3).length,
    0,
  );
  assert.equal(single.values.spouseName, "");
  const pension = changeFilingValues(single, { activity: "Pensionado" });
  assert.equal(pension.values.employer, "");
  assert.ok(
    !visibleFilingFields(step("work"), pension).some(
      (field) => field.key === "workAddress",
    ),
  );
  assert.ok(validateFilingStep(pension, step("activity"), result));
});
test("dependent cities reset and reference numbers must be distinct", () => {
  const { filing } = complete();
  const changed = changeFilingValues(filing, {
    residenceDepartment: "Antioquia",
  });
  assert.equal(changed.values.residenceCity, "");
  assert.ok(validateFilingStep(changed, step("residence"), result));
  for (const phone of [
    filing.values.phone,
    filing.values.family2Phone,
    "1234567890",
  ]) {
    filing.values.family1Phone = phone;
    assert.ok(validateFilingStep(filing, step("family1"), result));
  }
});
test("financial calculations retain source rules and block impossible deductions and purchases", () => {
  const { filing } = complete();
  filing.values.activity = "Pensionado";
  filing.values.income = "5000000";
  filing.deductions = [
    { id: "1", name: "Cooperativa", amount: "200000", type: "Regular" },
  ];
  filing.purchases = [{ id: "2", name: "Banco", amount: "10000000" }];
  filing.obligations = { Tarjeta: { payment: "180000", balance: "2400000" } };
  const calc = filingCalculations(filing, result);
  assert.equal(calc.statutory, 600000);
  assert.equal(calc.limit, 2200000);
  assert.equal(calc.margin, 1350000);
  assert.equal(calc.payout, 20000000);
  assert.equal(calc.debtPayment, 180000);
  filing.deductions[0].amount = "2000000";
  assert.ok(validateFilingStep(filing, step("capacity"), result));
  filing.deductions = [];
  filing.purchases[0].amount = "30000001";
  assert.ok(validateFilingStep(filing, step("capacity"), result));
  filing.purchases[0].amount = "NaN";
  assert.ok(validateFilingStep(filing, step("capacity"), result));
});
test("official supports require files, recent certificate and account ownership", () => {
  const { filing } = complete();
  assert.equal(
    validateFilingStep(filing, step("documents"), result),
    undefined,
  );
  delete filing.documents.income;
  assert.match(
    validateFilingStep(filing, step("documents"), result)!,
    /ingresos/,
  );
  filing.documents.income = { ...filing.documents.bank! };
  for (const date of ["2000-01-01", "2099-01-01", "2026-02-31", ""]) {
    filing.values.bankCertificateDate = date;
    assert.ok(validateFilingStep(filing, step("documents"), result));
  }
  filing.values.bankCertificateDate = new Date().toISOString().slice(0, 10);
  filing.values.accountOwner = "No";
  assert.ok(validateFilingStep(filing, step("documents"), result));
});
test("receipt stores an independent reviewed snapshot and edits invalidate confirmation", () => {
  const { draft, filing } = complete();
  const receipt = createFilingReceipt(filing, result, draft.profile);
  filing.values.bank = "Cambió";
  filing.documents.bank!.name = "cambió.pdf";
  assert.notEqual(receipt.snapshot.values.bank, "Cambió");
  assert.notEqual(receipt.snapshot.documents.bank!.name, "cambió.pdf");
  assert.equal(
    changeFilingValues(receipt.snapshot, { comments: "Cambio" }).values
      .reviewed,
    "No",
  );
  assert.throws(() =>
    createFilingReceipt(
      {
        ...receipt.snapshot,
        values: { ...receipt.snapshot.values, reviewed: "No" },
      },
      result,
      draft.profile,
    ),
  );
});
