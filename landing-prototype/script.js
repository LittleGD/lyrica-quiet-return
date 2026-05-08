const hero = document.querySelector(".hero");
const heroVideo = document.querySelector(".hero-video");
const heroOverlay = document.querySelector(".hero-overlay");
const heroCursor = document.querySelector(".hero-cursor");
const heroCopy = document.querySelector(".hero-copy");
const heroNav = document.querySelector(".hero-nav");
const heroRegister = document.querySelector(".hero-register");
const heroClock = document.querySelector(".hero-clock");
const dialGlass = document.querySelector(".dial-glass");
const designDial = document.querySelector(".dial-lens");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");
const copyFragments = Array.from(document.querySelectorAll(".copy-fragment"));
const dialBackgroundWords = Array.from(document.querySelectorAll(".dial-background-word"));
const dialGlassWords = Array.from(document.querySelectorAll(".dial-glass-word")).reduce(
  (words, word) => {
    const key = word.classList.contains("word-top") ? "top" : "bottom";
    words[key] = word;
    return words;
  },
  {}
);
const revealSections = Array.from(document.querySelectorAll(".content-section, .site-footer"));
const brandStatement = document.querySelector(".brand-statement");
const brandFollow = document.querySelector(".brand-follow");
const collectionCards = Array.from(document.querySelectorAll(".collection-card"));
const watchExploration = document.querySelector(".watch-exploration");
const explorerSticky = document.querySelector(".explorer-sticky");
const watchSequence = document.querySelector(".watch-sequence");
const watchSequenceFrame = document.querySelector(".watch-sequence-frame");
const detailItems = Array.from(document.querySelectorAll(".detail-item"));
const craftsmanship = document.querySelector(".craftsmanship");
const craftSequence = document.querySelector(".craft-sequence");
const craftSequenceFrame = document.querySelector(".craft-sequence-frame");
const snapGallery = document.querySelector(".snap-gallery");
const snapTiles = Array.from(document.querySelectorAll(".snap-gallery .snap-tile"));
const ownershipRitual = document.querySelector(".ownership-ritual");
const ritualLineItems = Array.from(document.querySelectorAll(".ritual-lines p"));
const ritualCards = Array.from(document.querySelectorAll(".ritual-grid article"));
const siteFooter = document.querySelector(".site-footer");
const designLiveReadout = document.querySelector(".dial-live-readout");
const designTimeLabels = Array.from(document.querySelectorAll(".dial-hand-label")).reduce(
  (labels, label) => {
    labels[label.dataset.designUnit] = label;
    return labels;
  },
  {}
);
const clockLabels = Array.from(document.querySelectorAll(".clock-time-label")).reduce(
  (labels, label) => {
    labels[label.dataset.unit] = label;
    return labels;
  },
  {}
);
const clockLabelTimers = {};

const state = {
  x: 0,
  y: 0,
  tx: 0,
  ty: 0,
  lastTx: 0,
  lastTy: 0,
  vx: 0,
  vy: 0,
  cursorX: 0,
  cursorY: 0,
  pullX: 0,
  pullY: 0,
  clientX: 0,
  clientY: 0,
  active: 0,
  targetActive: 0,
  energy: 0,
  targetEnergy: 0,
  frame: 0,
  scrollFrame: 0,
  clockTimer: 0,
  heroInView: true,
  designDialInView: true,
};

let fragmentRects = [];

const brandFollowState = {
  x: 0,
  y: 0,
  tx: 0,
  ty: 0,
  rotate: -2,
  targetRotate: -2,
  scale: 0.96,
  targetScale: 0.96,
  skew: 0,
  active: 0,
  targetActive: 0,
  frame: 0,
  initialized: false,
};

const explorerState = {
  progress: 0,
  targetProgress: 0,
  frame: 0,
  initialized: false,
  activeFrame: "",
};

const craftState = {
  progress: 0,
  targetProgress: 0,
  frame: 0,
  initialized: false,
  activeFrame: "",
};

const observeFrameSegments = [
  { id: "case", path: "./assets/observe-frames-v1/case/frame_", count: 81 },
  { id: "dial", path: "./assets/observe-frames-v1/dial/frame_", count: 81 },
  { id: "crown", path: "./assets/observe-frames-v1/crown/frame_", count: 81 },
  { id: "back", path: "./assets/observe-frames-v1/back/frame_", count: 81 },
];

const craftFrameSegment = {
  id: "assemble",
  path: "./assets/craft-frames-v1/assemble/frame_",
  count: 81,
};

const observeFrameCache = new Map();
const craftFrameCache = new Map();

