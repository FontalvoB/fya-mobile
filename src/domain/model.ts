export type LocalDocument = {
  name: string;
  uri: string;
  size: number;
  mimeType: string;
  demo?: boolean;
};
export type Profile = {
  firstName: string;
  secondName: string;
  lastName: string;
  secondLastName: string;
  docType: string;
  docNumber: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  expDate: string;
  address: string;
  city: string;
  department: string;
  civil: string;
  occupation: string;
};
export type Loan = {
  type: string;
  product: string;
  payer: string;
  modality: string;
  mode: "amount" | "payment";
  amount: number;
  payment: number;
  months: number;
  income: number;
  healthDeduction: number;
  pensionDeduction: number;
  otherDeduction: number;
};
export type Declaration = {
  us: boolean | null;
  other: boolean | null;
  tin: string;
  countries: string;
  taxConsent: boolean;
  health: (boolean | null)[];
  details: string[];
  riskConsent: boolean;
  dataConsent: boolean;
  channels: string[];
  commercial: boolean | null;
  utilityType: string;
  utilityDate: string;
  addressConfirmed: boolean;
  reviewed: boolean;
};
export type Result = {
  id: string;
  date: string;
  favorable: boolean;
  amount: number;
  payment: number;
  months: number;
  capacity: number;
  healthReview: boolean;
};
export type DocumentKey = "front" | "back" | "selfie" | "utility" | "payslip";
export type Draft = {
  profile: Profile;
  loan: Loan;
  declaration: Declaration;
  documents: Partial<Record<DocumentKey, LocalDocument>>;
};
export const policy = {
  maxBytes: 5 * 1024 * 1024,
  maxAgeDays: 90,
  mimeTypes: ["application/pdf", "image/jpeg", "image/png"],
  rate: 0.016,
  minAmount: 1000000,
  maxAmount: 120000000,
  minMonths: 12,
  maxMonths: 144,
  otpLifetime: 15 * 60 * 1000,
  otpAttempts: 3,
};
export const healthQuestions = [
  "¿Te han diagnosticado enfermedades del corazón o de la presión?",
  "¿Te han diagnosticado diabetes?",
  "¿Tienes o has tenido cáncer o tumores malignos?",
  "¿Tienes una enfermedad pulmonar crónica?",
  "¿Te han diagnosticado VIH o una enfermedad que baje tus defensas?",
  "¿Tienes una enfermedad psiquiátrica diagnosticada?",
  "¿Has tenido cirugías mayores en los últimos 5 años?",
  "¿Tomas medicamentos de forma permanente?",
  "¿Tienes una discapacidad física o cognitiva relevante?",
];
export const steps = [
  "Tus datos",
  "Residencia fiscal",
  "Salud",
  "Autorizaciones",
  "Soportes",
  "Resumen",
];
export const emptyProfile: Profile = {
  firstName: "",
  secondName: "",
  lastName: "",
  secondLastName: "",
  docType: "CC",
  docNumber: "",
  email: "",
  phone: "",
  gender: "",
  birthDate: "",
  expDate: "",
  address: "",
  city: "",
  department: "",
  civil: "",
  occupation: "",
};
export const demoProfile: Profile = {
  firstName: "Ana",
  secondName: "María",
  lastName: "Pérez",
  secondLastName: "López",
  docType: "CC",
  docNumber: "1012345678",
  email: "ana@ejemplo.test",
  phone: "3001234567",
  gender: "Femenino",
  birthDate: "1965-05-20",
  expDate: "1985-06-10",
  address: "Calle de ejemplo 12 # 34-56",
  city: "Bogotá",
  department: "Bogotá D.C.",
  civil: "Casado(a)",
  occupation: "Pensionado",
};
export const freshDraft = (): Draft => ({
  profile: { ...emptyProfile },
  loan: {
    type: "Pensionado",
    product: "Libre inversión",
    payer: "FOPEP",
    modality: "Otro",
    mode: "amount",
    amount: 30000000,
    payment: 650000,
    months: 96,
    income: 5000000,
    healthDeduction: 600000,
    pensionDeduction: 0,
    otherDeduction: 0,
  },
  declaration: {
    us: null,
    other: null,
    tin: "",
    countries: "",
    taxConsent: false,
    health: Array(9).fill(null),
    details: Array(9).fill(""),
    riskConsent: false,
    dataConsent: false,
    channels: [],
    commercial: null,
    utilityType: "Energía",
    utilityDate: "",
    addressConfirmed: false,
    reviewed: false,
  },
  documents: {},
});
export const money = (value: number) =>
  "$ " + Math.round(value).toLocaleString("es-CO");
