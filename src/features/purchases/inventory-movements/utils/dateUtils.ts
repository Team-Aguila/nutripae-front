/**
 * Utilidades para manejo de fechas en zona horaria de Colombia (UTC-5)
 */

const COLOMBIA_TIMEZONE = "America/Bogota";

/**
 * Obtiene la fecha actual en zona horaria de Colombia
 * @returns Date object en zona horaria de Colombia
 */
export function getCurrentColombianDate(): Date {
  return new Date(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: COLOMBIA_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .format(new Date())
      .replace(/(\d{4})-(\d{2})-(\d{2}), (\d{2}):(\d{2}):(\d{2})/, "$1-$2-$3T$4:$5:$6")
  );
}

/**
 * Convierte una fecha en zona horaria de Colombia a UTC para envío al servicio
 * @param dateString - Fecha en formato YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss
 * @returns String en formato ISO UTC
 */
export function convertColombianDateToUTC(dateString: string): string {
  // Si es solo fecha (YYYY-MM-DD), agregar hora actual de Colombia
  if (dateString.length === 10) {
    const currentTime = getCurrentColombianDate();
    const timeString = currentTime.toTimeString().split(" ")[0];
    dateString = `${dateString}T${timeString}`;
  }

  // Crear fecha asumiendo que está en zona horaria de Colombia
  const date = new Date(`${dateString}-05:00`); // UTC-5 para Colombia
  return date.toISOString();
}

/**
 * Convierte una fecha UTC del servicio a zona horaria de Colombia para mostrar
 * @param utcDateString - Fecha en formato ISO UTC
 * @returns Objeto con fecha y hora formateadas para Colombia
 */
