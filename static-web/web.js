/* =========================
   1. HAMBURGER MENU
========================= */
const hamburger = document.getElementById("hamburger");
const navItems = document.querySelector(".items");

if (hamburger && navItems) {
  hamburger.addEventListener("click", () => {
    navItems.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // Close menu when clicking on a link
  navItems.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navItems.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });
}

/* =========================
   2. SMOOTH SCROLL TO DONATION
========================= */
document.querySelectorAll('a[href="#donation"]').forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      document.getElementById("donation").scrollIntoView({
        behavior: "smooth"
      });
    });
  });

  /* =========================
   3. IN-CASH FILE UPLOAD VALIDATION
   (no alert on upload, only validation)
========================= */
const photoInput = document.getElementById("photo");
const incashMessage = document.getElementById("incash-message");

if (photoInput) {
  photoInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage(incashMessage, "Please upload an image file only.", "error");
      this.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage(incashMessage, "Image must be less than 5MB.", "error");
      this.value = "";
      return;
    }

    // Clear any previous error messages
    hideMessage(incashMessage);
  });
}

// Helper function to show messages
function showMessage(element, text, type) {
  if (!element) return;
  element.textContent = text;
  element.className = `message ${type}`;
}

// Helper function to hide messages
function hideMessage(element) {
  if (!element) return;
  element.className = "message";
  element.textContent = "";
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (supports international formats including Ethiopian)
const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

// Function to validate email
function validateEmail(email) {
  return emailRegex.test(email);
}

// Function to validate phone
function validatePhone(phone) {
  return phoneRegex.test(phone);
}

/* =========================
   4. DONATION FORM (two submit buttons)
========================= */
const donationForm = document.querySelector(".donation-form form");
const inkindMessage = document.getElementById("inkind-message");

if (donationForm) {
  // Detect which button triggered submit
  donationForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Determine which submit button was clicked
    const submitButton = e.submitter;
    const isInCashSubmit = submitButton.closest(".incash") !== null;
    const isInKindSubmit = submitButton.closest(".inkind") !== null;

    // ---- In-cash ----
    if (isInCashSubmit) {
      // Photo is optional, so we can submit without it
      showMessage(incashMessage, "Thank you! Your donation has been successfully submitted.", "success");
      hideMessage(inkindMessage);
      setTimeout(() => {
        donationForm.reset();
        hideMessage(incashMessage);
      }, 3000);
      return;
    }

    // ---- In-kind ----
    if (isInKindSubmit) {
      const name = document.getElementById("cash-name").value.trim();
      const phone = document.getElementById("cash-phone").value.trim();
      const date = document.getElementById("when").value;

      const checkboxes = document.querySelectorAll(
        "#stat, #clothes, #food, #others"
      );
      const isChecked = [...checkboxes].some(cb => cb.checked);

      if (!isChecked) {
        showMessage(inkindMessage, "Please select at least one in-kind donation type.", "error");
        return;
      }

      if (!name || !phone || !date) {
        showMessage(inkindMessage, "Please fill in your name, phone number, and date for in-kind donation.", "error");
        return;
      }

      // Validate phone number
      if (!validatePhone(phone)) {
        showMessage(inkindMessage, "Please enter a valid phone number.", "error");
        return;
      }

      showMessage(inkindMessage, "Thank you! Your donation has been successfully submitted.", "success");
      hideMessage(incashMessage);
      setTimeout(() => {
        donationForm.reset();
        hideMessage(inkindMessage);
      }, 3000);
      return;
    }
  });
}

/* =========================
   5. VOLUNTEER / CONTACT FORM VALIDATION
========================= */
const contactForm = document.querySelector(".contact-form form");
const contactMessage = document.getElementById("contact-message");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const comment = document.getElementById("comment").value.trim();

    if (!name || !email || !comment) {
      showMessage(contactMessage, "Please fill in all fields.", "error");
      return;
    }

    // Validate email
    if (!validateEmail(email)) {
      showMessage(contactMessage, "Please enter a valid email address.", "error");
      return;
    }

    showMessage(contactMessage, "Thank you! Your message has been sent successfully.", "success");
    setTimeout(() => {
      contactForm.reset();
      hideMessage(contactMessage);
    }, 3000);
  });
}

/* =========================
   6. PARTICIPATE BUTTON POPUP
========================= */
const participateBtn = document.getElementById("participateBtn");
const participateModal = document.getElementById("participateModal");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const participateForm = document.getElementById("participateForm");
const participateMessage = document.getElementById("participate-message");

if (participateBtn && participateModal) {
  // Open modal
  participateBtn.addEventListener("click", () => {
    participateModal.classList.add("active");
  });

  // Close modal
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      participateModal.classList.remove("active");
      if (participateForm) participateForm.reset();
      hideMessage(participateMessage);
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      participateModal.classList.remove("active");
      if (participateForm) participateForm.reset();
      hideMessage(participateMessage);
    });
  }

  // Close modal when clicking outside
  participateModal.addEventListener("click", (e) => {
    if (e.target === participateModal) {
      participateModal.classList.remove("active");
      if (participateForm) participateForm.reset();
      hideMessage(participateMessage);
    }
  });

  // Handle form submission
  if (participateForm) {
    participateForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("participateName").value.trim();
      const email = document.getElementById("participateEmail").value.trim();
      const eventChoice = document.getElementById("eventChoice").value;

      if (!name || !email) {
        showMessage(participateMessage, "Please fill in your name and email.", "error");
        return;
      }

      if (!eventChoice) {
        showMessage(participateMessage, "Please select an event to participate in.", "error");
        return;
      }

      // Validate email
      if (!validateEmail(email)) {
        showMessage(participateMessage, "Please enter a valid email address.", "error");
        return;
      }

      const eventNames = {
        football: "Football Tournament",
        art: "Art Exhibition",
        trips: "Field Trips",
        holiday: "Holiday Celebrations"
      };

      showMessage(participateMessage, `Thank you! Your participation in ${eventNames[eventChoice]} has been registered.`, "success");
      
      setTimeout(() => {
        participateModal.classList.remove("active");
        participateForm.reset();
        hideMessage(participateMessage);
      }, 3000);
    });
  }
}