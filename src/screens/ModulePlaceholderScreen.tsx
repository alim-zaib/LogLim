import type { ReactElement } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppButton, AppCard, Screen } from "../components/common";
import type { NavigateBack } from "../navigation/routes";
import { colours, spacing, typography } from "../theme";

export type ModulePlaceholderScreenProps = {
  description: string;
  onBack: NavigateBack;
  title: string;
};

export function ModulePlaceholderScreen({
  description,
  onBack,
  title,
}: ModulePlaceholderScreenProps): ReactElement {
  return (
    <Screen>
      <View style={styles.header}>
        <AppButton onPress={onBack} variant="ghost">
          {"< Home"}
        </AppButton>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>

      <AppCard>
        <View style={styles.placeholderContent}>
          <Text style={styles.placeholderTitle}>Nothing logged yet</Text>
          <Text style={styles.placeholderCopy}>
            This space is ready for the first simple version.
          </Text>
        </View>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  description: {
    color: colours.textSecondary,
    fontSize: typography.body,
    lineHeight: 24,
  },
  header: {
    gap: spacing.lg,
  },
  placeholderContent: {
    gap: spacing.sm,
  },
  placeholderCopy: {
    color: colours.textMuted,
    fontSize: typography.small,
    lineHeight: 20,
  },
  placeholderTitle: {
    color: colours.textPrimary,
    fontSize: typography.subheading,
    fontWeight: "600",
  },
  title: {
    color: colours.textPrimary,
    fontSize: typography.title,
    fontWeight: "700",
  },
  titleGroup: {
    gap: spacing.sm,
  },
});