const weightedScrollState = {
  current: window.scrollY || 0,
  target: window.scrollY || 0,
  frame: 0,
  active: false,
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function ensureFrame() {
  if (!state.frame) {
    state.frame = window.requestAnimationFrame(render);
  }
}

function ensureScrollFrame() {
  if (!state.scrollFrame) {
    state.scrollFrame = window.requestAnimationFrame(updateScroll);
  }
}

function getMaxScrollY() {
  const scroller = document.scrollingElement || document.documentElement;
  return Math.max(scroller.scrollHeight - window.innerHeight, 0);
}

function syncWeightedScrollPosition(top = window.scrollY || 0) {
  weightedScrollState.current = top;
  weightedScrollState.target = top;
}

function getWheelDeltaY(event) {
  const lineHeight = 18;
  const pageHeight = window.innerHeight || 1;
  const unit = event.deltaMode === 1 ? lineHeight : event.deltaMode === 2 ? pageHeight : 1;

  return event.deltaY * unit;
}

function canScrollInsideTarget(event, deltaY) {
  let node = event.target;

  while (node && node !== document.body && node !== document.documentElement) {
    if (node instanceof HTMLElement) {
      const tagName = node.tagName;
      if (/^(TEXTAREA|SELECT|INPUT)$/u.test(tagName)) return true;

      const style = window.getComputedStyle(node);
      const scrollableY = /(auto|scroll|overlay)/u.test(style.overflowY);
      const hasScrollRoom = node.scrollHeight > node.clientHeight + 1;

      if (scrollableY && hasScrollRoom) {
        const canScrollDown = deltaY > 0 && node.scrollTop + node.clientHeight < node.scrollHeight - 1;
        const canScrollUp = deltaY < 0 && node.scrollTop > 1;
        if (canScrollDown || canScrollUp) return true;
      }
    }

    node = node.parentNode;
  }

  return false;
}

function renderWeightedScroll() {
  weightedScrollState.frame = 0;

  const distance = weightedScrollState.target - weightedScrollState.current;
  weightedScrollState.current += distance * 0.115;

  if (Math.abs(distance) < 0.45) {
    weightedScrollState.current = weightedScrollState.target;
    weightedScrollState.active = false;
  }

  window.scrollTo(0, weightedScrollState.current);

  if (weightedScrollState.active) {
    weightedScrollState.frame = window.requestAnimationFrame(renderWeightedScroll);
  }
}

function startWeightedScroll() {
  if (!weightedScrollState.frame) {
    weightedScrollState.frame = window.requestAnimationFrame(renderWeightedScroll);
  }
}

function handleWeightedWheel(event) {
  if (reduceMotion.matches || !finePointer.matches || event.ctrlKey || event.metaKey) return;

  const deltaY = getWheelDeltaY(event);
  if (Math.abs(deltaY) < Math.abs(event.deltaX)) return;
  if (Math.abs(deltaY) < 0.4 || canScrollInsideTarget(event, deltaY)) return;

  event.preventDefault();

  if (!weightedScrollState.active) {
    weightedScrollState.current = window.scrollY || 0;
    weightedScrollState.target = weightedScrollState.current;
  }

  const weightedDelta = clamp(deltaY, -520, 520) * 0.86;
  weightedScrollState.target = clamp(
    weightedScrollState.target + weightedDelta,
    0,
    getMaxScrollY()
  );
  weightedScrollState.active = true;
  startWeightedScroll();
}

function syncWeightedScrollTarget() {
  if (weightedScrollState.active) return;
  syncWeightedScrollPosition();
}

function handleWeightedScrollResize() {
  weightedScrollState.target = clamp(weightedScrollState.target, 0, getMaxScrollY());
  if (!weightedScrollState.active) {
    syncWeightedScrollPosition(clamp(window.scrollY || 0, 0, getMaxScrollY()));
  }
}

function ensureBrandFollowFrame() {
  if (!brandFollowState.frame) {
    brandFollowState.frame = window.requestAnimationFrame(renderBrandFollow);
  }
}

function ensureExplorerFrame() {
  if (!explorerState.frame) {
    explorerState.frame = window.requestAnimationFrame(renderExplorer);
  }
}

function ensureCraftFrame() {
  if (!craftState.frame) {
    craftState.frame = window.requestAnimationFrame(renderCraftsmanship);
  }
}

function refreshFragmentRects() {
  fragmentRects = copyFragments.map((fragment) => fragment.getBoundingClientRect());
}

function syncDialGlassWords() {
  if (!dialGlass || !dialBackgroundWords.length) return;

  const glassRect = dialGlass.getBoundingClientRect();
  if (!glassRect.width || !glassRect.height) return;

  const radius = glassRect.width * 0.5;
  const centerX = glassRect.left + radius;
  const centerY = glassRect.top + glassRect.height * 0.5;

  dialBackgroundWords.forEach((word) => {
    const rect = word.getBoundingClientRect();
    const key = word.classList.contains("word-top") ? "top" : "bottom";
    const glassWord = dialGlassWords[key];

    word.style.setProperty("--dial-mask-x", `${(centerX - rect.left).toFixed(2)}px`);
    word.style.setProperty("--dial-mask-y", `${(centerY - rect.top).toFixed(2)}px`);
    word.style.setProperty("--dial-mask-r", `${radius.toFixed(2)}px`);

    if (!glassWord) return;
    glassWord.style.setProperty("--glass-word-x", `${(rect.left - glassRect.left).toFixed(2)}px`);
    glassWord.style.setProperty("--glass-word-y", `${(rect.top - glassRect.top).toFixed(2)}px`);
  });
}

function scheduleDialGlassSync() {
  window.requestAnimationFrame(syncDialGlassWords);
}

function updateTarget(event) {
  if (!hero || reduceMotion.matches) return;

  const rect = hero.getBoundingClientRect();
  const nextX = clamp((event.clientX - rect.left) / rect.width, 0, 1) - 0.5;
  const nextY = clamp((event.clientY - rect.top) / rect.height, 0, 1) - 0.5;
  const velocity = Math.hypot(nextX - state.lastTx, nextY - state.lastTy);

  state.tx = nextX;
  state.ty = nextY;
  state.vx = nextX - state.lastTx;
  state.vy = nextY - state.lastTy;
  state.lastTx = nextX;
  state.lastTy = nextY;
  state.clientX = event.clientX;
  state.clientY = event.clientY;
  state.targetActive = 1;
  state.targetEnergy = clamp(0.08 + velocity * 2.6, 0, 0.82);

  ensureFrame();
}

function updateTextBlur() {
  if (!copyFragments.length) return;

  const influenceRadius = 128;

  if (fragmentRects.length !== copyFragments.length) {
    refreshFragmentRects();
  }

  copyFragments.forEach((fragment, index) => {
    const rect = fragmentRects[index];
    if (!rect) return;
    const closestX = clamp(state.clientX, rect.left, rect.right);
    const closestY = clamp(state.clientY, rect.top, rect.bottom);
    const distance = Math.hypot(state.clientX - closestX, state.clientY - closestY);
    const proximity = clamp(1 - distance / influenceRadius, 0, 1) * state.active;
    const blur = proximity * proximity * 3.4;
    const opacity = 1 - proximity * 0.06;

    fragment.style.setProperty("--fragment-blur", `${blur.toFixed(2)}px`);
    fragment.style.setProperty("--fragment-opacity", opacity.toFixed(3));
  });
}

function render() {
  if (!hero || reduceMotion.matches) {
    state.frame = 0;
    return;
  }

  state.x += (state.tx - state.x) * 0.092;
  state.y += (state.ty - state.y) * 0.092;
  state.cursorX += (state.tx - state.cursorX) * 0.42;
  state.cursorY += (state.ty - state.cursorY) * 0.42;
  state.pullX += (state.x - state.pullX) * 0.06;
  state.pullY += (state.y - state.pullY) * 0.06;
  state.active += (state.targetActive - state.active) * 0.08;
  state.energy += (state.targetEnergy - state.energy) * 0.08;
  state.targetEnergy *= state.targetActive ? 0.9 : 0.84;
  state.vx *= 0.84;
  state.vy *= 0.84;

  const pressure = clamp(state.energy * 0.86 + state.active * 0.08, 0, 1);
  const pullDistance = clamp(Math.hypot(state.x - state.pullX, state.y - state.pullY), 0, 0.42);
  const lensX = state.x;
  const lensY = state.y;
  const interactionX = clamp(50 + lensX * 100, 2, 98);
  const interactionY = clamp(50 + lensY * 100, 2, 98);
  const cursorX = clamp(50 + state.cursorX * 100, 1, 99);
  const cursorY = clamp(50 + state.cursorY * 100, 1, 99);
  const baseAperture = state.active * (28.5 + pressure * 6);
  const apertureRx = baseAperture * (1 + pullDistance * 0.34) + state.active * Math.abs(state.vx) * 15;
  const apertureRy = baseAperture * (0.96 + pressure * 0.04 + pullDistance * 0.2) + state.active * Math.abs(state.vy) * 12;
  const cursorSpeed = clamp(Math.hypot(state.vx, state.vy) * 16, 0, 0.18);
  const cursorAngle = Math.atan2(state.vy, state.vx || 0.001) * (180 / Math.PI);

  const overlayTarget = heroOverlay || hero;
  const cursorTarget = heroCursor || hero;
  const copyTarget = heroCopy || hero;

  overlayTarget.style.setProperty("--interaction-x", `${interactionX.toFixed(2)}%`);
  overlayTarget.style.setProperty("--interaction-y", `${interactionY.toFixed(2)}%`);
  overlayTarget.style.setProperty("--aperture-rx", `${apertureRx.toFixed(2)}vmin`);
  overlayTarget.style.setProperty("--aperture-ry", `${apertureRy.toFixed(2)}vmin`);
  overlayTarget.style.setProperty("--grain-shift-x", `${(-state.x * 18).toFixed(2)}px`);
  overlayTarget.style.setProperty("--grain-shift-y", `${(-state.y * 14).toFixed(2)}px`);
  cursorTarget.style.setProperty("--cursor-x", `${cursorX.toFixed(2)}%`);
  cursorTarget.style.setProperty("--cursor-y", `${cursorY.toFixed(2)}%`);
  cursorTarget.style.setProperty("--cursor-opacity", (state.active * 0.92).toFixed(3));
  cursorTarget.style.setProperty("--cursor-scale-x", (1 + cursorSpeed).toFixed(3));
  cursorTarget.style.setProperty("--cursor-scale-y", (1 - cursorSpeed * 0.28).toFixed(3));
  cursorTarget.style.setProperty("--cursor-rotate", `${cursorAngle.toFixed(2)}deg`);
  copyTarget.style.setProperty("--copy-shift-x", `${(state.x * 3).toFixed(2)}px`);
  copyTarget.style.setProperty("--copy-shift-y", `${(state.y * 2).toFixed(2)}px`);
  copyTarget.style.setProperty("--copy-tilt-x", `${(-state.y * 0.75).toFixed(3)}deg`);
  copyTarget.style.setProperty("--copy-tilt-y", `${(state.x * 0.9).toFixed(3)}deg`);
  updateTextBlur();

  const isSettled =
    Math.abs(state.tx - state.x) < 0.001 &&
    Math.abs(state.ty - state.y) < 0.001 &&
    Math.abs(state.tx - state.cursorX) < 0.001 &&
    Math.abs(state.ty - state.cursorY) < 0.001 &&
    Math.abs(state.x - state.pullX) < 0.001 &&
    Math.abs(state.y - state.pullY) < 0.001 &&
    Math.abs(state.targetActive - state.active) < 0.001 &&
    state.energy < 0.006 &&
    state.targetEnergy < 0.006;

  if (!isSettled) {
    state.frame = window.requestAnimationFrame(render);
  } else {
    state.frame = 0;
  }
}

function updateScroll() {
  state.scrollFrame = 0;

  if (!hero || reduceMotion.matches) return;

  const rect = hero.getBoundingClientRect();
  const viewportHeight = window.innerHeight || 1;
  const progress = clamp(-rect.top / viewportHeight, 0, 1);
  const softProgress = progress * progress * (3 - 2 * progress);

  (heroVideo || hero).style.setProperty("--hero-video-y", `${(-34 * softProgress).toFixed(2)}px`);
  (heroVideo || hero).style.setProperty("--hero-video-scale", (1.01 + softProgress * 0.035).toFixed(4));
  (heroCopy || hero).style.setProperty("--copy-scroll-y", `${(-64 * softProgress).toFixed(2)}px`);
  (heroCopy || hero).style.setProperty("--copy-scroll-opacity", (1 - softProgress * 0.86).toFixed(3));
  (heroCopy || hero).style.setProperty("--copy-scroll-blur", `${(softProgress * 7).toFixed(2)}px`);
  (heroNav || hero).style.setProperty("--nav-scroll-y", `${(-18 * softProgress).toFixed(2)}px`);
  (heroNav || hero).style.setProperty("--nav-scroll-opacity", (1 - softProgress * 0.82).toFixed(3));
  (heroRegister || hero).style.setProperty("--register-scroll-y", `${(20 * softProgress).toFixed(2)}px`);
  (heroRegister || hero).style.setProperty("--register-scroll-opacity", (1 - softProgress * 0.95).toFixed(3));
  (heroClock || hero).style.setProperty("--clock-scroll-y", `${(-28 * softProgress).toFixed(2)}px`);
  (heroClock || hero).style.setProperty("--clock-scroll-opacity", (1 - softProgress * 0.78).toFixed(3));
  updateBrandStatement();
  updateCollectionMotion();
  updateExplorer();
  updateCraftsmanship();
  updateSnapGallery();
  updateOwnershipRitual();
}

function updateBrandStatement() {
  if (!brandStatement || reduceMotion.matches) return;

  const rect = brandStatement.getBoundingClientRect();
  const viewportHeight = window.innerHeight || 1;
  const centerOffset = (rect.top + rect.height * 0.5 - viewportHeight * 0.5) / viewportHeight;
  const focus = clamp(1 - Math.abs(centerOffset) * 1.12, 0, 1);
  const falloff = Math.pow(1 - focus, 1.45);
  const titleY = clamp(centerOffset * 58, -62, 62);
  const copyY = clamp(centerOffset * 38, -42, 42);
  const scrollBlur = falloff * 12;
  const copyBlur = falloff * 7;
  const titleScale = 0.982 + focus * 0.018;
  const fieldOpacity = 0.08 + focus * 0.68;

  brandStatement.style.setProperty("--brand-scroll-title-y", `${titleY.toFixed(2)}px`);
  brandStatement.style.setProperty("--brand-scroll-copy-y", `${copyY.toFixed(2)}px`);
  brandStatement.style.setProperty("--brand-scroll-blur", `${scrollBlur.toFixed(2)}px`);
  brandStatement.style.setProperty("--brand-copy-scroll-blur", `${copyBlur.toFixed(2)}px`);
  brandStatement.style.setProperty("--brand-title-scroll-scale", titleScale.toFixed(4));
  brandStatement.style.setProperty("--brand-field-opacity", fieldOpacity.toFixed(3));
}

function updateCollectionMotion() {
  if (!collectionCards.length || reduceMotion.matches) return;

  const viewportHeight = window.innerHeight || 1;

  collectionCards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const centerOffset = (rect.top + rect.height * 0.5 - viewportHeight * 0.58) / viewportHeight;
    const focus = clamp(1 - Math.abs(centerOffset) * 1.45, 0, 1);
    const easedFocus = focus * focus * (3 - 2 * focus);
    const drift = clamp(centerOffset * 30, -26, 26);
    const staggerLift = (index - 1) * 4;
    const y = drift * (1 - easedFocus) + staggerLift * (1 - focus);
    const scale = 0.972 + easedFocus * 0.028;

    card.style.setProperty("--collection-scroll-y", `${y.toFixed(2)}px`);
    card.style.setProperty("--collection-scroll-scale", scale.toFixed(4));
  });
}

