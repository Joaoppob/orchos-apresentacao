# OrchOS · Apresentação (site-deck)

Apresentação HTML do projeto **OrchOS — o agente como sistema operacional**.
Um slide por tela, estilo PowerPoint navegável. Vanilla HTML + CSS + JS, zero build,
zero dependências. Projeto irmão de `../orchos-prototipo` (reusa o `tokens.css`).

## Como rodar

```bash
node serve.js
# abre em http://127.0.0.1:8124
```

Ou abra `index.html` direto no navegador (o servidor é só conveniência; as fontes
vêm do Google Fonts, então é preciso conexão para a tipografia correta).

## Navegação

- **Menu do topo** — clique em qualquer número 01–12.
- **Teclado** — `←`/`→`, `PageUp`/`PageDown`, `Espaço` (avança), `Home`/`End`.
- **Roda do mouse** — scroll para cima/baixo (debounced).
- **Swipe** — toque e arraste horizontal (touch).
- **Hash da URL** — `#05` abre direto no slide 5; voltar/avançar do navegador funciona.

## Estrutura

- `index.html` — os 12 slides como `<section class="slide">` estáticos + chrome (nav, footer).
- `styles.css` — tokens próprios do deck + chrome compartilhado + layout por arquétipo.
- `app.js` — scaling 16:9 (palco 1920×1080 escalado por `transform: scale`), navegação,
  realce do nav, hash + popstate.
- `tokens.css` — copiado de `../orchos-prototipo` (fonte de verdade do DS).
- `serve.js` — servidor estático mínimo (porta 8124).

## Arquitetura visual

Palco fixo de **1920×1080** escalado por JS para caber na janela mantendo **16:9**
com letterbox (faixas pretas). Layout pixel-fiel ao Penpot. Paleta monocromática
(sem cor de acento). Cartões "glass" com linha de luz no topo; variante `★` para
destaques; número-fantasma gigante em `Bitcount Grid Single` ao fundo de cada slide.

## Os 12 slides

01 Capa · 02 O que é · 03 E se? · 04 Sinais fracos · 05 Tendências ·
06 Como funciona · 07 Horizonte temporal · 08 PESTEL · 09 Matriz 2×2 ·
10 Protótipos · 11 Evidências · 12 Fecho
