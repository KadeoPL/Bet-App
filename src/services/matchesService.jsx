
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

export async function addPrediction(data) {
  try {
    await axios.post('https://bet-app-livid.vercel.app/api/predictions', data);
  } catch (error) {
    console.error('Error sending data:', error);
    throw new Error(error.message);
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

export async function getOtherPrediction(matchId) {
  try {
      const response = await axios.get(`https://bet-app-livid.vercel.app/api/match_predictions/${matchId}`);
      const otherPredictionData = response.data;
      return otherPredictionData.data
  } catch (error) {
    console.log(error)
  }
  
}


