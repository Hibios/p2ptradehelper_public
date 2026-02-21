export const formatDate = (date: Date): string => {
    const months = ["января", "февраля", "марта", "апреля", "мая", 
                    "июня", "июля", "августа", "сентября", "октября",
                    "ноября", "декабря" ]

    const modifiedDate = `${date.getDate()} 
                          ${months[date.getMonth()]} 
                          ${date.getFullYear()} г. 
                          ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    return modifiedDate;
}