export function formatUTCToColombianTime(utcDateString: string): { date: string; time: string; datetime: string } {
  try {
    const date = new Date(utcDateString);

    // Verificar que la fecha es válida
    if (isNaN(date.getTime())) {
      return {
        date: utcDateString,
        time: "",
        datetime: utcDateString,
      };
    }

    const colombianDate = new Intl.DateTimeFormat("es-CO", {
      timeZone: COLOMBIA_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);

    const colombianTime = new Intl.DateTimeFormat("es-CO", {
      timeZone: COLOMBIA_TIMEZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);

    const colombianDateTime = new Intl.DateTimeFormat("es-CO", {
      timeZone: COLOMBIA_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);

    return {
      date: colombianDate,
      time: colombianTime,
      datetime: colombianDateTime,
    };
  } catch (error) {
    console.error("Error formatting date:", error);
    return {
      date: utcDateString,
      time: "",
      datetime: utcDateString,
    };
  }
}

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD para inputs de fecha en zona horaria de Colombia
 * @returns String en formato YYYY-MM-DD
 */
export function getCurrentColombianDateString(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: COLOMBIA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Obtiene la fecha y hora actual en formato YYYY-MM-DDTHH:mm para inputs datetime-local en zona horaria de Colombia
 * @returns String en formato YYYY-MM-DDTHH:mm
 */
export function getCurrentColombianDateTimeString(): string {
  const now = new Date();
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: COLOMBIA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(now)
    .replace(" ", "T");
}

/**
 * Convierte una fecha en zona horaria de Colombia a solo fecha (YYYY-MM-DD) para campos que requieren solo fecha
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @returns String en formato YYYY-MM-DD
 */
export function convertColombianDateToDateOnly(dateString: string): string {
  if (!dateString) return "";

  // Si ya es solo fecha (YYYY-MM-DD), devolverla tal como está
  if (dateString.length === 10 && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }

  // Si es un string de fecha ISO o con hora, extraer solo la parte de la fecha
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // Si no es una fecha válida, intentar extraer solo la parte antes de 'T'
    return dateString.split("T")[0];
  }

  // Formatear la fecha a YYYY-MM-DD usando la zona horaria de Colombia
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: COLOMBIA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Formatea una fecha UTC a un formato legible en español para la zona horaria de Colombia
 * @param utcDateString - Fecha en formato ISO UTC
 * @returns String con fecha y hora formateada en español
 */
export function formatDateForDisplay(utcDateString: string): string {
  try {
    if (!utcDateString) return "N/A";

    const date = new Date(utcDateString);

    // Verificar que la fecha es válida
    if (isNaN(date.getTime())) {
      return utcDateString;
    }

    // Formato más compacto: "15 de julio de 2025, 2:30 PM"
    return new Intl.DateTimeFormat("es-CO", {
      timeZone: COLOMBIA_TIMEZONE,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch (error) {
    console.error("Error formatting date for display:", error);
    return utcDateString || "N/A";
  }
}

/**
 * Formatea solo la fecha (sin hora) en formato legible en español para la zona horaria de Colombia
 * @param utcDateString - Fecha en formato ISO UTC
 * @returns String con fecha formateada en español
 */
export function formatDateOnlyForDisplay(utcDateString: string): string {
  try {
    if (!utcDateString) return "N/A";

    const date = new Date(utcDateString);

    // Verificar que la fecha es válida
    if (isNaN(date.getTime())) {
      return utcDateString;
    }

    // Formato: "15 de jul. de 2025"
    return new Intl.DateTimeFormat("es-CO", {
      timeZone: COLOMBIA_TIMEZONE,
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date only for display:", error);
    return utcDateString || "N/A";
  }
}

/**
 * Convierte una fecha UTC a zona horaria de Colombia manualmente (UTC-5)
 * @param utcDateString - Fecha en formato ISO UTC
 * @returns Date object ajustado a Colombia
 */
export function convertUTCToColombia(utcDateString: string): Date {
  const utcDate = new Date(utcDateString);
  // Colombia está siempre en UTC-5 (5 horas atrás de UTC)
  const colombiaDate = new Date(utcDate.getTime() - 5 * 60 * 60 * 1000);
  return colombiaDate;
}

/**
 * Formatea una fecha UTC a formato legible en Colombia usando conversión manual
 * @param utcDateString - Fecha en formato ISO UTC
 * @returns String con fecha y hora formateada para Colombia
 */
export function formatDateForDisplayManual(utcDateString: string): string {
  try {
    if (!utcDateString) return "N/A";

    const utcDate = new Date(utcDateString);

    // Verificar que la fecha es válida
    if (isNaN(utcDate.getTime())) {
      return utcDateString;
    }

    // Convertir manualmente a Colombia (UTC-5)
    const colombiaDate = new Date(utcDate.getTime() - 5 * 60 * 60 * 1000);

    // Formatear usando la fecha local ya convertida
    const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

    const day = colombiaDate.getDate();
    const month = months[colombiaDate.getMonth()];
    const year = colombiaDate.getFullYear();
    const hours = colombiaDate.getHours();
    const minutes = colombiaDate.getMinutes();

    // Convertir a formato 12 horas
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const ampm = hours < 12 ? "a. m." : "p. m.";
    const minutesStr = minutes.toString().padStart(2, "0");

    return `${day} de ${month} de ${year}, ${hour12}:${minutesStr} ${ampm}`;
  } catch (error) {
    console.error("Error formatting date manually:", error);
    return utcDateString || "N/A";
  }
}

/**
 * Formatea solo la fecha (sin hora) usando conversión manual a Colombia
 * @param utcDateString - Fecha en formato ISO UTC
 * @returns String con fecha formateada para Colombia
 */
export function formatDateOnlyForDisplayManual(utcDateString: string): string {
  try {
    if (!utcDateString) return "N/A";

    const utcDate = new Date(utcDateString);

    // Verificar que la fecha es válida
    if (isNaN(utcDate.getTime())) {
      return utcDateString;
    }

    // Convertir manualmente a Colombia (UTC-5)
    const colombiaDate = new Date(utcDate.getTime() - 5 * 60 * 60 * 1000);

    // Formatear usando la fecha local ya convertida
    const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

    const day = colombiaDate.getDate();
    const month = months[colombiaDate.getMonth()];
    const year = colombiaDate.getFullYear();

    return `${day} de ${month} de ${year}`;
  } catch (error) {
    console.error("Error formatting date only manually:", error);
    return utcDateString || "N/A";
  }
}
