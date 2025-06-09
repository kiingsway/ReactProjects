import { ConjugaisonTypes } from "./data/verbes";

export interface GameSettings {
  conjugaisonTypes: string[];
}

export type TSettingsState = [GameSettings, React.Dispatch<React.SetStateAction<GameSettings>>];

export type TypesConjugaisons = ConjugaisonTypes.ER | ConjugaisonTypes.TENIRVENIR;

export interface IVerbeAvecConjugaison {
  titre: string;
  conjugaison: string[];
  conjugaisonType?: null;
  remove_letters?: null;
}

export interface IVerbeAvecType {
  titre: string;
  conjugaison?: null;
  conjugaisonType: TypesConjugaisons;
  remove_letters: number;
}

export type IVerbe = IVerbeAvecConjugaison | IVerbeAvecType;