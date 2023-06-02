import React, { useState , useEffect , useContext} from "react";
import AppContext from "../../AppContext";
import {MoreVertRounded } from "@mui/icons-material";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ChatProfileDrawer from "../drawers/ChatProfileDrawer";


export default function ConvoTopBar({socket , fetchMsgs }) {
  const {user , conversation , setConversation , fetchConvos , giveNotification} = useContext(AppContext)

  const [drawer , setDrawer] = useState(false)

   const [menu, setMenu] = useState({
    anchorEl : null,
    open : false
  });

  const [display , setDisplay] = useState({})

  const handleClick = event => {
    setMenu({ open: true, anchorEl: event.currentTarget });
  };

  const handleClose = () => {
    setMenu({ open: false });
  };

  const updateChat = (data) => {
    fetch(`${process.env.REACT_APP_BASE_URL}/api/convo/group/${conversation._id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        "authorization": `Bearer ${localStorage.getItem("app-token")}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.success){
          setConversation(data.group);
          giveNotification('success' , 'group updated')
          fetchConvos();
        }
      });
  };
  const handleDelete = () => {
    if(window.confirm('This action will delete whole conversation. Are you sure want to continue?')){
      fetch(`${process.env.REACT_APP_BASE_URL}/api/convo/` , {
        method : "DELETE",
        headers : {
          'authorization' : `Bearer ${localStorage.getItem('app-token')}` ,
          'Content-type' : 'application/json'
        },
        body : JSON.stringify({
          "id" : conversation._id
        })
      }).then(res => res.json()).then(data => {
        if(data.success){
          setConversation(null)
          fetchConvos()
          giveNotification("success" , 'chat deleted')
          const obj = {
            id : conversation._id,
            name : user.name
          }
          socket.emit('deleteChat' , obj)
        }
      })
    }
  }
  
  const handleAddUser = () => {
    const email = prompt("Enter the email of the user to be added :")
    fetch(`${process.env.REACT_APP_BASE_URL}/api/convo/group/${conversation._id}` , {
      method : "POST" , 
      headers : {
        'authorization' : `Bearer ${localStorage.getItem('app-token')}` ,
        'Content-type' : 'application/json'
      },
      body : JSON.stringify({
        "email" : email
      })
    }).then(res => res.json()).then(data => {
      console.log(data)
      if(data.success){
        setConversation(data.group)
        socket.emit('addMember' , data.group)
      }
    })
  }

  const handleClear = () => {
    if(!window.confirm('This action will clear all messages from both sides . Continue?')){
      return null
    }
    fetch(`${process.env.REACT_APP_BASE_URL}/api/msg/${conversation._id}` , {
      method : "DELETE" , 
      headers : {
        'authorization' : `Bearer ${localStorage.getItem('app-token')}` ,
        'Content-type' : 'application/json'
      },
    }).then(res => res.json()).then(data => {
      if(data.success){
        const obj = {
          id : conversation._id,
          name : user.name
          
        }
        socket.emit('clearingChat' , obj)
      fetchMsgs()
      fetchConvos()
      }
      
    })
  }

  const removeUser = (id) => {
    if(!window.confirm("Are you sure want to remove this user ?")){
      return null
    }
    if(conversation.isGroup && conversation.members.length === 3){
      alert("There must be more than 2 members in a group. Removing this user can delete whole group.")
      return handleDelete()
    }
    fetch(`${process.env.REACT_APP_BASE_URL}/api/convo/group/${conversation._id}` , {
      method : "DELETE", 
      headers : {
        "Content-type": "application/json",
        "authorization": `Bearer ${localStorage.getItem("app-token")}`,
      },
      body :JSON.stringify({
        "id" : id
      })
    }).then(res => res.json()).then(data => {
      if(data.success){
        setConversation(data.group)
        const obj = {
          remove : id,
          convo : data.group
        }
        socket.emit('removeMember' , obj)
      }
    })
  }

  const setItems = () => {
    if(conversation.isGroup){
      setDisplay({
        name : conversation.name,
        pfp : conversation.pfp,
        id : conversation._id ,
        members : conversation.members ,
        isGroup : true,
        isAdmin : user._id === conversation.admin._id ,
        admin : conversation.admin._id
      })
    }else{
      const member = conversation.members.filter(member => member._id !== user._id )[0]
      setDisplay({
        name : member.name,
        pfp : member.pfp,
        id : member._id,
        email : member.email
      })
    }
  }

  useEffect(()=>{
    conversation && setItems()
  } , [conversation])

  return (<>
  <ChatProfileDrawer open={drawer} setter={setDrawer} chat={display} removeUser={removeUser} updateChat={updateChat}/>  
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ height: "9%", p: 1, pl: 2, pr: 2, bgcolor: "#D3D3D3", mb: 1 }}
    >
      <Stack direction="row" gap={1} alignItems="center">
        <Tooltip title="info" arrow>
          <IconButton sx={{ p: 0 }} onClick={()=> setDrawer(true)}>
          <Avatar alt={display.name} src={`${process.env.REACT_APP_BASE_URL}/${display.pfp}`} />

          </IconButton>
        </Tooltip>
        <Typography variant="h6">{display.name}</Typography>
      </Stack>
      <IconButton
        aria-label="options"
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
        <MenuItem onClick={() => {
          setDrawer(true)
          handleClose()
        }}>Chat Info</MenuItem>
        {conversation.isGroup ? user._id === conversation.admin._id ? <MenuItem onClick={(e) => {
          handleClose()
          handleAddUser()
        }}>Add member</MenuItem> : '' : ''}
        <MenuItem onClick={handleClose}>Mute messages</MenuItem>
        {!conversation.isGroup && <MenuItem onClick={(e) => {
          handleClose()
          handleClear()
        }}>Clear chat</MenuItem>}
        <MenuItem onClick={() => {
          handleClose()
          handleDelete()
        }}>Delete chat</MenuItem>
      </Menu>
    </Stack>
    </>
  );
}
