import { ArrowForward, Check, Close, Edit } from "@mui/icons-material";
import {
  Avatar,
  Chip,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import AppContext from "../../AppContext";

export default function ConversationProfileDrawer({
  open,
  setter,
  chat,
  removeUser,
  updateChat,
}) {
  const { uploadImage, user } = useContext(AppContext);
  const [changing, setChanging] = useState(false);

  const [menu, setMenu] = useState({
    anchorEl: null,
    open: false,
  });
  const handleClick = (event) => {
    setMenu({ open: true, anchorEl: event.currentTarget });
  };
  const handleClose = () => {
    setMenu({ open: false });
  };

  const handleRemove = () => {
    const data = {
      pfp: "none",
    };
    updateChat(data);
  };

  const handleImage = (file) => {
    uploadImage(file)
      .then((url) => {
        updateChat({ pfp: url });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {chat.isGroup && (
        <Menu
          anchorEl={menu.anchorEl}
          open={menu.open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleClose}>
            <Link
              href={chat.pfp}
              target="_blank"
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              View icon
            </Link>
          </MenuItem>
          <MenuItem>
            <label htmlFor="pic">Change icon</label>
            <Input
              type="file"
              name="pic"
              id="pic"
              sx={{ display: "none" }}
              onChange={(e) => handleImage(e.target.files[0])}
            />
          </MenuItem>
          <MenuItem onClick={handleRemove}>Remove icon</MenuItem>
        </Menu>
      )}
      <Drawer
        open={open}
        anchor="right"
        onClose={() => {
          setter(!open);
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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography sx={{ fontWeight: "bold" }} variant="h5">
              {chat.isGroup ? "Group Info" : "User Profile"}
            </Typography>
            <IconButton onClick={(e) => setter(false)}>
              <ArrowForward fontSize="large" />
            </IconButton>
          </Stack>
          <Divider sx={{ width: "100%", mb: 2 }} />
          <Tooltip placement="right" title={chat.isGroup ? "options" : "view"}>
            <Avatar
              sx={{
                bgcolor: "blue",
                width: "50%",
                height: "15vw",
                alignSelf: "center",
                cursor: "pointer",
                "&:hover": {
                  opacity: "0.6",
                },
              }}
              onClick={(e) => {
                chat.isGroup && handleClick(e);
              }}
              alt={chat.name}
              src={`${process.env.REACT_APP_BASE_URL}/${chat.pfp}`}
            />
          </Tooltip>

          <Typography sx={{ mb: 1, color: "success.main" }} variant="subtitle1">
            username
          </Typography>
          {chat.isGroup ? (
            <FormControl sx={{ mb: 1 }} variant="standard">
              <Input
                sx={{ fontWeight: "bold", fontSize: "20px" }}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    setChanging(false);
                    updateChat({ name: e.target.value });
                    setChanging(false);
                  }
                }}
                id="standard-adornment-password"
                type="text"
                disabled={!changing}
                defaultValue={chat.name}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={(e) => setChanging(!changing)}
                    >
                      {changing ? <Check /> : <Edit />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          ) : (
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {chat.name}
            </Typography>
          )}
          <Typography sx={{ alignSelf: "flex-start", mb: 1 }} variant="body2">
            {chat.isGroup
              ? " hit enter after editing the group name to confirm."
              : "lorem ipsum dolor lodam bcdned sledsad"}
          </Typography>

          <Typography sx={{ mb: 1, color: "success.main" }} variant="subtitle1">
            {chat.isGroup ? "members" : "email"}
          </Typography>
          <Typography sx={{ fontWeight: "bold" }} variant="h6">
            {!chat.isGroup && chat.email}
          </Typography>
          {chat.isGroup && (
            <List
              sx={{
                overflowY: "auto",
                height: "40%",
              }}
            >
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt={user?.name} src={user?.pfp} />
                </ListItemAvatar>
                <ListItemText primary={`${user?.name}`} />
                {chat.isAdmin && (
                  <Chip label="admin" size="small" variant="outlined" />
                )}
              </ListItem>
              <Divider variant="fullWidth" component="li" />
              {chat.members
                .filter((member) => member._id !== user._id)
                .map((member) => (
                  <React.Fragment key={member._id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar alt={member?.name} src={member?.pfp} />
                      </ListItemAvatar>
                      <ListItemText primary={`${member?.name}`} />
                      {chat.admin === member._id && (
                        <Chip label="admin" size="small" variant="outlined" />
                      )}
                      {chat.isAdmin && (
                        <Tooltip title="remove" arrow>
                          <IconButton onClick={(e) => removeUser(member._id)}>
                            <Close />
                          </IconButton>
                        </Tooltip>
                      )}
                    </ListItem>
                    <Divider variant="fullWidth" component="li" />
                  </React.Fragment>
                ))}
            </List>
          )}
        </Stack>
      </Drawer>
    </>
  );
}
