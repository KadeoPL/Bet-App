import axios from 'axios'


  export async function loginUser(data) {
    try {
      const response = await axios.post('https://bet-app-livid.vercel.app/api/login', data);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data.message;
      } else {
        throw 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';
      }
    }
  }
  
  export async function getUsersToScoreboard() {
    try {
        const response = await axios.get(`https://bet-hyozzqny3-kadeos-projects-d5e3ebb4.vercel.app/api/users`);
        const users = response
        console.log(users)
        return users.data
    } catch (error) {
      console.log(error)
    }
  }

  export async function getUserPoints(id) {
    try {
      const response = await axios.get(`https://bet-app-livid.vercel.app/api/points/${id}`);
      const pointsArray = response.data.data;
  
      if (pointsArray.length > 0) {
        const points = pointsArray[0].points;
        return points;
      } else {
        throw new Error("Nie znaleziono punktów dla użytkownika");
      }
    } catch (error) {
      console.error("Błąd podczas pobierania punktów:", error);
      throw error;
    }
  }
