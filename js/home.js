(() => {
  const initAboutWordReveal = () => {
    const revealLines = Array.from(document.querySelectorAll(".home-about__reveal-line"));

    if (revealLines.length === 0) {
      return;
    }

    const introPauseSteps = 20;
    const descriptionPauseSteps = 10;
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
        const moreAboutStartOrder = Math.max(0, lastParagraphLastOrder + descriptionPauseSteps + 1);

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

  const initHeaderVariants = () => {
    const headers = Array.from(document.querySelectorAll(".home-header"));

    if (headers.length === 0) {
      return {
        setProjectHoverActive: () => {},
      };
    }

    const applyHeaderCase = (header, nextCase) => {
      header.dataset.headerCase = nextCase;

      const headerActions = Array.from(header.querySelectorAll(".home-header__action.button-icon-final"));
      headerActions.forEach((action) => {
        action.dataset.tone = nextCase;
      });
    };

    const headerMeta = headers.map((header) => {
      const baseCase = header.dataset.headerCase === "inverse" ? "inverse" : "default";
      const headerVariant = header.dataset.headerVariant === "mobile" ? "mobile" : "desktop";

      header.dataset.headerCase = baseCase;
      header.dataset.headerVariant = headerVariant;

      applyHeaderCase(header, baseCase);

      return {
        header,
        baseCase,
      };
    });

    return {
      setProjectHoverActive: (isActive) => {
        headerMeta.forEach(({ header, baseCase }) => {
          applyHeaderCase(header, isActive ? "inverse" : baseCase);
        });
      },
    };
  };

  const headerVariantController = initHeaderVariants();
  setGreetingMessageByLocalTime();
  initAboutWordReveal();
  syncShellIntroToGreetingEnd();

  const projects = Array.isArray(window.homeProjects) ? window.homeProjects : [];
  const list = document.getElementById("project-list");
  const caseTitleElement = document.getElementById("home-case-title");
  const caseDescriptionElement = document.getElementById("home-case-description");
  const caseTagsElement = document.getElementById("home-case-tags");
  const caseDetailsElement = document.getElementById("home-case-details");
  const miniThumbnailElement = document.getElementById("home-mini-thumbnail");
  const miniThumbnailImage = document.getElementById("home-mini-thumbnail-image");
  const fallbackCaseTags = ["{tag}", "{tag}", "{tag}"];
  const caseDetailsTextIntroClassName = "home-case-details__text-intro";
  const caseDetailsOutroClassName = "home-case-details--outro";
  const miniThumbnailRevealActiveClassName = "home-body--mini-thumbnail-revealed";
  const miniThumbnailLeavingClassName = "home-body--mini-thumbnail-leaving";
  const homeReturningClassName = "home-body--returning-home";
  const caseTitleTextDelayMs = 0;
  const caseDescriptionTextDelayMs = 0;
  const caseDetailsSequenceEndMs = 0;
  const backgroundBlendClassName = "project-thumbnail-stage--blending";
  const backgroundLayerDimmingClassName = "is-dimming";
  const backgroundReturningHomeClassName = "project-thumbnail-stage--returning-home";
  const backgroundTransitionDurationMs = 420;
  const backgroundReturnTransitionDurationMs = 310;
  const hoverContentFollowDelayMs = 60;

  const restartCaseDetailsTextIntro = () => {
    const animatedTextNodes = [
      {
        node: caseTitleElement,
        delayMs: caseTitleTextDelayMs,
      },
      {
        node: caseDescriptionElement,
        delayMs: caseDescriptionTextDelayMs,
      },
    ].filter((entry) => Boolean(entry.node));

    if (animatedTextNodes.length === 0) {
      return;
    }

    animatedTextNodes.forEach(({ node }) => {
      node.classList.remove(caseDetailsTextIntroClassName);
    });

    void animatedTextNodes[0].node.offsetWidth;

    animatedTextNodes.forEach(({ node, delayMs }) => {
      node.style.setProperty("--case-details-text-delay", `${delayMs}ms`);
      node.classList.add(caseDetailsTextIntroClassName);
    });
  };

  const updateMiniThumbnailRevealDirection = () => {
    if (!caseDetailsElement || !miniThumbnailElement) {
      return;
    }

    const caseRect = caseDetailsElement.getBoundingClientRect();
    const miniRect = miniThumbnailElement.getBoundingClientRect();

    if (caseRect.width <= 0 || caseRect.height <= 0 || miniRect.width <= 0 || miniRect.height <= 0) {
      return;
    }

    const caseCenterX = caseRect.left + caseRect.width / 2;
    const caseCenterY = caseRect.top + caseRect.height / 2;
    const miniCenterX = miniRect.left + miniRect.width / 2;
    const miniCenterY = miniRect.top + miniRect.height / 2;
    const deltaX = caseCenterX - miniCenterX;
    const deltaY = caseCenterY - miniCenterY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      pageRoot.dataset.miniThumbnailRevealDirection = deltaX > 0 ? "right" : "left";
      return;
    }

    pageRoot.dataset.miniThumbnailRevealDirection = deltaY > 0 ? "below" : "above";
  };

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
  revealProjectListAfterFirstAboutParagraph();

  const pageRoot = document.body;
  const projectById = new Map(projects.map((project) => [String(project.id || ""), project]));
  const thumbnailByProjectId = {
    "01": "./assets/projects/1-delta/thumbnail_delta-desktop.jpg",
    "02": "./assets/projects/2-abinbev/thumbnail_modelorama-desktop.jpg",
    "03": "./assets/projects/3-toyota/thumbnail_toyota-desktop.jpg",
    "04": "./assets/projects/4-boats-group/thumbnail_boats-desktop.jpg",
    "05": "./assets/projects/5-heru/thumbnail_heru-desktop.jpg",
    "06": "./assets/projects/6-rocket/thumbnail_rocket-desktop.jpg",
    "07": "./assets/projects/7-just-be/thumbnail_just-be-desktop.jpg",
  };
  const projectLinks = Array.from(list.querySelectorAll(".project-item__link"));
  const projectMetaByLink = new Map();

  projectLinks.forEach((link, index) => {
    const item = link.closest(".project-item");
    const projectId = item?.dataset.projectId;
    const projectData = projectId ? projectById.get(projectId) : null;
    const src = projectId ? thumbnailByProjectId[projectId] : null;
    const tags = Array.isArray(projectData?.tags)
      ? projectData.tags.filter((tag) => typeof tag === "string" && tag.trim().length > 0).map((tag) => tag.trim())
      : [];

    if (projectId && src) {
      projectMetaByLink.set(link, {
        id: projectId,
        src,
        index,
        title: String(projectData?.title || "{title}"),
        description: String(projectData?.description || "{description}"),
        tags,
        miniSrc: String(projectData?.miniThumbnailSrc || src),
      });
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
      <div class="project-thumbnail-blackout"></div>
    `;
    pageRoot.append(stage);
  }

  while (stage.querySelectorAll(".project-thumbnail").length < 2) {
    const thumbnail = document.createElement("img");
    thumbnail.className = "project-thumbnail";
    thumbnail.alt = "";
    stage.append(thumbnail);
  }

  if (!stage.querySelector(".project-thumbnail-blackout")) {
    const blackoutLayer = document.createElement("div");
    blackoutLayer.className = "project-thumbnail-blackout";
    stage.append(blackoutLayer);
  }

  const layers = Array.from(stage.querySelectorAll(".project-thumbnail"));

  let hoverToken = 0;
  let activeProjectId = null;
  let activeLayerIndex = 0;
  let miniThumbnailRevealRafId = 0;
  let hoverTransitionTimeoutId = 0;
  let hoverContentSyncTimeoutId = 0;
  const preloadPromisesBySrc = new Map();

  const preloadThumbnail = (src) => {
    if (!src) {
      return Promise.resolve();
    }

    if (preloadPromisesBySrc.has(src)) {
      return preloadPromisesBySrc.get(src);
    }

    const preloadPromise = new Promise((resolve) => {
      const preloader = new Image();
      preloader.decoding = "async";
      const done = () => resolve();

      if (typeof preloader.decode === "function") {
        preloader.src = src;
        preloader.decode().then(done).catch(() => {
          if (preloader.complete) {
            done();
            return;
          }

          preloader.addEventListener("load", done, { once: true });
          preloader.addEventListener("error", done, { once: true });
        });
        return;
      }

      preloader.addEventListener("load", done, { once: true });
      preloader.addEventListener("error", done, { once: true });
      preloader.src = src;
    });

    preloadPromisesBySrc.set(src, preloadPromise);
    return preloadPromise;
  };

  projectMetaByLink.forEach((meta) => {
    void preloadThumbnail(meta.src);
    void preloadThumbnail(meta.miniSrc);
  });

  const waitForLayerImageReady = (image, src) =>
    new Promise((resolve) => {
      let settled = false;

      const finish = () => {
        if (settled) {
          return;
        }

        settled = true;
        resolve();
      };

      image.addEventListener("load", finish, { once: true });
      image.addEventListener("error", finish, { once: true });

      if (image.getAttribute("src") !== src) {
        image.src = src;
      }

      if (typeof image.decode === "function") {
        image.decode().then(finish).catch(() => {
          if (image.complete) {
            finish();
          }
        });
      } else if (image.complete) {
        finish();
      }
    });

  const resetThumbnailState = (node) => {
    node.classList.remove("is-enter-from-top", "is-enter-from-bottom", "is-exit-to-top", "is-exit-to-bottom", "is-visible");
  };

  const hideLayerImmediately = (node) => {
    if (!node) {
      return;
    }

    node.style.transition = "none";
    resetThumbnailState(node);
    void node.offsetWidth;
    node.style.removeProperty("transition");
  };

  const clearBackgroundBlendState = () => {
    stage.classList.remove(backgroundBlendClassName);
    stage.classList.remove(backgroundReturningHomeClassName);
    layers.forEach((layer) => {
      layer.classList.remove(backgroundLayerDimmingClassName);
    });
  };

  const restartBackgroundBlend = () => {
    stage.classList.remove(backgroundBlendClassName);
    void stage.offsetWidth;
    stage.classList.add(backgroundBlendClassName);
  };

  const createCaseTagElement = (label, order = 0, textRevealDurationMs = 0) => {
    const tagElement = document.createElement("span");
    tagElement.className = "home-case-tag home-case-tag--reveal";
    tagElement.style.setProperty("--case-tag-order", String(order));
    tagElement.style.setProperty("--case-tag-start-delay", `${Math.max(0, Math.round(textRevealDurationMs))}ms`);

    const stateLayer = document.createElement("span");
    stateLayer.className = "home-case-tag__state-layer";

    const tagLabel = document.createElement("span");
    tagLabel.className = "home-case-tag__label";
    tagLabel.textContent = label;

    stateLayer.append(tagLabel);
    tagElement.append(stateLayer);
    return tagElement;
  };

  const renderCaseTags = (tagList, textRevealDurationMs = 0) => {
    if (!caseTagsElement) {
      return;
    }

    caseTagsElement.replaceChildren(...tagList.map((tag, index) => createCaseTagElement(tag, index, textRevealDurationMs)));
  };

  const syncHoveredCaseMeta = (meta) => {
    if (caseTitleElement) {
      caseTitleElement.textContent = meta?.title || "{title}";
    }

    if (caseDescriptionElement) {
      caseDescriptionElement.textContent = meta?.description || "{description}";
    }

    restartCaseDetailsTextIntro();

    if (caseTagsElement) {
      const tagList = Array.isArray(meta?.tags) && meta.tags.length > 0 ? meta.tags : fallbackCaseTags;
      renderCaseTags(tagList, caseDetailsSequenceEndMs);
    }

    if (miniThumbnailImage) {
      const nextMiniSrc = meta?.miniSrc || meta?.src || "";

      if (miniThumbnailImage.getAttribute("src") !== nextMiniSrc) {
        miniThumbnailImage.setAttribute("src", nextMiniSrc);
      }

      miniThumbnailImage.alt = meta?.title ? `${meta.title} mini thumbnail` : "";
    }
  };

  const clearHoverTransitionTimeout = () => {
    if (!hoverTransitionTimeoutId) {
      return;
    }

    window.clearTimeout(hoverTransitionTimeoutId);
    hoverTransitionTimeoutId = 0;
  };

  const clearHoverContentSyncTimeout = () => {
    if (!hoverContentSyncTimeoutId) {
      return;
    }

    window.clearTimeout(hoverContentSyncTimeoutId);
    hoverContentSyncTimeoutId = 0;
  };

  const resetCaseDetailsTextIntroState = () => {
    if (caseTitleElement) {
      caseTitleElement.style.removeProperty("--case-details-text-delay");
      caseTitleElement.classList.remove(caseDetailsTextIntroClassName);
    }

    if (caseDescriptionElement) {
      caseDescriptionElement.style.removeProperty("--case-details-text-delay");
      caseDescriptionElement.classList.remove(caseDetailsTextIntroClassName);
    }
  };

  const clearHoverOutroState = () => {
    pageRoot.classList.remove(miniThumbnailLeavingClassName);
    pageRoot.classList.remove(homeReturningClassName);

    if (caseDetailsElement) {
      caseDetailsElement.classList.remove(caseDetailsOutroClassName);
    }
  };

  const startHoverOutroState = ({ isReturningHome = false } = {}) => {
    pageRoot.classList.remove(miniThumbnailRevealActiveClassName);
    pageRoot.classList.add(miniThumbnailLeavingClassName);
    pageRoot.classList.toggle(homeReturningClassName, isReturningHome);

    if (caseDetailsElement) {
      caseDetailsElement.classList.add(caseDetailsOutroClassName);
    }
  };

  const queueMiniThumbnailReveal = () => {
    if (miniThumbnailRevealRafId) {
      cancelAnimationFrame(miniThumbnailRevealRafId);
    }

    miniThumbnailRevealRafId = requestAnimationFrame(() => {
      miniThumbnailRevealRafId = requestAnimationFrame(() => {
        miniThumbnailRevealRafId = 0;

        if (!pageRoot.classList.contains("home-body--delta-thumbnail-visible")) {
          return;
        }

        pageRoot.classList.add(miniThumbnailRevealActiveClassName);
      });
    });
  };

  const applyProjectHoverState = (meta) => {
    pageRoot.classList.add("home-body--delta-thumbnail-visible");
    clearHoverOutroState();
    pageRoot.classList.remove(miniThumbnailRevealActiveClassName);
    pageRoot.dataset.activeProjectId = meta.id;
    headerVariantController.setProjectHoverActive(true);
    syncHoveredCaseMeta(meta);
    updateMiniThumbnailRevealDirection();
    queueMiniThumbnailReveal();
  };

  const finalizeHideProjectThumbnail = () => {
    clearHoverContentSyncTimeout();
    clearHoverOutroState();
    pageRoot.classList.remove(miniThumbnailRevealActiveClassName);
    pageRoot.classList.remove("home-body--delta-thumbnail-visible");
    delete pageRoot.dataset.activeProjectId;
    delete pageRoot.dataset.miniThumbnailRevealDirection;
    resetCaseDetailsTextIntroState();

    if (activeProjectId !== null) {
      const outgoing = layers[activeLayerIndex];
      hideLayerImmediately(outgoing);
      activeProjectId = null;
    }

    clearBackgroundBlendState();
  };

  const showProjectThumbnail = (meta) => {
    if (!meta) {
      return;
    }

    const currentProjectId = pageRoot.dataset.activeProjectId || null;
    if (currentProjectId === meta.id) {
      return;
    }

    const requestToken = ++hoverToken;
    clearHoverTransitionTimeout();
    clearHoverContentSyncTimeout();

    const isSwitchingBetweenCases =
      pageRoot.classList.contains("home-body--delta-thumbnail-visible") && Boolean(currentProjectId);

    if (isSwitchingBetweenCases) {
      stage.classList.remove(backgroundBlendClassName);
      stage.classList.remove(backgroundReturningHomeClassName);
    } else {
      clearBackgroundBlendState();
    }

    const nextLayerIndex = 1 - activeLayerIndex;
    const incoming = layers[nextLayerIndex];
    const outgoing = activeProjectId ? layers[activeLayerIndex] : null;

    if (!isSwitchingBetweenCases) {
      applyProjectHoverState(meta);
    }

    void Promise.all([preloadThumbnail(meta.src), waitForLayerImageReady(incoming, meta.src)]).then(() => {
      if (requestToken !== hoverToken || meta.id === activeProjectId) {
        return;
      }

      hideLayerImmediately(incoming);

      if (isSwitchingBetweenCases) {
        if (outgoing) {
          outgoing.classList.add(backgroundLayerDimmingClassName);
        }

        restartBackgroundBlend();

        hoverContentSyncTimeoutId = window.setTimeout(() => {
          hoverContentSyncTimeoutId = 0;

          if (requestToken !== hoverToken) {
            return;
          }

          startHoverOutroState();

          requestAnimationFrame(() => {
            if (requestToken !== hoverToken) {
              return;
            }

            applyProjectHoverState(meta);
          });
        }, hoverContentFollowDelayMs);
      }

      incoming.classList.add("is-visible");

      hoverTransitionTimeoutId = window.setTimeout(() => {
        hoverTransitionTimeoutId = 0;

        if (requestToken !== hoverToken) {
          return;
        }

        if (outgoing) {
          hideLayerImmediately(outgoing);
        }

        clearBackgroundBlendState();
        activeProjectId = meta.id;
        activeLayerIndex = nextLayerIndex;
      }, backgroundTransitionDurationMs);
    });
  };

  const hideProjectThumbnail = () => {
    const requestToken = ++hoverToken;
    clearHoverTransitionTimeout();
    clearHoverContentSyncTimeout();
    clearBackgroundBlendState();

    if (miniThumbnailRevealRafId) {
      cancelAnimationFrame(miniThumbnailRevealRafId);
      miniThumbnailRevealRafId = 0;
    }

    if (!pageRoot.classList.contains("home-body--delta-thumbnail-visible")) {
      finalizeHideProjectThumbnail();
      headerVariantController.setProjectHoverActive(false);
      return;
    }

    const outgoing = activeProjectId ? layers[activeLayerIndex] : null;
    if (outgoing) {
      outgoing.classList.add(backgroundLayerDimmingClassName);
    }

    stage.classList.add(backgroundReturningHomeClassName);
    restartBackgroundBlend();

    hoverContentSyncTimeoutId = window.setTimeout(() => {
      hoverContentSyncTimeoutId = 0;

      if (requestToken !== hoverToken) {
        return;
      }

      startHoverOutroState({ isReturningHome: true });
    }, hoverContentFollowDelayMs);

    hoverTransitionTimeoutId = window.setTimeout(() => {
      hoverTransitionTimeoutId = 0;

      if (requestToken !== hoverToken) {
        return;
      }

      finalizeHideProjectThumbnail();
      headerVariantController.setProjectHoverActive(false);
    }, backgroundReturnTransitionDurationMs);
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
