
export function checkIfMatchStarted(date) {
    const matchDateTimeString = `${date.date}T${date.time}`;
    const matchDate = new Date(matchDateTimeString);
    const today = new Date();

    if (today > matchDate) {
        return true;
    } else {
        return false;
    }
}