import type { ReactElement, ReactNode } from "react";
import {
  type AccessibilityRole,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colours, shadows, spacing } from "../../theme";

export type AppCardProps = {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  children: ReactNode;
  compact?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppCard({
  accessibilityHint,
  accessibilityLabel,
  accessibilityRole = "button",
  children,
  compact = false,
  onPress,
  selected = false,
  style,
}: AppCardProps): ReactElement {
  const cardStyle = [
    styles.card,
    compact && styles.compact,
    selected && styles.selected,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.surface,
    borderColor: colours.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.lg,
    ...shadows.soft,
  },
  compact: {
    padding: spacing.md,
  },
  pressed: {
    opacity: 0.84,
  },
  selected: {
    backgroundColor: colours.accentSoft,
    borderColor: colours.accentMuted,
  },
});
