import React from 'react';
import { Profile } from '../domain/model';
import { departments, municipalities } from '../domain/catalogues';
import { Field } from './ui';
import { SelectField } from './SelectionFields';
export function ResidenceFields({ profile, onChange }: {profile:Profile;onChange:(value:Partial<Profile>)=>void}) {
  return <>
    <Field label="Dirección de residencia *" value={profile.address} autoCapitalize="words" onChangeText={address=>onChange({address})}/>
    <SelectField label="Departamento *" value={profile.department} options={departments} searchable onChange={department=>onChange({department,city:''})}/>
    <SelectField label="Ciudad o municipio *" value={profile.city} options={municipalities(profile.department)} searchable disabled={!profile.department} placeholder={profile.department?'Selecciona tu ciudad o municipio':'Primero elige el departamento'} onChange={city=>onChange({city})}/>
  </>;
}
