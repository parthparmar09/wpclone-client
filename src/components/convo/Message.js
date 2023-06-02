import { MoreVertRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

export default function Message({ message, self, sender }) {
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

  return (
    <>
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
            href={message.url}
            target="_blank"
            sx={{ textDecoration: "none", color: "inherit", width : '100%' }}
          >
            View
          </Link>
        </MenuItem>
        <MenuItem onClick={(e) => {
          handleClose(e)
        }}>
         <Link
            href={`http://localhost:5000/api/img/download/${message.msg}`}
            target="_blank"
            sx={{ textDecoration: "none", color: "inherit", width : '100%' }}
          >
            Download
          </Link>
        </MenuItem>
      </Menu>
      <Box
        sx={{
          maxWidth: "70%",
          mb: 1,
          display: "flex",
          alignSelf: self && "flex-end",
        }}
      >
        {!self && (
          <Avatar
            alt={`${sender.name}`}
            src={`${process.env.REACT_APP_BASE_URL}/${sender.pfp}`}
            sx={{ height: "32px", width: "32px", m: 1 }}
          />
        )}
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            display: "inline-flex",
            bgcolor: self ? "#03c40a" : "#d3d3d3",
            borderRadius: 1,
            px: 1,
          }}
        >
          {message.isImage ? (
            <Paper elevation={3} sx={{m:1 , bgcolor : 'inherit'}}>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="body1" sx={{ml :1}}>{message.msg}</Typography>
                <IconButton onClick={handleClick}>
                  <MoreVertRounded />
                </IconButton>
              </Stack>
            </Paper>
          ) : (
            <Typography variant="body1" sx={{ py: 1 }}>
              {message.msg}
            </Typography>
          )}
          <Typography variant="caption" sx={{ alignSelf: "flex-end", ml: 1 }}>
            {new Date(message.createdAt).getHours() +
              ":" +
              new Date(message.createdAt).getMinutes()}
          </Typography>
        </Stack>
      </Box>
    </>
  );
}
