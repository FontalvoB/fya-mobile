import { Result, policy } from "../domain/model";
import { normalizeSearch } from "../domain/catalogs";
export type ChatResponse = { text: string; suggestions: string[] };
export interface SupportService {
  reply(
    question: string,
    context?: { result: Result | null },
  ): Promise<ChatResponse>;
}
const knowledge: { keys: string[]; text: string; suggestions: string[] }[] = [
  {
    keys: [
      "persona",
      "humano",
      "agente",
      "telefono",
      "contactar",
      "asesoria personalizada",
    ],
    text: "Soy un asistente automático de esta demostración. Todavía no hay un canal humano conectado ni datos de contacto oficiales configurados. Puedes consultar las preguntas frecuentes o preguntarme cómo completar un paso.",
    suggestions: ["¿Qué documentos necesito?", "¿Cómo funciona la solicitud?"],
  },
  {
    keys: [
      "arriendo",
      "arrendamiento",
      "vivienda no",
      "casa no",
      "no es mia",
      "no es propia",
      "no soy propietario",
    ],
    text: "Al crear la cuenta indica si la vivienda donde resides es de tu propiedad. Si eliges No, debes adjuntar el contrato de arrendamiento, además del recibo de servicio público. Puedes reemplazar o eliminar los archivos antes de continuar.",
    suggestions: ["¿Qué formatos aceptan?", "¿Dónde adjunto el recibo?"],
  },
  {
    keys: [
      "nombramiento",
      "resolucion",
      "acreditacion",
      "acreditar",
      "docente",
      "pensionado",
    ],
    text: "En Documentos de cuenta selecciona Pensionado o Docente y el tipo de acreditación: acta de nombramiento, resolución u otro documento que acredite esa condición en Colombia. Adjunta el archivo; la demo comprueba formato y tamaño, sin validarlo oficialmente.",
    suggestions: ["¿Qué formatos aceptan?", "¿Qué documentos necesito?"],
  },
  {
    keys: ["recibo", "servicio publico", "factura", "90 dias"],
    text: `El recibo de servicio público se adjunta al crear la cuenta, no en la simulación. Selecciona el tipo de servicio, elige la fecha en el calendario y confirma la dirección. Debe ser de los últimos ${policy.maxAgeDays} días. Si cambias la dirección después, vuelve a confirmar el recibo en Documentos de cuenta.`,
    suggestions: ["¿Y si vivo en arriendo?", "¿Qué formatos aceptan?"],
  },
  {
    keys: [
      "formato",
      "tamano",
      "megabytes",
      "archivo grande",
      "pdf",
      "jpg",
      "png",
      "5 mb",
    ],
    text: `Puedes seleccionar PDF, JPG o PNG de hasta ${policy.maxBytes / 1024 / 1024} MB por archivo. Si aparece un error, comprueba la extensión, el tamaño y que no esté vacío. Usa Reemplazar para elegir otra versión o Eliminar para quitarla.`,
    suggestions: ["¿Qué documentos necesito?", "¿Se envían mis datos?"],
  },
  {
    keys: ["asesor", "comision", "codigo del asesor", "sin asesoria"],
    text: "Puedes realizar la solicitud por tu cuenta. En el simulador responde No a “¿Te acompaña un asesor?” y continúa sin código. Si respondes Sí, debes introducir el código que te entregó tu asesor. Se conserva con el resultado de prueba, pero no se verifica ni liquida una comisión real.",
    suggestions: [
      "¿Cómo funciona la solicitud?",
      "¿Qué significa el resultado?",
    ],
  },
  {
    keys: ["otp", "codigo", "correo", "celular", "sms", "verificacion"],
    text: "Los códigos de esta demo se muestran en pantalla y no se envían por correo ni SMS. Usa “Usar código de prueba” o escríbelo. Hay 3 intentos y vigencia de 15 minutos. Si se agotan o vence, espera a que se habilite generar otro código.",
    suggestions: ["¿Se envían mis datos?", "¿Cómo funciona la solicitud?"],
  },
  {
    keys: ["calendario", "fecha", "nacimiento", "expedicion"],
    text: "Toca el campo de fecha para abrir el calendario. Toca el año para elegirlo directamente y después selecciona mes y día. No necesitas escribir fechas. El nacimiento debe corresponder a una persona mayor de edad y la expedición no puede ser futura ni anterior al nacimiento.",
    suggestions: ["¿Cómo elijo mi ciudad?", "¿Qué documentos necesito?"],
  },
  {
    keys: ["ciudad", "departamento", "municipio", "estado civil", "selector"],
    text: "Elige primero el departamento y luego busca tu ciudad o municipio. La búsqueda acepta texto con o sin tildes. Al cambiar de departamento se limpia la ciudad para evitar combinaciones incorrectas. Estado civil, ocupación y género también se eligen desde listas.",
    suggestions: ["¿Cómo uso el calendario?", "¿Dónde adjunto el recibo?"],
  },
  {
    keys: [
      "privacidad",
      "datos",
      "informacion",
      "envian",
      "almacen",
      "segur",
      "guardar",
    ],
    text: "En esta fase todo funciona en el frontend. Los datos y esta conversación permanecen en memoria durante la sesión; no se envían a un servidor. El selector puede copiar archivos a la caché temporal del dispositivo. Usa información ficticia para probar.",
    suggestions: ["¿Qué documentos necesito?", "¿Qué significa el resultado?"],
  },
  {
    keys: ["salud", "enfermedad", "diagnostico", "seguro"],
    text: "Responde las nueve preguntas de salud. Si marcas Sí, añade el detalle solicitado. Eso no implica rechazo automático: el resultado de prueba indica que se requiere revisión de asegurabilidad. No realizo diagnósticos ni evaluaciones médicas.",
    suggestions: [
      "¿Qué significa el resultado?",
      "¿Cómo funciona la solicitud?",
    ],
  },
  {
    keys: ["resultado", "aprobado", "preaprob", "desembolso", "firma"],
    text: "El resultado es una viabilidad calculada con datos de prueba. No constituye aprobación, firma ni desembolso. Si la cuota supera la capacidad estimada, puedes ajustar monto o plazo y volver a simular.",
    suggestions: ["¿Cómo simulo un crédito?", "¿En qué va mi solicitud?"],
  },
  {
    keys: ["documento", "necesito", "soporte", "desprendible"],
    text: "Para crear la cuenta: ambas caras del documento de identidad, acreditación de pensionado/docente, recibo de servicio público y contrato de arrendamiento si la vivienda no es propia. La selfie es opcional. Durante la solicitud se adjunta el desprendible de pago.",
    suggestions: [
      "¿Dónde adjunto el recibo?",
      "¿Qué formatos aceptan?",
      "¿Y si vivo en arriendo?",
    ],
  },
  {
    keys: ["simul", "credito", "tasa", "cuota", "monto", "plazo"],
    text: "En el simulador puedes explorar por monto o cuota, ajustar el plazo e indicar ingresos y deducciones. El perfil viene de tu cuenta. Elige si te acompaña un asesor. La tasa y los cálculos son de prueba y no representan una oferta real.",
    suggestions: [
      "¿Puedo solicitar sin asesor?",
      "¿Qué significa el resultado?",
    ],
  },
  {
    keys: ["como funciona", "solicitud", "proceso", "empezar", "paso"],
    text: "Crea tu perfil, confirma los códigos de prueba y completa Documentos de cuenta. Después simula el crédito y recorre datos personales, declaración fiscal, salud, autorizaciones, desprendible y resumen. Puedes editar antes de confirmar.",
    suggestions: [
      "¿Qué documentos necesito?",
      "¿Cómo uso el calendario?",
      "¿Puedo solicitar sin asesor?",
    ],
  },
];
export const supportService: SupportService = {
  async reply(question, context) {
    const q = normalizeSearch(question);
    if (/seguimiento|en que va|estado de mi solicitud/.test(q))
      return {
        text: context?.result
          ? `Tu resultado local ${context.result.id} muestra ${context.result.favorable ? "viabilidad preliminar favorable" : "una simulación no viable"}. Puedes consultar Solicitudes para ver los pasos ilustrativos. No existe una revisión remota en esta demo.`
          : "Aún no hay una solicitud finalizada en esta sesión. Empieza por simular tu crédito y completar el recorrido. El seguimiento estará disponible al terminar.",
        suggestions: [
          "¿Cómo funciona la solicitud?",
          "¿Qué significa el resultado?",
        ],
      };
    const match = knowledge.find((item) =>
      item.keys.some((key) => q.includes(key)),
    );
    if (match) return { text: match.text, suggestions: match.suggestions };
    if (/^(hola|buenos dias|buenas|gracias|ok|buenas tardes)[!. ]*$/.test(q))
      return {
        text: q.includes("gracias")
          ? "Con gusto. Aquí estoy si necesitas orientación sobre otro paso."
          : "Hola, soy el asistente automático de FYA. Puedo orientarte sobre registro, documentos, fechas, simulación y asesores.",
        suggestions: [
          "¿Qué documentos necesito?",
          "¿Puedo solicitar sin asesor?",
          "¿Cómo funciona la solicitud?",
        ],
      };
    return {
      text: "No tengo una respuesta verificada para esa pregunta. Puedo ayudarte con los pasos y requisitos de esta app. Prueba con uno de estos temas; todavía no tengo un canal humano conectado.",
      suggestions: [
        "¿Qué documentos necesito?",
        "¿Cómo funciona la solicitud?",
        "¿Qué significa el resultado?",
      ],
    };
  },
};
