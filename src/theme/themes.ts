import { colors } from "./colors";

export const Themes = {
  galaxy: colors,
  garden: colors,
  sky: colors,
  dark: colors,
  cute: colors,
};

export type ThemeName = keyof typeof Themes;