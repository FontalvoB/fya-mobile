import {
  citiesOf,
  departments,
  civilStatuses,
  genders,
  isLocation,
} from "./catalogs";
import {
  Draft,
  LocalDocument,
  Profile,
  Result,
  dateValue,
  validateDocument,
} from "./model";

export const pepRelationships = [
  "Cónyuge / Compañero permanente",
  "Padres",
  "Hijos",
  "Hermanos",
  "Abuelos",
  "Nietos",
  "Suegros",
  "Otro",
];
export const filingDocTypes = [
  "Cédula de Ciudadanía",
  "Cédula de Extranjería",
  "Pasaporte",
  "Otro",
];
export const obligationTypes = [
  "Tarjetas de crédito y rotativos",
  "Otras libranzas",
  "Cooperativas",
  "Vehículo",
  "Microcrédito",
  "Otros créditos",
];
export type FilingEntry = {
  id: string;
  name: string;
  amount: string;
  type?: string;
};
export type FilingDraft = {
  resultId: string;
  step: string;
  values: Record<string, string>;
  deductions: FilingEntry[];
  purchases: FilingEntry[];
  obligations: Record<string, { payment: string; balance: string }>;
  documents: Partial<
    Record<"front" | "back" | "income" | "bank", LocalDocument>
  >;
  savedAt: string;
};
export type FilingReceipt = {
  id: string;
  resultId: string;
  date: string;
  snapshot: FilingDraft;
  credit: Result;
};
type Values = FilingDraft["values"];
export type FilingField = {
  key: string;
  label: string;
  kind?:
    | "text"
    | "digits"
    | "money"
    | "decimal"
    | "select"
    | "date"
    | "check"
    | "area";
  required?: boolean;
  locked?: boolean;
  options?: string[] | ((v: Values) => string[]);
  when?: (v: Values) => boolean;
  parent?: string;
  demo?: string;
};
export type FilingStep = {
  id: string;
  section: number;
  title: string;
  description: string;
  fields: FilingField[];
  kind?: "capacity" | "obligations" | "documents" | "summary";
  when?: (v: Values) => boolean;
};
export const filingSections = [
  "Solicitante",
  "PEP",
  "Actividad laboral",
  "Cónyuge",
  "Referencias",
  "Crédito",
  "Soportes",
  "Comentarios",
];
const f = (
  key: string,
  label: string,
  demo = "",
  extra: Partial<FilingField> = {},
): FilingField => ({ key, label, demo, required: true, ...extra });
const select = (
  key: string,
  label: string,
  options: string[],
  demo = options[0],
  extra: Partial<FilingField> = {},
) => f(key, label, demo, { kind: "select", options, ...extra });
const check = (key: string, label: string, required = true) =>
  f(key, label, "Sí", { kind: "check", required });
const moneyField = (key: string, label: string, demo = "0", required = false) =>
  f(key, label, demo, { kind: "money", required });
const allCities = [...new Set(departments.flatMap(citiesOf))].sort((a, b) =>
  a.localeCompare(b, "es"),
);
const location = (prefix: string): FilingField[] => [
  select(prefix + "Department", "Departamento", departments, "Atlántico"),
  f(prefix + "City", "Ciudad o municipio", "Barranquilla", {
    kind: "select",
    parent: prefix + "Department",
    options: (v) => citiesOf(v[prefix + "Department"]),
  }),
];
const pensioner = (v: Values) => v.activity === "Pensionado";
export const hasSpouse = (v: Values) =>
  ["Casado(a)", "Unión libre"].includes(v.civil);
const employerFields = (fields: FilingField[]) =>
  fields.map((field) => ({ ...field, when: (v: Values) => !pensioner(v) }));
