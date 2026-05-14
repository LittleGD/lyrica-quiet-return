// Subpages — reveal observer, mobile nav disclosure, reserve form validation.
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const STAGGER_MS = 50;
  const STAGGER_CAP = 6;

  // ---------- Reveal observer ------------------------------------------------
  const sections = Array.from(
    document.querySelectorAll(".content-section, .site-footer")
  );

  function revealAll() {
    sections.forEach((el) => el.classList.add("is-visible"));
  }

  function applyChildStagger(section) {
    const children = section.querySelectorAll(
      ".watch-row, .pillar, .reserve-field, .footer-groups div"
    );
    children.forEach((el, i) => {
      const step = Math.min(i, STAGGER_CAP);
      el.style.transitionDelay = `${step * STAGGER_MS}ms`;
    });
  }

  function clearChildStaggers() {
    document
      .querySelectorAll(
        ".watch-row, .pillar, .reserve-field, .footer-groups div"
      )
      .forEach((el) => {
        el.style.transitionDelay = "";
      });
  }

  function setupObserver() {
    if (!("IntersectionObserver" in window)) {
      revealAll();
      return null;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            applyChildStagger(entry.target);
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    sections.forEach((el) => observer.observe(el));
    return observer;
  }

  let observer = reduceMotion.matches ? (revealAll(), null) : setupObserver();

  reduceMotion.addEventListener?.("change", (e) => {
    if (e.matches) {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      clearChildStaggers();
      revealAll();
    } else if (!observer) {
      observer = setupObserver();
    }
  });

  // ---------- Mobile nav disclosure ----------------------------------------
  const toggle = document.querySelector(".page-header .nav-toggle");
  const nav = document.querySelector(".page-header .nav-links");

  function navFocusables() {
    if (!nav) return [];
    return Array.from(nav.querySelectorAll("a"));
  }

  function onTrapKeydown(e) {
    if (e.key !== "Tab") return;
    const items = [toggle, ...navFocusables()].filter(Boolean);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function setNavOpen(open) {
    document.body.dataset.navOpen = open ? "true" : "false";
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      toggle.textContent = open ? "Close" : "Menu";
    }
    if (open) {
      document.addEventListener("keydown", onTrapKeydown);
      const firstLink = nav?.querySelector("a");
      if (firstLink) firstLink.focus({ preventScroll: true });
    } else {
      document.removeEventListener("keydown", onTrapKeydown);
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = document.body.dataset.navOpen === "true";
      setNavOpen(!isOpen);
    });
    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") setNavOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.dataset.navOpen === "true") {
        setNavOpen(false);
        toggle.focus();
      }
    });
    const desktopMq = window.matchMedia("(min-width: 600px)");
    desktopMq.addEventListener?.("change", (e) => {
      if (e.matches) setNavOpen(false);
    });
  }

  // ---------- Reserve form: validation + status feedback -------------------
  const form = document.querySelector(".reserve-form");
  if (form) {
    const status = document.querySelector(".reserve-status");
    const submit = form.querySelector(".reserve-submit");

    function announce(state, message) {
      if (!status) return;
      status.classList.add("is-changing");
      setTimeout(() => {
        status.dataset.state = state;
        status.textContent = message;
        status.classList.remove("is-changing");
      }, 160);
    }

    function setFieldError(field, message) {
      const wrap = field.closest(".reserve-field");
      if (!wrap) return;
      wrap.dataset.invalid = message ? "true" : "false";
      field.setAttribute("aria-invalid", message ? "true" : "false");
      let err = wrap.querySelector(".field-error");
      if (message) {
        if (!err) {
          err = document.createElement("p");
          err.className = "field-error";
          // No role="alert" — message is exposed via aria-describedby
          // and surfaced when the field is focused. The form-level
          // .reserve-status (role="status") handles global feedback.
          err.id = field.id + "-error";
          wrap.appendChild(err);
        }
        err.textContent = message;
        const describedBy = field.getAttribute("aria-describedby");
        if (!describedBy || !describedBy.includes(err.id)) {
          field.setAttribute(
            "aria-describedby",
            [describedBy, err.id].filter(Boolean).join(" ")
          );
        }
      } else if (err) {
        err.remove();
        field.removeAttribute("aria-describedby");
      }
    }

    function validate() {
      let firstInvalid = null;
      const requiredFields = form.querySelectorAll("[required]");
      requiredFields.forEach((field) => {
        let message = "";
        if (!field.value.trim()) {
          message = "Please fill in this field.";
        } else if (field.type === "email" && !field.checkValidity()) {
          message = "Please enter a valid email address.";
        }
        setFieldError(field, message);
        if (message && !firstInvalid) firstInvalid = field;
      });
      return firstInvalid;
    }

    form.addEventListener("submit", (e) => {
      const invalid = validate();
      if (invalid) {
        e.preventDefault();
        invalid.focus();
        announce("error", "Please correct the highlighted fields.");
        return;
      }
      e.preventDefault();
      submit.setAttribute("aria-busy", "true");
      announce("pending", "Sending your inquiry…");
      const data = new FormData(form);
      const body = Array.from(data.entries())
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
      const href =
        "mailto:inquiry@lyrica.watch" +
        "?subject=" +
        encodeURIComponent("Private inquiry — Lyrica") +
        "&body=" +
        encodeURIComponent(body);
      window.location.href = href;
      setTimeout(() => {
        submit.setAttribute("aria-busy", "false");
        announce(
          "success",
          "Your inquiry has been prepared. The atelier will reply by hand within 48 hours."
        );
      }, 600);
    });

    form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("blur", () => {
        if (field.hasAttribute("required")) {
          let message = "";
          if (!field.value.trim()) message = "Please fill in this field.";
          else if (field.type === "email" && !field.checkValidity())
            message = "Please enter a valid email address.";
          setFieldError(field, message);
        }
      });
    });
  }
})();