function getBrandFollowRest(rect) {
  return {
    x: rect.width * 0.58,
    y: rect.height * 0.48,
  };
}

function primeBrandFollow(rect = brandStatement.getBoundingClientRect()) {
  if (!brandFollow || !brandStatement || brandFollowState.initialized) return;

  const rest = getBrandFollowRest(rect);
  brandFollowState.x = rest.x;
  brandFollowState.y = rest.y;
  brandFollowState.tx = rest.x;
  brandFollowState.ty = rest.y;
  brandFollowState.initialized = true;
  brandFollow.style.setProperty("--brand-follow-x", `${rest.x.toFixed(2)}px`);
  brandFollow.style.setProperty("--brand-follow-y", `${rest.y.toFixed(2)}px`);
}

function updateBrandFollowTarget(event) {
  if (!brandFollow || !brandStatement || reduceMotion.matches) return;

  const rect = brandStatement.getBoundingClientRect();
  primeBrandFollow(rect);

  const nextX = clamp(event.clientX - rect.left + rect.width * 0.025, 40, rect.width - 40);
  const nextY = clamp(event.clientY - rect.top + rect.height * 0.025, 64, rect.height - 64);
  const dx = nextX - brandFollowState.tx;
  const dy = nextY - brandFollowState.ty;
  const velocity = clamp(Math.hypot(dx, dy) / Math.max(rect.width, 1), 0, 0.16);

  brandFollowState.tx = nextX;
  brandFollowState.ty = nextY;
  brandFollowState.targetRotate = clamp(dx * 0.018 + dy * -0.006, -7, 7);
  brandFollowState.targetScale = 0.985 + velocity * 0.5;
  brandFollowState.targetActive = 1;
  ensureBrandFollowFrame();
}

