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



export default function App() {
  const db = useDBAssistant();
  const { rateLimit, history } = db;

  return (
    <main className={styles.main}>
      <div ref={db.topRef} />
      <div className={styles.HeaderAndHero}>
        <Header
          onLogoClick={db.resetToHome}
          rateStatus={rateLimit.isLimited ? "limited" : "ok"}
          countdown={rateLimit.countdown}
          historyCount={history.history.length}
          onHistoryClick={() => history.setShowHistory(!history.showHistory)}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/main" element={<MainPage />} />
          </Routes>
        </BrowserRouter>
      </div>
      <TapeAndComp></TapeAndComp>
    </main>
  );
}
