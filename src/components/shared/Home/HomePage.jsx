import React from "react";
import Slider from "./Slider";
import "./Home.css";
import Footer from "./Footer";

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="hero-image">
        <div className="hero-text">
          <h1>YAŞAR BİLGİ</h1>
          <h3>MASA REZERVASYON SİSTEMİ</h3>
          <p>
            Günümüzde iş yerlerinde verimliliği artırmak ve çalışma ortamını
            optimize etmek amacıyla masa rezervasyon sistemleri giderek daha
            fazla önem kazanmaktadır. Yaşar Bilgi Şirketi olarak, modern iş
            ihtiyaçlarını karşılamak ve çalışanlarımıza esnek ve verimli bir
            çalışma ortamı sunmak amacıyla, yenilikçi bir masa rezervasyon
            sistemi geliştirmiş bulunmaktayız.
          </p>
          {/* <a href="/rezervasyon-olustur">
            <button className="hero-button">Rezervasyon Oluştur</button>
          </a> */}
        </div>
      </div>
      <Slider />
      {/* <Plan /> */}
      <Footer />
    </div>
  );
};

export default HomePage;
