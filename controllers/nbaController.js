import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const getTeamsWithLogos = async () => {
  const options = {
    method: "GET",
    url: "https://tank01-fantasy-stats.p.rapidapi.com/getNBATeams",
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY_NBA,
      "x-rapidapi-host": "tank01-fantasy-stats.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.body.reduce((acc, team) => {
      acc[team.teamAbv] = {
        nbaComLogo: team.nbaComLogo1,
        espnLogo: team.espnLogo1,
      };
      return acc;
    }, {});
  } catch (error) {
    console.error(error);
    return {};
  }
};
const getNBATeams = async (req, res) => {
  const options = {
    method: "GET",
    url: "https://tank01-fantasy-stats.p.rapidapi.com/getNBATeams",
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY_NBA,
      "x-rapidapi-host": "tank01-fantasy-stats.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data from NBA API" });
  }
};

const getNBATeamSchedule = async (req, res) => {
  const { teamID, teamAbv } = req.body;

  const options = {
    method: "GET",
    url: "https://tank01-fantasy-stats.p.rapidapi.com/getNBATeamSchedule",
    params: {
      teamAbv: teamAbv || "",
      teamID: teamID || "",
    },
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY_NBA,
      "x-rapidapi-host": "tank01-fantasy-stats.p.rapidapi.com",
    },
  };

  try {
    const teamsWithLogos = await getTeamsWithLogos();
    const response = await axios.request(options);
    const scheduledGames = response.data.body.schedule.filter(
      (game) => game.gameStatus === "Scheduled"
    );

    const gamesWithLogos = scheduledGames.map((game) => {
      const homeLogo = teamsWithLogos[game.home]?.nbaComLogo || null;
      const awayLogo = teamsWithLogos[game.away]?.nbaComLogo || null;

      return {
        ...game,
        homeLogo,
        awayLogo,
      };
    });

    res.status(200).json({ games: gamesWithLogos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data from NBL API" });
  }
};

export { getNBATeams, getNBATeamSchedule };
