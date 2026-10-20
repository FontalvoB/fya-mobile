# Catálogo geográfico local

Se conserva el catálogo y las opciones añadidas por el usuario en `273061b` y se amplía su cobertura con un snapshot público de la capa [Municipios Colombia del DANE](https://geoportal.dane.gov.co/mparcgis/rest/services/Hosted/Municipios_Colombia/FeatureServer/0), descargado el 20 de octubre de 2026. No se consultan servicios externos al completar formularios.

Consulta: `/query?where=1%3D1&outFields=mpcodigo%2Cmpnombre%2Cdepto&returnGeometry=false&f=json&resultRecordCount=2000`.

El servicio devolvió 1.122 registros sin indicar truncamiento. Se excluyó el registro `00000` (“Area En Litigio Cauca - Huila”), que no identifica un municipio seleccionable. El registro `11001` se asigna a Bogotá D.C. y se muestra como Bogotá, coherente con el catálogo existente. `colombia.json` conserva 1.121 registros con código/nombre, agrupados en 33 departamentos/distrito.

`domain/catalogs.ts` agrega esas ubicaciones a las opciones previas del usuario y elimina nombres duplicados. Conserva sus denominaciones y listas de estado civil, ocupación, género y documentos. Las denominaciones alternativas de ciudades del catálogo previo siguen disponibles; no se presentan como registros adicionales oficiales del DANE. La búsqueda ignora mayúsculas y tildes.

Esto es un snapshot de la capa consultada, no una garantía de vigencia administrativa continua. Para producción, acordar una fuente versionada de DIVIPOLA y actualizar códigos y alias de forma controlada.
