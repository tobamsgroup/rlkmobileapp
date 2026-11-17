import React from 'react';

import { Mission } from '@/types/mission';
import ChooseYourAdventure from './ChooseYourAdventure';
import DreamLadder from './DreamLadder';
import MatchGame from './MatchGame';
import MysteryDetective from './MysteryDetective';
import PickAndDrop from './PickAndDrop';
import SpinTheWheel from './SpinTheWheel';

/** Renders the game engine for a mission's model. */
const MissionGame = ({
  mission,
  onNext,
}: {
  mission: Mission;
  onNext: () => void;
}) => {
  switch (mission.model) {
    case 'pick_drop':
      return <PickAndDrop mission={mission} onNext={onNext} />;
    case 'spin_wheel':
      return <SpinTheWheel mission={mission} onNext={onNext} />;
    case 'dream_ladder':
      return <DreamLadder mission={mission} onNext={onNext} />;
    case 'match':
      return <MatchGame mission={mission} onNext={onNext} />;
    case 'mystery':
      return <MysteryDetective mission={mission} onNext={onNext} />;
    case 'adventure':
      return <ChooseYourAdventure mission={mission} onNext={onNext} />;
    default:
      // A model this app version doesn't support yet
      return null;
  }
};

export default MissionGame;
