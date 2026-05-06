import type { HomeModuleId } from "../domain";

export type AppRoute = "home" | HomeModuleId;

export type NavigateToModule = (route: HomeModuleId) => void;

export type NavigateBack = () => void;

