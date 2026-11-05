const market = {
  name: "구미새마을중앙시장",
  appName: "구전이",
  intro: "점포와 골목, 주차장 정보를 확인할 수 있는 시장 안내입니다. 아래 점포와 주차 정보는 화면 확인을 위한 예시입니다.",
  address: "구미새마을중앙시장",
  phone: "",
};

const alleys = ["순대골목", "국수골목", "족발골목", "한복골목"];

const categories = [
  { id: "food", name: "먹거리", color: "#b94f3b" },
  { id: "farm", name: "농산물", color: "#4b8b50" },
  { id: "sea", name: "수산물", color: "#3979a8" },
  { id: "cloth", name: "의류·한복", color: "#8061a8" },
  { id: "etc", name: "생활용품", color: "#73756f" },
];

const stores = [
  { id: 1, name: "성주순대", category: "food", products: ["돼지국밥", "순대국밥", "순대따로국밥", "순대", "수육", "암뽕"], hours: "매달 1번째 화요일 휴무 (상세 시간 미기재)", alley: "순대골목", phone: "054-454-9403", address: "경북 구미시 구미중앙로9길 11", x: 23, y: 24 },
  { id: 2, name: "원동왕족발", category: "food", products: ["미니족발", "왕족발", "모듬족발", "수육", "편육"], hours: "23:00 영업 종료", alley: "족발골목", phone: "054-452-6166", address: "경북 구미시 구미중앙로9길 11", x: 23, y: 74 },
  { id: 3, name: "미경이로운떡볶이", category: "food", products: ["떡볶이", "계란김밥", "순대", "튀김", "어묵"], hours: "10:00 영업 시작", alley: "", phone: "0507-1326-8211", address: "경북 구미시 구미중앙로9길 11 가동 1층 113호", x: "", y: "" },
  { id: 4, name: "고향마을", category: "food", products: ["콩국수", "손칼국수", "수제비", "된장찌개"], hours: "", alley: "국수골목", phone: "", address: "경북 구미시 구미중앙로9길 11", x: 77, y: 24 },
  { id: 5, name: "소복소복", category: "food", products: ["계란장", "꽈리고추찜", "궁채나물볶음 등 각종 반찬"], hours: "20:00 영업 종료", alley: "", phone: "0507-1315-2005", address: "경북 구미시 구미중앙로9길 11 소복소복(가동 115호, 116호)", x: "", y: "" },
  { id: 6, name: "민속떡집", category: "food", products: ["백설기", "콩찰떡", "시루떡", "송편", "찹쌀떡 등"], hours: "21:00 영업 종료", alley: "", phone: "054-452-9870", address: "경북 구미시 구미중앙로9길 11", x: "", y: "" },
  { id: 7, name: "구미땅콩상회", category: "sea", products: ["오징어", "황태포", "산모미역 등 건어물"], hours: "10:00 영업 시작", alley: "", phone: "054-452-4565", address: "경북 구미시 구미중앙로9길 11", x: "", y: "" },
  { id: 8, name: "한우회축산물직판장", category: "food", products: ["한우 등심", "소고기", "삼겹살"], hours: "20:00 영업 종료", alley: "", phone: "054-458-0244", address: "경북 구미시 구미중앙로9길 11", x: "", y: "" },
  { id: 9, name: "양지당흑염소", category: "food", products: ["흑염소 중탕", "한약"], hours: "20:00 영업 종료", alley: "", phone: "054-456-7793", address: "경북 구미시 구미중앙로9길 11", x: "", y: "" },
  { id: 10, name: "옷이날개", category: "cloth", products: ["남자바지", "츄리닝", "할머니바지(몸빼바지)", "윗도리"], hours: "", alley: "", phone: "054-452-1414", address: "경북 구미시 구미중앙로9길 11", x: "", y: "" },
];

const parkings = [
  { name: "시장 인근 주차장 (예시)", place: "시장 주변 · 정확한 위치 확인 필요", fee: "요금 정보 확인 필요", note: "예시 정보입니다. 방문 전 실제 운영 여부와 요금을 확인해 주세요." },
];
