import type { ReactElement } from "react";
import { StatusBar } from "expo-status-bar";

import { AppNavigator } from "./src/navigation/AppNavigator";
import { colours } from "./src/theme";

export default function App(): ReactElement {
  return (
    <>
      <StatusBar style="light" backgroundColor={colours.background} />
      <AppNavigator />
    </>
  );
}
