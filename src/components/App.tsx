import React from "react";
import styled from "styled-components";
import { Table } from "./Table";

export const App = () => (
  <Body>
    <Table />
  </Body>
);

const Body = styled.main`
  display: flex;
  flex: 1;
  position: relative;
  margin: 0 auto;
  padding: 0 32px;
  width: 1096px;
  max-width: 100%;
`;
