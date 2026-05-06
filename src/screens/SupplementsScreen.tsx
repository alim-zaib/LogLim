import type { ReactElement } from "react";

import { ModulePlaceholderScreen } from "./ModulePlaceholderScreen";
import type { NavigateBack } from "../navigation/routes";

export type SupplementsScreenProps = {
  onBack: NavigateBack;
};

export function SupplementsScreen({
  onBack,
}: SupplementsScreenProps): ReactElement {
  return (
    <ModulePlaceholderScreen
      description="A quiet checklist for supplements taken today."
      onBack={onBack}
      title="Supplements"
    />
  );
}

