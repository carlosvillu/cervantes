export const fromTimeStampToDate = (timestamp: number, format = 'es-ES') =>
  new Date(timestamp).toLocaleDateString(format)
