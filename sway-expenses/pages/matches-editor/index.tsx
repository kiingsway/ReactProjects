import conversionRules from '@/components/expenses/conversion/personalRules';
import CategoriesCSVModal from '@/components/matches-editor/CategoriesCSVModal';
import MatchesModalForm from '@/components/matches-editor/MatchesModalForm';
import MatchesTableData from '@/components/matches-editor/MatchesTableData';
import MatchesToolbar from '@/components/matches-editor/MatchesToolbar';
import useBoolean from '@/hooks/useBoolean';
import { IConvertExpenseRule } from '@/interfaces';
import React from 'react';

export type IConversionCategory = Omit<IConvertExpenseRule, 'match' | 'Title'>;

export default function MatchesEditor(): React.JSX.Element {

  const [matches, setMatches] = React.useState(conversionRules);
  const [selectedMatch, selectMatch] = React.useState<IConvertExpenseRule>();
  const [open, { setTrue: openModal, setFalse: closeModal }] = useBoolean();
  const [openCatCSV, { setTrue: openCatCSVModal, setFalse: closeCatCSVModal }] = useBoolean();
  const [possibleCategories, setPossibleCategories] = React.useState<IConversionCategory[]>([]);

  const setMatchRule = (m?: IConvertExpenseRule): void => { selectMatch(m); openModal(); }
  const unsetMatchRule = (): void => { closeModal(); selectMatch(undefined); }

  return (
    <div className="flex flex-col gap-4 items-center">
      <MatchesToolbar
        matches={matches}
        onNewMatch={() => setMatchRule()}
        onCategoriesCSV={openCatCSVModal}
      />
      <MatchesModalForm
        open={open}
        onClose={unsetMatchRule}
        match={selectedMatch}
        setMatches={setMatches}
      />
      <CategoriesCSVModal
        open={openCatCSV}
        onClose={closeCatCSVModal}
        setPossibleCategories={setPossibleCategories}
      />
      <MatchesTableData
        possibleCategories={possibleCategories}
        onMatchSelect={setMatchRule}
        dataSource={matches} />
    </div>
  );
}