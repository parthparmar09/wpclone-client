import { ArrowBack, ArrowForward } from "@mui/icons-material";
import {
  Chip,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  List,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../AppContext";
import GroupListItem from "../GroupListItem";
import SearchBar from "../misc/SearchBar";

export default function NewGroupDrawer({ open, setter }) {
    const {setConversation , fetchConvos , giveNotification} = useContext(AppContext)
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState(null);
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const createGroup = () => {
    fetch(process.env.REACT_APP_BASE_URL + '/api/convo/group' , {
        method : "POST" ,
        headers : {
            'Content-type' : 'application/json',
            'authorization' : `Bearer ${localStorage.getItem('app-token')}`
        },
        body : JSON.stringify({
            "name" : name ,
            "members" : selected.map(user => `${user._id}`)
        })
    }).then(res => res.json()).then(data => {
        if(data.success){
          giveNotification('success' , 'new group created')
            setConversation(data.group)
            setter(!open)
            fetchConvos()
        }
        
    }).catch(err => console.log(err.message))
  }

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

  const handleRemove = (id) => {
    let temp = selected;
    temp = temp.filter((e) => e._id !== id);
    setSelected(temp);
  };

  const nameHandle = (e) => {
    setName(e.target.value);
  };
  const handleCreate = (e) => {
    if(name === ''){
      return giveNotification('error' , `name can't be empty`)

    }
    if(selected.length < 2){
      return giveNotification('warning' , 'at least 3 members are required')
    }
    if(window.confirm('Create new group ?')){
        createGroup()
    }
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
        setSelected(null);
      }}
    >
      <Stack
        direction="column"
        sx={{
          width: "30vw",
          height: "100%",
          ml: 1,
          mt: 4,
          p: 2,
          overflow: "hidden",
        }}
      >
        <Typography sx={{ fontWeight: "bold" }} variant="h5">
          <IconButton onClick={() => setter(!open)}>
            <ArrowBack fontSize="large" />
          </IconButton>
          New Group
        </Typography>
        <Divider sx={{ width: "100%", mb: 2 }} />
        <TextField
          value={name}
          onChange={nameHandle}
          variant="standard"
          sx={{ p: 0, mb: 1 , px : 2 }}
          placeholder="group name"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="create group" arrow placement="top-end">
                <IconButton onClick={handleCreate}> <ArrowForward /> </IconButton>
                </Tooltip>
                
              </InputAdornment>
            ),
          }}
        />
        <SearchBar setter={setKeyword} />
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {selected?.map((item) => (
            <Grid item xs={3} key={item._id} id={item._id} sx={{}}>
              <Chip
                label={item.name}
                variant="filled"
                onDelete={(e) => {
                  handleRemove(item._id);
                }}
              />
            </Grid>
          ))}
        </Grid>
        <List sx={{ overflowY: "auto", height: "82%" }}>
          {!loading && users ? (
            users.map((user) => (
              <GroupListItem
                user={user}
                key={user._id}
                setter={setSelected}
                data={selected}
              />
            ))
          ) : (
            <>
              <Skeleton
                variant="rectangular"
                sx={{ width: "100%", height: 50, mb: 1 }}
              />
              <Skeleton
                variant="rectangular"
                sx={{ width: "100%", height: 50, mb: 1 }}
              />
              <Skeleton
                variant="rectangular"
                sx={{ width: "100%", height: 50, mb: 1 }}
              />
              <Skeleton
                variant="rectangular"
                sx={{ width: "100%", height: 50, mb: 1 }}
              />
              <Skeleton
                variant="rectangular"
                sx={{ width: "100%", height: 50, mb: 1 }}
              />
              <Skeleton
                variant="rectangular"
                sx={{ width: "100%", height: 50, mb: 1 }}
              />
              <Skeleton
                variant="rectangular"
                sx={{ width: "100%", height: 50, mb: 1 }}
              />
              <Skeleton
                variant="rectangular"
                sx={{ width: "100%", height: 50, mb: 1 }}
              />
            </>
          )}
        </List>
      </Stack>
    </Drawer>
  );
}
