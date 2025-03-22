import { darkTheme, DesignSystemProvider, lightTheme } from '@strapi/design-system';
import { FC, ReactNode } from 'react';

console.log('!!darkTheme', !!darkTheme);
console.log('!!lightTheme', !!lightTheme);

export const CommonProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <DesignSystemProvider theme={{ theme: darkTheme, themeName: 'light' }}>
          {children}
      </DesignSystemProvider>
  );
};