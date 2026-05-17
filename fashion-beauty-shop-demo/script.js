const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const siteNavLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll("[data-reveal]");
const stage = document.querySelector(".atelier-stage");
const tabs = document.querySelectorAll(".tab-button");
const clubForm = document.querySelector(".club-form");
const clubInput = document.getElementById("email");

const spotlight = {
  label: document.getElementById("spotlight-label"),
  visualTitle: document.getElementById("spotlight-visual-title"),
  kicker: document.getElementById("spotlight-kicker"),
  title: document.getElementById("spotlight-title"),
  price: document.getElementById("spotlight-price"),
  body: document.getElementById("spotlight-body"),
  list: document.getElementById("spotlight-list"),
  link: document.getElementById("spotlight-link"),
};

const collections = {
  wardrobe: {
    kicker: "Wardrobe Reset",
    title: "블러시 트렌치와 슬림 니트 조합",
    price: "from ₩189,000",
    body:
      "채도가 낮은 핑크 베이지 계열을 중심으로, 출근부터 저녁 약속까지 무리 없이 이어지는 실루엣을 만들었습니다.",
    visualTitle: "Soft trench & knit set",
    items: [
      "하이라이즈 슬랙스와 같이 입기 좋은 길이감",
      "웜톤 메이크업과 자연스럽게 연결되는 색감",
      "가벼운 봄 아우터지만 실루엣은 선명하게 유지",
    ],
    linkLabel: "이 무드로 쇼핑하기",
  },
  beauty: {
    kicker: "Beauty Ritual",
    title: "세럼, 크림 블러셔, 글로우 베이스의 3단 루틴",
    price: "set ₩78,000",
    body:
      "피부 표현이 과해 보이지 않도록 한 겹씩 레이어링되는 제형만 골랐습니다. 맑은 광채와 혈색을 빠르게 만드는 데 초점을 맞췄습니다.",
    visualTitle: "Glow serum & cream blush",
    items: [
      "건성부터 복합성까지 무난하게 쓰기 쉬운 제형",
      "옷 컬러와 충돌하지 않는 로지 뉴트럴 팔레트",
      "파우치에 함께 넣기 좋은 휴대성 중심 구성",
    ],
    linkLabel: "뷰티 세트 장바구니 담기",
  },
  fragrance: {
    kicker: "Layered Scent",
    title: "린넨 머스크 위에 앰버를 얹는 저녁 향 조합",
    price: "from ₩69,000",
    body:
      "가벼운 탑노트로 시작해서 따뜻한 잔향으로 마무리되는 레이어링 구성을 제안합니다. 니트, 코트, 립 컬러와 연결되는 향입니다.",
    visualTitle: "Amber linen layering",
    items: [
      "낮에는 산뜻하고 밤에는 깊어지는 투 스텝 구조",
      "포근한 패브릭 계열 의상과 어울리는 잔향",
      "선물용으로도 보기 좋은 유리 보틀 실루엣",
    ],
    linkLabel: "향수 조합 보러 가기",
  },
};

function setCollection(name) {
  const next = collections[name];

  if (!next || !stage) {
    return;
  }

  stage.dataset.theme = name;
  spotlight.label.textContent = next.kicker;
  spotlight.visualTitle.textContent = next.visualTitle;
  spotlight.kicker.textContent = next.kicker;
  spotlight.title.textContent = next.title;
  spotlight.price.textContent = next.price;
  spotlight.body.textContent = next.body;
  spotlight.link.textContent = next.linkLabel;

  spotlight.list.innerHTML = "";
  next.items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    spotlight.list.appendChild(li);
  });

  tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.collection === name);
  });
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

siteNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("nav-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setCollection(tab.dataset.collection));
});

if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

if (clubForm && clubInput) {
  clubForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clubInput.value = "";
    clubInput.placeholder = "가입 요청이 데모에 저장되었습니다";
  });
}

setCollection("wardrobe");
