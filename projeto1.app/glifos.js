// Escolhe a letra do site: a sua (letra.html / escrever.html) ou uma letra pronta
(function () {
  let glifos = {};
  try { glifos = JSON.parse(localStorage.getItem("minhaLetra")) || {}; } catch (e) {}
  const total = Object.keys(glifos).length;
  let usar = total > 0;

  const fontes = document.createElement("link");
  fontes.rel = "stylesheet";
  fontes.href =
    "https://fonts.googleapis.com/css2?family=Kalam&family=Patrick+Hand&family=Indie+Flower&family=Shadows+Into+Light&display=swap";
  document.head.appendChild(fontes);

  const estilo = document.createElement("style");
  estilo.textContent = `
    #folhas { --gh: calc(var(--esp) * var(--tam) * 1.3); }
    .sup, .sub { --gh: calc(var(--esp) * var(--tam) * 0.85); }
    .g { display: inline-block; height: var(--gh);
         margin: calc(var(--gh) * -0.72) 0 calc(var(--gh) * -0.28);
         -webkit-mask-size: 100% 100%; mask-size: 100% 100%;
         -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
         background-color: currentColor; }`;
  document.head.appendChild(estilo);

  const original = letra; // função do index.html
  letra = function (c, cor) {
    const g = usar && glifos[c];
    if (!g) return original(c, cor);
    const s = document.createElement("span");
    s.className = "g";
    s.style.cssText =
      "color:" + cor + ";position:relative;top:" + (Math.random() * 0.6 - 0.3 + sobe) + "mm;" +
      "width:calc(var(--gh) * " + g.a + ");" +
      "-webkit-mask-image:url('" + g.u + "');mask-image:url('" + g.u + "')";
    const caixa = document.createElement("span");
    caixa.append(s, "\u2060"); // impede quebrar a palavra no meio
    return caixa;
  };

  const area = document.createElement("div");
  area.style.marginTop = "12px";
  area.innerHTML =
    '<label>Qual letra usar? <select id="qualLetra"></select></label><br />' +
    '<a href="escrever.html">Escrever a minha letra na tela</a> · ' +
    '<a href="letra.html">Criar com folha impressa</a>';
  document.querySelector(".controles").appendChild(area);

  const lista = document.getElementById("qualLetra");
  const opcoes = [
    ["minha", total ? "Minha letra (" + total + " letras)" : "Minha letra (ainda não criada)"],
    ["Caveat", "Letra pronta: Caveat"],
    ["Kalam", "Letra pronta: Kalam"],
    ["Patrick Hand", "Letra pronta: Patrick Hand"],
    ["Indie Flower", "Letra pronta: Indie Flower"],
    ["Shadows Into Light", "Letra pronta: Shadows Into Light"],
  ];
  for (const [valor, texto] of opcoes) lista.add(new Option(texto, valor));
  lista.options[0].disabled = !total;
  lista.value = usar ? "minha" : "Caveat";

  lista.addEventListener("change", async () => {
    usar = lista.value === "minha";
    const nome = usar ? "Caveat" : lista.value;
    folhas.style.setProperty("--fonte", '"' + nome + '"');
    await document.fonts.load('20px "' + nome + '"');
    if (gerado) gerar();
  });
})();