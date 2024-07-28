import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section address">
          <h2>İletişim Bilgileri</h2>
          <div className="contact-info">
            <div className="contact-column">
              <h3>Adres</h3>
              <p>
                Merkez: Egemenlik Mahallesi Kemalpaşa Caddesi No:250 A Bornova /
                İZMİR
              </p>
            </div>
            <div className="contact-column">
              <h3>Telefonlar</h3>
              <ul>
                <li>Merkez: 0232 355 1000</li>
                <li>Ankara İrtibat Numarası: 0312 294 9343</li>
              </ul>
            </div>
            <div className="contact-column">
              <h3>E-posta</h3>
              <ul>
                <li>destek@yasarbilgi.com.tr</li>
                <li>info@yasarbilgi.com.tr</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-section trademark">
          <p>2024 Yaşar Bilgi stajyer ekibi tarafından yapılmıştır. &trade;</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
