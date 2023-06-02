import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import * as timeago from "timeago.js";

export default function ConvoListItem({convo , dont , setter , dataSet}) {
  const { user, setConversation , fetchConvos} = useContext(AppContext);
  const [display, setDisplay] = useState({
    name: "",
    pfp: "",
    id: "",
    grp : false
  });

  const handleClick = (id) => {
    fetch( process.env.REACT_APP_BASE_URL + "/api/convo/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("app-token")}`,
      },
      body: JSON.stringify({
        id: id,
        grp : display.grp
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dataSet && dataSet(null)
        setter && setter(false)
        setConversation(data.convo[0]);
        fetchConvos()
      });
  };

  const setItems = () => {
    if (convo.isGroup || dont) {
      setDisplay({
        name: convo.name,
        pfp: convo.pfp,
        id: convo._id,
      });
    } else {
      const member = convo.members.filter(member => member._id !== user._id )[0]
      setDisplay({
        name : member.name,
        pfp : member.pfp,
        id : member._id
      })}
      setDisplay((prev) => ({...prev ,  grp: convo.isGroup}))
  }
  useEffect(() => {
    setItems()
  } ,  []);

  return (
    <>
      <ListItem
        alignItems="flex-start"
        sx={{
          cursor: "pointer",
          "&:hover": {
            bgcolor: "#d3d3d3",
          },
          display: "flex",
          alignItems: "center",
          pr: 3,
        }}
        onClick={() => 
          handleClick(display.id)
        }
      >
        <ListItemAvatar>
          <Avatar alt={display.name} src={`${process.env.REACT_APP_BASE_URL}/${display.pfp}`}/>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="subtitle1" fontWeight="500">
              {display.name}
            </Typography>
          }
          secondary={convo.lastMsg && <>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {timeago.format(convo.lastMsg.updatedAt)}
              </Typography>
              {` - ${convo.lastMsg.msg.slice(0 ,50 ) }`}
            </>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}
