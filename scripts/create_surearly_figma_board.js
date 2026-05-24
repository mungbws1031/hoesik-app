const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "outputs");
const pluginDir = path.join(outDir, "surearly_objet_figma_plugin");
const imagePath = path.join(root, "assets", "premium-reader-device.png");
const productImage = fs.readFileSync(imagePath).toString("base64");

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(pluginDir, { recursive: true });

const colors = {
  bg: "#F7F2F3",
  panel: "#FFFDFD",
  ink: "#241F26",
  muted: "#766D76",
  line: "#E6DDE1",
  rose: "#D5A8B3",
  roseStrong: "#BB8696",
  plum: "#514552",
  green: "#55756A",
  amber: "#9B6A52"
};

const icons = {
  hCG: `<path d="M12 3v5l-4.8 7.3a3.8 3.8 0 0 0 3.2 5.7h3.2a3.8 3.8 0 0 0 3.2-5.7L12 8V3Z"/><path d="M9.5 13h5"/>`,
  FSH: `<circle cx="12" cy="12" r="7"/><path d="M12 8v8"/><path d="M8 12h8"/>`,
  LH: `<path d="M4 18h16"/><path d="M6 15l4-5 3 4 5-8"/>`,
  EP: `<path d="M5 15c5-8 11-8 14-8-1 6-5 10-12 10"/><path d="M7 17c2-3 5-5 10-7"/>`,
  sample: `<path d="M9 3h6"/><path d="M10 3v5l-4 7a4 4 0 0 0 3.5 6h5a4 4 0 0 0 3.5-6l-4-7V3"/>`,
  move: `<path d="M5 12h12"/><path d="M13 8l4 4-4 4"/><path d="M4 18h6"/>`,
  insert: `<path d="M4 12h11"/><path d="M15 7v10"/><path d="M19 9v6"/>`,
  review: `<rect x="5" y="5" width="14" height="14" rx="3"/><path d="M8 12h8"/><path d="M12 8v8"/>`
};

function esc(text) {
  return String(text).replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char]));
}

function text(x, y, content, opts = {}) {
  const {
    size = 24,
    weight = 500,
    fill = colors.ink,
    family = "Manrope, Pretendard, Arial, sans-serif",
    anchor = "start",
    line = size * 1.28,
    opacity = 1
  } = opts;
  const lines = Array.isArray(content) ? content : [content];
  const tspans = lines.map((lineText, i) =>
    `<tspan x="${x}" dy="${i === 0 ? 0 : line}">${esc(lineText)}</tspan>`
  ).join("");
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" opacity="${opacity}">${tspans}</text>`;
}

function rect(x, y, w, h, r = 0, fill = "none", stroke = "none", sw = 1, opacity = 1) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}"/>`;
}

function icon(x, y, key, clsFill = "#FFFFFF", stroke = colors.plum, size = 48) {
  const body = icons[key] || icons.review;
  return `<g transform="translate(${x} ${y})">
    ${rect(0, 0, size, size, 16, clsFill, "#E8DDE1")}
    <svg x="${(size - 24) / 2}" y="${(size - 24) / 2}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>
  </g>`;
}

function analyteTile(x, y, label, sub, key, stroke) {
  return `<g>
    ${rect(x, y, 135, 118, 18, "#FFFFFF", colors.line)}
    ${icon(x + 16, y + 16, key, "#FAF7F8", stroke, 46)}
    ${text(x + 16, y + 84, label, { size: 20, weight: 800 })}
    ${text(x + 16, y + 106, sub, { size: 11, weight: 700, fill: colors.muted })}
  </g>`;
}

function phoneFrame(x, y, title, subtitle, body) {
  return `<g>
    ${text(x, y - 20, title, { size: 18, weight: 800 })}
    ${text(x + 168, y - 20, subtitle, { size: 11, weight: 700, fill: colors.muted, anchor: "end" })}
    ${rect(x, y, 250, 542, 38, "#FFFFFF", "#EFE7EA")}
    ${rect(x + 12, y + 12, 226, 518, 28, "#FFFCFC", "#EEE4E8")}
    ${rect(x + 82, y + 20, 86, 18, 9, "#241F26")}
    ${body(x + 30, y + 62)}
  </g>`;
}

function smallAnalyteGrid(x, y) {
  const items = [
    ["hCG", "기준선", "hCG", colors.plum],
    ["FSH", "안정", "FSH", colors.green],
    ["LH", "상승", "LH", colors.amber],
    ["E+P", "활성", "EP", colors.roseStrong]
  ];
  return items.map((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const gx = x + col * 84;
    const gy = y + row * 96;
    return `<g>
      ${rect(gx, gy, 74, 82, 14, "#FAF7F8", "#EEE4E8")}
      ${icon(gx + 10, gy + 10, item[2], "#FFFFFF", item[3], 30)}
      ${text(gx + 10, gy + 54, item[0], { size: 13, weight: 800 })}
      ${text(gx + 10, gy + 72, item[1], { size: 10, fill: colors.muted, weight: 700 })}
    </g>`;
  }).join("");
}

