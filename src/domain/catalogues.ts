import catalogue from '../data/colombia.json';
export const departments = Object.keys(catalogue);
export const municipalities = (department: string): string[] =>
  (catalogue[department as keyof typeof catalogue] || []).map(city => city.name);
export const isLocation = (department: string, city: string) => municipalities(department).includes(city);
export const civilStatuses = ['Soltero/a', 'Casado/a', 'Unión libre', 'Separado/a', 'Divorciado/a', 'Viudo/a'];
export const occupations = ['Pensionado/a', 'Docente', 'Docente pensionado/a', 'Otra'];
export const genders = ['Femenino', 'Masculino', 'Otro', 'Prefiero no responder'];
export const accreditationTypes = ['Acta de nombramiento', 'Resolución', 'Otro documento de acreditación'];
export const utilityTypes = ['Energía', 'Agua', 'Gas', 'Otro'];
export const normalizeSearch = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
