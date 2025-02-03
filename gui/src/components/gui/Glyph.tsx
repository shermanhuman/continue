import React from "react";
import styled from "styled-components";

const StyledGlyph = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe WPC", "Segoe UI", "HelveticaNeue-Light", system-ui, "Ubuntu", "Droid Sans", sans-serif;
  font-size: 2rem;
  font-weight: 100;
  width: 1rem;
  height: 1rem;
  vertical-align: -0.3rem;
  margin: 0.08rem 0.4rem 0.08rem 0.15rem;
  line-height: 0.9;
  color: var(--vscode-sideBar-foreground);       /* #cccccc */
  z-index: 1;

  &:before {
    content: "";
    position: absolute;
    top: .06rem;
    left: 0;
    width: .9rem;
    height: .9rem;
    border: 1px solid var(--vscode-sideBar-border);      /* #2b2b2b */
    background-color: var(--vscode-sideBar-background);
    border-radius: 0.3125rem;
    z-index: -1;
  }
`;

interface GlyphProps {
  children: string;
}

const Glyph: React.FC<GlyphProps> = ({ children }) => {
  if (children !== "+") {
    console.warn('Currently, only the "+" glyph is supported.');
    return null;
  }

  const glyph = children;
  return <StyledGlyph aria-label="New Session">{glyph}</StyledGlyph>;
};

export default Glyph;