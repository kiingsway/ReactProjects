"use client";
import React from "react";
import NewGame from "./components/NewGame";
import { GameSettings } from "./interfaces";
import Game from "./components/Game";
import { ConjugaisonTypes } from "./data/verbes";

export default function Home() {

  const [isNewGame, setIsNewGame] = React.useState(true);
  const settingsState = React.useState<GameSettings>({ conjugaisonTypes: Object.values(ConjugaisonTypes) });

  const onQuitGame = () => setIsNewGame(true);
  const onStartGame = () => setIsNewGame(false);

  const Content = () => {
    if (isNewGame) return <NewGame settingsState={settingsState} onStartGame={onStartGame} />;
    return <Game settings={settingsState[0]} onQuitGame={onQuitGame} />;
  }

  return <Content />;
}