export function estimate(loan: Loan) {
  const factor = policy.rate / (1 - Math.pow(1 + policy.rate, -loan.months));
  const amount =
    loan.mode === "amount" ? loan.amount : Math.round(loan.payment / factor);
  return {
    amount,
    payment: Math.round(amount * factor),
    capacity: Math.max(
      0,
      (loan.income -
        loan.healthDeduction -
        (loan.type === "Docente" ? loan.pensionDeduction : 0) -
        loan.otherDeduction) *
        0.5,
    ),
  };
}
export function dateValue(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const date = new Date(value + "T12:00:00Z");
  return Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
    ? date.getTime()
    : NaN;
}
export function age(value: string, now = new Date()) {
  const birth = new Date(value + "T12:00:00Z");
  let years = now.getUTCFullYear() - birth.getUTCFullYear();
  if (
    now.getUTCMonth() < birth.getUTCMonth() ||
    (now.getUTCMonth() === birth.getUTCMonth() &&
      now.getUTCDate() < birth.getUTCDate())
  )
    years--;
  return years;
}
export function validateDocument(file: LocalDocument): string | undefined {
  if (!policy.mimeTypes.includes(file.mimeType))
    return "Selecciona un PDF, JPG o PNG.";
  if (!Number.isFinite(file.size) || file.size <= 0)
    return "No pudimos comprobar el tamaño o el archivo está vacío. Elige otro archivo.";
  if (file.size > policy.maxBytes)
    return "El archivo supera los 5 MB. Selecciona una versión más pequeña.";
}
export function validateLoan(l: Loan): string | undefined {
  const e = estimate(l);
  if (
    !Object.values(l)
      .filter((v) => typeof v === "number")
      .every((v) => Number.isFinite(v) && v >= 0)
  )
    return "Revisa los valores: deben ser números positivos.";
  if (l.income <= 0) return "Ingresa tus ingresos mensuales.";
  if (l.months < 12 || l.months > 144 || !Number.isInteger(l.months))
    return "El plazo de prueba es de 12 a 144 meses.";
  if (e.amount < policy.minAmount || e.amount > policy.maxAmount)
    return "El monto de prueba debe estar entre $1.000.000 y $120.000.000.";
  if (l.healthDeduction + l.pensionDeduction + l.otherDeduction > l.income)
    return "Las deducciones no pueden superar tus ingresos.";
}
export function validateStep(d: Draft, step: number): string | undefined {
  const p = d.profile,
    a = d.declaration;
  if (step === 0) {
    if (
      [
        p.firstName,
        p.lastName,
        p.docNumber,
        p.email,
        p.phone,
        p.gender,
        p.birthDate,
        p.expDate,
        p.address,
        p.city,
        p.department,
        p.civil,
        p.occupation,
      ].some((x) => !x.trim())
    )
      return "Completa los campos obligatorios de tus datos.";
    if (
      !/^\S+@\S+\.\S+$/.test(p.email) ||
      !/^\d{10}$/.test(p.phone) ||
      !/^\d{6,12}$/.test(p.docNumber)
    )
      return "Revisa correo, celular de 10 dígitos y documento de 6 a 12 dígitos.";
    if (
      !Number.isFinite(dateValue(p.birthDate)) ||
      !Number.isFinite(dateValue(p.expDate)) ||
      age(p.birthDate) < 18 ||
      dateValue(p.expDate) > Date.now() ||
      dateValue(p.expDate) <= dateValue(p.birthDate)
    )
      return "Revisa las fechas (AAAA-MM-DD). Debes ser mayor de edad y la expedición debe ser posterior al nacimiento y no futura.";
  }
  if (step === 1) {
    if (a.us === null || a.other === null || !a.taxConsent)
      return "Responde las dos preguntas y acepta la declaración fiscal.";
    if ((a.us && !a.tin.trim()) || (a.other && !a.countries.trim()))
      return "Completa la identificación tributaria y los países que correspondan.";
  }
  if (step === 2) {
    if (a.health.some((x) => x === null))
      return "Responde las nueve preguntas de salud.";
    if (a.health.some((x, i) => x && a.details[i].trim().length < 5))
      return "Incluye un detalle de al menos 5 caracteres para cada respuesta Sí.";
  }
  if (step === 3) {
    if (
      !a.riskConsent ||
      !a.dataConsent ||
      !a.channels.length ||
      a.commercial === null
    )
      return "Elige al menos un canal, decide sobre publicidad y acepta las autorizaciones requeridas.";
  }
  if (step === 4) {
    if (!d.documents.utility || !d.documents.payslip)
      return "Adjunta el recibo de servicio público y el desprendible de pago obligatorios.";
    const error =
      validateDocument(d.documents.utility) ||
      validateDocument(d.documents.payslip);
    if (error) return error;
    const today = new Date();
    const issued = dateValue(a.utilityDate),
      days =
        (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 12) -
          issued) /
        86400000;
    if (!Number.isFinite(issued) || days < 0 || days > policy.maxAgeDays)
      return "El recibo debe tener una fecha válida de los últimos 90 días, sin fechas futuras.";
    if (!a.addressConfirmed)
      return "Confirma que el recibo corresponde a tu dirección.";
  }
  if (step === 5 && !a.reviewed)
    return "Confirma que revisaste la información de tu solicitud.";
}
export function validateAll(d: Draft) {
  return (
    validateLoan(d.loan) ||
    steps.map((_, i) => validateStep(d, i)).find(Boolean)
  );
}
