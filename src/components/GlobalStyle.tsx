import { createGlobalStyle } from "styled-components";

/**
 * Global styles
 */
export default createGlobalStyle`
  body {
    background: #ffff;
  }

  #root {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    max-width: 1600px;
    min-height: 100vh;
  }
`;
