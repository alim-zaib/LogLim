import type { ReactElement } from "react";

import { ModulePlaceholderScreen } from "./ModulePlaceholderScreen";
import type { NavigateBack } from "../navigation/routes";

export type GymScreenProps = {
  onBack: NavigateBack;
};

export function GymScreen({ onBack }: GymScreenProps): ReactElement {
  return (
    <ModulePlaceholderScreen
      description="Log gym sessions and muscles worked."
      onBack={onBack}
      title="Gym"
    />
  );
}

