import React from 'react';
import { Text } from 'react-native';
import { useSession } from '../state/session';
import { AccountEvidence, DocumentKey, Profile, LocalDocument } from '../domain/model';
import { accreditationTypes, utilityTypes } from '../domain/catalogues';
import { Card, Choice, Notice, Segments, YesNo, s } from './ui';
import { SectionHeading } from './visuals';
import { DocumentCard } from './DocumentCard';
import { ResidenceFields } from './ResidenceFields';
import { SelectField, DateField } from './SelectionFields';
export function AccountDocuments() {
 const {draft,setDraft}=useSession();const a=draft.account;
 function evidence(v:Partial<AccountEvidence>){setDraft(d=>({...d,account:{...d.account,...v},declaration:{...d.declaration,reviewed:false}}));}
 function profile(v:Partial<Profile>){setDraft(d=>({...d,profile:{...d.profile,...v},account:{...d.account,addressConfirmed:false},declaration:{...d.declaration,reviewed:false}}));}
 function document(key:DocumentKey,value:LocalDocument|undefined){setDraft(d=>({...d,documents:{...d.documents,[key]:value},declaration:{...d.declaration,reviewed:false}}));}
 return <>
   {Object.values(draft.documents).some(file=>file?.demo)&&<Notice>Este perfil utiliza archivos ficticios de demostración. Puedes reemplazarlos por archivos de prueba seleccionados en tu dispositivo.</Notice>}
   <SectionHeading number="01" title="Tu documento de identidad"/>
   <DocumentCard title="Frente del documento" hint="Buena luz, sin reflejos y con las cuatro esquinas visibles." value={draft.documents.front} onChange={value=>document('front',value)}/>
   <DocumentCard title="Reverso del documento" hint="Asegúrate de que el código y el texto se puedan leer." value={draft.documents.back} onChange={value=>document('back',value)}/>
   <SectionHeading number="02" title="Tu vínculo en Colombia" detail="Selecciona el perfil que puedes acreditar"/>
   <Card>
    <Text style={s.label}>Soy *</Text><Segments items={['Pensionado','Docente']} value={a.customerType} onChange={type=>{const customerType=type as 'Pensionado'|'Docente';setDraft(d=>({...d,account:{...d.account,customerType,accreditationType:''},profile:{...d.profile,occupation:type==='Docente'?'Docente':'Pensionado/a'},loan:{...d.loan,type,payer:type==='Pensionado'?'FOPEP':'Secretaría de Educación (prueba)',pensionDeduction:0},documents:{...d.documents,accreditation:undefined},declaration:{...d.declaration,reviewed:false}}));}}/>
    <SelectField label="Tipo de acreditación *" value={a.accreditationType} options={accreditationTypes} onChange={accreditationType=>evidence({accreditationType})}/>
   </Card>
   <DocumentCard title="Documento de acreditación" hint={a.customerType==='Docente'?'Acta de nombramiento, resolución u otro documento que acredite tu condición de docente en Colombia.':'Resolución u otro documento que acredite tu condición de pensionado en Colombia.'} value={draft.documents.accreditation} onChange={value=>document('accreditation',value)}/>
   <SectionHeading number="03" title="Tu residencia" detail="El recibo se solicita al crear tu cuenta"/>
   <Card><ResidenceFields profile={draft.profile} onChange={profile}/><YesNo label="¿La vivienda de residencia es de tu propiedad?" value={a.ownsHome} onChange={ownsHome=>{evidence({ownsHome});if(ownsHome)document('lease',undefined);}}/></Card>
   <DocumentCard title="Recibo de servicio público" hint="Un recibo con tu dirección y fecha de los últimos 90 días. No necesita estar a tu nombre." value={draft.documents.utility} onChange={value=>document('utility',value)}/>
   <Card>
     <SelectField label="Tipo de servicio *" value={a.utilityType} options={utilityTypes} onChange={utilityType=>evidence({utilityType})}/>
     <DateField label="Fecha de emisión del recibo *" value={a.utilityDate} onChange={utilityDate=>evidence({utilityDate})}/>
     <Choice label="El recibo corresponde a mi dirección de residencia" detail={`${draft.profile.address || 'Completa tu dirección'}, ${draft.profile.city || 'selecciona tu ciudad'}`} selected={a.addressConfirmed} onPress={()=>evidence({addressConfirmed:!a.addressConfirmed})}/>
     <Text style={s.small}>Comprobamos la fecha declarada y los metadatos del archivo. No se verifica oficialmente su contenido.</Text>
   </Card>
   {a.ownsHome===false&&<DocumentCard title="Contrato de arrendamiento" hint="Adjunta el contrato de la vivienda donde resides. Es obligatorio cuando indicas que la vivienda no es de tu propiedad." value={draft.documents.lease} onChange={value=>document('lease',value)}/>}
 </>;
}
