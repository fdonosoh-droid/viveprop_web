// Datos compartidos entre módulos — se poblan desde la API al iniciar
export const store = {
  UF:          39908,
  STOCK:       [],
  PROJECTS:    [],
  CC_DATA:     {},
  _GC:         {},   // geocodes en memoria (GEOCODES + PRI_GEOCODES + localStorage)
};

export const PER_PAGE = 24;
