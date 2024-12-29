import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const getTeamsWithLogos = async () => {
  const options = {
    method: "GET",
    url: "https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLTeams",
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY,
      "x-rapidapi-host":
        "tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.body.reduce((acc, team) => {
      acc[team.teamAbv] = {
        nflComLogo: team.nflComLogo1,
        espnLogo: team.espnLogo1,
      };
      return acc;
    }, {});
  } catch (error) {
    console.error(error);
    return {};
  }
};

const getNFLTeams = async (req, res) => {
  const options = {
    method: "GET",
    url: "https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLTeams",
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY,
      "x-rapidapi-host":
        "tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data from NFL API" });
  }
};

const getNFLTeamSchedule = async (req, res) => {
  const { teamID, teamAbv } = req.body;

  const options = {
    method: "GET",
    url: "https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLTeamSchedule",
    params: {
      teamAbv: teamAbv || "",
      teamID: teamID || "",
    },
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY,
      "x-rapidapi-host":
        "tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com",
    },
  };

  try {
    const teamsWithLogos = await getTeamsWithLogos();

    const response = await axios.request(options);
    const scheduledGames = response.data.body.schedule.filter(
      (game) => game.gameStatus === "Scheduled"
    );

    const gamesWithLogos = scheduledGames.map((game) => {
      const homeLogo = teamsWithLogos[game.home]?.nflComLogo || null;
      const awayLogo = teamsWithLogos[game.away]?.nflComLogo || null;

      return {
        ...game,
        homeLogo,
        awayLogo,
      };
    });

    res.status(200).json({ games: gamesWithLogos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data from NFL API" });
  }
};

export { getNFLTeams, getTeamsWithLogos, getNFLTeamSchedule };
