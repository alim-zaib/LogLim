import type { ReactElement } from "react";

import { ModulePlaceholderScreen } from "./ModulePlaceholderScreen";
import type { NavigateBack } from "../navigation/routes";

export type DailyNotesScreenProps = {
  onBack: NavigateBack;
};

export function DailyNotesScreen({
  onBack,
}: DailyNotesScreenProps): ReactElement {
  return (
    <ModulePlaceholderScreen
      description="A quick scratchpad for today's notes."
      onBack={onBack}
      title="Daily Notes"
    />
  );
}

