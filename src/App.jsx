import React from "react";
import { useDBAssistant } from "./hooks/useDBAssistant";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import HistoryPanel from "./components/HistoryPanel/HistoryPanel";
import InputSection from "./components/InputSection/InputSection";
import TabER from "./components/TabER/TabER";
import TabTables from "./components/TabTables/TabTables";
import TabSQL from "./components/TabSQL/TabSQL";
import TabSeed from "./components/TabSeed/TabSeed";
import TabNormalize from "./components/TabNormalize/TabNormalize";
import RefineChat from "./components/RefineChat/RefineChat";
import styles from "./App.module.css";
import image from "./assets/index.js";
import TapeAndComp from "./components/TapeAndComp/TapeAndComp.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage.jsx";
import Footer from "./components/Footer/Footer.jsx";



const LandingPage = () => (
  <main className={styles.main}>
    <div className={styles.HeaderAndHero}>
      <Header />
      <Hero />
    </div>
    <TapeAndComp />
    <Footer></Footer>
  </main>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}
