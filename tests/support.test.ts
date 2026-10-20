import { test } from "node:test";
import assert from "node:assert/strict";
import { supportService } from "../src/services/support";
import {
  departments,
  citiesOf,
  isLocation,
  normalizeSearch,
} from "../src/domain/catalogs";
test("location catalogue covers all departments and dependent municipalities", () => {
  assert.equal(departments.length, 33);
  assert.ok(citiesOf("Antioquia").length > 100);
  assert.deepEqual(citiesOf("Bogotá D.C."), ["Bogotá"]);
  assert.equal(isLocation("Atlántico", "Medellín"), false);
  assert.equal(normalizeSearch("  Bogotá  "), "bogota");
});
test("support explains utility at account creation and conditional lease", async () => {
  assert.match(
    (await supportService.reply("¿Dónde adjunto el recibo?")).text,
    /crear la cuenta/,
  );
  assert.match(
    (await supportService.reply("vivo en arriendo")).text,
    /contrato de arrendamiento/,
  );
});
test("support explains direct requests and avoids invented answers", async () => {
  assert.match(
    (await supportService.reply("¿Puedo solicitar sin asesor?")).text,
    /por tu cuenta/,
  );
  assert.match(
    (await supportService.reply("¿Cuál es la clave secreta del banco?")).text,
    /No tengo una respuesta verificada/,
  );
});
test("support never claims a human conversation or remote review", async () => {
  assert.match(
    (await supportService.reply("quiero hablar con un humano")).text,
    /no hay un canal humano/,
  );
  assert.match(
    (await supportService.reply("¿En qué va mi solicitud?", { result: null }))
      .text,
    /Aún no hay/,
  );
});
