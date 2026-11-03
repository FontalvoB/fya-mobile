import { test, expect, Page } from "@playwright/test";

async function preapprove(page: Page) {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Explorar con un perfil de prueba" })
    .click();
  await page.getByRole("button", { name: "Simular mi crédito" }).click();
  await page.getByRole("radio", { name: "No", exact: true }).click();
  await page
    .getByRole("button", { name: "Continuar con esta simulación" })
    .click();
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(
    page.getByRole("radio", { name: "No", exact: true }),
  ).toHaveCount(2);
  for (const no of await page
    .getByRole("radio", { name: "No", exact: true })
    .all())
    await no.click();
  await page
    .getByRole("checkbox", {
      name: "Declaro que la información fiscal es correcta",
    })
    .click();
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(
    page.getByRole("radio", { name: "No", exact: true }),
  ).toHaveCount(9);
  for (const no of await page
    .getByRole("radio", { name: "No", exact: true })
    .all())
    await no.click();
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await page.getByRole("checkbox", { name: "Correo", exact: true }).click();
  await page.getByRole("radio", { name: "No", exact: true }).click();
  await page
    .getByRole("checkbox", {
      name: "Autorizo la consulta de centrales de riesgo",
    })
    .click();
  await page
    .getByRole("checkbox", {
      name: "Autorizo el tratamiento de datos de la solicitud",
    })
    .click();
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await page
    .getByRole("checkbox", {
      name: "Revisé y confirmo la información de prueba",
    })
    .click();
  await page
    .getByRole("button", { name: "Confirmar con código de prueba" })
    .click();
  await page.getByRole("button", { name: "Usar código de prueba" }).click();
  await page
    .getByRole("button", { name: "Finalizar solicitud de prueba" })
    .click();
  await expect(
    page.getByRole("button", { name: "Completar mi radicación" }),
  ).toBeVisible();
}
async function choose(page: Page, label: string, value: string) {
  await page.getByRole("button", { name: label, exact: true }).click();
  await page.getByRole("button", { name: value, exact: true }).click();
}
async function example(page: Page) {
  await page
    .getByRole("button", { name: "Completar este paso con datos de ejemplo" })
    .click();
}
async function next(page: Page) {
  await page
    .getByRole("button", { name: "Guardar y continuar", exact: true })
    .click();
}
async function upload(page: Page, label: string, name: string) {
  const chooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: label, exact: true }).click();
  await (
    await chooser
  ).setFiles({
    name,
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4\nDocumento ficticio\n%%EOF"),
  });
}

