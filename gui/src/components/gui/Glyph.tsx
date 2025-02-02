import type React from "react"
import styled from "styled-components"
import { getFontSize } from "../../util";
import { lightGray } from ".."
const StyledGlyph = styled.span`
  position: relative;
  display: inline-block;
  font-family: var(--monaco-monospace-font);
  font-size: ${String(getFontSize() + 8)}px;
  font-weight: lighter;
  vertical-align: -0.1rem;
  margin: 0.08rem 0.4rem 0.08rem 0.15rem;
  line-height: 0.7;
  color: --vscode-editor-foreground;
`

interface GlyphProps {
  children: string
}

const Glyph: React.FC<GlyphProps> = ({ children }) => {
  if (children !== "+") {
    console.warn('Currently, only the "+" glyph is supported.')
    return null
  }

  return <StyledGlyph>{children}</StyledGlyph>
}

export default Glyph