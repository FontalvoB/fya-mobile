import { test, expect, Page } from "@playwright/test";
async function demo(page: Page) {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Explorar con un perfil de prueba" })
    .click();
}
async function chooseDate(
  page: Page,
  label: string,
  year: number,
  month: string,
  date: string,
) {
  await page.getByRole("button", { name: label, exact: true }).click();
  await page.getByRole("button", { name: "Elegir año", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Buscar año", exact: true })
    .fill(String(year));
  await page.getByRole("button", { name: `Año ${year}`, exact: true }).click();
  await page.getByRole("button", { name: `Mes ${month}`, exact: true }).click();
  await page
    .getByRole("button", { name: `Seleccionar fecha ${date}`, exact: true })
    .click();
}
test("calendar and dependent searchable choices preserve edits", async ({
  page,
}) => {
  await demo(page);
  await page.getByRole("button", { name: "Perfil", exact: true }).click();
  await page
    .getByRole("button", { name: "Editar datos de mi solicitud", exact: true })
    .click();
  await chooseDate(page, "Fecha de nacimiento *", 1964, "Mayo", "1964-05-20");
  await expect(
    page.getByRole("button", { name: "Fecha de nacimiento *", exact: true }),
  ).toContainText("20 / 05 / 1964");
  await chooseDate(page, "Fecha de expedición *", 1983, "Junio", "1983-06-10");
  await page
    .getByRole("button", { name: "Estado civil *", exact: true })
    .click();
  await page.getByRole("button", { name: "Unión libre", exact: true }).click();
  await page
    .getByRole("button", { name: "Departamento *", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Buscar departamento" })
    .fill("antioquia");
  await page.getByRole("button", { name: "Antioquia", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Ciudad o municipio *", exact: true }),
  ).toContainText("Selecciona tu ciudad");
  await page
    .getByRole("button", { name: "Ciudad o municipio *", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Buscar ciudad o municipio" })
    .fill("medellin");
  await page.getByRole("button", { name: "Medellín", exact: true }).click();
  await page.screenshot({ path: "work/ajustes-datos.png" });
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await page.getByRole("button", { name: "Volver al paso anterior" }).click();
  await expect(
    page.getByRole("button", { name: "Estado civil *", exact: true }),
  ).toContainText("Unión libre");
  await expect(
    page.getByRole("button", { name: "Ciudad o municipio *", exact: true }),
  ).toContainText("Medellín");
});
test("adviser is conditional and can be removed for direct requests", async ({
  page,
}) => {
  await demo(page);
  await page.getByRole("button", { name: "Simular mi crédito" }).click();
  await page.getByRole("radio", { name: "Sí", exact: true }).click();
  await page
    .getByRole("button", { name: "Continuar con esta simulación" })
    .click();
  await expect(
    page.getByText("Ingresa el código del asesor", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Código del asesor *", exact: true })
    .fill("ASESOR-DEMO");
  await page
    .getByRole("button", { name: "Continuar con esta simulación" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Hablemos de ti." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Volver", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Código del asesor *", exact: true }),
  ).toHaveValue("ASESOR-DEMO");
  await page.getByRole("radio", { name: "No", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Código del asesor *" }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Continuar con esta simulación" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Hablemos de ti." }),
  ).toBeVisible();
});
test("chat answers free text, followups, unknown topics and works at 320px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  await expect(
    page.getByRole("img", { name: "FYA Social Capital" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Abrir asistente de ayuda" }).click();
  const field = page.getByRole("textbox", { name: "Escribe tu pregunta" });
  await field.fill("¿Dónde adjunto el recibo?");
  await page.getByRole("button", { name: "Enviar pregunta" }).click();
  await expect(
    page.getByText(
      "El recibo de servicio público se adjunta al crear la cuenta",
      { exact: false },
    ),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "¿Y si vivo en arriendo?", exact: true })
    .click();
  await expect(
    page.getByText("debes adjuntar el contrato de arrendamiento", {
      exact: false,
    }),
  ).toBeVisible();
  await field.fill("¿Cuál es la clave secreta del banco?");
  await field.press("Enter");
  await expect(
    page.getByText("No tengo una respuesta verificada", { exact: false }),
  ).toBeVisible();
  await page.screenshot({ path: "work/ajustes-chat.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
