import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getTeams } from '../services/teamsService';

const TeamsContext = createContext();

const TeamsProvider = ({ children }) => {
  const [teams, setTeams] = useState(null);

    useEffect(() => {
        async function fetchData() {
          try {
            const teams = await getTeams()
            setTeams(teams)
          } catch (error) {
            console.error('Error fetching users:', error)
          }
        }
    
        fetchData()
      }, [])

  return (
    <TeamsContext.Provider value={{teams}}>
      {children}
    </TeamsContext.Provider>
  );
};

TeamsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { TeamsContext, TeamsProvider };
