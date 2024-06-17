
export const getDayOfWeek = (date) => {
    const days = ['Ndz', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'];
    const matchDate = new Date(date);
    return days[matchDate.getDay()];
  };
