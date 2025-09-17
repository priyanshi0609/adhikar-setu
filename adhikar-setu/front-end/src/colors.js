// colors.js - Adhikar Setu Color Scheme
// Forest Rights Theme - Inspired by nature and government identity

export const colors = {
  // Primary Colors - Forest Green Theme
  primary: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e", // Main primary
    600: "#16a34a", // Primary hover
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
  },

  // Secondary Colors - Emerald
  secondary: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981", // Main secondary
    600: "#059669", // Secondary hover
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
    950: "#022c22",
  },

  // Accent Colors - Earth Tones
  accent: {
    amber: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      500: "#f59e0b",
      600: "#d97706",
    },
    brown: {
      50: "#fdf8f6",
      100: "#f2e8e5",
      200: "#eaddd7",
      500: "#92400e",
      600: "#78350f",
    },
  },

  // Neutral Colors - Gray Scale
  neutral: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712",
  },

  // Background Colors
  background: {
    primary: "#ffffff",
    secondary: "#f9fafb",
    tertiary: "#f0fdf4",
    card: "#ffffff",
    overlay: "rgba(0, 0, 0, 0.5)",
    gradient: {
      primary: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
      secondary: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      hero: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 50%, #ecfdf5 100%)",
      overlay: "linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent)",
    },
  },

  // Text Colors
  text: {
    primary: "#111827",
    secondary: "#374151",
    tertiary: "#6b7280",
    muted: "#9ca3af",
    inverse: "#ffffff",
    success: "#065f46",
    error: "#dc2626",
    warning: "#d97706",
  },

  // Border Colors
  border: {
    light: "#e5e7eb",
    medium: "#d1d5db",
    dark: "#9ca3af",
    primary: "#22c55e",
    secondary: "#10b981",
  },

  // Status Colors
  status: {
    success: {
      bg: "#dcfce7",
      text: "#14532d",
      border: "#bbf7d0",
    },
    warning: {
      bg: "#fef3c7",
      text: "#92400e",
      border: "#fde68a",
    },
    error: {
      bg: "#fee2e2",
      text: "#991b1b",
      border: "#fecaca",
    },
    info: {
      bg: "#dbeafe",
      text: "#1e40af",
      border: "#bfdbfe",
    },
  },

  // Interactive States
  interactive: {
    hover: {
      primary: "#16a34a",
      secondary: "#059669",
      neutral: "#f3f4f6",
      card: "#f9fafb",
    },
    active: {
      primary: "#15803d",
      secondary: "#047857",
    },
    focus: {
      ring: "#22c55e",
      offset: "#ffffff",
    },
  },

  // Shadow Colors
  shadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    colored:
      "0 10px 15px -3px rgba(34, 197, 94, 0.1), 0 4px 6px -2px rgba(34, 197, 94, 0.05)",
  },
};

// Utility functions for color manipulation
export const colorUtils = {
  // Get color with opacity
  withOpacity: (color, opacity) => {
    if (color.startsWith("#")) {
      const hex = color.slice(1);
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  },

  // Generate gradient string
  gradient: (direction, ...colors) => {
    return `linear-gradient(${direction}, ${colors.join(", ")})`;
  },

  // Theme variations
  themes: {
    light: {
      background: colors.background.primary,
      surface: colors.neutral[50],
      text: colors.text.primary,
    },
    dark: {
      background: colors.neutral[900],
      surface: colors.neutral[800],
      text: colors.text.inverse,
    },
  },
};

// CSS Custom Properties Export (for use with Tailwind or CSS)
export const cssVariables = {
  "--color-primary": colors.primary[600],
  "--color-primary-hover": colors.primary[700],
  "--color-secondary": colors.secondary[600],
  "--color-secondary-hover": colors.secondary[700],
  "--color-background": colors.background.primary,
  "--color-surface": colors.background.secondary,
  "--color-text-primary": colors.text.primary,
  "--color-text-secondary": colors.text.secondary,
  "--color-border": colors.border.light,
  "--gradient-primary": colors.background.gradient.primary,
  "--gradient-hero": colors.background.gradient.hero,
  "--shadow-base": colors.shadow.base,
  "--shadow-lg": colors.shadow.lg,
};

export default colors;
