(() => {
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
      const projectSlug = String(project.title || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      return `
        <li class="project-item" data-project-id="${project.id}" data-project-slug="${projectSlug}">
          <a class="project-item__link" href="${project.href}">
            <span class="project-item__lead" aria-hidden="true">${arrowForwardIcon}</span>
            <span class="project-item__index">${itemNumber}</span>
            <span class="project-item__name">${project.title}</span>
            ${hasLock ? lockIcon : ""}
          </a>
        </li>
      `;
    })
    .join("");

  const deltaProjectLink = list.querySelector('.project-item[data-project-slug="delta"] .project-item__link');

  if (!deltaProjectLink) {
    return;
  }

  const pageRoot = document.body;
  let deltaThumbnail = document.getElementById("thumbnail_delta-desktop");

  if (!deltaThumbnail) {
    deltaThumbnail = document.createElement("img");
    deltaThumbnail.id = "thumbnail_delta-desktop";
    deltaThumbnail.className = "project-thumbnail project-thumbnail--delta";
    deltaThumbnail.src = "./assets/projects/project-01/thumbnail_delta-desktop.jpg";
    deltaThumbnail.alt = "";
    deltaThumbnail.setAttribute("aria-hidden", "true");
    pageRoot.append(deltaThumbnail);
  }

  const toggleDeltaThumbnail = (isVisible) => {
    pageRoot.classList.toggle("home-body--delta-thumbnail-visible", isVisible);
  };

  deltaProjectLink.addEventListener("mouseenter", () => toggleDeltaThumbnail(true));
  deltaProjectLink.addEventListener("mouseleave", () => toggleDeltaThumbnail(false));
  deltaProjectLink.addEventListener("focus", () => toggleDeltaThumbnail(true));
  deltaProjectLink.addEventListener("blur", () => toggleDeltaThumbnail(false));
})();
