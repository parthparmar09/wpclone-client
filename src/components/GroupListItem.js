import {
  Avatar,
  Checkbox,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";

export default function ConvoListItem({ user, setter, data }) {
  const handleToggle = () => {
    if (data?.some((e) => e._id === user._id)) {
      let temp = data;
      temp = temp.filter((e) => e._id !== user._id);
      setter(temp);
    } else {
      setter(prev => (prev && [...prev , user ]))
    }
  };
  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={handleToggle} dense>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={data?.some((e) => e._id === user._id)}
              tabIndex={-1}
              disableRipple
            />
          </ListItemIcon>
          <ListItemAvatar>
            <Avatar alt={user?.name} src={`${process.env.REACT_APP_BASE_URL}/${user?.pfp}`} />
          </ListItemAvatar>
          <ListItemText primary={`${user?.name}`} />
        </ListItemButton>
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}
