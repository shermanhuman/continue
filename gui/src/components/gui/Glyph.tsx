import React from "react";
import styled from "styled-components";
import { PhotoIcon, AtSymbolIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

const StyledGlyph = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  vertical-align: -0.3rem;
  margin: 0.08rem 0.4rem 0.08rem 0.15rem;
  color: var(--vscode-sideBar-foreground);
  z-index: 1;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 1rem;
    height: 1rem;
    background-color: var(--vscode-sideBar-background);
    border-radius: 0.3125rem;
    z-index: -1;
  }
`;

const IconWrapper = styled.i`
  font-style: normal;
  font-size: 1rem;
  line-height: 1;
`;

const HeroIconWrapper = styled.svg`
  width: 1rem;
  height: 1rem;
`;

interface GlyphProps {
  children: 'add' | 'history' | 'gear' | 'ellipsis' | 'photo' | 'at-symbol' | 'wrench-screwdriver' | 'screen-full';
}

const iconMap = {
  add: { class: 'codicon codicon-add', label: 'New Session' },
  history: { class: 'codicon codicon-history', label: 'View History' },
  gear: { class: 'codicon codicon-gear', label: 'Open Continue Config' },
  ellipsis: { class: 'codicon codicon-ellipsis', label: 'More' },
  'screen-full': { class: 'codicon codicon-screen-full', label: 'Toggle Full Screen' },
  photo: { component: PhotoIcon, label: 'Attach an image' },
  'at-symbol': { component: AtSymbolIcon, label: 'Add context' },
  'wrench-screwdriver': { component: WrenchScrewdriverIcon, label: 'Enable tool usage' },
};

const Glyph: React.FC<GlyphProps> = ({ children }) => {
  const icon = iconMap[children];

  if (!icon) {
    console.warn(`Unsupported glyph type: ${children}`);
    return null;
  }

  const content = icon.class ? (
    <IconWrapper className={icon.class} />
  ) : icon.component ? (
    <HeroIconWrapper as={icon.component} />
  ) : null;

  return (
    <StyledGlyph aria-label={icon.label}>
      {content}
    </StyledGlyph>
  );
};

export default Glyph;