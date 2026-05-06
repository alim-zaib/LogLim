import type { ReactElement } from "react";
import { useCallback, useState } from "react";

import type { AppRoute } from "./routes";
import { DailyNotesScreen } from "../screens/DailyNotesScreen";
import { GymScreen } from "../screens/GymScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { SkincareScreen } from "../screens/SkincareScreen";
import { SupplementsScreen } from "../screens/SupplementsScreen";

export function AppNavigator(): ReactElement {
  const [route, setRoute] = useState<AppRoute>("home");

  const goHome = useCallback((): void => {
    setRoute("home");
  }, []);

  if (route === "daily_notes") {
    return <DailyNotesScreen onBack={goHome} />;
  }

  if (route === "gym") {
    return <GymScreen onBack={goHome} />;
  }

  if (route === "skincare") {
    return <SkincareScreen onBack={goHome} />;
  }

  if (route === "supplements") {
    return <SupplementsScreen onBack={goHome} />;
  }

  return <HomeScreen onSelectModule={setRoute} />;
}