function releaseBrandFollow() {
  if (!brandFollow || !brandStatement || reduceMotion.matches) return;

  const rect = brandStatement.getBoundingClientRect();
  const rest = getBrandFollowRest(rect);
  brandFollowState.tx = rest.x;
  brandFollowState.ty = rest.y;
  brandFollowState.targetRotate = -2;
  brandFollowState.targetScale = 0.96;
  brandFollowState.targetActive = 0;
  ensureBrandFollowFrame();
}

function updateOwnershipRitual() {
  if (!ownershipRitual || reduceMotion.matches) return;

  const rect = ownershipRitual.getBoundingClientRect();
  const viewportHeight = window.innerHeight || 1;
  const progress = clamp((viewportHeight * 0.82 - rect.top) / (rect.height * 0.78), 0, 1);
  const eased = progress * progress * (3 - 2 * progress);

  ownershipRitual.style.setProperty("--ritual-progress", eased.toFixed(4));

  ritualLineItems.forEach((line, index) => {
    const lineProgress = clamp((progress - index * 0.075) * 1.85, 0, 1);
    const lineEased = lineProgress * lineProgress * (3 - 2 * lineProgress);
    line.style.setProperty("--line-progress", lineEased.toFixed(4));
  });

  ritualCards.forEach((card, index) => {
    const cardProgress = clamp((progress - 0.46 - index * 0.055) * 2.35, 0, 1);
    const cardEased = cardProgress * cardProgress * (3 - 2 * cardProgress);
    card.style.setProperty("--ritual-card-progress", cardEased.toFixed(4));
  });
}

function renderBrandFollow() {
  if (!brandFollow || !brandStatement || reduceMotion.matches) {
    brandFollowState.frame = 0;
    return;
  }

  primeBrandFollow();
  const velocityX = brandFollowState.tx - brandFollowState.x;
  const velocityY = brandFollowState.ty - brandFollowState.y;
  brandFollowState.x += velocityX * 0.13;
  brandFollowState.y += velocityY * 0.09;
  brandFollowState.rotate += (brandFollowState.targetRotate - brandFollowState.rotate) * 0.08;
  brandFollowState.scale += (brandFollowState.targetScale - brandFollowState.scale) * 0.09;
  brandFollowState.active += (brandFollowState.targetActive - brandFollowState.active) * 0.08;

  const targetSkew = clamp(-velocityX * 0.14, -9, 9);
  brandFollowState.skew += (targetSkew - brandFollowState.skew) * 0.22;

  const active = brandFollowState.active;
  const opacity = 0.18 + active * 0.2;
  const blur = 4 - active * 2;

  brandFollow.style.setProperty("--brand-follow-x", `${brandFollowState.x.toFixed(2)}px`);
  brandFollow.style.setProperty("--brand-follow-y", `${brandFollowState.y.toFixed(2)}px`);
  brandFollow.style.setProperty("--brand-follow-rotate", `${brandFollowState.rotate.toFixed(2)}deg`);
  brandFollow.style.setProperty("--brand-follow-scale", brandFollowState.scale.toFixed(4));
  brandFollow.style.setProperty("--brand-follow-skew", `${brandFollowState.skew.toFixed(2)}deg`);
  brandFollow.style.setProperty("--brand-follow-opacity", opacity.toFixed(3));
  brandFollow.style.setProperty("--brand-follow-blur", `${blur.toFixed(2)}px`);

  const settled =
    Math.abs(brandFollowState.tx - brandFollowState.x) < 0.18 &&
    Math.abs(brandFollowState.ty - brandFollowState.y) < 0.18 &&
    Math.abs(brandFollowState.targetRotate - brandFollowState.rotate) < 0.04 &&
    Math.abs(brandFollowState.targetScale - brandFollowState.scale) < 0.002 &&
    Math.abs(brandFollowState.targetActive - brandFollowState.active) < 0.002 &&
    Math.abs(brandFollowState.skew) < 0.05;

  if (!settled) {
    brandFollowState.frame = window.requestAnimationFrame(renderBrandFollow);
  } else {
    brandFollowState.frame = 0;
  }
}

