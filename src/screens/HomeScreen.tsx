import type { ReactElement } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppCard, Screen, SectionHeader } from "../components/common";
import type { HomeModuleId } from "../domain";
import { getHomeModules } from "../services/homeService";
import { colours, spacing, typography } from "../theme";
import { formatDisplayDate, getTodayISODate } from "../utils/dates";

const modules = getHomeModules();

export type HomeScreenProps = {
  onSelectModule: (moduleId: HomeModuleId) => void;
};

export function HomeScreen({
  onSelectModule,
}: HomeScreenProps): ReactElement {
  const today = formatDisplayDate(getTodayISODate());

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.appName}>LogLim</Text>
        <Text style={styles.subtitle}>Today's logs</Text>
      </View>

      <View style={styles.dateCard}>
        <Text style={styles.dateLabel}>Today</Text>
        <Text style={styles.dateText}>{today}</Text>
      </View>

      <SectionHeader
        title="Quick log"
        subtitle="Start with the core daily modules."
      />

      <View style={styles.moduleList}>
        {modules.map((module) => (
          <AppCard
            accessibilityHint={`Open ${module.title}`}
            accessibilityLabel={module.title}
            key={module.id}
            onPress={() => {
              onSelectModule(module.id);
            }}
          >
            <View style={styles.moduleRow}>
              <View style={styles.moduleCopy}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleDescription}>{module.description}</Text>
              </View>
              <Text style={styles.chevron}>{">"}</Text>
            </View>
          </AppCard>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
  },
  appName: {
    color: colours.textPrimary,
    fontSize: typography.title,
    fontWeight: "700",
  },
  subtitle: {
    color: colours.textSecondary,
    fontSize: typography.body,
  },
  dateCard: {
    backgroundColor: colours.surfaceSoft,
    borderColor: colours.borderSoft,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  dateLabel: {
    color: colours.textMuted,
    fontSize: typography.small,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  dateText: {
    color: colours.textPrimary,
    fontSize: typography.heading,
    fontWeight: "600",
  },
  moduleList: {
    gap: spacing.md,
  },
  moduleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  moduleCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  moduleTitle: {
    color: colours.textPrimary,
    fontSize: typography.subheading,
    fontWeight: "600",
  },
  moduleDescription: {
    color: colours.textSecondary,
    fontSize: typography.small,
    lineHeight: 20,
  },
  chevron: {
    color: colours.accentMuted,
    fontSize: typography.heading,
  },
});