const references = ["family1", "family2", "personal"].map(
  (prefix, index): FilingStep => ({
    id: prefix === "personal" ? "personalReference" : prefix,
    section: 4,
    title:
      index < 2
        ? `Referencia familiar ${index + 1} de 2`
        : "Referencia personal",
    description:
      index < 2
        ? "Una persona de tu familia; si es posible, que no viva contigo."
        : "Una persona que te conozca y no sea familiar.",
    fields: [
      f(
        prefix + "Name",
        "Nombre completo",
        ["Ana Prueba Ruiz", "Luis Prueba Gómez", "Carla Ejemplo Díaz"][index],
      ),
      select(
        prefix + "Relation",
        index < 2 ? "Parentesco" : "Relación",
        index < 2
          ? [
              "Madre",
              "Padre",
              "Hermano(a)",
              "Hijo(a)",
              "Tío(a)",
              "Primo(a)",
              "Otro familiar",
            ]
          : ["Amigo(a)", "Compañero(a) de trabajo", "Vecino(a)", "Otro"],
      ),
      f(prefix + "Address", "Dirección", "Calle de ejemplo 10 # 20-30"),
      ...location(prefix),
      f(
        prefix + "Phone",
        "Celular",
        ["3001112233", "3014445566", "3027778899"][index],
        { kind: "digits" },
      ),
      f(prefix + "Landline", "Teléfono fijo", "", {
        kind: "digits",
        required: false,
      }),
    ],
  }),
);
export const filingSteps: FilingStep[] = [
  {
    id: "identity",
    section: 0,
    title: "Tu identidad, a la mano.",
    description:
      "Los nombres, el documento y la fecha de nacimiento vienen de tu cuenta.",
    fields: [
      f("firstName", "Primer nombre", "", { locked: true }),
      f("secondName", "Segundo nombre", "", { locked: true, required: false }),
      f("lastName", "Primer apellido", "", { locked: true }),
      f("secondLastName", "Segundo apellido", "", {
        locked: true,
        required: false,
      }),
      f("docType", "Tipo de documento", "", { locked: true }),
      f("docNumber", "Número de documento", "", { locked: true }),
      f("birthDate", "Fecha de nacimiento", "", { locked: true }),
      select("issueCountry", "País de expedición", ["Colombia"]),
      select("issueCity", "Ciudad de expedición", allCities, "Barranquilla"),
      f("issueDate", "Fecha de expedición", "1985-06-10", { kind: "date" }),
    ],
  },
  {
    id: "personal",
    section: 0,
    title: "Un poco más de ti.",
    description:
      "Tu estado civil define si necesitamos información de tu cónyuge.",
    fields: [
      select("birthCountry", "País de nacimiento", ["Colombia"]),
      ...location("birth"),
      select("gender", "Género", genders),
      select("nationality", "Nacionalidad", ["Colombiana", "Otra"]),
      select("civil", "Estado civil", civilStatuses),
      f("dependants", "Personas a cargo", "2", { kind: "digits" }),
    ],
  },
  {
    id: "housing",
    section: 0,
    title: "Tu vivienda y educación.",
    description: "Completa tu perfil y los datos físicos para el seguro.",
    fields: [
      select(
        "stratum",
        "Estrato socioeconómico",
        ["1", "2", "3", "4", "5", "6"],
        "3",
      ),
      select("housing", "Tipo de vivienda", [
        "Propia",
        "Familiar",
        "Arrendada",
        "Hipotecada",
      ]),
      select("education", "Nivel de estudio", [
        "Bachiller",
        "Técnico",
        "Tecnólogo",
        "Profesional",
        "Especialización",
        "Maestría",
        "Doctorado",
      ]),
      f("weight", "Peso (kg)", "72", { kind: "decimal", required: false }),
      f("height", "Altura (m)", "1,74", { kind: "decimal", required: false }),
    ],
  },
  {
    id: "residence",
    section: 0,
    title: "Dónde estás hoy.",
    description: "Confirma tu residencia y tu contacto.",
    fields: [
      f("address", "Dirección de residencia", "Calle de ejemplo 12 # 34-56"),
      f("neighborhood", "Barrio", "El Prado"),
      ...location("residence"),
      f("phone", "Celular de la cuenta", "", { locked: true }),
      f("email", "Correo de la cuenta", "", { locked: true }),
      f("alternatePhone", "Teléfono alterno", "", {
        kind: "digits",
        required: false,
      }),
    ],
  },
  {
    id: "health",
    section: 0,
    title: "Tu salud, actualizada.",
    description: "Complementa la declaración de salud que ya respondiste.",
    fields: [
      check("covid", "Completé el esquema de vacunación COVID-19", false),
      select("doses", "Número de dosis", ["1", "2", "3", "4 o más"], "3", {
        when: (v) => v.covid === "Sí",
      }),
    ],
  },
  {
    id: "pep",
    section: 1,
    title: "Tu declaración PEP.",
    description:
      "Indica tu condición y si tienes vínculo familiar o cercano con una Persona Expuesta Políticamente.",
    fields: [
      select("pep", "¿Eres Persona Expuesta Políticamente (PEP)?", [
        "No",
        "Sí",
      ]),
      f("pepRole", "Cargo de la PEP", "Cargo público de prueba", {
        when: (v) => v.pep === "Sí",
      }),
      f("pepEntity", "Entidad de la PEP", "Entidad de prueba", {
        when: (v) => v.pep === "Sí",
      }),
      check("pepLink", "Tengo vínculo familiar o cercano con una PEP", false),
      select(
        "pepRelationship",
        "Tipo de parentesco",
        pepRelationships,
        "Hijos",
        { when: (v) => v.pepLink === "Sí" },
      ),
      select(
        "pepDocType",
        "Tipo de documento del familiar o cercano",
        filingDocTypes,
        "Cédula de Ciudadanía",
        { when: (v) => v.pepLink === "Sí" },
      ),
      f(
        "pepDocNumber",
        "Número de documento del familiar o cercano",
        "1023456789",
        { when: (v) => v.pepLink === "Sí" },
      ),
      f("pepName", "Nombre del familiar o cercano", "Persona de prueba", {
        when: (v) => v.pepLink === "Sí",
      }),
    ],
  },
  {
    id: "activity",
    section: 2,
    title: "De dónde vienen tus ingresos.",
    description: "Elige tu actividad principal.",
    fields: [
      select("activity", "Actividad principal", [
        "Empleado",
        "Pensionado",
        "Independiente",
        "Otro",
      ]),
      select(
        "pensionEntity",
        "Entidad que paga tu pensión",
        [
          "FOPEP",
          "Colpensiones (prueba)",
          "Fiduprevisora (prueba)",
          "Otra entidad",
        ],
        "FOPEP",
        { when: pensioner },
      ),
      select(
        "pensionType",
        "Tipo de pensión",
        ["Vejez", "Invalidez", "Sobrevivientes", "Sustitución"],
        "Vejez",
        { when: pensioner },
      ),
      ...employerFields([
        select("employer", "Empresa o pagaduría", [
          "Secretaría de Educación de Barranquilla (prueba)",
          "Secretaría de Educación del Atlántico (prueba)",
          "Secretaría de Educación de Malambo (prueba)",
          "Otra entidad",
        ]),
        f("tenure", "Antigüedad laboral (meses)", "64", { kind: "digits" }),
        select("contract", "Tipo de contrato", [
          "Indefinido",
          "Fijo",
          "Obra o labor",
          "Prestación de servicios",
        ]),
        select("employment", "Tipo de vinculación", [
          "En propiedad",
          "Provisional vacante definitiva",
          "Provisional vacante temporal",
          "Periodo de prueba",
        ]),
      ]),
    ],
  },
  {
    id: "cashflow",
    section: 2,
    title: "Tu flujo mensual.",
    description:
      "Registra tus ingresos y gastos mensuales en pesos colombianos.",
    fields: [
      moneyField("income", "Ingreso mensual promedio", "5000000", true),
      moneyField("additionalIncome", "Ingresos adicionales"),
      moneyField("rentIncome", "Arrendamientos"),
      moneyField("fixedExpenses", "Gastos fijos mensuales", "1200000"),
      moneyField("otherPayments", "Cuotas de otros créditos", "250000"),
      moneyField("otherExpenses", "Otras obligaciones"),
    ],
  },
  {
    id: "assets",
    section: 2,
    title: "Lo que tienes y lo que debes.",
    description:
      "Si no tienes activos o pasivos, puedes dejar el valor en cero.",
    fields: [
      moneyField("assets", "Activos (casa, carro, ahorros)", "120000000"),
      moneyField("otherAssets", "Otros activos", "5000000"),
      moneyField("liabilities", "Pasivos (deudas)", "18000000"),
      moneyField("otherLiabilities", "Otros pasivos"),
    ],
  },
  {
    id: "work",
    section: 2,
    title: "Tu contacto laboral.",
    description: "Los pensionados no necesitan completar un lugar de trabajo.",
    fields: [
      ...employerFields([
        f("jobTitle", "Cargo", "Docente"),
        f("workAddress", "Dirección de trabajo", "Calle de ejemplo 34 # 43-31"),
        select("workCity", "Ciudad de trabajo", allCities, "Barranquilla"),
        f("workPhone", "Teléfono de trabajo", "6053000000", { kind: "digits" }),
        f("extension", "Extensión", "", { kind: "digits", required: false }),
        select("companyType", "Tipo de empresa", [
          "Pública",
          "Privada",
          "Mixta",
        ]),
      ]),
      check(
        "truthDeclaration",
        "Declaro que los datos consignados son verídicos y reflejan mi situación económica real",
      ),
      check(
        "changeDeclaration",
        "Me comprometo a notificar variaciones significativas en mis ingresos o endeudamiento",
      ),
    ],
  },
  {
    id: "spouseIdentity",
    section: 3,
    title: "La identidad de tu cónyuge.",
    description: "Esta sección aplica por tu estado civil.",
    when: hasSpouse,
    fields: [
      f("spouseName", "Nombre completo del cónyuge", "Laura Ejemplo Prueba"),
      select(
        "spouseDocType",
        "Tipo de documento del cónyuge",
        filingDocTypes.slice(0, 3),
      ),
      f("spouseDocNumber", "Número de documento del cónyuge", "1098765432"),
      select("spouseGender", "Género del cónyuge", genders),
    ],
  },
  {
    id: "spouseActivity",
    section: 3,
    title: "Su contacto y actividad.",
    description: "Información para el análisis de capacidad conjunta.",
    when: hasSpouse,
    fields: [
      f("spousePhone", "Celular del cónyuge", "3125550101", { kind: "digits" }),
      f("spouseEmail", "Correo del cónyuge", "laura@ejemplo.test", {
        required: false,
      }),
      f("spouseOccupation", "Profesión u ocupación del cónyuge", "Enfermera"),
      f(
        "spouseEmployer",
        "Empresa o entidad pagadora del cónyuge",
        "Clínica de prueba",
        { required: false },
      ),
      moneyField("spouseIncome", "Ingreso mensual del cónyuge", "2900000"),
    ],
  },
  {
    id: "spouseConsent",
    section: 3,
    title: "Sus obligaciones y autorización.",
    description:
      "Tu cónyuge debe conocer que compartes estos datos. FYA podrá contactarlo para confirmarlos.",
    when: hasSpouse,
    fields: [
      select("spouseShared", "¿Comparte obligaciones o bienes contigo?", [
        "Sí",
        "No",
      ]),
      check(
        "spouseConsent",
        "Autorizo el uso de los datos de mi cónyuge para el análisis de capacidad conjunta y su verificación en bases autorizadas",
      ),
    ],
  },
  ...references,
  {
    id: "bank",
    section: 5,
    title: "La cuenta para tus planes.",
    description: "La cuenta bancaria debe estar a tu nombre.",
    fields: [
      select("bank", "Banco", [
        "Bancolombia",
        "Banco de Bogotá",
        "Davivienda",
        "BBVA",
        "Banco Popular",
        "Banco Agrario",
        "Nequi (cuenta de ahorros)",
        "Otro banco",
      ]),
      select("accountType", "Tipo de cuenta", ["Ahorros", "Corriente"]),
      f("accountNumber", "Número de cuenta", "12345678901", { kind: "digits" }),
      select("purpose", "¿Para qué usarás el dinero?", [
        "Libre inversión",
        "Educación",
        "Salud",
        "Vivienda",
        "Capital de trabajo",
        "Otro",
      ]),
    ],
  },
  {
    id: "capacity",
    section: 5,
    title: "Tu capacidad de descuento.",
    description:
      "Revisa las deducciones y las compras de cartera antes de continuar.",
    fields: [],
    kind: "capacity",
  },
  {
    id: "obligations",
    section: 5,
    title: "Tus otras obligaciones.",
    description:
      "Registra la cuota mensual y el saldo de cada categoría que aplique.",
    fields: [],
    kind: "obligations",
  },
  {
    id: "documents",
    section: 6,
    title: "Los soportes de tu crédito.",
    description:
      "Usa tu identidad del registro y adjunta los soportes de esta radicación.",
    fields: [],
    kind: "documents",
  },
  {
    id: "summary",
    section: 7,
    title: "Todo listo para radicar.",
    description:
      "Revisa las ocho secciones antes de confirmar con un código de prueba.",
    fields: [
      f(
        "comments",
        "Tu comentario",
        "Prefiero que me llamen en la tarde. (Prueba)",
        { kind: "area", required: false },
      ),
      check("reviewed", "Revisé y confirmo la información de la radicación"),
    ],
    kind: "summary",
  },
];

