// Admin Dashboard JavaScript

// Tab Navigation
document.addEventListener("DOMContentLoaded", function () {
  const navButtons = document.querySelectorAll(".nav-btn");
  const tabs = document.querySelectorAll(".admin-tab");

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");

      // Remove active class from all buttons and tabs
      navButtons.forEach((btn) => btn.classList.remove("active"));
      tabs.forEach((tab) => tab.classList.remove("active"));

      // Add active class to clicked button and corresponding tab
      button.classList.add("active");
      document.getElementById(targetTab).classList.add("active");
    });
  });

  // Load data on page load
  loadAllData();

  // Filter functionality for participants
  const filterInput = document.getElementById("filter-event");
  if (filterInput) {
    filterInput.addEventListener("input", filterParticipants);
  }
});

// Function to fetch data from API (replace with your actual API endpoint)
async function fetchData(endpoint) {
  try {
    // TODO: Replace with your actual API endpoint
    const response = await fetch(`/api/${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    // Return mock data for demonstration
    return getMockData(endpoint);
  }
}

// Mock data for demonstration (remove when connected to real API)
function getMockData(endpoint) {
  // Return empty arrays - no mock data
  return [];
}

// Load all data
async function loadAllData() {
  await Promise.all([
    loadParticipants(),
    loadInCash(),
    loadInKind(),
    loadContact(),
  ]);
}

// Load Participants Data
async function loadParticipants() {
  const data = await fetchData("participants");
  const tbody = document.getElementById("participants-body");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="no-data">No participants data available</td></tr>';
    return;
  }

  data.forEach((participant, index) => {
    const row = document.createElement("tr");
    const eventNames = {
      football: "Football Tournament",
      art: "Art Exhibition",
      trips: "Field Trips",
      holiday: "Holiday Celebrations",
    };

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${participant.name}</td>
      <td>${participant.email}</td>
      <td><span class="event-badge">${eventNames[participant.eventType] || participant.eventType}</span></td>
      <td>${formatDate(participant.dateSubmitted)}</td>
    `;
    tbody.appendChild(row);
  });
}

// Load In-Cash Donations
async function loadInCash() {
  const data = await fetchData("incash");
  const tbody = document.getElementById("incash-body");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="no-data">No in-cash donations available</td></tr>';
    return;
  }

  data.forEach((donation, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>
        <img src="${donation.screenshot}" alt="Screenshot ${index + 1}" class="screenshot-img" onclick="openScreenshotModal('${donation.screenshot}')" />
      </td>
      <td>${formatDate(donation.dateSubmitted)}</td>
    `;
    tbody.appendChild(row);
  });
}

// Load In-Kind Donations
async function loadInKind() {
  const data = await fetchData("inkind");
  const tbody = document.getElementById("inkind-body");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="no-data">No in-kind donations available</td></tr>';
    return;
  }

  data.forEach((donation, index) => {
    const row = document.createElement("tr");
    const choiceNames = {
      stat: "Stationary Materials",
      clothes: "Clothes",
      food: "Food",
      others: "Others",
    };

    const choicesHtml = donation.choices
      .map(
        (choice) =>
          `<span class="choice-badge">${choiceNames[choice] || choice}</span>`
      )
      .join("");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${donation.name}</td>
      <td>${donation.email}</td>
      <td>${donation.phone}</td>
      <td>${donation.date}</td>
      <td><div class="choices-list">${choicesHtml}</div></td>
      <td>${formatDate(donation.dateSubmitted)}</td>
    `;
    tbody.appendChild(row);
  });
}

// Load Contact Messages
async function loadContact() {
  const data = await fetchData("contact");
  const tbody = document.getElementById("contact-body");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="no-data">No contact messages available</td></tr>';
    return;
  }

  data.forEach((message, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${message.name}</td>
      <td>${message.email}</td>
      <td>${message.message}</td>
      <td>${formatDate(message.dateSubmitted)}</td>
    `;
    tbody.appendChild(row);
  });
}

// Filter Participants by Event Type
function filterParticipants() {
  const filterValue = document
    .getElementById("filter-event")
    .value.toLowerCase();
  const rows = document.querySelectorAll("#participants-body tr");

  rows.forEach((row) => {
    const eventCell = row.querySelector("td:nth-child(4)");
    if (eventCell) {
      const eventText = eventCell.textContent.toLowerCase();
      row.style.display = eventText.includes(filterValue) ? "" : "none";
    }
  });
}

// Screenshot Modal
function openScreenshotModal(imageSrc) {
  let modal = document.getElementById("screenshotModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "screenshotModal";
    modal.className = "screenshot-modal";
    modal.innerHTML = `
      <div class="screenshot-modal-content">
        <span class="close-screenshot" onclick="closeScreenshotModal()">&times;</span>
        <img src="" alt="Screenshot" id="modalScreenshot" />
      </div>
    `;
    document.body.appendChild(modal);
  }

  document.getElementById("modalScreenshot").src = imageSrc;
  modal.classList.add("active");

  // Close on outside click
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeScreenshotModal();
    }
  });
}

function closeScreenshotModal() {
  const modal = document.getElementById("screenshotModal");
  if (modal) {
    modal.classList.remove("active");
  }
}

// Format Date
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Make functions globally available
window.openScreenshotModal = openScreenshotModal;
window.closeScreenshotModal = closeScreenshotModal;

