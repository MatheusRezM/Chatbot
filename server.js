const express = require("express");
const cors = require("cors");
const { HLTV } = require("hltv");

const app = express();
app.use(cors());

app.get("/api/placar", async (req, res) => {
  try {
    const teamId = 8297; // FURIA

    const results = await HLTV.getResults({ teamIds: [teamId] });

    if (!results.length) {
      return res.json({
        status: "SEM JOGOS",
        jogo: "Nenhuma partida recente encontrada.",
        placar: "Indisponível",
        evento: "-",
        data: "-",
        link: "-"
      });
    }

    // Log dos jogos e status
    console.log("Resultados encontrados:");
    results.forEach((match, i) => {
      console.log(`#${i} - ${match.team1.name} vs ${match.team2.name} | status: ${match.status}`);
    });

    // 🔍 Procurar jogo ao vivo
    const liveMatch = results.find((match) => match.status === "live");

    // 🔍 Se não houver ao vivo, pega último com resultado disponível
    const latestMatch = liveMatch || results.find(
      (match) =>
        match.result?.team1 !== undefined &&
        match.result?.team2 !== undefined
    );

    if (!latestMatch) {
      return res.json({
        status: "SEM JOGOS",
        jogo: "Nenhuma partida com resultado disponível foi encontrada.",
        placar: "Indisponível",
        evento: "-",
        data: "-",
        link: "-"
      });
    }

    let opponentName = "Adversário desconhecido";

    if (latestMatch.team1.name.toLowerCase().includes("furia")) {
      opponentName = latestMatch.team2.name;
    } else if (latestMatch.team2.name.toLowerCase().includes("furia")) {
      opponentName = latestMatch.team1.name;
    } else {
      opponentName = "FURIA não encontrada na partida";
    }
    

    const placar =
      latestMatch.result?.team1 !== undefined &&
      latestMatch.result?.team2 !== undefined
        ? `${latestMatch.result.team1} - ${latestMatch.result.team2}`
        : "Placar não disponível";

    const status =
      latestMatch.status === "live" ? "AO VIVO" : "FINALIZADO";

    res.json({
      status: status,
      jogo: `FURIA vs ${opponentName}`,
      placar: placar,
      evento: latestMatch.event?.name || "Evento desconhecido",
      data: latestMatch.date
        ? new Date(latestMatch.date).toLocaleDateString()
        : "Data desconhecida",
      link: `https://www.hltv.org/matches/${latestMatch.id}`
    });
  } catch (error) {
    console.error("Erro ao buscar placar:", error.message, error.stack);
    res.status(500).json({ erro: "Erro ao buscar informações do jogo." });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
