import { ChatRounded, MoreVertRounded } from "@mui/icons-material";
import { Avatar, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../AppContext";
import ProfileDrawer from "../drawers/ProfileDrawer";
import NewChatDrawer from "../drawers/NewChatDrawer";
import NewGroupDrawer from "../drawers/NewGroupDrawer";


export default function Navbar() {
  const {setConversation , user} = useContext(AppContext)
  const navigate = useNavigate()
  const [menu, setMenu] = useState({
    anchorEl : null,
    open : false
  });
  const [chatDrawer, setChatDrawer] = useState(false)
  const [profileDrawer, setProfileDrawer] = useState(false)
  const [groupDrawer, setGroupDrawer] = useState(false)
  
  const handleClick = event => {
    setMenu({ open: true, anchorEl: event.currentTarget });
  };

  const handleClose = () => {
    setMenu({ open: false });
  };

  const logout = () => {
    localStorage.removeItem('app-token')
    setConversation(null)
    navigate('/')
  }



  return (<>  
  <ProfileDrawer open={profileDrawer} setter={setProfileDrawer}/>  
  <NewChatDrawer open={chatDrawer} setter={setChatDrawer}/>  
  <NewGroupDrawer open={groupDrawer} setter={setGroupDrawer}/>  
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ height: "9%", p: 1,pl : 2 , pr : 2 , bgcolor: "#D3D3D3", mb: 1 }}
    >
      <Tooltip title="Profile" arrow>
        <IconButton sx={{p : 0}} onClick={()=>{setProfileDrawer(true)}}>
        <Avatar sx={{ bgcolor: "orangered" }}  alt={`${user?.name}`}
      src={`${process.env.REACT_APP_BASE_URL}/${user?.pfp}`} />
        </IconButton>
      </Tooltip>
      <Stack direction="row" gap={1} alignItems="center">
        <Tooltip title="New Chat" arrow>
          <IconButton aria-label="chat" onClick={()=>{setChatDrawer(true)}}>
            <ChatRounded />
          </IconButton>
        </Tooltip>
        <IconButton
          aria-label="options"
          id="basic-button"
          aria-haspopup="true"
    
          onClick={handleClick}
        >
          <MoreVertRounded />
        </IconButton>
        <Menu
          anchorEl={menu.anchorEl}
          open={menu.open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={()=>{
            setGroupDrawer(true)
            handleClose()
          }}>New Group</MenuItem>
          <MenuItem onClick={e => {
            setProfileDrawer(true)
            handleClose()
          }}>Profile</MenuItem>
          <MenuItem onClick={e => {
            handleClose()
            logout()
          }}>Logout</MenuItem>
        </Menu>
      </Stack>
    </Stack>
    </>);
}