function updateExplorer() {
  if (!watchExploration || !detailItems.length || reduceMotion.matches) return;

  const rect = watchExploration.getBoundingClientRect();
  const viewportHeight = window.innerHeight || 1;
  const scrollSpan = Math.max(rect.height - viewportHeight, 1);
  const enterStart = 0;
  const enterSpan = viewportHeight * 0.82;
  const shouldFix = rect.top <= 0 && rect.bottom > viewportHeight;
  const shouldSettle = rect.bottom <= viewportHeight && rect.bottom > 0;
  const enterProgress = rect.top <= enterStart
    ? clamp((enterStart - rect.top) / enterSpan, 0, 1)
    : 0;
  const easedEnter = enterProgress * enterProgress * (3 - 2 * enterProgress);
  const contentProgress = clamp((easedEnter - 0.86) / 0.14, 0, 1);
  const easedContent = contentProgress * contentProgress * (3 - 2 * contentProgress);

  watchExploration.classList.toggle("is-observe-fixed", shouldFix);
  watchExploration.classList.toggle("is-observe-after", shouldSettle);
  watchExploration.style.setProperty(
    "--observe-enter-opacity",
    (0.28 + easedEnter * 0.72).toFixed(3)
  );
  watchExploration.style.setProperty(
    "--observe-enter-clip",
    `${((1 - easedEnter) * 58).toFixed(2)}%`
  );
  watchExploration.style.setProperty(
    "--observe-enter-y",
    `${((1 - easedEnter) * 7.2).toFixed(2)}vh`
  );
  watchExploration.style.setProperty(
    "--observe-enter-scale",
    (1.026 - easedEnter * 0.026).toFixed(4)
  );
  watchExploration.style.setProperty(
    "--observe-enter-blur",
    `${((1 - easedEnter) * 5.4).toFixed(2)}px`
  );
  watchExploration.style.setProperty(
    "--observe-paper-opacity",
    (1 - easedEnter).toFixed(3)
  );
  watchExploration.style.setProperty(
    "--observe-content-opacity",
    easedContent.toFixed(3)
  );
  watchExploration.style.setProperty(
    "--observe-content-y",
    `${((1 - easedContent) * 18).toFixed(2)}px`
  );
  watchExploration.style.setProperty(
    "--observe-content-blur",
    `${((1 - easedContent) * 3.2).toFixed(2)}px`
  );
  explorerState.targetProgress = clamp(
    Math.max(-rect.top - enterSpan, 0) / Math.max(scrollSpan - enterSpan, 1),
    0,
    1
  );
  ensureExplorerFrame();
}

function alignExploreHash() {
  if (window.location.hash !== "#explore-title" || !watchExploration) return;

  const targetTop = watchExploration.offsetTop + (window.innerHeight || 1) * 0.82 + 1;
  window.scrollTo({ top: targetTop, behavior: "auto" });
  syncWeightedScrollPosition(targetTop);
  updateExplorer();
  explorerState.progress = explorerState.targetProgress;
  explorerState.initialized = false;
  ensureExplorerFrame();
}

function alignCraftHash() {
  if (window.location.hash !== "#craft" || !craftsmanship) return;

  const targetTop = craftsmanship.offsetTop + (window.innerHeight || 1) * 0.07 + 1;
  window.scrollTo({ top: targetTop, behavior: "auto" });
  syncWeightedScrollPosition(targetTop);
  updateCraftsmanship();
  craftState.progress = craftState.targetProgress;
  craftState.initialized = false;
  ensureCraftFrame();
}

function alignStickyHashSections() {
  alignExploreHash();
  alignCraftHash();
}

function getObserveFramePath(segment, frame) {
  return `${segment.path}${String(frame).padStart(4, "0")}.jpg`;
}

function preloadObserveFrame(src) {
  if (!src || observeFrameCache.has(src)) return;

  const image = new Image();
  image.decoding = "async";
  image.onerror = () => {
    observeFrameCache.delete(src);
  };
  image.src = src;
  observeFrameCache.set(src, image);
}

function preloadCraftFrame(src) {
  if (!src || craftFrameCache.has(src)) return;

  const image = new Image();
  image.decoding = "async";
  image.onerror = () => {
    craftFrameCache.delete(src);
  };
  image.src = src;
  craftFrameCache.set(src, image);
}

function updateWatchFrame(progress) {
  if (!watchSequenceFrame || !observeFrameSegments.length) return;

  const segmentCount = observeFrameSegments.length;
  const rawPosition = clamp(progress, 0, 1) * segmentCount;
  const segmentIndex = clamp(Math.floor(rawPosition), 0, segmentCount - 1);
  const segment = observeFrameSegments[segmentIndex];
  const localProgress = segmentIndex === segmentCount - 1 && progress >= 1
    ? 1
    : clamp(rawPosition - segmentIndex, 0, 1);
  const frame = clamp(
    Math.round(1 + localProgress * (segment.count - 1)),
    1,
    segment.count
  );
  const src = getObserveFramePath(segment, frame);

  if (explorerState.activeFrame !== src) {
    watchSequenceFrame.src = src;
    watchSequenceFrame.dataset.frame = `${segment.id}-${frame}`;
    explorerState.activeFrame = src;
  }

  for (let offset = -4; offset <= 6; offset += 1) {
    preloadObserveFrame(
      getObserveFramePath(segment, clamp(frame + offset, 1, segment.count))
    );
  }

  const nextSegment = observeFrameSegments[segmentIndex + 1];
  if (nextSegment && frame > segment.count - 8) {
    for (let nextFrame = 1; nextFrame <= 8; nextFrame += 1) {
      preloadObserveFrame(getObserveFramePath(nextSegment, nextFrame));
    }
  }
}

function updateCraftFrame(progress) {
  if (!craftSequenceFrame) return;

  const frame = clamp(
    Math.round(1 + clamp(progress, 0, 1) * (craftFrameSegment.count - 1)),
    1,
    craftFrameSegment.count
  );
  const src = getObserveFramePath(craftFrameSegment, frame);

  if (craftState.activeFrame !== src) {
    craftSequenceFrame.src = src;
    craftSequenceFrame.dataset.frame = `${craftFrameSegment.id}-${frame}`;
    craftState.activeFrame = src;
  }

  for (let offset = -4; offset <= 6; offset += 1) {
    preloadCraftFrame(
      getObserveFramePath(
        craftFrameSegment,
        clamp(frame + offset, 1, craftFrameSegment.count)
      )
    );
  }
}

