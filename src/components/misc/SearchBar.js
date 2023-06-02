import { Search } from '@mui/icons-material';
import React, { useState } from 'react'
import { styled } from "@mui/material/styles";
import { InputBase } from '@mui/material';


const SearchBox = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#D3D3D3",
    "&:hover": {
      backgroundColor: "#C3C3C3",
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    marginBottom : theme.spacing(1),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  }));
  
  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }));

export default function SearchBar({setter}) {

  const handleChange = (e) => {
    setter(e.target.value)
  }

  return (
    <SearchBox >
    <SearchIconWrapper>
      <Search />
    </SearchIconWrapper>
    <StyledInputBase
      placeholder="Search…"
      inputProps={{ "aria-label": "search" }}
      onChange={handleChange}
      autoFocus
    />
  </SearchBox>
  )
}