test("preapproved credit completes all filing sections with image PEP fields, edits and OTP", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await preapprove(page);
  await page.getByRole("button", { name: "Completar mi radicación" }).click();
  await expect(
    page.getByRole("textbox", { name: "Primer nombre", exact: true }),
  ).not.toBeEditable();
  await expect(
    page.getByRole("button", { name: "Sección Soportes", exact: true }),
  ).toBeDisabled();
  await next(page);
  await expect(
    page.getByText("Completa: Ciudad de expedición.", { exact: true }),
  ).toBeVisible();
  await example(page);
  await next(page);
  await example(page);
  await choose(page, "Estado civil *", "Casado(a)");
  await next(page);
  await example(page);
  await next(page);
  await example(page);
  await next(page);
  await example(page);
  await next(page);
  await expect(
    page.getByRole("heading", { name: "Tu declaración PEP." }),
  ).toBeVisible();
  await example(page);
  await choose(page, "Tipo de parentesco *", "Suegros");
  await page
    .getByRole("textbox", {
      name: "Número de documento del familiar o cercano *",
      exact: true,
    })
    .fill("");
  await next(page);
  await expect(
    page.getByText("Completa: Número de documento del familiar o cercano.", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("textbox", {
      name: "Número de documento del familiar o cercano *",
      exact: true,
    })
    .fill("1234567890");
  await expect(
    page.getByRole("textbox", { name: "Cargo que ocupa", exact: true }),
  ).toHaveCount(0);
  await page.setViewportSize({ width: 320, height: 740 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({ path: "work/radicacion-pep.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  // Leaving the form keeps the current step and its entered values in this session.
  await page.getByRole("button", { name: "Inicio", exact: true }).click();
  await page.getByRole("button", { name: "Crédito", exact: true }).click();
  await page.getByRole("button", { name: "Completar mi radicación" }).click();
  await expect(
    page.getByRole("button", { name: "Tipo de parentesco *", exact: true }),
  ).toContainText("Suegros");
  await next(page);
  await example(page);
  await next(page);
  await example(page);
  await next(page);
  await example(page);
  await next(page);
  await example(page);
  await next(page);
  for (let i = 0; i < 3; i++) {
    await example(page);
    await next(page);
  }
  await expect(
    page.getByRole("heading", { name: "Referencia familiar 1 de 2" }),
  ).toBeVisible();
  await example(page);
  await page
    .getByRole("textbox", { name: "Celular *", exact: true })
    .fill("3001234567");
  await next(page);
  await expect(
    page.getByText("El celular de la referencia debe empezar por 3", {
      exact: false,
    }),
  ).toBeVisible();
  await example(page);
  await next(page);
  await example(page);
  await next(page);
  await example(page);
  await next(page);
  await example(page);
  await next(page);
  await expect(
    page.getByRole("heading", { name: "Tu capacidad de descuento." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Agregar deducción", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Concepto 1 *", exact: true })
    .fill("Cooperativa de prueba");
  await page
    .getByRole("textbox", { name: "Cuota mensual 1 (COP) *", exact: true })
    .fill("3000000");
  await next(page);
  await expect(
    page.getByText("La cuota y las deducciones superan", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Cuota mensual 1 (COP) *", exact: true })
    .fill("100000");
  await page
    .getByRole("button", { name: "Agregar cartera a comprar", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Entidad 1 *", exact: true })
    .fill("Banco de prueba");
  await page
    .getByRole("textbox", { name: "Saldo a pagar 1 (COP) *", exact: true })
    .fill("1000000");
  await next(page);
  await next(page);
  await expect(
    page.getByRole("heading", { name: "Los soportes de tu crédito." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: /[Tt]omar foto de comprobante de ingresos/,
    }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /[Tt]omar foto de certificado bancario/ }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Usar ambas caras del registro" })
    .click();
  await next(page);
  await expect(
    page.getByText("Adjunta el comprobante de ingresos.", { exact: true }),
  ).toBeVisible();
  await upload(page, "Seleccionar comprobante de ingresos", "ingresos.pdf");
  await upload(page, "Seleccionar certificado bancario", "banco.pdf");
  await page
    .getByRole("button", {
      name: "Fecha de emisión del certificado bancario *",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", {
      name: `Seleccionar fecha ${new Date().toISOString().slice(0, 10)}`,
      exact: true,
    })
    .click();
  await page
    .getByRole("checkbox", {
      name: "El certificado y la cuenta bancaria están a mi nombre",
    })
    .click();
  await page.screenshot({ path: "work/radicacion-soportes.png" });
  await next(page);
  await expect(
    page.getByRole("heading", { name: "Todo listo para radicar." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Editar pep", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Tipo de parentesco *", exact: true }),
  ).toContainText("Suegros");
  await page
    .getByRole("button", { name: "Sección Comentarios", exact: true })
    .click();
  await example(page);
  await page
    .getByRole("button", { name: "Confirmar radicación con código" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Confirma tu radicación." }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Código de 6 dígitos", exact: true })
    .fill("000000");
  await page
    .getByRole("button", { name: "Radicar solicitud de prueba" })
    .click();
  await expect(
    page.getByText("Código incorrecto.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Usar código de prueba" }).click();
  await page
    .getByRole("button", { name: "Radicar solicitud de prueba" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Tu radicación, preparada." }),
  ).toBeVisible();
  await expect(
    page.getByText(/^RAD-DEMO-/).filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ver mis datos radicados" }).click();
  await page.getByRole("button", { name: "Ver pep", exact: true }).click();
  await expect(
    page.getByText("Tipo de parentesco: Suegros", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Editar pep", exact: true }),
  ).toHaveCount(0);
  await page.screenshot({ path: "work/radicacion-completa.png" });
  await page
    .getByRole("button", { name: "Ver seguimiento", exact: true })
    .click();
  await expect(
    page.getByText("Completada en esta sesión", { exact: false }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("filing is inaccessible before login and without preapproval", async ({
  page,
}) => {
  await page.goto("/filing");
  await expect(
    page.getByRole("button", { name: "Comenzar mi registro" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Explorar con un perfil de prueba" })
    .click();
  await page.getByRole("button", { name: "Crédito", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Completar mi radicación" }),
  ).toHaveCount(0);
});
