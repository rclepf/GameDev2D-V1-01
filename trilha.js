// Trilha GameDev 2D — realce de GDScript e botão "copiar" nos blocos de código.
const PALAVRAS = new Set(("extends class_name func var const enum signal if elif else for while match return " +
  "await break continue pass and or not in is as self super static preload load true false null void").split(" "));
const TIPOS = new Set(("int float bool String Vector2 Vector2i Node Node2D Area2D CharacterBody2D RigidBody2D " +
  "AnimatedSprite2D Camera2D Input Array Dictionary PackedScene Color").split(" "));

function escapar(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function realcar(codigo) {
  // um token por vez: comentário, texto, anotação/nó, número, palavra
  const re = /(#[^\n]*)|("[^"\n]*")|(@\w+|\$[\w/]+)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)/g;
  let saida = "", ultimo = 0, m;
  while ((m = re.exec(codigo))) {
    saida += escapar(codigo.slice(ultimo, m.index));
    const [t, com, txt, meta, num, pal] = m;
    let cls = "";
    if (com) cls = "hljs-comment";
    else if (txt) cls = "hljs-string";
    else if (meta) cls = "hljs-meta";
    else if (num) cls = "hljs-number";
    else if (PALAVRAS.has(pal)) cls = "hljs-keyword";
    else if (TIPOS.has(pal)) cls = "hljs-built_in";
    else if (codigo[re.lastIndex] === "(") cls = "hljs-title";
    saida += cls ? `<span class="${cls}">${escapar(t)}</span>` : escapar(t);
    ultimo = re.lastIndex;
  }
  return saida + escapar(codigo.slice(ultimo));
}

document.querySelectorAll("pre > code").forEach((bloco) => {
  const texto = bloco.textContent;
  if (bloco.classList.contains("gd")) bloco.innerHTML = realcar(texto);
  const b = document.createElement("button");
  b.className = "copiar";
  b.type = "button";
  b.textContent = "copiar";
  b.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(texto);
      b.textContent = "copiado!";
    } catch {
      b.textContent = "selecione e copie";
    }
    setTimeout(() => (b.textContent = "copiar"), 1500);
  });
  bloco.parentElement.appendChild(b);
});