function renderExplorer() {
  explorerState.frame = 0;

  if (!watchExploration || reduceMotion.matches) return;

  if (!explorerState.initialized) {
    explorerState.progress = explorerState.targetProgress;
    explorerState.initialized = true;
  } else {
    explorerState.progress += (explorerState.targetProgress - explorerState.progress) * 0.18;
  }

  const progress = clamp(explorerState.progress, 0, 1);
  const easedProgress = progress * progress * (3 - 2 * progress);
  const activeIndex = detailItems.length
    ? clamp(Math.round(progress * (detailItems.length - 1)), 0, detailItems.length - 1)
    : 0;

  if (watchSequence) {
    watchSequence.style.setProperty("--watch-sequence-y", `${(-10 + easedProgress * 20).toFixed(2)}px`);
    watchSequence.style.setProperty("--watch-sequence-scale", (1.018 + easedProgress * 0.018).toFixed(4));
    watchSequence.style.setProperty("--watch-sequence-blur", `${(Math.abs(progress - 0.5) * 0.22).toFixed(2)}px`);
  }

  updateWatchFrame(progress);

  detailItems.forEach((item, index) => {
    const isActive = index === activeIndex;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-current", isActive ? "true" : "false");
  });

  if (Math.abs(explorerState.targetProgress - explorerState.progress) > 0.001) {
    ensureExplorerFrame();
  }
}

function updateCraftsmanship() {
  if (!craftsmanship || reduceMotion.matches) return;

  const rect = craftsmanship.getBoundingClientRect();
  const viewportHeight = window.innerHeight || 1;
  const scrollSpan = Math.max(rect.height - viewportHeight, 1);
  const shouldFix = rect.top <= 0 && rect.bottom > viewportHeight;
  const shouldSettle = rect.bottom <= viewportHeight && rect.bottom > 0;

  craftsmanship.classList.toggle("is-craft-fixed", shouldFix);
  craftsmanship.classList.toggle("is-craft-after", shouldSettle);

  const enterStart = viewportHeight * 1.8;
  const enterProgress = clamp((enterStart - rect.top) / enterStart, 0, 1);
  const easedEnter = enterProgress * enterProgress * (3 - 2 * enterProgress);
  const enterOpacity = 0.4 + easedEnter * 0.6;
  craftsmanship.style.setProperty("--craft-enter-opacity", enterOpacity.toFixed(3));
  craftsmanship.style.setProperty("--craft-enter-y", "0");
  craftsmanship.style.setProperty("--craft-enter-scale", (1.04 - easedEnter * 0.04).toFixed(4));
  craftsmanship.style.setProperty("--craft-enter-blur", `${((1 - easedEnter) * 4).toFixed(2)}px`);

  craftState.targetProgress = clamp(-rect.top / scrollSpan, 0, 1);
  ensureCraftFrame();
}

function renderCraftsmanship() {
  craftState.frame = 0;

  if (!craftsmanship || reduceMotion.matches) return;

  if (!craftState.initialized) {
    craftState.progress = craftState.targetProgress;
    craftState.initialized = true;
  } else {
    craftState.progress += (craftState.targetProgress - craftState.progress) * 0.18;
  }

  const progress = clamp(craftState.progress, 0, 1);
  const easedProgress = progress * progress * (3 - 2 * progress);
  const contentProgress = clamp((progress - 0.025) / 0.34, 0, 1);
  const easedContent = contentProgress * contentProgress * (3 - 2 * contentProgress);

  if (craftSequence) {
    craftsmanship.style.setProperty("--craft-media-y", `${(-12 + easedProgress * 24).toFixed(2)}px`);
    craftsmanship.style.setProperty("--craft-media-scale", (1.018 + easedProgress * 0.016).toFixed(4));
    craftsmanship.style.setProperty("--craft-media-blur", `${(Math.abs(progress - 0.5) * 0.3).toFixed(2)}px`);
  }

  craftsmanship.style.setProperty("--craft-content-opacity", easedContent.toFixed(3));
  craftsmanship.style.setProperty("--craft-content-y", `${((1 - easedContent) * 18).toFixed(2)}px`);
  craftsmanship.style.setProperty("--craft-content-blur", `${((1 - easedContent) * 3.4).toFixed(2)}px`);

  updateCraftFrame(progress);

  if (Math.abs(craftState.targetProgress - craftState.progress) > 0.001) {
    ensureCraftFrame();
  }
}

