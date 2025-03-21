// ThemeContext.tsx
import React, {createContext, useState, useEffect, ReactNode} from 'react';
import {Appearance} from 'react-native';

// Define the shape of the theme object
interface Theme {
  backgroundColor: string;
  button: string;
  text: string;
  header: string;
  whole: string;
  input: string;
  bottom: string;
}

// Define the context shape
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create the context with default values
export const ThemeContext = createContext<ThemeContextType>({
  theme: {
    backgroundColor: '#f5f5f5',
    button: '#E9EEF2',
    text: '#000000',
    header: '#333333',
    whole: '#f5f5f5',
    input: '#000000',
    bottom: '#ffffff',
  },
  toggleTheme: () => {},
});

// Define props for the ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
}

// ThemeProvider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  // Restrict state to 'light' | 'dark' only, with 'light' as the default
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (Appearance.getColorScheme() as 'light' | 'dark') || 'light',
  );

  // Listen to device theme changes and ensure only 'light' or 'dark' is set
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme((colorScheme as 'light' | 'dark') || 'light'); // Fallback to 'light' if null
    });
    return () => subscription.remove();
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Define themes object with explicit types
  const themes: Record<'light' | 'dark', Theme> = {
    light: {
      backgroundColor: '#ffffff',
      button: '#E9EEF2',
      text: '#000000',
      header: '#333333',
      whole: '#f5f5f5',
      input: '#000000',
      bottom: '#ffffff',
    },
    dark: {
      backgroundColor: '#000000',
      button: '#161F26',
      text: '#737070',
      header: '#737070',
      whole: '#1a1a1a',
      input: '#ffffff',
      bottom: '#000000',
    },
  };

  return (
    <ThemeContext.Provider value={{theme: themes[theme], toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
