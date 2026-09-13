const navbar = document.querySelector("#navbar");
const navLinks = document.querySelectorAll(".nav-links a");
const reveals = document.querySelectorAll(".reveal, .reveal-group, .channel-card");
const counters = document.querySelectorAll(".count");
const reservationCounters = document.querySelectorAll(".reservation .count");
let hasBooked = false;

function formatNumber(value) {
  return Math.floor(value).toLocaleString("zh-CN");
}

function runCounter(el) {
  if (el.dataset.done === "true") return;
  el.dataset.done = "true";
  const target = Number(el.dataset.target || 0);
  const duration = target > 100000 ? 1400 : 900;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatNumber(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("in-view");
    entry.target.querySelectorAll?.(".count").forEach(runCounter);
    if (entry.target.classList.contains("count")) runCounter(entry.target);
  });
}, { threshold: 0.18, rootMargin: "0px 0px -60px 0px" });

reveals.forEach((el) => revealObserver.observe(el));
counters.forEach((el) => revealObserver.observe(el));

const pageSections = [...document.querySelectorAll("main section[id]")];

function updateActiveNav() {
  const marker = window.scrollY + window.innerHeight * 0.36;
  let activeId = pageSections[0]?.id;

  pageSections.forEach((section) => {
    if (marker >= section.offsetTop) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const target = link.getAttribute("href")?.replace("#", "");
    link.classList.toggle("active", target === activeId);
  });
}

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
  updateActiveNav();
}, { passive: true });

window.addEventListener("resize", updateActiveNav);
updateActiveNav();

window.addEventListener("pointermove", (event) => {
  document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
  document.documentElement.style.setProperty("--my", `${event.clientY}px`);
}, { passive: true });

document.querySelectorAll(".tilt").forEach((image) => {
  image.addEventListener("pointermove", (event) => {
    const rect = image.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    image.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-6px)`;
  });
  image.addEventListener("pointerleave", () => {
    image.style.transform = "";
  });
});

const storyScenes = [...document.querySelectorAll(".story-scene")];
let storyFrameRequested = false;

function updateStoryStack() {
  storyFrameRequested = false;
  if (!storyScenes.length) return;

  const stickyTop = 92;
  let frontIndex = 0;

  storyScenes.forEach((scene, index) => {
    if (scene.getBoundingClientRect().top <= stickyTop + 24) {
      frontIndex = index;
    }
  });

  storyScenes.forEach((scene, index) => {
    scene.classList.toggle("is-behind", index < frontIndex);
    scene.classList.toggle("is-front", index === frontIndex);
  });
}

window.addEventListener("scroll", () => {
  if (!storyFrameRequested) {
    storyFrameRequested = true;
    requestAnimationFrame(updateStoryStack);
  }
}, { passive: true });

updateStoryStack();

const timelineItems = [
  {
    stage: "预热",
    title: "制造新品期待",
    body: "悬念海报 / 短视频，用局部轮廓和短钩子建立第一波关注。",
    image: "图片素材/12｜新品预热海报 .png",
    alt: "YING ONE 新品预热海报"
  },
  {
    stage: "种草",
    title: "建立产品兴趣",
    body: "小红书 / 抖音 / B站，用 KOL 测评、产品体验和生活方式内容降低理解门槛。",
    image: "图片素材/14｜KOL 种草内容样机.png",
    alt: "KOL 种草内容样机"
  },
  {
    stage: "发布",
    title: "集中引爆声量",
    body: "新品发布会和全平台直播承接期待，在同一时间窗口释放核心卖点。",
    image: "图片素材/13｜发布会主海报.png",
    alt: "YING ONE 发布会主海报"
  },
  {
    stage: "转化",
    title: "把兴趣转化为购买",
    body: "官网首发、电商权益与清晰 SKU 决策，缩短从种草到下单的距离。",
    image: "图片素材/05三配色产品组合图.png",
    alt: "YING ONE 三配色产品组合图"
  },
  {
    stage: "口碑",
    title: "形成二次传播",
    body: "晒单、测评和用户分享把购买体验转为新的内容资产。",
    image: "图片素材/15｜用户晒单  口碑传播样机.png",
    alt: "用户晒单口碑传播样机"
  }
];

const timelineButtons = document.querySelectorAll(".timeline-tabs button");
const timelineImage = document.querySelector("#timelineImage");
const timelineStage = document.querySelector("#timelineStage");
const timelineTitle = document.querySelector("#timelineTitle");
const timelineBody = document.querySelector("#timelineBody");
const timelineTrack = document.querySelector(".timeline-track");

timelineButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.step);
    const item = timelineItems[index];
    timelineButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
    timelineImage.style.opacity = "0";
    setTimeout(() => {
      timelineImage.src = item.image;
      timelineImage.alt = item.alt;
      timelineStage.textContent = item.stage;
      timelineTitle.textContent = item.title;
      timelineBody.textContent = item.body;
      timelineTrack?.style.setProperty("--progress", `${20 + index * 20}%`);
      timelineImage.style.opacity = "1";
    }, 180);
  });
});

const storeImage = document.querySelector("#storeImage");
document.querySelectorAll(".color-options button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".color-options button").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    storeImage.style.opacity = "0";
    storeImage.style.transform = "scale(0.98)";
    setTimeout(() => {
      storeImage.src = button.dataset.img;
      storeImage.style.opacity = "1";
      storeImage.style.transform = "scale(1)";
    }, 180);
  });
});

const bundleChecks = document.querySelectorAll(".bundle-check");
const originPrice = document.querySelector("#originPrice");
const bundlePrice = document.querySelector("#bundlePrice");
const saveBadge = document.querySelector("#saveBadge");

function updateBundlePrice() {
  const base = 5999;
  const addon = [...bundleChecks].reduce((sum, checkbox) => (
    checkbox.checked ? sum + Number(checkbox.dataset.price) : sum
  ), 0);
  const total = base + addon;
  const discount = addon > 0 ? 499 : 0;
  originPrice.textContent = `¥${formatNumber(total)}`;
  bundlePrice.textContent = `¥${formatNumber(total - discount)}`;
  saveBadge.textContent = discount > 0 ? `省 ¥${discount}` : "基础配置";
}

bundleChecks.forEach((checkbox) => checkbox.addEventListener("change", updateBundlePrice));
updateBundlePrice();

const modal = document.querySelector("#reservationModal");
const form = document.querySelector("#reservationForm");
const successText = document.querySelector("#successText");
const modalClose = document.querySelector(".modal-close");

document.querySelectorAll(".js-open-modal").forEach((button) => {
  button.addEventListener("click", () => {
    successText.textContent = "";
    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  successText.textContent = "预约成功";
  if (!hasBooked) {
    hasBooked = true;
    reservationCounters.forEach((counter) => {
      const nextValue = Number(counter.dataset.target) + 1;
      counter.dataset.target = String(nextValue);
      counter.textContent = formatNumber(nextValue);
    });
  }
});

modalClose.addEventListener("click", () => {
  modal.close();
});
