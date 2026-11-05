(() => {
  const views = [...document.querySelectorAll(".view")];
  const homeSearchForm = document.querySelector("#home-search-form");
  const homeSearch = document.querySelector("#home-search");
  const storeSearchForm = document.querySelector("#store-search-form");
  const storeSearch = document.querySelector("#store-search");
  const categoryList = document.querySelector("#category-list");
  const storeList = document.querySelector("#store-list");
  const storeCount = document.querySelector("#store-count");
  const detailBackdrop = document.querySelector("#sheet-backdrop");
  const detailSheet = document.querySelector("#detail-sheet");
  const detailContent = document.querySelector("#detail-content");
  const closeButton = document.querySelector("#sheet-close");
  const textSizeButton = document.querySelector("#text-size-toggle");
  const favoritesMenuButton = document.querySelector("#favorites-menu-button");
  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  const favoritesStorageKey = "gujeon-i-favorite-stores";
  const storedFavorites = JSON.parse(localStorage.getItem(favoritesStorageKey) || "[]");
  if (!Array.isArray(storedFavorites)) {
    throw new TypeError("저장된 찜 점포 정보가 올바르지 않습니다.");
  }
  const favoriteStoreIds = new Set(storedFavorites);
  let selectedCategory = "";
  let selectedAlley = "";
  let selectedMapStoreId = "";
  let favoritesOnly = false;
  let previouslyFocusedElement = null;

  function makeElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function showView(viewId) {
    views.forEach((view) => {
      view.hidden = view.id !== viewId;
    });
    document.querySelector("#main-content").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function categoryFor(store) {
    return categoriesById.get(store.category);
  }

  function addCategoryTag(parent, category, extraClass = "") {
    const tag = makeElement("span", `category-tag ${extraClass}`.trim(), category ? category.name : "");
    if (category) tag.style.backgroundColor = category.color;
    parent.append(tag);
  }

  function getVisibleStores() {
    const query = storeSearch.value.trim().toLocaleLowerCase();
    return stores.filter((store) => {
      if (favoritesOnly && !favoriteStoreIds.has(store.id)) return false;
      if (selectedCategory && store.category !== selectedCategory) return false;
      if (selectedAlley && store.alley !== selectedAlley) return false;
      if (!query) return true;

      const categoryName = categoryFor(store)?.name || "";
      const searchableText = [store.name, ...store.products, categoryName]
        .join(" ")
        .toLocaleLowerCase();
      return searchableText.includes(query);
    });
  }

  function renderCategories() {
    categoryList.replaceChildren();
    const options = [{ id: "", name: "전체" }, ...categories];

    options.forEach((category) => {
      const button = makeElement("button", "category-button", category.name);
      button.type = "button";
      button.setAttribute("aria-pressed", String(selectedCategory === category.id));
      button.addEventListener("click", () => {
        selectedCategory = category.id;
        renderCategories();
        renderStores();
      });
      categoryList.append(button);
    });
  }

  function renderStores() {
    const visibleStores = getVisibleStores();
    storeCount.textContent = `${visibleStores.length}개 점포`;
    storeList.replaceChildren();

    if (visibleStores.length === 0) {
      storeList.append(makeElement(
        "p",
        "empty-state",
        favoritesOnly && favoriteStoreIds.size === 0 ? "찜한 점포가 없습니다." : "검색 결과가 없습니다.",
      ));
      return;
    }

    visibleStores.forEach((store) => {
      const card = makeElement("article", "store-card");
      const detailsButton = makeElement("button", "store-card-details");
      detailsButton.type = "button";
      detailsButton.setAttribute("aria-label", `${store.name} 상세 정보`);

      const top = makeElement("span", "store-card-top");
      addCategoryTag(top, categoryFor(store));
      detailsButton.append(top);
      detailsButton.append(makeElement("span", "store-name", store.name));
      detailsButton.append(makeElement("span", "store-product", store.products.join(", ")));
      detailsButton.addEventListener("click", () => openStoreDetails(store));

      const isFavorite = favoriteStoreIds.has(store.id);
      const favoriteButton = makeElement("button", "store-favorite-button", isFavorite ? "★" : "☆");
      favoriteButton.type = "button";
      favoriteButton.setAttribute("aria-pressed", String(isFavorite));
      favoriteButton.setAttribute("aria-label", `${store.name} ${isFavorite ? "찜 해제" : "찜하기"}`);
      favoriteButton.addEventListener("click", () => {
        if (favoriteStoreIds.has(store.id)) favoriteStoreIds.delete(store.id);
        else favoriteStoreIds.add(store.id);
        localStorage.setItem(favoritesStorageKey, JSON.stringify([...favoriteStoreIds]));
        renderStores();
      });

      card.append(detailsButton, favoriteButton);
      storeList.append(card);
    });
  }

  function renderAlleyButtons() {
    const alleyList = document.querySelector("#home-alley-list");
    alleyList.replaceChildren();

    alleys.forEach((alley) => {
      const button = makeElement("button", "alley-button", alley);
      button.type = "button";
      button.addEventListener("click", () => {
        selectedAlley = alley;
        selectedCategory = "";
        favoritesOnly = false;
        storeSearch.value = "";
        document.querySelector("#stores-title").textContent = "점포찾기";
        renderCategories();
        renderStores();
        showView("stores-view");
      });
      alleyList.append(button);
    });
  }

  function appendDetailField(list, label, value) {
    list.append(makeElement("dt", "", label));
    list.append(makeElement("dd", "", value));
  }

  function openStoreDetails(store) {
    selectedMapStoreId = "";
    document.querySelectorAll(".map-marker.is-highlighted").forEach((marker) => {
      marker.classList.remove("is-highlighted");
    });
    const category = categoryFor(store);
    detailContent.replaceChildren();
    addCategoryTag(detailContent, category, "detail-category");
    const title = makeElement("h2", "detail-title", store.name);
    title.id = "detail-name";
    detailContent.append(title);

    const photo = makeElement("div", "store-photo");
    if (store.photo) {
      const image = document.createElement("img");
      image.src = store.photo;
      image.alt = `${store.name} 사진`;
      photo.append(image);
    } else {
      photo.textContent = "사진 준비 중";
    }
    detailContent.append(photo);

    const fields = makeElement("dl", "detail-fields");
    appendDetailField(fields, "대표상품", store.products.join(", "));
    appendDetailField(fields, "영업시간", store.hours);
    appendDetailField(fields, "위치(골목)", store.alley || "골목 정보 없음");
    appendDetailField(fields, "연락처", store.phone || "공개하지 않음");
    detailContent.append(fields);

    const mapButton = makeElement("button", "primary-action", "지도에서 위치보기");
    mapButton.type = "button";
    mapButton.addEventListener("click", () => {
      selectedMapStoreId = store.id;
      closeStoreDetails(false);
      renderMap();
      showView("map-view");
    });
    detailContent.append(mapButton);

    previouslyFocusedElement = document.activeElement;
    detailBackdrop.hidden = false;
    document.body.classList.add("dialog-open");
    detailSheet.focus();
    closeButton.focus();
  }

  function closeStoreDetails(restoreFocus = true) {
    if (detailBackdrop.hidden) return;
    detailBackdrop.hidden = true;
    document.body.classList.remove("dialog-open");
    if (restoreFocus && previouslyFocusedElement instanceof HTMLElement) {
      previouslyFocusedElement.focus();
    }
  }

  function renderMap() {
    const mapContent = document.querySelector("#map-content");
    mapContent.replaceChildren();

    if (stores.length === 0) {
      mapContent.append(makeElement("p", "empty-state", "등록된 점포 위치 정보가 없습니다."));
      return;
    }

    const selectedStore = stores.find((store) => store.id === selectedMapStoreId);
    const status = makeElement("p", "map-status", selectedStore ? `${selectedStore.name} 위치입니다` : "");
    status.setAttribute("role", "status");
    mapContent.append(status);

    const map = makeElement("div", "market-map");
    map.setAttribute("role", "group");
    map.setAttribute("aria-label", "예시배치도, 점포 위치 안내");
    alleys.forEach((alley, index) => {
      const block = makeElement("div", `map-block map-block-${index + 1}`);
      block.append(makeElement("span", "map-block-name", alley));
      map.append(block);
    });

    stores.forEach((store) => {
      const marker = makeElement("button", "map-marker");
      marker.type = "button";
      marker.style.left = `${store.x}%`;
      marker.style.top = `${store.y}%`;
      marker.style.backgroundColor = categoryFor(store)?.color || "#73756f";
      marker.classList.toggle("is-highlighted", store.id === selectedMapStoreId);
      marker.setAttribute("aria-label", `${store.name}, ${store.alley || "골목 정보 없음"}`);
      marker.title = store.name;
      marker.addEventListener("click", () => {
        selectedMapStoreId = "";
        openStoreDetails(store);
      });
      map.append(marker);
    });
    const exampleLabel = makeElement("p", "map-example-label", "예시배치도");
    map.append(exampleLabel);
    mapContent.append(map);
    const legend = makeElement("div", "map-legend");
    categories.forEach((category) => {
      const item = makeElement("span", "map-legend-item");
      const swatch = makeElement("span", "map-legend-dot");
      swatch.style.backgroundColor = category.color;
      swatch.setAttribute("aria-hidden", "true");
      item.append(swatch, document.createTextNode(category.name));
      legend.append(item);
    });
    mapContent.append(legend);
    mapContent.append(
      makeElement("p", "map-caption", "점포 위치와 배치는 예시입니다. 점을 누르면 점포 상세 정보를 볼 수 있습니다."),
    );
  }

  function renderParking() {
    const parkingList = document.querySelector("#parking-list");
    parkingList.replaceChildren();

    if (parkings.length === 0) {
      parkingList.append(makeElement("p", "empty-state", "등록된 주차 정보가 없습니다."));
      return;
    }

    parkings.forEach((parking) => {
      const card = makeElement("article", "info-card");
      card.append(makeElement("h2", "", parking.name));
      const fields = makeElement("dl", "detail-fields parking-fields");
      appendDetailField(fields, "위치", parking.place);
      appendDetailField(fields, "요금", parking.fee);
      appendDetailField(fields, "메모", parking.note);
      card.append(fields);
      const directions = makeElement("a", "primary-action", "길찾기 (네이버지도)");
      directions.href = `https://map.naver.com/p/search/${encodeURIComponent(`구미${parking.name}`)}`;
      directions.target = "_blank";
      directions.rel = "noopener noreferrer";
      card.append(directions);
      parkingList.append(card);
    });
  }

  function showStores(query = "", onlyFavorites = false) {
    selectedAlley = "";
    selectedCategory = "";
    favoritesOnly = onlyFavorites;
    storeSearch.value = query;
    document.querySelector("#stores-title").textContent = favoritesOnly ? "찜한 점포" : "점포찾기";
    renderCategories();
    renderStores();
    showView("stores-view");
  }

  document.querySelector("#header-market").textContent = market.name;
  document.querySelector("#header-app").textContent = market.appName;
  document.querySelector("#market-intro").textContent = market.intro;
  document.querySelector("#footer-market").textContent = market.name;
  document.querySelector("#footer-address").textContent = market.address;

  const footerPhone = document.querySelector("#footer-phone");
  if (market.phone) {
    footerPhone.href = `tel:${market.phone}`;
    footerPhone.textContent = market.phone;
  } else {
    footerPhone.remove();
  }

  homeSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    showStores(homeSearch.value);
  });
  storeSearchForm.addEventListener("submit", (event) => event.preventDefault());
  storeSearch.addEventListener("input", renderStores);
  favoritesMenuButton.addEventListener("click", () => showStores("", true));

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const viewId = button.dataset.view;
      if (viewId === "stores-view") showStores();
      else showView(viewId);
    });
  });
  document.querySelectorAll("[data-home]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      selectedAlley = "";
      selectedCategory = "";
      homeSearch.value = "";
      showView("home-view");
    });
  });

  closeButton.addEventListener("click", closeStoreDetails);
  detailBackdrop.addEventListener("click", (event) => {
    if (event.target === detailBackdrop) closeStoreDetails();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeStoreDetails();
  });

  textSizeButton.addEventListener("click", () => {
    const enabled = document.documentElement.classList.toggle("large-text");
    textSizeButton.setAttribute("aria-pressed", String(enabled));
    localStorage.setItem("gujeon-i-large-text", enabled ? "true" : "false");
  });
  const largeTextEnabled = localStorage.getItem("gujeon-i-large-text") === "true";
  document.documentElement.classList.toggle("large-text", largeTextEnabled);
  textSizeButton.setAttribute("aria-pressed", String(largeTextEnabled));

  renderAlleyButtons();
  renderCategories();
  renderStores();
  renderMap();
  renderParking();
})();