export const activeFilingSteps = (d: FilingDraft) =>
  filingSteps.filter((step) => !step.when || step.when(d.values));
export const visibleFilingFields = (step: FilingStep, d: FilingDraft) =>
  step.fields.filter((field) => !field.when || field.when(d.values));
export const fieldOptions = (field: FilingField, values: Values) =>
  typeof field.options === "function"
    ? field.options(values)
    : field.options || [];
const identityKeys = [
  "firstName",
  "secondName",
  "lastName",
  "secondLastName",
  "docType",
  "docNumber",
  "birthDate",
  "phone",
  "email",
] as const;
export function freshFiling(d: Draft, result: Result): FilingDraft {
  const values: Values = {
    ...Object.fromEntries(identityKeys.map((key) => [key, d.profile[key]])),
    issueDate: d.profile.expDate,
    civil: d.profile.civil,
    gender: d.profile.gender,
    address: d.profile.address,
    residenceDepartment: d.profile.department,
    residenceCity: d.profile.city,
    activity:
      d.account.customerType === "Pensionado" ? "Pensionado" : "Empleado",
    income: String(d.loan.income),
    dependants: "0",
    issueCountry: "Colombia",
    birthCountry: "Colombia",
    nationality: "Colombiana",
    pepLink: "No",
    covid: "No",
  };
  return {
    resultId: result.id,
    step: "identity",
    values,
    deductions: [],
    purchases: [],
    obligations: {},
    documents: {},
    savedAt: new Date().toISOString(),
  };
}
export function changeFilingValues(d: FilingDraft, patch: Values): FilingDraft {
  const values: Values = { ...d.values, ...patch, reviewed: "No" };
  if ("reviewed" in patch) values.reviewed = patch.reviewed;
  for (const field of filingSteps.flatMap((step) => step.fields))
    if (
      field.parent &&
      field.parent in patch &&
      patch[field.parent] !== d.values[field.parent]
    )
      values[field.key] = "";
  if (patch.pep === "No") {
    values.pepRole = "";
    values.pepEntity = "";
  }
  if (patch.pepLink === "No")
    for (const key of [
      "pepRelationship",
      "pepDocType",
      "pepDocNumber",
      "pepName",
    ])
      values[key] = "";
  if (patch.covid === "No") values.doses = "";
  if ("civil" in patch && !hasSpouse(values))
    for (const key of Object.keys(values))
      if (key.startsWith("spouse")) values[key] = "";
  if ("activity" in patch && patch.activity !== d.values.activity) {
    for (const key of pensioner(values)
      ? [
          "employer",
          "tenure",
          "contract",
          "employment",
          "jobTitle",
          "workAddress",
          "workCity",
          "workPhone",
          "extension",
          "companyType",
        ]
      : ["pensionEntity", "pensionType"])
      values[key] = "";
  }
  return { ...d, values, savedAt: new Date().toISOString() };
}
const number = (value?: string) =>
  value?.trim() ? Number(value.replace(",", ".")) : 0;
