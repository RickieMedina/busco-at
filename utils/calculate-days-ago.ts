
export const calculateDaysAgo = (createdAt: Date): string => {
    if (!createdAt) return ''; // Si no hay fecha, retornar vacío

    const creationDate = new Date(createdAt);
    const currentDate = new Date();

    // Cálculo de la diferencia en milisegundos
    const differenceInMilliseconds = currentDate.getTime() - creationDate.getTime();

    // Convertir la diferencia de milisegundos a días
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const differenceInDays = Math.floor(differenceInMilliseconds / millisecondsPerDay);

    if (differenceInDays === 0) {
      return 'Publicado hoy';
    } else if (differenceInDays === 1) {
      return `Publicado hace 1 día`;
    } else {
      return `Publicado hace ${differenceInDays} días`;
    }
};