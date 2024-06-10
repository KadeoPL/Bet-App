
import axios from 'axios'

export async function getMatches() {
          try {
              const response = await axios.get(`https://bet-app-livid.vercel.app/api/matches`);
              const matchData = response.data;
              return matchData.data
          } catch (error) {
            console.log(error)
          }
          
      }

export async function addPrediction(data){
  console.log(data);
  axios.post('https://bet-app-livid.vercel.app/api/predictions', data)
  .then(response => {
      console.log('Data successfully sent:', response.data);
  })
  .catch(error => {
      console.error('Error sending data:', error);
  });
}