function guideSteps(x, y) {
  const steps = [
    ["Dip", "검체 적용", "sample"],
    ["Move", "리더기로 이동", "move"],
    ["Insert", "1회 삽입", "insert"],
    ["Review", "4항목 확인", "review"]
  ];
  return steps.map((step, i) => {
    const gy = y + i * 72;
    return `<g>
      ${rect(x, gy, 170, 58, 16, i === 0 ? "#F9EEF2" : "#FFFFFF", "#EEE4E8")}
      ${icon(x + 12, gy + 12, step[2], i === 0 ? colors.rose : "#FAF7F8", i === 0 ? "#FFFFFF" : colors.plum, 34)}
      ${text(x + 58, gy + 26, step[0], { size: 13, weight: 800 })}
      ${text(x + 58, gy + 44, step[1], { size: 10, fill: colors.muted, weight: 700 })}
    </g>`;
  }).join("");
}

function trendChart(x, y) {
  const rows = [
    ["hCG", 38, colors.plum],
    ["FSH", 46, colors.green],
    ["LH", 82, colors.amber],
    ["E+P", 72, colors.roseStrong]
  ];
  return rows.map((row, i) => {
    const gy = y + i * 52;
    return `<g>
      ${text(x, gy + 14, row[0], { size: 13, weight: 800 })}
      ${rect(x + 48, gy, 126, 12, 6, "#EEE7EA")}
      ${rect(x + 48, gy, row[1], 12, 6, row[2])}
      ${text(x + 48, gy + 34, i === 2 ? "상승" : "유지", { size: 10, fill: colors.muted, weight: 700 })}
    </g>`;
  }).join("");
}

const phones = [
  phoneFrame(86, 1040, "1. 온보딩", "4 analytes", (x, y) => `
    ${text(x, y, ["한 번의 검체로", "4개 분석항목."], { size: 24, weight: 800, line: 30 })}
    ${icon(x, y + 82, "hCG", "#FAF7F8", colors.plum, 38)}
    ${icon(x + 48, y + 82, "FSH", "#FAF7F8", colors.green, 38)}
    ${icon(x + 96, y + 82, "LH", "#FAF7F8", colors.amber, 38)}
    ${icon(x + 144, y + 82, "EP", "#FAF7F8", colors.roseStrong, 38)}
    ${rect(x, y + 148, 168, 94, 18, "#F9F3F5", "#EEE4E8")}
    <image x="${x + 20}" y="${y + 160}" width="128" height="70" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,${productImage}"/>
    ${rect(x, y + 268, 170, 40, 20, colors.plum)}
    ${text(x + 85, y + 293, "4호르몬 패널 연결", { size: 12, weight: 800, fill: "#FFFFFF", anchor: "middle" })}
  `),
  phoneFrame(386, 1040, "2. 홈", "status board", (x, y) => `
    ${text(x, y, ["동일 세션", "4호르몬 보드."], { size: 24, weight: 800, line: 30 })}
    ${smallAnalyteGrid(x, y + 88)}
    ${rect(x, y + 304, 170, 44, 16, "#EEF5F1", "#DAE7DF")}
    ${text(x + 16, y + 331, "4항목 판독 완료", { size: 13, weight: 800, fill: colors.green })}
  `),
  phoneFrame(686, 1040, "3. 가이드", "1 test", (x, y) => `
    ${text(x, y, ["검사는 1회,", "판독은 4항목."], { size: 24, weight: 800, line: 30 })}
    ${guideSteps(x, y + 86)}
  `),
  phoneFrame(986, 1040, "4. 결과", "readout", (x, y) => `
    ${text(x, y, ["한 세션의 4신호를", "함께 판독."], { size: 23, weight: 800, line: 29 })}
    ${smallAnalyteGrid(x, y + 88)}
    ${rect(x, y + 304, 170, 44, 16, "#F9F3F5", "#EEE4E8")}
    ${text(x + 16, y + 331, "같은 시간대 재측정", { size: 13, weight: 800 })}
  `),
  phoneFrame(1286, 1040, "5. 트렌드", "4-line", (x, y) => `
    ${text(x, y, ["네 호르몬을", "같은 시간축에서 비교."], { size: 22, weight: 800, line: 28 })}
    ${trendChart(x, y + 100)}
  `)
].join("");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1750" viewBox="0 0 2400 1750">
  ${rect(0, 0, 2400, 1750, 0, colors.bg)}
  ${rect(60, 60, 2280, 900, 42, "#FFFDFD", "#F0E6EA")}
  ${rect(90, 90, 780, 840, 34, "#FFFFFF", "#EFE7EA")}
  ${text(138, 150, "4-HORMONE MEDICAL CONCEPT", { size: 13, weight: 800, fill: colors.muted })}
  ${text(136, 245, ["Surearly", "Objet"], { size: 88, weight: 700, family: "'Playfair Display', Georgia, serif", line: 80 })}
  ${text(138, 398, ["hCG, FSH, LH, E+P를", "한 번의 검체로", "동시에 읽는", "정밀 동반 앱."], { size: 48, weight: 800, line: 58 })}
  ${text(140, 650, ["하나의 검체와 하나의 세션에서 4개 호르몬을 동시에 정렬합니다.", "앱은 긴 설명보다 판독 상태와 다음 행동을 먼저 보여줍니다."], { size: 20, fill: colors.muted, line: 32 })}
  ${analyteTile(140, 735, "hCG", "PREGNANCY", "hCG", colors.plum)}
  ${analyteTile(295, 735, "FSH", "RESERVE", "FSH", colors.green)}
  ${analyteTile(450, 735, "LH", "PEAK", "LH", colors.amber)}
  ${analyteTile(605, 735, "E+P", "CONTEXT", "EP", colors.roseStrong)}
  ${rect(930, 90, 1380, 840, 34, "#FFFCFC", "#EFE7EA")}
  ${text(2230, 132, "Synchronized 4-analyte panel", { size: 13, weight: 800, fill: colors.muted, anchor: "end" })}
  ${rect(1050, 265, 1140, 500, 28, "#FFFFFF", "#EFE7EA")}
  <image x="1070" y="275" width="1100" height="480" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,${productImage}"/>
  ${text(1048, 852, "PANEL IDEA", { size: 13, weight: 800, fill: colors.muted })}
  ${text(1048, 884, "네 신호를 동일 세션 기준의 판독 보드로 정렬합니다.", { size: 18, fill: colors.muted })}
  ${rect(60, 1000, 2280, 660, 42, "#FFFDFD", "#F0E6EA")}
  ${text(90, 980, "FIGMA SCREEN SET", { size: 15, weight: 800, fill: colors.muted })}
  ${phones}
