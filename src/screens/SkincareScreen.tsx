import type { ReactElement } from "react";

import { ModulePlaceholderScreen } from "./ModulePlaceholderScreen";
import type { NavigateBack } from "../navigation/routes";

export type SkincareScreenProps = {
  onBack: NavigateBack;
};

export function SkincareScreen({
  onBack,
}: SkincareScreenProps): ReactElement {
  return (
    <ModulePlaceholderScreen
      description="Track simple morning and night skincare use."
      onBack={onBack}
      title="Skincare"
    />
  );
}

