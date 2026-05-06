import type { ReactElement } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colours, spacing, typography } from "../../theme";

export type SectionHeaderProps = {
  subtitle?: string;
  title: string;
};

export function SectionHeader({
  subtitle,
  title,
}: SectionHeaderProps): ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  title: {
    color: colours.textPrimary,
    fontSize: typography.heading,
    fontWeight: "600",
  },
  subtitle: {
    color: colours.textMuted,
    fontSize: typography.small,
    lineHeight: 20,
  },
});

