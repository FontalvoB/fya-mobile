import { test, expect, Page } from "@playwright/test";
async function visualReady(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map((image) =>
        image.decode().catch(() => undefined),
      ),
    );
  });
  await page.waitForTimeout(450);
}
async function upload(
  page: Page,
  label: string,
  name = "recibo-demo.pdf",
  mimeType = "application/pdf",
  buffer = Buffer.from("%PDF-1.4\nDocumento ficticio de prueba\n%%EOF"),
) {
  const chooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: label, exact: true }).click();
  await (await chooser).setFiles({ name, mimeType, buffer });
}
async function start(page: Page) {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Explorar con un perfil de prueba" })
    .click();
  await visualReady(page);
  await page.screenshot({ path: "work/v2-inicio-390.png" });
  await page.getByRole("button", { name: "Simular mi crédito" }).click();
  await visualReady(page);
  await page.screenshot({ path: "work/v2-simulador.png" });
  await page
    .getByRole("button", { name: "Continuar con esta simulación" })
    .click();
}
test("full application with conditional fields, documents, editing and tracking", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await start(page);
  await visualReady(page);
  await page.screenshot({ path: "work/v2-datos.png" });
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(
    page.getByText("Responde las dos preguntas y acepta"),
  ).toBeVisible();
  await page.getByRole("radio", { name: "Sí", exact: true }).first().click();
  await page.getByRole("radio", { name: "No", exact: true }).nth(1).click();
  await page
    .getByRole("checkbox", {
      name: "Declaro que la información fiscal es correcta",
    })
    .click();
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(
    page.getByText("Completa la identificación tributaria"),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Número TIN o SSN *", exact: true })
    .fill("TIN-PRUEBA");
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(
    page.getByRole("radio", { name: "No", exact: true }),
  ).toHaveCount(9);
  for (const no of await page
    .getByRole("radio", { name: "No", exact: true })
    .all())
    await no.click();
  await page.getByRole("radio", { name: "Sí", exact: true }).first().click();
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(page.getByText("Incluye un detalle de al menos")).toBeVisible();
  await page
    .getByRole("textbox", { name: "Detalle de salud 1 *" })
    .fill("Diagnóstico ficticio para revisión.");
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
  await visualReady(page);
  await page.screenshot({ path: "work/soportes.png" });
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(
    page.getByText("Adjunta el recibo de servicio público y el desprendible"),
  ).toBeVisible();
  await upload(
    page,
    "Seleccionar recibo de servicio público",
    "incorrecto.txt",
    "text/plain",
    Buffer.from("Archivo de prueba"),
  );
  await expect(page.getByText("Selecciona un PDF, JPG o PNG.")).toBeVisible();
  await upload(
    page,
    "Seleccionar recibo de servicio público",
    "grande.pdf",
    "application/pdf",
    Buffer.alloc(5 * 1024 * 1024 + 1, 32),
  );
  await expect(
    page.getByText("El archivo supera los 5 MB.", { exact: false }),
  ).toBeVisible();
  await upload(page, "Seleccionar recibo de servicio público");
  await expect(
    page.getByText("recibo-demo.pdf", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Eliminar recibo de servicio público" })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Seleccionar recibo de servicio público",
    }),
  ).toBeVisible();
  await upload(page, "Seleccionar recibo de servicio público");
  await upload(
    page,
    "Reemplazar recibo de servicio público",
    "recibo-reemplazado.pdf",
  );
  await page
    .getByRole("textbox", {
      name: "Fecha de emisión del recibo * (AAAA-MM-DD)",
    })
    .fill(new Date().toISOString().slice(0, 10));
  await page
    .getByRole("checkbox", {
      name: "El recibo corresponde a mi dirección de residencia",
    })
    .click();
  await upload(page, "Seleccionar desprendible de pago", "mesada-demo.pdf");
  await visualReady(page);
  await page.screenshot({ path: "work/documentos-seleccionados.png" });
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await page.getByRole("button", { name: "Editar residencia fiscal" }).click();
  await expect(
    page.getByRole("textbox", { name: "Número TIN o SSN *" }),
  ).toHaveValue("TIN-PRUEBA");
  await page
    .getByRole("button", { name: "Guardar y volver al resumen" })
    .click();
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
    page.getByText("Un paso más cerca.", { exact: true }),
  ).toBeVisible();
  await visualReady(page);
  await page.screenshot({ path: "work/resultado.png" });
  await page.getByRole("button", { name: "Ver seguimiento de prueba" }).click();
  await expect(
    page.getByText("Viabilidad preliminar favorable", { exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
  await page.getByRole("button", { name: "Volver al inicio" }).click();
  await page.getByRole("button", { name: "Simular mi crédito" }).click();
  await page
    .getByRole("textbox", { name: "Ingresos mensuales (COP)", exact: true })
    .fill("700000");
  await page
    .getByRole("button", { name: "Continuar con esta simulación" })
    .click();
  for (const heading of [
    "Hablemos de ti.",
    "Tu residencia fiscal.",
    "Tu bienestar importa.",
    "Tú tienes el control.",
    "Tus soportes, aquí.",
  ]) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    await page.getByRole("button", { name: "Guardar y continuar" }).click();
  }
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
    page.getByRole("heading", { name: "Busquemos otro equilibrio." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ver seguimiento de prueba" }).click();
  await expect(
    page.getByText("Simulación no viable", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("No iniciada.", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
test("registration OTP and identity files", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Comenzar mi registro" }).click();
  await visualReady(page);
  await page.screenshot({ path: "work/v2-registro.png" });
  await page.getByRole("button", { name: "Continuar al código" }).click();
  await expect(page.getByText("Escribe tu primer nombre.")).toBeVisible();
  await page
    .getByRole("button", { name: "Completar con datos de ejemplo" })
    .click();
  await page
    .getByRole("checkbox", {
      name: "Autorizo el tratamiento de datos y el contacto de registro",
    })
    .click();
  await page.getByRole("button", { name: "Continuar al código" }).click();
  await page
    .getByRole("textbox", { name: "Código de 6 dígitos" })
    .fill("000000");
  await page.getByRole("button", { name: "Verificar código" }).click();
  await expect(
    page.getByText("Código incorrecto.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Usar código de prueba" }).click();
  await page.getByRole("button", { name: "Verificar código" }).click();
  await expect(
    page.getByText("Ahora, tu celular.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Usar código de prueba" }).click();
  await page.getByRole("button", { name: "Verificar código" }).click();
  await visualReady(page);
  await page.screenshot({ path: "work/v2-identidad.png" });
  await page.getByRole("button", { name: "Continuar a revisión" }).click();
  await expect(
    page.getByText("Selecciona las dos caras de tu documento."),
  ).toBeVisible();
  await upload(page, "Seleccionar frente del documento", "frente.pdf");
  await upload(page, "Seleccionar reverso del documento", "reverso.pdf");
  await page.getByRole("button", { name: "Continuar a revisión" }).click();
  await page
    .getByRole("button", { name: "Simular revisión favorable" })
    .click();
  await expect(page.getByText("Hola, Ana.", { exact: true })).toBeVisible();
});
test("responsive welcome and secondary screens", async ({ page }) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Comenzar mi registro" }),
    ).toBeVisible();
    const feature = await page
      .getByText("Tú decides", { exact: true })
      .boundingBox();
    expect(feature!.x + feature!.width).toBeLessThanOrEqual(width);
    await visualReady(page);
    await page.screenshot({ path: `work/bienvenida-${width}.png` });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
  await page
    .getByRole("button", { name: "Explorar con un perfil de prueba" })
    .click();
  await visualReady(page);
  await page.screenshot({ path: "work/inicio.png" });
  await page.getByRole("button", { name: "Créditos", exact: true }).click();
  await expect(
    page.getByText("Aún no hay créditos para mostrar"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Volver", exact: true }).click();
  await page.getByRole("button", { name: "Perfil", exact: true }).click();
  await page
    .getByRole("button", { name: "Ayuda y preguntas frecuentes" })
    .click();
  await page.getByRole("button", { name: "¿Se envía mi información?" }).click();
  await expect(
    page.getByText("No. Los datos están en memoria", { exact: false }),
  ).toBeVisible();
});