function updateSnapGallery() {
  if (!snapGallery || reduceMotion.matches) return;

  const rect = snapGallery.getBoundingClientRect();
  const viewportHeight = window.innerHeight || 1;
  const galleryScroll = Math.max(-rect.top, 0);
  const scrollSpan = Math.max(rect.height - viewportHeight, 1);
  const progress = clamp(galleryScroll / scrollSpan, 0, 1);
  const introProgress = clamp(galleryScroll / (viewportHeight * 0.72), 0, 1);
  const easedIntro = introProgress * introProgress * (3 - 2 * introProgress);
  const stackProgress = clamp(galleryScroll / scrollSpan, 0, 1);
  const easedStack = stackProgress * stackProgress * (3 - 2 * stackProgress);
  const stackY = -easedStack * 810;
  const heroRadius = easedIntro * 2;
  const heroTargetWidth = Math.min((window.innerWidth || 1) * 0.46, 680);
  const heroTargetHeight = heroTargetWidth * (1448 / 1086);
  const heroWidth = (window.innerWidth || 1) + (heroTargetWidth - (window.innerWidth || 1)) * easedIntro;
  const heroHeight = viewportHeight + (heroTargetHeight - viewportHeight) * easedIntro;
  const heroY = -30 + easedIntro * 6;

  snapGallery.style.setProperty("--snap-gallery-progress", progress.toFixed(4));
  snapGallery.style.setProperty("--snap-gallery-stack-y", `${stackY.toFixed(2)}vh`);
  snapGallery.style.setProperty("--snap-gallery-hero-width", `${heroWidth.toFixed(2)}px`);
  snapGallery.style.setProperty("--snap-gallery-hero-height", `${heroHeight.toFixed(2)}px`);
  snapGallery.style.setProperty("--snap-gallery-hero-y", `${heroY.toFixed(2)}%`);
  snapGallery.style.setProperty("--snap-gallery-hero-radius", `${heroRadius.toFixed(2)}px`);
  snapGallery.style.setProperty(
    "--snap-gallery-hero-shadow",
    `0 ${Math.round(easedIntro * 26)}px ${Math.round(easedIntro * 76)}px rgba(0, 0, 0, ${(
      easedIntro * 0.42
    ).toFixed(3)})`
  );
  const activePosition = easedStack * Math.max(snapTiles.length - 1, 1);
  snapTiles.forEach((tile, index) => {
    const distance = index - activePosition;
    const absDistance = Math.abs(distance);
    const focus = clamp(1 - absDistance / 1.18, 0, 1);
    const presence = clamp(1 - absDistance / 3.2, 0, 1);
    const easedFocus = focus * focus * (3 - 2 * focus);
    const direction = index % 2 === 0 ? -1 : 1;
    const parallaxX = clamp((activePosition - index) * direction * 4.8, -9, 9);
    const parallaxY = clamp(distance * -5.8, -12, 12);
    const driftX = clamp((activePosition - index) * direction * 0.42, -1.4, 1.4);
    const liftY = -easedFocus * 18 + (1 - presence) * 10;
    const tileScale = 0.965 + easedFocus * 0.055;
    const imageScale = 1.18 - easedFocus * 0.055;
    const brightness = 0.58 + presence * 0.18 + easedFocus * 0.18;
    const contrast = 1.02 + easedFocus * 0.07;
    const saturate = 0.72 + easedFocus * 0.18;
    const shadow = 0.22 + easedFocus * 0.42;

    tile.style.setProperty("--snap-tile-x-drift", `${driftX.toFixed(2)}vw`);
    tile.style.setProperty("--snap-tile-y", `${liftY.toFixed(2)}px`);
    tile.style.setProperty("--snap-tile-scale", tileScale.toFixed(4));
    tile.style.setProperty("--snap-tile-opacity", "1");
    tile.style.setProperty("--snap-tile-shadow", shadow.toFixed(3));
    tile.style.setProperty("--snap-img-x", `${parallaxX.toFixed(2)}%`);
    tile.style.setProperty("--snap-img-y", `${parallaxY.toFixed(2)}%`);
    tile.style.setProperty("--snap-img-scale", imageScale.toFixed(4));
    tile.style.setProperty("--snap-img-brightness", brightness.toFixed(3));
    tile.style.setProperty("--snap-img-contrast", contrast.toFixed(3));
    tile.style.setProperty("--snap-img-saturate", saturate.toFixed(3));
  });
}

function updateFooterMotion(event) {
  if (!siteFooter || reduceMotion.matches) return;

  const rect = siteFooter.getBoundingClientRect();
  const localX = clamp(event.clientX - rect.left, 0, rect.width);
  const localY = clamp(event.clientY - rect.top, 0, rect.height);
  const nx = rect.width ? localX / rect.width : 0.5;
  const ny = rect.height ? localY / rect.height : 0.5;
  const signedX = nx - 0.5;
  const signedY = ny - 0.5;

  siteFooter.style.setProperty("--footer-focus-x", `${(nx * 100).toFixed(2)}%`);
  siteFooter.style.setProperty("--footer-focus-y", `${(ny * 100).toFixed(2)}%`);
  siteFooter.style.setProperty("--footer-glow-opacity", "0.17");
  siteFooter.style.setProperty("--footer-logo-x", `${(signedX * 10).toFixed(2)}px`);
  siteFooter.style.setProperty("--footer-logo-y", `${(signedY * 7).toFixed(2)}px`);
  siteFooter.style.setProperty("--footer-logo-rotate", `${(signedX * 1.45).toFixed(2)}deg`);
  siteFooter.style.setProperty("--footer-link-shift", `${(signedY * -1.4).toFixed(2)}px`);
}

function releaseFooterMotion() {
  if (!siteFooter || reduceMotion.matches) return;

  siteFooter.style.setProperty("--footer-focus-x", "50%");
  siteFooter.style.setProperty("--footer-focus-y", "64%");
  siteFooter.style.setProperty("--footer-glow-opacity", "0.08");
  siteFooter.style.setProperty("--footer-logo-x", "0px");
  siteFooter.style.setProperty("--footer-logo-y", "0px");
  siteFooter.style.setProperty("--footer-logo-rotate", "0deg");
  siteFooter.style.setProperty("--footer-link-shift", "0px");
}

function setClockLabel(unit, value) {
  const label = clockLabels[unit];
  if (!label) return;

  const nextValue = String(value).padStart(2, "0");
  if (label.dataset.value === nextValue) return;

  const track = label.querySelector(".clock-label-track");
  const slots = track ? Array.from(track.children) : [];
  if (slots.length < 2) return;

  if (!label.dataset.value) {
    slots[0].textContent = nextValue;
    slots[1].textContent = nextValue;
    label.dataset.value = nextValue;
    return;
  }

  if (reduceMotion.matches) {
    slots[0].textContent = nextValue;
    slots[1].textContent = nextValue;
    label.dataset.value = nextValue;
    return;
  }

  if (unit === "second") {
    slots[0].textContent = nextValue;
    slots[1].textContent = nextValue;
    label.classList.remove("is-rolling");
    label.dataset.value = nextValue;
    return;
  }

  slots[1].textContent = nextValue;
  label.classList.remove("is-rolling");
  track.style.transition = "none";
  track.style.transform = "translate3d(0, 0, 0)";
  track.offsetHeight;
  track.style.transition = "";
  track.style.transform = "";

  window.requestAnimationFrame(() => {
    label.classList.add("is-rolling");
  });

  window.clearTimeout(clockLabelTimers[unit]);
  clockLabelTimers[unit] = window.setTimeout(() => {
    slots[0].textContent = nextValue;
    slots[1].textContent = nextValue;
    label.classList.remove("is-rolling");
    label.dataset.value = nextValue;
    track.style.transition = "";
    track.style.transform = "";
  }, 390);
}

function padClock(value) {
  return String(value).padStart(2, "0");
}

function updateDesignDial(now, angles) {
  if (!designDial) return;

  designDial.style.setProperty("--design-hour-angle", `${angles.hour.toFixed(3)}deg`);
  designDial.style.setProperty("--design-minute-angle", `${angles.minute.toFixed(3)}deg`);
  designDial.style.setProperty("--design-second-angle", `${angles.second.toFixed(3)}deg`);
  designDial.style.setProperty("--design-hour-label-counter-angle", `${(-angles.hour).toFixed(3)}deg`);
  designDial.style.setProperty("--design-minute-label-counter-angle", `${(-angles.minute).toFixed(3)}deg`);
  designDial.style.setProperty("--design-second-label-counter-angle", `${(-angles.second).toFixed(3)}deg`);

  if (designTimeLabels.hour) designTimeLabels.hour.textContent = padClock(now.getHours());
  if (designTimeLabels.minute) designTimeLabels.minute.textContent = padClock(now.getMinutes());
  if (designTimeLabels.second) designTimeLabels.second.textContent = padClock(now.getSeconds());
  if (designLiveReadout) {
    designLiveReadout.textContent = `${padClock(now.getHours())}:${padClock(now.getMinutes())}:${padClock(now.getSeconds())}`;
  }
}

