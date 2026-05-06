import { HOME_MODULES } from "../domain";
import type { HomeModule } from "../domain";

export function getHomeModules(): readonly HomeModule[] {
  return HOME_MODULES;
}

