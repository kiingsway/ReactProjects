import { IVerbe, TypesConjugaisons } from "../interfaces";

export enum ConjugaisonTypes {
  TENIRVENIR = "tenir/venir (irrégulier)",
  ER = "-er",
  IRREGULIERS = "verbes irréguliers",
}

const verbes: IVerbe[] = [
  { titre: "avoir", conjugaison: ["ai", "as", "a", "avons", "avez", "ont"] },
  { titre: "être", conjugaison: ["suis", "es", "est", "sommes", "êtes", "sont"] },
  { titre: "aller", conjugaison: ["vais", "vas", "va", "allons", "allez", "vont"] },
  { titre: "faire", conjugaison: ["fais", "fais", "fait", "faisons", "faites", "font"] },
  { titre: "vouloir", conjugaison: ["veux", "veux", "veut", "voulons", "voulez", "veulent"] },
  { titre: "pouvoir", conjugaison: ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"] },
  { titre: "devoir", conjugaison: ["dois", "dois", "doit", "devons", "devez", "doivent"] },
  { titre: "croire", conjugaison: ["crois", "crois", "croit", "croyons", "croyez", "croient"] },
  { titre: "tenir", remove_letters: 4, conjugaisonType: ConjugaisonTypes.TENIRVENIR },
  { titre: "venir", remove_letters: 4, conjugaisonType: ConjugaisonTypes.TENIRVENIR },
  { titre: "jouer", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "visiter", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "parler", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "aimer", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "travailler", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "marcher", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "regarder", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "écouter", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "fermer", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "habiter", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "arriver", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "donner", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "chanter", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "porter", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "penser", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "montrer", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "préparer", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "garder", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "toucher", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "rêver", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "adorer", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "chercher", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "laver", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "monter", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "tomber", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "dîner", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "dessiner", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "changer", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "trouver", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
  { titre: "passer", remove_letters: 2, conjugaisonType: ConjugaisonTypes.ER },
];

interface IConjugaison {
  titre: TypesConjugaisons;
  ending: string[];
}

export const conjugaisons: IConjugaison[] = [
  {
    titre: ConjugaisonTypes.TENIRVENIR,
    ending: ["iens", "iens", "ient", "enons", "enez", "iennent"]
  },
  {
    titre: ConjugaisonTypes.ER,
    ending: ["e", "es", "e", "ons", "ez", "ent"]
  }
];

export const getConjugasions = (verbe: IVerbe): string[] => {
  if (verbe.conjugaison) return verbe.conjugaison;
  const conjugaison = conjugaisons.find(c => c.titre === verbe.conjugaisonType);
  if (!conjugaison) throw new Error(`Conjugação não encontrada para o verbo selecionado. Cheque 'getConjugasions'. Verbo: '${verbe.titre}'`);

  const raw_verbe: string = verbe.titre.slice(0, -verbe.remove_letters);
  return conjugaison.ending.map(ending => raw_verbe + ending);
}

export default verbes;