</svg>`;

fs.writeFileSync(path.join(outDir, "surearly_objet_figma_board.svg"), svg, "utf8");

const pluginManifest = {
  name: "Surearly Objet Board Generator",
  id: "surearly-objet-board-generator",
  api: "1.0.0",
  main: "code.js",
  editorType: ["figma"]
};

const pluginCode = `async function loadFonts() {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
}

function makeText(parent, name, text, x, y, size, weight) {
  const node = figma.createText();
  node.name = name;
  node.characters = text;
  node.x = x;
  node.y = y;
  node.fontName = { family: "Inter", style: weight === "bold" ? "Bold" : "Regular" };
  node.fontSize = size;
  node.fills = [{ type: "SOLID", color: { r: 0.141, g: 0.122, b: 0.149 } }];
  parent.appendChild(node);
  return node;
}

function makeRect(parent, name, x, y, w, h, r, color) {
  const node = figma.createRectangle();
  node.name = name;
  node.x = x;
  node.y = y;
  node.resize(w, h);
  node.cornerRadius = r;
  node.fills = [{ type: "SOLID", color }];
  parent.appendChild(node);
  return node;
}

async function main() {
  await loadFonts();
  const page = figma.createPage();
  page.name = "Surearly Objet Concept";
  figma.currentPage = page;
  const frame = figma.createFrame();
  frame.name = "Surearly Objet / 4-hormone app board";
  frame.resize(1440, 1100);
  frame.fills = [{ type: "SOLID", color: { r: 0.969, g: 0.949, b: 0.953 } }];
  page.appendChild(frame);
  makeRect(frame, "Hero surface", 48, 48, 1344, 460, 32, { r: 1, g: 0.992, b: 0.992 });
  makeText(frame, "Brand", "Surearly\\nObjet", 92, 92, 64, "bold");
  makeText(frame, "Headline", "hCG, FSH, LH, E+P를\\n한 번의 검체로\\n동시에 읽는\\n정밀 동반 앱.", 92, 238, 34, "bold");
  const labels = ["hCG", "FSH", "LH", "E+P"];
  labels.forEach((label, i) => {
    const x = 92 + i * 132;
    makeRect(frame, label + " tile", x, 402, 112, 70, 14, { r: 0.984, g: 0.965, b: 0.973 });
    makeText(frame, label + " label", label, x + 16, 418, 18, "bold");
  });
  const phoneTitles = ["온보딩", "홈", "가이드", "결과", "트렌드"];
  phoneTitles.forEach((title, i) => {
    const x = 70 + i * 270;
    makeText(frame, title + " title", title, x, 590, 18, "bold");
    makeRect(frame, title + " phone", x, 620, 220, 420, 32, { r: 1, g: 0.992, b: 0.992 });
    makeText(frame, title + " summary", i === 0 ? "검체 1회\\n4항목 판독" : i === 2 ? "Dip\\nMove\\nInsert\\nReview" : "4호르몬\\n상태 보드", x + 24, 664, 22, "bold");
  });
  figma.viewport.scrollAndZoomIntoView([frame]);
  figma.closePlugin("Surearly Objet Figma board created.");
}

main();`;

fs.writeFileSync(path.join(pluginDir, "manifest.json"), JSON.stringify(pluginManifest, null, 2), "utf8");
fs.writeFileSync(path.join(pluginDir, "code.js"), pluginCode, "utf8");

console.log("Created:");
console.log(path.join(outDir, "surearly_objet_figma_board.svg"));
console.log(path.join(pluginDir, "manifest.json"));
console.log(path.join(pluginDir, "code.js"));
