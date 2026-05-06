import { Platform } from "react-native";

export const shadows = {
  soft: Platform.select({
    android: {
      elevation: 1,
    },
    default: {
      shadowColor: "#000000",
      shadowOffset: { height: 8, width: 0 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
    },
  }),
} as const;

