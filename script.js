const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
const navLinks = document.querySelectorAll(".main-nav a");
const currentYear = document.querySelector("#current-year");
const projectCards = document.querySelectorAll(".project-card[data-project]");
const projectModal = document.querySelector("#project-modal");
const projectDialog = projectModal?.querySelector(".project-dialog");
const modalCloseButton = projectModal?.querySelector(".modal-close");
const modalTitle = document.querySelector("#project-modal-title");
const modalDescription = document.querySelector("#project-modal-description");
const modalRole = document.querySelector("#project-modal-role");
const modalOutcome = document.querySelector("#project-modal-outcome");
const modalTechnologies = document.querySelector("#project-modal-technologies");
const contactForm = document.querySelector("#contact-form");

const projectDetails = {
  lumio: {
    name: "Lumio",
    description: "학습 자료를 주제별로 정리하고 필요한 콘텐츠를 쉽게 찾을 수 있도록 구성한 학습 웹 서비스 콘셉트입니다.",
    role: "페이지 구조를 설계하고, 학습 카드와 주요 화면의 사용자 인터페이스를 구현했습니다.",
    technologies: ["HTML", "CSS", "JavaScript"],
    outcome: "반응형 콘텐츠 목록 화면과 직관적인 정보 탐색 흐름을 구성했습니다."
  },
  mori: {
    name: "Mori",
    description: "사용자가 하루의 생각과 기억을 차분하게 기록하고 다시 살펴볼 수 있도록 기획한 개인 기록 서비스 콘셉트입니다.",
    role: "기록 작성 화면과 목록 화면의 구성 및 시각 디자인을 담당했습니다.",
    technologies: ["HTML", "CSS", "JavaScript"],
    outcome: "기록 작성부터 목록 확인까지 이어지는 간단한 사용자 흐름을 제안했습니다."
  },
  ondostudio: {
    name: "OndoStudio",
    description: "스튜디오의 작업과 분위기를 소개하는 크리에이티브 스튜디오 웹사이트 콘셉트입니다.",
    role: "소개 페이지의 레이아웃을 구성하고 웹 화면으로 구현했습니다.",
    technologies: ["HTML", "CSS", "JavaScript"],
    outcome: "프로젝트 소개와 스튜디오 정보를 한 페이지에서 확인하는 반응형 레이아웃을 만들었습니다."
  }
};

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (contactForm) {
  const contactFields = [
    {
      input: contactForm.querySelector("#contact-name"),
      error: contactForm.querySelector("#contact-name-error"),
      requiredMessage: "이름을 입력해 주세요."
    },
    {
      input: contactForm.querySelector("#contact-email"),
      error: contactForm.querySelector("#contact-email-error"),
      requiredMessage: "이메일 주소를 입력해 주세요.",
      invalidMessage: "올바른 이메일 주소를 입력해 주세요."
    },
    {
      input: contactForm.querySelector("#contact-message"),
      error: contactForm.querySelector("#contact-message-error"),
      requiredMessage: "메시지를 입력해 주세요."
    }
  ];
  const formStatus = contactForm.querySelector("#contact-form-status");

  function validateContactField(field) {
    const value = field.input.value.trim();
    field.input.value = value;

    let message = "";
    if (!value) {
      message = field.requiredMessage;
    } else if (field.invalidMessage && !field.input.validity.valid) {
      message = field.invalidMessage;
    }

    field.input.setAttribute("aria-invalid", String(Boolean(message)));
    field.error.textContent = message;
    return !message;
  }

  contactFields.forEach((field) => {
    field.input.addEventListener("input", () => {
      if (field.input.getAttribute("aria-invalid") === "true") {
        validateContactField(field);
      }
      formStatus.textContent = "";
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "";

    const invalidFields = contactFields.filter((field) => !validateContactField(field));
    if (invalidFields.length > 0) {
      formStatus.textContent = "입력 내용을 확인해 주세요.";
      invalidFields[0].input.focus();
      return;
    }

    formStatus.textContent = "입력값이 모두 확인되었습니다. 이 양식은 데모이며 실제로 전송되지 않았습니다.";
  });
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.querySelector(".sr-only").textContent = isOpen ? "메뉴 닫기" : "메뉴 열기";
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.querySelector(".sr-only").textContent = "메뉴 열기";
    });
  });
}

// 선택한 프로젝트의 정보를 모달에 표시하고 모달로 포커스를 이동합니다.
function openProjectDetails(card) {
  const project = projectDetails[card.dataset.project];
  if (!project || !projectModal || !projectDialog || !modalTitle || !modalDescription || !modalRole || !modalOutcome || !modalTechnologies || !modalCloseButton) {
    return;
  }

  modalTitle.textContent = project.name;
  modalDescription.textContent = project.description;
  modalRole.textContent = project.role;
  modalOutcome.textContent = project.outcome;
  modalTechnologies.replaceChildren(...project.technologies.map((technology) => {
    const item = document.createElement("li");
    item.textContent = technology;
    return item;
  }));
  projectModal.hidden = false;
  document.body.classList.add("modal-open");
  modalCloseButton.focus();
}

// 모달을 닫은 뒤, 열기 전 선택했던 프로젝트 카드로 포커스를 돌려줍니다.
function closeProjectDetails() {
  if (!projectModal || projectModal.hidden) {
    return;
  }

  projectModal.hidden = true;
  document.body.classList.remove("modal-open");
  activeProjectCard?.focus();
}

let activeProjectCard = null;

projectCards.forEach((card) => {
  card.addEventListener("click", () => {
    activeProjectCard = card;
    openProjectDetails(card);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activeProjectCard = card;
      openProjectDetails(card);
    }
  });
});

modalCloseButton?.addEventListener("click", closeProjectDetails);

projectModal?.addEventListener("click", (event) => {
  if (event.target === projectModal) {
    closeProjectDetails();
  }
});

// Escape로 닫고 Tab 포커스가 모달 밖으로 나가지 않도록 제한합니다.
document.addEventListener("keydown", (event) => {
  if (!projectModal || projectModal.hidden) {
    return;
  }

  if (event.key === "Escape") {
    closeProjectDetails();
    return;
  }

  if (event.key === "Tab" && projectDialog && modalCloseButton) {
    const focusableElements = projectDialog.querySelectorAll("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && document.activeElement === modalCloseButton) {
      event.preventDefault();
      lastFocusableElement?.focus();
    } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
      event.preventDefault();
      modalCloseButton.focus();
    }
  }
});

console.log("김유정 포트폴리오가 정상적으로 실행되었습니다.");