export function filingCalculations(d: FilingDraft, result: Result) {
  const v = d.values;
  const income =
    number(v.income) + number(v.additionalIncome) + number(v.rentIncome);
  const expenses =
    number(v.fixedExpenses) + number(v.otherPayments) + number(v.otherExpenses);
  const statutory = Math.round(number(v.income) * (pensioner(v) ? 0.12 : 0.08));
  const deductions = d.deductions.reduce(
    (sum, item) => sum + number(item.amount),
    0,
  );
  const limit = Math.max(0, Math.round((number(v.income) - statutory) / 2));
  const debtPayment = Object.values(d.obligations).reduce(
    (sum, item) => sum + number(item.payment),
    0,
  );
  const debtBalance = Object.values(d.obligations).reduce(
    (sum, item) => sum + number(item.balance),
    0,
  );
  const purchases = d.purchases.reduce(
    (sum, item) => sum + number(item.amount),
    0,
  );
  return {
    income,
    expenses,
    net: income - expenses,
    equity:
      number(v.assets) +
      number(v.otherAssets) -
      number(v.liabilities) -
      number(v.otherLiabilities),
    statutory,
    deductions,
    limit,
    margin: limit - result.payment - deductions,
    usedPercent: limit ? ((result.payment + deductions) / limit) * 100 : 0,
    basicExpenses: Math.round(income * 0.25),
    debtPayment,
    debtBalance,
    available: income - statutory - Math.round(income * 0.25) - debtPayment,
    debtPercent: income ? ((debtPayment + result.payment) / income) * 100 : 0,
    salaryRatio: income ? debtBalance / income : 0,
    purchases,
    payout: result.amount - purchases,
  };
}
export function validateFilingStep(
  d: FilingDraft,
  step: FilingStep,
  result: Result,
): string | undefined {
  if (step.when && !step.when(d.values)) return;
  const v = d.values;
  for (const field of visibleFilingFields(step, d)) {
    const value = (v[field.key] || "").trim();
    if (
      field.required &&
      (!value || (field.kind === "check" && value !== "Sí"))
    )
      return `Completa: ${field.label}.`;
    if (!value) continue;
    if (field.kind === "select" && !fieldOptions(field, v).includes(value))
      return `Selecciona una opción válida: ${field.label}.`;
    if (["digits", "money"].includes(field.kind || "") && !/^\d+$/.test(value))
      return `Usa solo números positivos en ${field.label}.`;
    if (
      ["money", "digits", "decimal"].includes(field.kind || "") &&
      (!Number.isFinite(number(value)) ||
        number(value) < 0 ||
        number(value) > Number.MAX_SAFE_INTEGER)
    )
      return `Revisa el valor de ${field.label}.`;
    if (field.kind === "decimal" && !/^\d+([.,]\d{1,2})?$/.test(value))
      return `Revisa el valor de ${field.label}.`;
    if (value.length > (field.kind === "area" ? 2000 : 250))
      return `${field.label}: el texto es demasiado largo.`;
  }
  if (
    step.id === "identity" &&
    (!Number.isFinite(dateValue(v.issueDate)) ||
      dateValue(v.issueDate) > Date.now() ||
      dateValue(v.issueDate) <= dateValue(v.birthDate))
  )
    return "Revisa la expedición: debe ser posterior al nacimiento y no futura.";
  if (step.id === "personal" && !isLocation(v.birthDepartment, v.birthCity))
    return "Selecciona un departamento y ciudad de nacimiento que correspondan.";
  if (
    step.id === "personal" &&
    (!Number.isInteger(number(v.dependants)) || number(v.dependants) > 15)
  )
    return "Las personas a cargo deben estar entre 0 y 15.";
  if (
    step.id === "residence" &&
    !isLocation(v.residenceDepartment, v.residenceCity)
  )
    return "Selecciona un departamento y ciudad de residencia que correspondan.";
  if (
    step.id === "housing" &&
    ((v.weight && (number(v.weight) <= 0 || number(v.weight) > 500)) ||
      (v.height && (number(v.height) < 0.5 || number(v.height) > 2.8)))
  )
    return "Revisa peso en kg y altura en metros.";
  if (
    step.id === "pep" &&
    v.pepLink === "Sí" &&
    !validIdentityNumber(v.pepDocType, v.pepDocNumber)
  )
    return "Revisa el número de documento del familiar o cercano con PEP.";
  if (
    step.id === "spouseIdentity" &&
    !validIdentityNumber(v.spouseDocType, v.spouseDocNumber)
  )
    return "Revisa el número de documento del cónyuge.";
  if (
    step.id === "spouseActivity" &&
    (!/^3\d{9}$/.test(v.spousePhone) ||
      (v.spouseEmail && !/^\S+@\S+\.\S+$/.test(v.spouseEmail)))
  )
    return "Revisa el celular de 10 dígitos y el correo del cónyuge.";
  if (step.section === 4) {
    const reference = step.id === "personalReference" ? "personal" : step.id;
    const phone = v[reference + "Phone"];
    if (
      !/^3\d{9}$/.test(phone) ||
      phone === v.phone ||
      ["family1", "family2", "personal"].some(
        (prefix) => prefix !== reference && v[prefix + "Phone"] === phone,
      )
    )
      return "El celular de la referencia debe empezar por 3, tener 10 dígitos y ser distinto al tuyo y al de las otras referencias.";
    if (!isLocation(v[reference + "Department"], v[reference + "City"]))
      return "Revisa departamento y ciudad de la referencia.";
  }
  if (step.id === "cashflow" && number(v.income) <= 0)
    return "El ingreso mensual promedio debe ser mayor que cero.";
  if (step.id === "bank" && !/^\d{6,25}$/.test(v.accountNumber))
    return "El número de cuenta debe tener de 6 a 25 dígitos.";
  if (step.kind === "capacity") {
    for (const item of [...d.deductions, ...d.purchases])
      if (
        !item.name.trim() ||
        !/^\d+$/.test(item.amount) ||
        !Number.isSafeInteger(number(item.amount)) ||
        number(item.amount) <= 0 ||
        (item.type &&
          !["Regular", "Cartera", "Saneamiento"].includes(item.type))
      )
        return "Completa el concepto o entidad y un valor positivo para cada deducción o cartera.";
    const c = filingCalculations(d, result);
    if (c.margin < 0)
      return "La cuota y las deducciones superan la capacidad de descuento de referencia. Revisa los valores antes de continuar.";
    if (c.payout < 0)
      return "La compra de cartera no puede superar el monto preaprobado.";
  }
  if (step.kind === "obligations")
    for (const item of Object.values(d.obligations))
      for (const value of [item.payment, item.balance])
        if (
          value &&
          (!/^\d+$/.test(value) || !Number.isSafeInteger(number(value)))
        )
          return "Revisa las cuotas y saldos: usa valores positivos sin decimales.";
  if (step.kind === "documents") {
    for (const [key, label] of [
      ["front", "frente de identidad"],
      ["back", "reverso de identidad"],
      ["income", "comprobante de ingresos"],
      ["bank", "certificado bancario"],
    ] as const) {
      const file = d.documents[key];
      if (!file) return `Adjunta el ${label}.`;
      const issue = validateDocument(file);
      if (issue) return `${label}: ${issue}`;
    }
    const issued = dateValue(v.bankCertificateDate);
    const today = new Date();
    const days =
      (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 12) -
        issued) /
      86400000;
    if (!Number.isFinite(issued) || days < 0 || days > 30)
      return "El certificado bancario debe tener una fecha válida de los últimos 30 días.";
    if (v.accountOwner !== "Sí")
      return "Confirma que el certificado y la cuenta bancaria están a tu nombre.";
  }
}
function validIdentityNumber(type: string, value: string) {
  return type === "Cédula de Ciudadanía"
    ? /^\d{6,12}$/.test(value || "")
    : /^[a-zA-Z0-9-]{3,25}$/.test(value || "");
}
export function validateFiling(
  d: FilingDraft,
  result: Result,
  profile?: Profile,
) {
  if (!result.favorable || result.id !== d.resultId)
    return "La radicación requiere la preaprobación vigente de esta solicitud.";
  if (profile && identityKeys.some((key) => d.values[key] !== profile[key]))
    return "La identidad de la radicación debe coincidir con tu cuenta.";
  return activeFilingSteps(d)
    .map((step) => validateFilingStep(d, step, result))
    .find(Boolean);
}
export function createFilingReceipt(
  d: FilingDraft,
  result: Result,
  profile: Profile,
  now = new Date(),
): FilingReceipt {
  const issue = validateFiling(d, result, profile);
  if (issue) throw new Error(issue);
  return {
    id: "RAD-DEMO-" + now.getTime().toString(36).toUpperCase(),
    resultId: result.id,
    date: now.toISOString(),
    snapshot: JSON.parse(JSON.stringify(d)),
    credit: { ...result },
  };
}
