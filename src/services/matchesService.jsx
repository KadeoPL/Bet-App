
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

// export async function addPrediction(data){
//   axios.post('https://bet-app-livid.vercel.app/api/predictions', data)
//   .then(response => {
//       console.log(response.data)
//   })
//   .catch(error => {
//       console.error('Error sending data:', error);
//   });
// }

export async function addPrediction(data) {
  try {
    const response = await axios.post('https://bet-app-livid.vercel.app/api/predictions', data);
    console.log(response.data);
  } catch (error) {
    console.error('Error sending data:', error);
  }
}


export async function getPrediction(id) {
  try {
      const response = await axios.get(`https://bet-app-livid.vercel.app/api/predictions/${id}`);
      const predictionData = response.data;
      return predictionData.data
  } catch (error) {
    console.log(error)
  }
  
}
