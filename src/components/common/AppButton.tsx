import type { ReactElement, ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colours, spacing, typography } from "../../theme";

export type AppButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export type AppButtonProps = {
  children: ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  variant?: AppButtonVariant;
};

export function AppButton({
  children,
  onPress,
  style,
  variant = "secondary",
}: AppButtonProps): ReactElement {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, variant === "primary" && styles.primaryText]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  danger: {
    backgroundColor: "transparent",
    borderColor: colours.danger,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  pressed: {
    opacity: 0.78,
  },
  primary: {
    backgroundColor: colours.accent,
    borderColor: colours.accent,
  },
  primaryText: {
    color: colours.background,
  },
  secondary: {
    backgroundColor: colours.surfaceRaised,
    borderColor: colours.border,
  },
  text: {
    color: colours.textPrimary,
    fontSize: typography.small,
    fontWeight: "600",
  },
});