function updateClock() {
  if (!heroClock && !designDial) return;

  const now = new Date();
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;
  const hourAngle = hours * 30;
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  if (heroClock) {
    heroClock.style.setProperty("--second-hand-angle", `${secondAngle.toFixed(3)}deg`);
    heroClock.style.setProperty("--minute-hand-angle", `${minuteAngle.toFixed(3)}deg`);
    heroClock.style.setProperty("--hour-hand-angle", `${hourAngle.toFixed(3)}deg`);
    heroClock.style.setProperty("--second-hand-counter-angle", `${(-secondAngle).toFixed(3)}deg`);
    heroClock.style.setProperty("--minute-hand-counter-angle", `${(-minuteAngle).toFixed(3)}deg`);
    heroClock.style.setProperty("--hour-hand-counter-angle", `${(-hourAngle).toFixed(3)}deg`);
    setClockLabel("hour", now.getHours());
    setClockLabel("minute", now.getMinutes());
    setClockLabel("second", now.getSeconds());
  }

  updateDesignDial(now, {
    hour: hourAngle,
    minute: minuteAngle,
    second: secondAngle,
  });
}

function queueClock() {
  window.clearTimeout(state.clockTimer);

  const shouldRunHeroClock = heroClock && state.heroInView;
  const shouldRunDesignDial = designDial && state.designDialInView;

  if (document.hidden || (!shouldRunHeroClock && !shouldRunDesignDial)) return;

  state.clockTimer = window.setTimeout(() => {
    updateClock();
    queueClock();
  }, reduceMotion.matches ? 60000 : 250);
}

function markSectionsVisible() {
  revealSections.forEach((section) => section.classList.add("is-visible"));
}

function initRevealSections() {
  if (!revealSections.length) return;

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    markSectionsVisible();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          if (dialGlass && entry.target.contains(dialGlass)) {
            scheduleDialGlassSync();
            window.setTimeout(syncDialGlassWords, 760);
          }
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.18,
    }
  );

  revealSections.forEach((section) => observer.observe(section));
}

if (hero) {
  hero.addEventListener("pointermove", updateTarget);
  hero.addEventListener("pointerenter", (event) => {
    refreshFragmentRects();
    updateTarget(event);
  });
  hero.addEventListener("pointerleave", () => {
    state.tx = 0;
    state.ty = 0;
    state.lastTx = 0;
    state.lastTy = 0;
    state.vx = 0;
    state.vy = 0;
    state.targetActive = 0;
    state.targetEnergy = 0;
    ensureFrame();
  });

  updateScroll();
  window.addEventListener("scroll", ensureScrollFrame, { passive: true });
  window.addEventListener("resize", () => {
    refreshFragmentRects();
    scheduleDialGlassSync();
    if (brandFollow) {
      brandFollowState.initialized = false;
      releaseBrandFollow();
    }
    ensureScrollFrame();
  });
}

if (brandStatement && brandFollow) {
  brandStatement.addEventListener("pointermove", updateBrandFollowTarget);
  brandStatement.addEventListener("pointerenter", updateBrandFollowTarget);
  brandStatement.addEventListener("pointerleave", releaseBrandFollow);
}

if (siteFooter) {
  siteFooter.addEventListener("pointermove", updateFooterMotion);
  siteFooter.addEventListener("pointerenter", updateFooterMotion);
  siteFooter.addEventListener("pointerleave", releaseFooterMotion);
}

window.addEventListener("wheel", handleWeightedWheel, { passive: false });
window.addEventListener("scroll", syncWeightedScrollTarget, { passive: true });
window.addEventListener("resize", handleWeightedScrollResize);

function handleReduceMotionChange() {
  state.tx = 0;
  state.ty = 0;
  state.lastTx = 0;
  state.lastTy = 0;
  state.vx = 0;
  state.vy = 0;
  state.targetActive = 0;
  state.targetEnergy = 0;
  brandFollowState.targetActive = 0;
  brandFollowState.initialized = false;

  markSectionsVisible();
  refreshFragmentRects();
  scheduleDialGlassSync();
  ensureFrame();
  ensureScrollFrame();
  updateClock();
  queueClock();
}

if (typeof reduceMotion.addEventListener === "function") {
  reduceMotion.addEventListener("change", handleReduceMotionChange);
} else if (typeof reduceMotion.addListener === "function") {
  reduceMotion.addListener(handleReduceMotionChange);
}

if (watchSequenceFrame) {
  updateWatchFrame(0);
  observeFrameSegments.forEach((segment) => {
    for (let frame = 1; frame <= 6; frame += 1) {
      preloadObserveFrame(getObserveFramePath(segment, frame));
    }
  });
}

if (craftSequenceFrame) {
  updateCraftFrame(0);
  for (let frame = 1; frame <= 8; frame += 1) {
    preloadCraftFrame(getObserveFramePath(craftFrameSegment, frame));
  }
}

window.addEventListener("load", alignStickyHashSections);
window.addEventListener("pageshow", alignStickyHashSections);
window.addEventListener("hashchange", alignStickyHashSections);
window.requestAnimationFrame(alignStickyHashSections);
window.setTimeout(alignStickyHashSections, 0);

if (hero && "IntersectionObserver" in window) {
  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      state.heroInView = entry.isIntersecting;
      if (state.heroInView) {
        updateClock();
      }
      queueClock();
    },
    { threshold: 0.08 }
  );

  heroObserver.observe(hero);
}

if (designDial && "IntersectionObserver" in window) {
  const designDialObserver = new IntersectionObserver(
    ([entry]) => {
      state.designDialInView = entry.isIntersecting;
      if (state.designDialInView) {
        updateClock();
      }
      queueClock();
    },
    { threshold: 0.08 }
  );

  designDialObserver.observe(designDial);
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    updateClock();
  }
  queueClock();
});

refreshFragmentRects();
initRevealSections();
syncDialGlassWords();
window.addEventListener("load", syncDialGlassWords);
window.addEventListener("resize", scheduleDialGlassSync);
updateClock();
queueClock();
