(() => {
  const initAboutWordReveal = () => {
    const revealLines = Array.from(document.querySelectorAll(".home-about__reveal-line"));

    if (revealLines.length === 0) {
      return;
    }

    const introPauseSteps = 30;
    const descriptionPauseSteps = 20;
    let wordOrder = 0;
    let previousGroup = null;
    let previousInDescription = false;

    revealLines.forEach((line, index) => {
      const revealGroup = line.dataset.revealGroup || `group-${index}`;
      const currentInDescription = Boolean(line.closest(".home-description"));

      if (previousGroup !== null && revealGroup !== previousGroup) {
        wordOrder += previousInDescription && currentInDescription ? descriptionPauseSteps : introPauseSteps;
      }

      previousGroup = revealGroup;
      previousInDescription = currentInDescription;
      let lineWordOrder = 0;

      const textNodes = [];
      const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
      let currentNode = walker.nextNode();

      while (currentNode) {
        textNodes.push(currentNode);
        currentNode = walker.nextNode();
      }

      textNodes.forEach((textNode) => {
        const content = textNode.textContent;

        if (!content || content.trim().length === 0) {
          return;
        }

        const fragment = document.createDocumentFragment();
        const parts = content.split(/(\s+)/);

        parts.forEach((part) => {
          if (!part) {
            return;
          }

          if (/^\s+$/.test(part)) {
            fragment.append(document.createTextNode(part));
            return;
          }

          const word = document.createElement("span");
          word.className = "home-about__word";
          word.style.setProperty("--word-order", String(wordOrder));
          word.style.setProperty("--line-word-order", String(lineWordOrder));
          const wordInner = document.createElement("span");
          wordInner.className = "home-about__word-inner";
          wordInner.textContent = part;
          word.append(wordInner);
          fragment.append(word);
          wordOrder += 1;
          lineWordOrder += 1;
        });

        textNode.replaceWith(fragment);
      });
    });

    const firstDescriptionLine = document.querySelector(".home-description .home-about__reveal-line");
    const highlightedName = firstDescriptionLine?.querySelector(".home-description__name");
    const firstParagraphWords = firstDescriptionLine ? Array.from(firstDescriptionLine.querySelectorAll(".home-about__word")) : [];

    if (highlightedName && firstParagraphWords.length > 0) {
      const firstOrder = Number.parseFloat(firstParagraphWords[0].style.getPropertyValue("--word-order"));
      const lastOrder = Number.parseFloat(
        firstParagraphWords[firstParagraphWords.length - 1].style.getPropertyValue("--word-order"),
      );

      if (Number.isFinite(firstOrder) && Number.isFinite(lastOrder)) {
        const midParagraphOrder = firstOrder + (lastOrder - firstOrder) / 2;
        highlightedName.style.setProperty("--name-underline-order", String(midParagraphOrder));
      }
    }

    const descriptionLines = Array.from(document.querySelectorAll(".home-description .home-about__reveal-line"));
    const lastDescriptionLine = descriptionLines[descriptionLines.length - 1] || null;
    const lastDescriptionWords = lastDescriptionLine ? Array.from(lastDescriptionLine.querySelectorAll(".home-about__word")) : [];

    const moreAboutLine = document.querySelector(".more-about-link .home-about__reveal-line");
    const moreAboutWords = moreAboutLine ? Array.from(moreAboutLine.querySelectorAll(".home-about__word")) : [];

    if (lastDescriptionWords.length > 0 && moreAboutWords.length > 0) {
      const lastParagraphLastOrder = Number.parseFloat(
        lastDescriptionWords[lastDescriptionWords.length - 1].style.getPropertyValue("--word-order"),
      );

      if (Number.isFinite(lastParagraphLastOrder)) {
        const moreAboutStartOrder = Math.max(0, lastParagraphLastOrder - (moreAboutWords.length - 1));

        moreAboutWords.forEach((word, index) => {
          word.style.setProperty("--word-order", String(moreAboutStartOrder + index));
        });
      }
    }
  };

  const syncShellIntroToGreetingEnd = () => {
    const header = document.querySelector(".home-header");
    const footer = document.querySelector(".home-footer");

    if (!header || !footer) {
      return;
    }

    header.classList.add("home-header--intro");
    footer.classList.add("home-footer--intro");

    const revealShell = (() => {
      let revealed = false;

      return () => {
        if (revealed) {
          return;
        }

        revealed = true;
        header.classList.add("is-visible");
        footer.classList.add("is-visible");
      };
    })();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealShell();
      return;
    }

    const firstDescriptionWord = document.querySelector(".home-description .home-about__reveal-line .home-about__word:first-of-type");

    if (!firstDescriptionWord) {
      revealShell();
      return;
    }

    firstDescriptionWord.addEventListener("animationstart", revealShell, { once: true });
    window.setTimeout(revealShell, 4000);
  };

  const revealProjectListAfterFirstAboutParagraph = () => {
    const projectsSection = document.querySelector(".home-projects");

    if (!projectsSection) {
      return;
    }

    projectsSection.classList.add("home-projects--delayed");

    const revealProjects = (() => {
      let revealed = false;

      return () => {
        if (revealed) {
          return;
        }

        revealed = true;
        projectsSection.classList.add("is-visible");
      };
    })();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealProjects();
      return;
    }

    const descriptionLines = Array.from(document.querySelectorAll(".home-description .home-about__reveal-line"));
    const secondParagraphFirstWord = descriptionLines[1]?.querySelector(".home-about__word:first-of-type");

    if (!secondParagraphFirstWord) {
      revealProjects();
      return;
    }

    secondParagraphFirstWord.addEventListener("animationstart", revealProjects, { once: true });
    window.setTimeout(revealProjects, 6000);
  };

  const setGreetingMessageByLocalTime = () => {
    const titleLine = document.querySelector(".greeting-message__title .home-about__reveal-line");
    const subtitleLine = document.querySelector(".greeting-message__subtitle .home-about__reveal-line");

    if (!titleLine || !subtitleLine) {
      return;
    }

    const hour = new Date().getHours();
    let greetingTitle = "Good evening";
    let greetingSubtitle = "Late hours. Still worth your time";

    if (hour >= 5 && hour < 12) {
      greetingTitle = "Good Morning";
      greetingSubtitle = "Fresh eyes on sharp work";
    } else if (hour >= 12 && hour < 17) {
      greetingTitle = "Good Afternoon";
      greetingSubtitle = "You're here. Good midday pause";
    } else if (hour >= 17 && hour < 20) {
      greetingTitle = "Good evening";
      greetingSubtitle = "Day is done, this is worth your time";
    }

    titleLine.textContent = greetingTitle;
    subtitleLine.textContent = greetingSubtitle;
  };

  setGreetingMessageByLocalTime();
  initAboutWordReveal();
  syncShellIntroToGreetingEnd();

  const projects = Array.isArray(window.homeProjects) ? window.homeProjects : [];
  const list = document.getElementById("project-list");

  if (!list || projects.length === 0) {
    return;
  }

  const lockIcon = `
    <svg class="project-item__lock" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4.667 7V5.667a3.333 3.333 0 1 1 6.666 0V7h.334c.736 0 1.333.597 1.333 1.333v5.334c0 .736-.597 1.333-1.333 1.333h-7.334A1.333 1.333 0 0 1 3 13.667V8.333C3 7.597 3.597 7 4.333 7h.334Zm1.333 0h4V5.667a2 2 0 1 0-4 0V7Z"
        fill="currentColor"
      />
    </svg>
  `;

  const arrowForwardIcon = `
    <svg class="project-item__lead-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor" />
    </svg>
  `;

  list.innerHTML = projects
    .map((project, index) => {
      const itemNumber = index + 1;
      const hasLock = Boolean(project.locked);
      const projectTitle = String(project.title || "");
      const projectSlug = String(project.title || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      let projectLetterOrder = 0;
      const projectNameMarkup = Array.from(projectTitle)
        .map((char) => {
          if (/^\s$/.test(char)) {
            return char;
          }

          const letterMarkup = `<span class="project-item__name-letter" style="--project-letter-order: ${projectLetterOrder};">${char}</span>`;
          projectLetterOrder += 1;
          return letterMarkup;
        })
        .join("");

      return `
        <li class="project-item" data-project-id="${project.id}" data-project-slug="${projectSlug}" style="--case-item-index: ${index};">
          <a class="project-item__link" href="${project.href}">
            <span class="project-item__lead" aria-hidden="true">${arrowForwardIcon}</span>
            <span class="project-item__index">${itemNumber}</span>
            <span class="project-item__name">${projectNameMarkup}</span>
            ${hasLock ? lockIcon : ""}
          </a>
        </li>
      `;
    })
    .join("");

  const pageRoot = document.body;
  const thumbnailByProjectId = {
    "01": "./assets/projects/project-01/thumbnail_delta-desktop.jpg",
    "02": "./assets/projects/project-02/thumbnail_modelorama-desktop.jpg",
    "03": "./assets/projects/project-03/thumbnail_toyota-desktop.jpg",
    "04": "./assets/projects/project-04/thumbnail_boats-desktop.jpg",
    "05": "./assets/projects/project-05/thumbnail_heru-desktop.jpg",
    "06": "./assets/projects/project-06/thumbnail_rocket-desktop.jpg",
    "07": "./assets/projects/project-07/thumbnail_just-be-desktop.jpg",
  };

  const projectLinks = Array.from(list.querySelectorAll(".project-item__link"));
  revealProjectListAfterFirstAboutParagraph();
  const projectMetaByLink = new Map();

  projectLinks.forEach((link, index) => {
    const item = link.closest(".project-item");
    const projectId = item?.dataset.projectId;
    const src = projectId ? thumbnailByProjectId[projectId] : null;

    if (projectId && src) {
      projectMetaByLink.set(link, { id: projectId, src, index });
    }
  });

  if (projectMetaByLink.size === 0) {
    return;
  }

  let stage = document.getElementById("project-thumbnail-stage");

  if (!stage) {
    stage = document.createElement("div");
    stage.id = "project-thumbnail-stage";
    stage.className = "project-thumbnail-stage";
    stage.setAttribute("aria-hidden", "true");
    stage.innerHTML = `
      <img class="project-thumbnail" alt="" />
      <img class="project-thumbnail" alt="" />
    `;
    pageRoot.append(stage);
  }

  const layers = Array.from(stage.querySelectorAll(".project-thumbnail"));

  if (layers.length < 2) {
    return;
  }

  const motionClasses = ["is-enter-from-top", "is-enter-from-bottom", "is-exit-to-top", "is-exit-to-bottom"];
  let activeProjectId = null;
  let activeIndex = -1;
  let activeLayerIndex = 0;

  const clearMotionClasses = (node) => {
    motionClasses.forEach((className) => node.classList.remove(className));
  };

  const showProjectThumbnail = (meta) => {
    if (!meta || meta.id === activeProjectId) {
      return;
    }

    const nextLayerIndex = 1 - activeLayerIndex;
    const incoming = layers[nextLayerIndex];
    const outgoing = activeProjectId ? layers[activeLayerIndex] : null;
    const movingDown = activeIndex !== -1 && meta.index > activeIndex;
    const enterClass = activeIndex === -1 ? "is-enter-from-bottom" : movingDown ? "is-enter-from-bottom" : "is-enter-from-top";
    const exitClass = movingDown ? "is-exit-to-top" : "is-exit-to-bottom";

    clearMotionClasses(incoming);
    incoming.classList.remove("is-visible");
    incoming.src = meta.src;
    incoming.classList.add(enterClass);

    if (outgoing) {
      clearMotionClasses(outgoing);
      outgoing.classList.remove("is-visible");
      outgoing.classList.add(exitClass);
    }

    requestAnimationFrame(() => {
      incoming.classList.add("is-visible");
    });

    pageRoot.classList.add("home-body--delta-thumbnail-visible");
    activeProjectId = meta.id;
    activeIndex = meta.index;
    activeLayerIndex = nextLayerIndex;
  };

  const hideProjectThumbnail = () => {
    if (activeProjectId === null) {
      return;
    }

    const outgoing = layers[activeLayerIndex];
    clearMotionClasses(outgoing);
    outgoing.classList.remove("is-visible");
    outgoing.classList.add("is-exit-to-bottom");

    pageRoot.classList.remove("home-body--delta-thumbnail-visible");
    activeProjectId = null;
    activeIndex = -1;
  };

  projectLinks.forEach((link) => {
    const meta = projectMetaByLink.get(link);

    if (!meta) {
      return;
    }

    link.addEventListener("mouseenter", () => showProjectThumbnail(meta));
    link.addEventListener("focus", () => showProjectThumbnail(meta));
  });

  list.addEventListener("mouseleave", hideProjectThumbnail);
  list.addEventListener("focusout", () => {
    requestAnimationFrame(() => {
      if (!list.contains(document.activeElement)) {
        hideProjectThumbnail();
      }
    });
  });
})();
