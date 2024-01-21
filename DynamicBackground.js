import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import styled from 'styled-components';

const Background = styled.div`
  background-color: ${props => props.theme === 'light' ? '#fff' : '#333'};
  color: ${props => props.theme === 'light' ? '#333' : '#fff'};
  transition: all 0.3s ease;
`;

const DynamicBackground = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  return <Background theme={theme}>{children}</Background>;
};

export default DynamicBackground;
