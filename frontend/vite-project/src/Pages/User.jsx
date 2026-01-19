import React, { useState, useEffect } from "react";
import "./user.css";

// Import all images
import bgImage from "../assets/images/bgimage.jpg";
import aboutBg from "../assets/images/Screenshot_30-11-2025_11507_www.bing.com.jpeg";
import homeImg from "../assets/images/home.jpg";
import schoolImg from "../assets/images/school.webp";
import foodImg from "../assets/images/food.webp";
import healImg from "../assets/images/heal.webp";
import footballImg from "../assets/images/football.jpg";
import artImg from "../assets/images/art.webp";
import tripsImg from "../assets/images/trips.webp";
import holidayImg from "../assets/images/holiday.webp";
import facebookIcon from "../assets/images/Facebook_icon.svg.png";
import xIcon from "../assets/images/X_icon_2.svg.png";
import whatsappIcon from "../assets/images/whatsappicon.webp";
import instagramIcon from "../assets/images/Instagram_icon.png.webp";
import linkedinIcon from "../assets/images/LinkedIn_icon.svg.png";
import gmailIcon from "../assets/images/Gmail_icon_(2020).svg.png";

const User = () => {
  // State for hamburger menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State for participate modal
  const [isParticipateModalOpen, setIsParticipateModalOpen] = useState(false);
  const [participateForm, setParticipateForm] = useState({
    name: "",
    email: "",
    eventChoice: ""
  });
  const [participateMessage, setParticipateMessage] = useState({ text: "", type: "" });

  // State for donation forms
  const [incashFile, setIncashFile] = useState(null);
  const [incashMessage, setIncashMessage] = useState({ text: "", type: "" });
  const [inkindForm, setInkindForm] = useState({
    stat: false,
    clothes: false,
    food: false,
    others: false,
    date: "",
    name: "",
    phone: ""
  });
  const [inkindMessage, setInkindMessage] = useState({ text: "", type: "" });

  // State for contact form
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [contactMessage, setContactMessage] = useState({ text: "", type: "" });

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Phone validation regex
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

  // Helper functions
  const showMessage = (setter, text, type) => {
    setter({ text, type });
  };

  const hideMessage = (setter) => {
    setter({ text: "", type: "" });
  };

  // Smooth scroll handler
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  // Handle hamburger menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle participate modal
  const openParticipateModal = () => {
    setIsParticipateModalOpen(true);
  };

  const closeParticipateModal = () => {
    setIsParticipateModalOpen(false);
    setParticipateForm({ name: "", email: "", eventChoice: "" });
    setParticipateMessage({ text: "", type: "" });
  };

  const handleParticipateSubmit = (e) => {
    e.preventDefault();
    const { name, email, eventChoice } = participateForm;

    if (!name || !email) {
      showMessage(setParticipateMessage, "Please fill in your name and email.", "error");
      return;
    }

    if (!eventChoice) {
      showMessage(setParticipateMessage, "Please select an event to participate in.", "error");
      return;
    }

    if (!emailRegex.test(email)) {
      showMessage(setParticipateMessage, "Please enter a valid email address.", "error");
      return;
    }

    const eventNames = {
      football: "Football Tournament",
      art: "Art Exhibition",
      trips: "Field Trips",
      holiday: "Holiday Celebrations"
    };

    showMessage(setParticipateMessage, `Thank you! Your participation in ${eventNames[eventChoice]} has been registered.`, "success");

    setTimeout(() => {
      closeParticipateModal();
    }, 3000);
  };

  // Handle in-cash file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage(setIncashMessage, "Please upload an image file only.", "error");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage(setIncashMessage, "Image must be less than 5MB.", "error");
      e.target.value = "";
      return;
    }

    setIncashFile(file);
    hideMessage(setIncashMessage);
  };

  // Handle donation form submission
  const handleDonationSubmit = (e) => {
    e.preventDefault();
    const submitButton = e.nativeEvent.submitter;

    if (submitButton.closest(".incash")) {
      // In-cash submission
      showMessage(setIncashMessage, "Thank you! Your donation has been successfully submitted.", "success");
      hideMessage(setInkindMessage);
      setTimeout(() => {
        setIncashFile(null);
        hideMessage(setIncashMessage);
        e.target.reset();
      }, 3000);
    } else if (submitButton.closest(".inkind")) {
      // In-kind submission
      const { stat, clothes, food, others, date, name, phone } = inkindForm;

      const isChecked = stat || clothes || food || others;
      if (!isChecked) {
        showMessage(setInkindMessage, "Please select at least one in-kind donation type.", "error");
        return;
      }

      if (!name || !phone || !date) {
        showMessage(setInkindMessage, "Please fill in your name, phone number, and date for in-kind donation.", "error");
        return;
      }

      if (!phoneRegex.test(phone)) {
        showMessage(setInkindMessage, "Please enter a valid phone number.", "error");
        return;
      }

      showMessage(setInkindMessage, "Thank you! Your donation has been successfully submitted.", "success");
      hideMessage(setIncashMessage);
      setTimeout(() => {
        setInkindForm({ stat: false, clothes: false, food: false, others: false, date: "", name: "", phone: "" });
        hideMessage(setInkindMessage);
      }, 3000);
    }
  };

  // Handle contact form submission
  const handleContactSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = contactForm;

    if (!name || !email || !message) {
      showMessage(setContactMessage, "Please fill in all fields.", "error");
      return;
    }

    if (!emailRegex.test(email)) {
      showMessage(setContactMessage, "Please enter a valid email address.", "error");
      return;
    }

    showMessage(setContactMessage, "Thank you! Your message has been sent successfully.", "success");
    setTimeout(() => {
      setContactForm({ name: "", email: "", message: "" });
      hideMessage(setContactMessage);
    }, 3000);
  };

  // Set CSS custom properties for background images
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-image', `url(${bgImage})`);
    root.style.setProperty('--about-bg', `url(${aboutBg})`);
    root.style.setProperty('--home-img', `url(${homeImg})`);
    root.style.setProperty('--school-img', `url(${schoolImg})`);
    root.style.setProperty('--food-img', `url(${foodImg})`);
    root.style.setProperty('--heal-img', `url(${healImg})`);
  }, []);

  return (
    <div>
      {/* Nav bar */}
      <div className="nav-bar">
        <div className="logo">EM</div>
        <div className="nav-item">
          <div className={`hamburger ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul className={`items ${isMenuOpen ? "active" : ""}`}>
            <li><a href="#home" onClick={(e) => handleSmoothScroll(e, "home")}>Home</a></li>
            <li><a href="#aboutus" onClick={(e) => handleSmoothScroll(e, "aboutus")}>About</a></li>
            <li><a href="#service" onClick={(e) => handleSmoothScroll(e, "service")}>Service</a></li>
            <li><a href="#event" onClick={(e) => handleSmoothScroll(e, "event")}>Events</a></li>
            <li><a href="#donation" onClick={(e) => handleSmoothScroll(e, "donation")}>Donation</a></li>
            <li><a href="#contact" onClick={(e) => handleSmoothScroll(e, "contact")}>Contact Us</a></li>
          </ul>
        </div>
      </div>

      {/* Home section */}
      <div className="home" id="home">
        <div className="slgn">
          <p>
            A HOME,<br />
            A FUTURE,<br />
            A CHANCE <br />
            FOR EVERY CHILD!
          </p>
        </div>
      </div>

      {/* About section */}
      <div className="Aboutus" id="aboutus">
        <div className="imgstretch">
          <h1 className="headd">About Us</h1>
        </div>
        <div className="box">
          <div className="boxe" id="box1">
            <h2>Motto</h2>
            <p>Fighting for every child's right to a childhood!</p>
          </div>
          <div className="boxe" id="box2">
            <h2>Mission</h2>
            <p>The solution our mission is to rescue children from the streets and provide them with a safe home quality education and holistic care to help them build a fulfilling future.</p>
          </div>
          <div className="boxe" id="box3">
            <h2>Vision</h2>
            <p>Our vision is a world where every child has a safe place to call home and the opportunity to reach their full potential.</p>
          </div>
          <div className="boxe" id="box4">
            <h2>Value</h2>
            <ul className="values">
              <li>Integrity</li>
              <li>Compassion</li>
              <li>Empowerment</li>
              <li>Respect</li>
              <li>Love</li>
              <li>Empathy</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Service section */}
      <div className="service" id="service">
        <div>
          <h1>Services</h1>
        </div>
        <div className="boxs">
          <div className="boks" id="homes"></div>
          <div className="captions"><h2>Safe Shelter and <br />Home</h2></div>
          <div className="boks" id="school"></div>
          <div className="captions"><h2>Education and Schooling</h2></div>
          <div className="boks" id="health"></div>
          <div className="captions"><h2>Healthcare and Nutrition</h2></div>
          <div className="boks" id="heal"></div>
          <div className="captions"><h2>Counseling and Healings</h2></div>
        </div>
      </div>

      {/* Event section */}
      <div className="event" id="event">
        <div>
          <h1>Events</h1>
        </div>
        <div className="boxss">
          <div className="bok" id="bok1">
            <div className="img">
              <img src={footballImg} alt="Children playing football" />
            </div>
            <div><h2>Football Tournaments</h2></div>
            <div><p>Weekly matches teaching teamwork, discipline, and confidence. Safe spaces where street children learn leadership through sports.</p></div>
          </div>
          <div className="bok" id="bok2">
            <div className="img">
              <img src={artImg} alt="Children Art Exhibition" />
            </div>
            <div><h2>Art Exhibition</h2></div>
            <div><p>Quarterly showcase of children's artwork. Creative expression helping heal trauma and build self-worth.</p></div>
          </div>
          <div className="bok" id="bok3">
            <div className="img">
              <img src={tripsImg} alt="Children Trips" />
            </div>
            <div><h2>Field Trips</h2></div>
            <div><p>Monthly educational visits to museums, parks and farms. Broadening horizons beyond street life.</p></div>
          </div>
          <div className="bok" id="bok4">
            <div className="img">
              <img src={holidayImg} alt="Children holidays" />
            </div>
            <div><h2>Holiday Celebrations</h2></div>
            <div><p>Seasonal events (Christmas, Eid, Meskel) creating joyful memories. Every child deserves celebration.</p></div>
          </div>
        </div>
        <div>
          <button className="participate-btn" onClick={openParticipateModal}>Participate</button>
        </div>

        {/* Participate Popup Modal */}
        <div className={`participate-modal ${isParticipateModalOpen ? "active" : ""}`} onClick={(e) => {
          if (e.target.classList.contains("participate-modal")) {
            closeParticipateModal();
          }
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={closeParticipateModal}>&times;</span>
            <h2>What would you like to participate in?</h2>
            <form onSubmit={handleParticipateSubmit}>
              <label htmlFor="participateName">Name:</label>
              <input
                type="text"
                id="participateName"
                name="participateName"
                placeholder="Enter your name"
                value={participateForm.name}
                onChange={(e) => setParticipateForm({ ...participateForm, name: e.target.value })}
                required
              />

              <label htmlFor="participateEmail">Email:</label>
              <input
                type="email"
                id="participateEmail"
                name="participateEmail"
                placeholder="Enter your email"
                value={participateForm.email}
                onChange={(e) => setParticipateForm({ ...participateForm, email: e.target.value })}
                required
              />

              <label htmlFor="eventChoice">Select an event:</label>
              <select
                id="eventChoice"
                name="eventChoice"
                value={participateForm.eventChoice}
                onChange={(e) => setParticipateForm({ ...participateForm, eventChoice: e.target.value })}
                required
              >
                <option value="">-- Please select an event --</option>
                <option value="football">Football Tournament</option>
                <option value="art">Art Exhibition</option>
                <option value="trips">Field Trips</option>
                <option value="holiday">Holiday Celebrations</option>
              </select>
              <div className="modal-buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={closeParticipateModal}>Cancel</button>
              </div>
              {participateMessage.text && (
                <div className={`message ${participateMessage.type}`}>{participateMessage.text}</div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Donation section */}
      <div className="donation-page" id="donation">
        <div className="heado"><h1>Donation</h1></div>
        <div className="donation-form">
          <div className="buttons">
            <button type="button">Incash</button>
            <button type="button">Inkind</button>
          </div>
          <div className="inputs">
            <form onSubmit={handleDonationSubmit}>
              <div className="incash">
                <label htmlFor="bank">CBE: 10000********</label>
                <label htmlFor="bank">Awash Bank: 10000********</label>
                <label htmlFor="bank">COOP: 10000********</label>
                <label htmlFor="bank">Abyssinia Bank: 10000********</label>
                <label htmlFor="bank">NIB Bank: 10000********</label>
                <label htmlFor="bank">Birhan Bank: 10000********</label>
                <label htmlFor="bank">Wagagen Bank: 10000********</label>
                <label htmlFor="photo">You can send us the screenshot of your transaction(optional).</label>
                <input type="file" name="photo" id="photo" accept="image/*" onChange={handleFileChange} />
                {incashFile && (
                  <p className="file-selected">Selected file: {incashFile.name}</p>
                )}
                <button type="submit">Submit</button>
                {incashMessage.text && (
                  <div className={`message ${incashMessage.type}`}>{incashMessage.text}</div>
                )}
              </div>
              <div className="inkind">
                <label htmlFor="what" className="texts">What Kind? : </label>
                <label htmlFor="stat">Stationary Materials</label>
                <input
                  type="checkbox"
                  name="stat"
                  id="stat"
                  checked={inkindForm.stat}
                  onChange={(e) => setInkindForm({ ...inkindForm, stat: e.target.checked })}
                />
                <label htmlFor="clothes">Clothes</label>
                <input
                  type="checkbox"
                  name="cloths"
                  id="clothes"
                  checked={inkindForm.clothes}
                  onChange={(e) => setInkindForm({ ...inkindForm, clothes: e.target.checked })}
                />
                <label htmlFor="food">Food</label>
                <input
                  type="checkbox"
                  name="food"
                  id="food"
                  checked={inkindForm.food}
                  onChange={(e) => setInkindForm({ ...inkindForm, food: e.target.checked })}
                />
                <label htmlFor="others">Others</label>
                <input
                  type="checkbox"
                  name="others"
                  id="others"
                  checked={inkindForm.others}
                  onChange={(e) => setInkindForm({ ...inkindForm, others: e.target.checked })}
                />
                <label htmlFor="when">When?</label>
                <input
                  type="date"
                  name="when"
                  id="when"
                  value={inkindForm.date}
                  onChange={(e) => setInkindForm({ ...inkindForm, date: e.target.value })}
                />
                <label htmlFor="cash-name">Your Name</label>
                <input
                  type="text"
                  id="cash-name"
                  placeholder="Enter your name"
                  value={inkindForm.name}
                  onChange={(e) => setInkindForm({ ...inkindForm, name: e.target.value })}
                />
                <label htmlFor="cash-phone">Phone Number</label>
                <input
                  type="tel"
                  id="cash-phone"
                  placeholder="Enter your phone number"
                  value={inkindForm.phone}
                  onChange={(e) => setInkindForm({ ...inkindForm, phone: e.target.value })}
                />
                <button type="submit">Submit</button>
                {inkindMessage.text && (
                  <div className={`message ${inkindMessage.type}`}>{inkindMessage.text}</div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Contact section */}
      <div className="contact-container" id="contact">
        <div className="left-end">
          <div className="contact-info">
            <p><b>Address:</b> Addis Ababa, <br />Arada, 5Kilo</p>
            <p><b>Phone:</b> +2519********</p>
            <p>
              <b>Email:</b> <br />
              <a href="mailto:EMforStreetChildren@gmail.com">EMforStreetChildren@gmail.com</a>
            </p>
          </div>

          {/* Footer Section */}
          <div className="social-footer">
            <div className="footer-content">
              <h3>Follow Us</h3>
              <p>Stay connected with our latest updates</p>
              <div className="social-icons">
                <a href="#" className="icon-link" title="Facebook">
                  <img src={facebookIcon} alt="Facebook" />
                </a>
                <a href="#" className="icon-link" title="Twitter/X">
                  <img src={xIcon} alt="Twitter/X" />
                </a>
                <a href="#" className="icon-link" title="WhatsApp">
                  <img src={whatsappIcon} alt="WhatsApp" />
                </a>
                <a href="#" className="icon-link" title="Instagram">
                  <img src={instagramIcon} alt="Instagram" />
                </a>
                <a href="#" className="icon-link" title="LinkedIn">
                  <img src={linkedinIcon} alt="LinkedIn" />
                </a>
                <a href="#" className="icon-link" title="Email">
                  <img src={gmailIcon} alt="Email" />
                </a>
              </div>
              <div className="footer-bottom">
                <p>&copy; 2025 EMforStreetChildren. All rights reserved.</p>
                <p className="footer-links">
                  <a href="#contact" onClick={(e) => handleSmoothScroll(e, "contact")}>Contact</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <form onSubmit={handleContactSubmit}>
            <h2>Send us a Message</h2>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name please!"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email please!"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
            />

            <label htmlFor="comment">Message</label>
            <textarea
              id="comment"
              name="comment"
              rows="6"
              placeholder="We appreciate any suggestions and ideas!"
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
            ></textarea>

            <button type="submit">Send Message</button>
            {contactMessage.text && (
              <div className={`message ${contactMessage.type}`}>{contactMessage.text}</div>
            )}
          </form>
        </div>
      </div>

      {/* Donate popup */}
      <div className="donate-popup" id="donatePopup">
        <a href="#donation" className="donate-btn" onClick={(e) => handleSmoothScroll(e, "donation")}>Donate Now</a>
      </div>
    </div>
  );
};

export default User;
