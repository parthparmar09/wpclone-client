import { ArrowBack } from "@mui/icons-material";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import ConvoListItem from "../ConvoListItem";
import SearchBar from "../misc/SearchBar";

export default function ProfileDrawer({ open, setter }) {
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchUsers = () => {
    if (keyword.length < 2) {
      return null;
    }
    setLoading(true);

    fetch(`${process.env.REACT_APP_BASE_URL}/api/user/multi?keyword=${keyword}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("app-token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
        setLoading(false);
      }).catch(err => {return})
  };

  useEffect(() => {
    fetchUsers();
  }, [keyword]);


  return (
    <Drawer
      open={open}
      anchor="left"
      onClose={() => {
        setter(!open);
        setUsers(null);
      }}
    >
      <Stack
        direction="column"
        sx={{ width: "30vw", height: "100%", ml: 1, mt: 4, p: 2 , overflow : 'hidden'}}
      >
        <Typography sx={{ fontWeight: "bold" }} variant="h5">
          <IconButton onClick={() => setter(!open)}>
            <ArrowBack fontSize="large" />
          </IconButton>
          New Chat
        </Typography>
        <Divider sx={{ width: "100%", mb: 2 }} />
        <SearchBar setter={setKeyword} />

        <List sx={{ overflowY: "auto", height: "82%" }}>
          {(!loading && users)
            ? users.map((user) => (
                <ConvoListItem convo={user} key={user._id} setter={setter} dont dataSet={setUsers} />
              ))
            : <>
              <Skeleton
                  variant="rectangular"
                  sx={{ width: "100%", height: 50 , mb:1}}
                  
                />
              <Skeleton
                  variant="rectangular"
                  sx={{ width: "100%", height: 50 , mb:1}}
                  
                />
              <Skeleton
                  variant="rectangular"
                  sx={{ width: "100%", height: 50 , mb:1}}
                  
                />
              <Skeleton
                  variant="rectangular"
                  sx={{ width: "100%", height: 50 , mb:1}}
                  
                />
              <Skeleton
                  variant="rectangular"
                  sx={{ width: "100%", height: 50 , mb:1}}
                  
                />
              <Skeleton
                  variant="rectangular"
                  sx={{ width: "100%", height: 50 , mb:1}}
                  
                />
              <Skeleton
                  variant="rectangular"
                  sx={{ width: "100%", height: 50 , mb:1}}
                  
                />
              <Skeleton
                  variant="rectangular"
                  sx={{ width: "100%", height: 50 , mb:1}}
                  
                />
            </>
              }
        </List>
      </Stack>
    </Drawer>
  );
}
