const chatBox = document.getElementById('chat');
const userInput = document.getElementById('user-input');

const jogadores = {
  fallen: "👤 FalleN - IGL e AWPer lendário da FURIA, conhecido como Professor.",
  kscerato: "👤 KSCERATO - Rifler de alto impacto e clutches impressionantes.",
  yuurih: "👤 yuurih - Consistente, inteligente e um dos pilares da equipe.",
  chelo: "👤 chelo - Estilo agressivo, traz energia ao time.",
  art: "👤 arT - Conhecido por suas jogadas rápidas e estratégias ousadas."
};

function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.classList.add("message", sender);
  msg.innerHTML = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function botTyping() {
  const typing = document.createElement('div');
  typing.id = "typing";
  typing.classList.add("message", "bot");
  typing.innerText = "Digitando...";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

function handleKey(e) {
  if (e.key === "Enter" && userInput.value.trim() !== "") {
    const msg = userInput.value.toLowerCase();
    addMessage(userInput.value, "user");
    userInput.value = "";
    processText(msg);
  }
}

function handleOption(option) {
  botTyping();
  setTimeout(() => {
    removeTyping();
    processText(option);
  }, 800);
}

async function processText(text) {
  removeTyping();
  text = text.toLowerCase();

  if (text.includes("loja")) {
    addMessage(`🛒 Loja oficial: <a href="https://loja.furia.gg" target="_blank">loja.furia.gg</a>`, "bot");
  } else if (text.includes("agenda") || text.includes("jogos")) {
    addMessage(`📅 Jogos:<br>- FURIA vs NAVI - 27/04 - 18h<br>- FURIA vs G2 - 30/04 - 16h30`, "bot");
  } else if (text.includes("jogadores") || text.includes("jogadores")) {
    addMessage('👥 Time Titular: KSCERATO, yuurih, arT, chelo, FalleN.', 'bot');
  } else if (text.includes("social") || text.includes("rede")) {
    addMessage(`📱 Redes sociais:<br><a href="https://linktr.ee/furiagg" target="_blank">linktr.ee/furiagg</a>`, "bot");
  } else if (text.includes("placar") || text.includes("ao vivo") || text.includes("live") || text.includes("partida")) {
    botTyping();
    try {
      const res = await fetch('http://localhost:3001/api/placar');
      const data = await res.json();
      removeTyping();
      const placar = data.aoVivo
        ? `🎮 ${data.jogo}<br>🔴 ${data.status}<br>🧮 Placar: ${data.placar}<br>🗺️ Mapa: ${data.mapa}<br>🔁 Round: ${data.round}`
        : `🚫 Nenhum jogo ao vivo no momento.<br>✅ Último jogo:<br>🎮 ${data.jogo}<br>📊 ${data.status}<br>Placar: ${data.placar}`;
      addMessage(placar, "bot");
    } catch {
      addMessage("❌ Erro ao carregar o placar ao vivo.", "bot");
    }
  } else {
    const jogador = Object.keys(jogadores).find(j => text.includes(j));
    if (jogador) {
      addMessage(jogadores[jogador], "bot");
    } else {
      addMessage("❓ Não entendi o que você quis dizer.", "bot");
    }
  }
}
