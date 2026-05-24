async function loadFonts() {
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
  makeText(frame, "Brand", "Surearly\nObjet", 92, 92, 64, "bold");
  makeText(frame, "Headline", "hCG, FSH, LH, E+P를\n한 번의 검체로\n동시에 읽는\n정밀 동반 앱.", 92, 238, 34, "bold");
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
    makeText(frame, title + " summary", i === 0 ? "검체 1회\n4항목 판독" : i === 2 ? "Dip\nMove\nInsert\nReview" : "4호르몬\n상태 보드", x + 24, 664, 22, "bold");
  });
  figma.viewport.scrollAndZoomIntoView([frame]);
  figma.closePlugin("Surearly Objet Figma board created.");
}

main();