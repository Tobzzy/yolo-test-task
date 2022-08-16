import React, { useState, useEffect } from "react";
import { styled as materialStyled } from "@mui/material/styles";
import styled from "styled-components";
import { sortBy } from "lodash";
import {
  CircularProgress,
  Table as MaterialTable,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Paper,
  TextField,
} from "@mui/material";
import { useQuery } from "@apollo/client";
import { TablePaginationActions } from "./TablePagination";
import { GET_ALL_COUNTRIES } from "../helpers/queries";

interface Country {
  name: string;
  code: string;
  capital: string;
  currency: string;
}

interface CountriesData {
  countries: Country[];
}

export const Table = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState("");
  const { loading, error, data } = useQuery<CountriesData>(GET_ALL_COUNTRIES);
  const [countries, setCountries] = useState<Country[]>(data?.countries || []);

  useEffect(() => {
    if (data) {
      if (filterValue) {
        setCountries(
          data?.countries.filter(
            ({ code }) => code === filterValue.toUpperCase()
          )
        );
      } else {
        setCountries(sortBy(data?.countries, ["name"]));
      }
    }
  }, [data, filterValue]);

  if (loading) {
    return (
      <Wrapper>
        <CircularProgress />
      </Wrapper>
    );
  }

  if (error) {
    return <div> `Error! - ${error.message}`</div>;
  }

  if (countries) {
    const emptyRows =
      page > 0 && countries.length > 1
        ? Math.max(0, (1 + page) * rowsPerPage - countries.length)
        : 0;

    const handleChangePage = (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number
    ) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
    return (
      <TableWrapper>
        <TextField
          id="filled-basic"
          label="filter by country code"
          variant="filled"
          onChange={(e) => setFilterValue(e.target.value)}
        />
        <TableContainer component={Paper}>
          <MaterialTable sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Country name</StyledTableCell>
                <StyledTableCell align="right">Country code</StyledTableCell>
              </TableRow>
            </TableHead>
            {countries.length === 0 && <Wrapper>No country found.</Wrapper>}
            <TableBody>
              {(rowsPerPage > 0
                ? countries.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : countries
              ).map((row) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell component="th" scope="row">
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.code}</StyledTableCell>
                </StyledTableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            {!filterValue && (
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      10,
                      20,
                      50,
                      100,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={3}
                    count={countries.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            )}
          </MaterialTable>
        </TableContainer>
      </TableWrapper>
    );
  }
  return <Wrapper>No country found.</Wrapper>;
};

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  gap: 40px;
  margin-top: 40px;
`;

const StyledTableCell = materialStyled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = materialStyled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
