import React, { useState, useEffect } from "react";
import "./AdminPage.css"; // make sure this file has the CSS below

// --------------------- Header Component ---------------------
function Header() {
  return (
    <header className="admin-header">
      <h1>Admin Dashboard</h1>
    </header>
  );
}

// --------------------- NavTabs Component ---------------------
function NavTabs({ activeTab, setActiveTab }) {
  const tabs = ["participants", "incash", "inkind", "contact"];

  return (
    <nav className="admin-nav">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`navigation-button ${activeTab === tab ? "active" : ""}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </nav>
  );
}

// --------------------- Table Component ---------------------
function Table({
  columns,
  data,
  renderRow,
  noDataMessage = "No data available",
}) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item, idx) => renderRow(item, idx))
        ) : (
          <tr>
            <td colSpan={columns.length} style={{ textAlign: "center" }}>
              {noDataMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

// --------------------- TabContent Component ---------------------
function TabContent({ type, data, filterEvent, setFilterEvent, openModal }) {
  if (!data) return <div>Loading...</div>;
  if (type === "participants") {
    const filtered = data.filter((p) =>
      (p.event || "").toLowerCase().includes((filterEvent || "").toLowerCase())
    );

    return (
      <div>
        <h2>Participants</h2>
        <input
          type="text"
          placeholder="Filter by Event Type"
          value={filterEvent}
          onChange={(e) => setFilterEvent(e.target.value)}
          className="filter-input"
        />
        <Table
          columns={["#", "Name", "Email", "Event Type", "Date Submitted"]}
          data={filtered}
          renderRow={(p, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>{p.event}</td>
              <td>{formatDate(p.dateSubmitted)}</td>
            </tr>
          )}
          noDataMessage="No participants data available"
        />
      </div>
    );
  }

  if (type === "incash") {
    return (
      <div>
        <h2>In-Cash Donations</h2>
        <Table
          columns={["#", "Screenshot", "Date Submitted"]}
          data={data}
          renderRow={(item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>
                <img
                  src={item.screenshot}
                  alt={`Screenshot ${idx + 1}`}
                  className="screenshot-img"
                  onClick={() => openModal(item.screenshot)}
                />
              </td>
              <td>{formatDate(item.dateSubmitted)}</td>
            </tr>
          )}
          noDataMessage="No in-cash donations available"
        />
      </div>
    );
  }

  if (type === "inkind") {
    return (
      <div>
        <h2>In-Kind Donations</h2>
        <Table
          columns={[
            "#",
            "Name",
            "Email",
            "Phone",
            "Date",
            "Choices",
            "Date Submitted",
          ]}
          data={data}
          renderRow={(item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td>{item.date}</td>
              <td>
                {item.choices.map((c, i) => (
                  <span key={i} className="choice-pill">
                    {c}
                  </span>
                ))}
              </td>
              <td>{formatDate(item.dateSubmitted)}</td>
            </tr>
          )}
          noDataMessage="No in-kind donations available"
        />
      </div>
    );
  }

  if (type === "contact") {
    return (
      <div>
        <h2>Contact Messages</h2>
        <Table
          columns={["#", "Name", "Email", "Message", "Date Submitted"]}
          data={data}
          renderRow={(item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.message}</td>
              <td>{formatDate(item.dateSubmitted)}</td>
            </tr>
          )}
          noDataMessage="No contact messages available"
        />
      </div>
    );
  }

  return null;
}

// --------------------- Modal Component ---------------------
function Modal({ imageSrc, onClose }) {
  if (!imageSrc) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <img src={imageSrc} alt="Screenshot" className="modal-image" />
    </div>
  );
}

// --------------------- Helper ---------------------
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString();
}

// --------------------- AdminPage Component ---------------------
function AdminPage() {
  const [activeTab, setActiveTab] = useState("participants");
  const [filterEvent, setFilterEvent] = useState("");
  const [participantsData, setParticipantsData] = useState([]);
  const [incashData, setIncashData] = useState([]);
  const [inkindData, setInkindData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    async function fetchData(endpoint, setter) {
      try {
        const res = await fetch(`http://localhost:5000/${endpoint}`);
        const data = await res.json();
        setter(data);
      } catch (err) {
        console.error("Error fetching " + endpoint, err);
        setter([]);
      }
    }

    fetchData("participants", setParticipantsData);
    fetchData("incash", setIncashData);
    fetchData("inkind", setInkindData);
    fetchData("contact", setContactData);
  }, []);

  return (
    <div className="admin-page">
      <Header />
      <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="tab-container">
        <div
          className={`admin-tab ${
            activeTab === "participants" ? "active" : ""
          }`}
        >
          <TabContent
            type="participants"
            data={participantsData}
            filterEvent={filterEvent}
            setFilterEvent={setFilterEvent}
          />
        </div>
        <div className={`admin-tab ${activeTab === "incash" ? "active" : ""}`}>
          <TabContent
            type="incash"
            data={incashData}
            openModal={setModalImage}
          />
        </div>
        <div className={`admin-tab ${activeTab === "inkind" ? "active" : ""}`}>
          <TabContent type="inkind" data={inkindData} />
        </div>
        <div className={`admin-tab ${activeTab === "contact" ? "active" : ""}`}>
          <TabContent type="contact" data={contactData} />
        </div>
      </div>

      <Modal imageSrc={modalImage} onClose={() => setModalImage(null)} />
    </div>
  );
}

export default AdminPage;
