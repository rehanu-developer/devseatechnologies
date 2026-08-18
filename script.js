const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const navigationLinks = [...document.querySelectorAll(".site-nav a")];
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
  navigation.classList.toggle("open", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
});

navigationLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) closeMenu();
});

const sectionByNavTarget = new Map(
  navigationLinks
    .map((link) => [link.getAttribute("href"), link])
    .filter(([target]) => target?.startsWith("#"))
    .map(([target, link]) => [document.querySelector(target), link])
    .filter(([section]) => section)
);

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navigationLinks.forEach((link) => link.classList.remove("active"));
    sectionByNavTarget.get(visible.target)?.classList.add("active");
  },
  { rootMargin: "-20% 0px -55%", threshold: [0, 0.1, 0.3, 0.6] },
);

sectionByNavTarget.forEach((_, section) => observer.observe(section));

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const fullName = formData.get("full-name")?.toString().trim() || "Website visitor";
  const workEmail = formData.get("work-email")?.toString().trim() || "";
  const phoneNumber = formData.get("phone-number")?.toString().trim() || "Not provided";
  const organization = formData.get("organization")?.toString().trim() || "Not provided";
  const description = formData.get("description")?.toString().trim() || "Not provided";
  const subscribed = formData.get("subscribe") ? "Yes" : "No";

  const subject = `New website contact from ${fullName}`;
  const body = [
    `Full Name: ${fullName}`,
    `Work Email: ${workEmail}`,
    `Phone Number: ${phoneNumber}`,
    `Organization: ${organization}`,
    `Subscribed for details: ${subscribed}`,
    "",
    "Description:",
    description,
  ].join("\n");

  formStatus.textContent = "Opening your email app with the completed form details.";
  window.location.href = `mailto:rehansajid9d@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
