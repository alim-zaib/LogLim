import type { ReactElement, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colours, spacing, typography } from "../../theme";

export type PillProps = {
  children: ReactNode;
  selected?: boolean;
};

export function Pill({ children, selected = false }: PillProps): ReactElement {
  return (
    <View style={[styles.pill, selected && styles.selected]}>
      <Text style={[styles.text, selected && styles.selectedText]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    backgroundColor: colours.surfaceRaised,
    borderColor: colours.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  selected: {
    backgroundColor: colours.accentSoft,
    borderColor: colours.accentMuted,
  },
  text: {
    color: colours.textSecondary,
    fontSize: typography.small,
    fontWeight: "600",
  },
  selectedText: {
    color: colours.textPrimary,
  },
});

