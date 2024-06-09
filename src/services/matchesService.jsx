
import axios from 'axios'

export async function getMatches() {
          try {
              const response = await axios.get(`https://bet-app-livid.vercel.app/api/matches`);
              const matchData = response.data;
              console.log(matchData.data)
              return matchData.data
          } catch (error) {
            console.log(error)
          }
          
      }