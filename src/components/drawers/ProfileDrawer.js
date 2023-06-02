import { ArrowBack, Check, Edit } from "@mui/icons-material";
import { Avatar, CircularProgress, Divider, Drawer,FormControl,IconButton,Input,InputAdornment,Link, Menu, MenuItem, Stack, Tooltip, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import AppContext from "../../AppContext";


export default function ProfileDrawer({ open, setter }) {
    const {uploadImage , user , setUserData} = useContext(AppContext)
    const [loading , setLoading] = useState(false)
    const [changing, setChanging] = useState(false);

    const [menu, setMenu] = useState({
        anchorEl : null,
        open : false
      });
      const handleClick = event => {
        setMenu({ open: true, anchorEl: event.currentTarget });
      };
    
      const handleClose = () => {
        setMenu({ open: false });
      };

      const handleImage =(file) => {
        setLoading(true)
        uploadImage(file).then(url => {
          setLoading(false);
          updateUser({"pfp" : url})
        }).catch((err) => {
          setLoading(false);
          console.log(err);
        });
      }

      const updateUser = (data) => {
        fetch(process.env.REACT_APP_BASE_URL + '/api/user/' , {
          method : "PATCH",
          headers : {
              "Content-type" : "application/json",
              "authorization" : `Bearer ${localStorage.getItem('app-token')}`
          },
          body : JSON.stringify(data)
      }).then(res => res.json()).then(data => {
          setUserData(data.user)
      }).catch(err => console.log(err.message))
      }
  return (<>

    <Drawer
      open={open}
      anchor="left"
      onClose={() => {
        setter(!open)
      }}
    >
      <Stack
        direction="column"
        sx={{ width: "30vw", height: "100%", ml: 1, mt: 4, p: 2 }}
      >
        {loading && <CircularProgress color="inherit" />}
        <Typography sx={{ fontWeight: "bold"}} variant="h5">
          <IconButton onClick={()=>setter(!open)}><ArrowBack fontSize="large"/></IconButton>Profile
        </Typography>
        <Divider sx={{ width: "100%", mb: 2 }} />
       <Tooltip placement="right" title="options"> 
       <Avatar
          sx={{
            bgcolor: "blue",
            width: "50%",
            height: "15vw",
            alignSelf: "center",
            cursor : "pointer",
            "&:hover" : {
                opacity : '0.6'
            }
          }}
          alt={user?.name}
          src={`${process.env.REACT_APP_BASE_URL}/${user?.pfp}`}
          onClick={handleClick}
        />
       </Tooltip>
        <Typography sx={{ mb: 1, color: "success.main" }} variant="subtitle1">
          your name
        </Typography>
        <FormControl sx={{ mb: 1}} variant="standard">
          <Input
          sx={{fontWeight: "bold" , fontSize : "20px"}}
          onKeyUp={e => {
            if(e.key === "Enter"){
              setChanging(false)
              updateUser({"name" : e.target.value})
            }
          }}
            id="standard-adornment-password"
            type="text"
            disabled={!changing}
            defaultValue={user?.name}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={e => setChanging(!changing)}
                >
                  {changing ? <Check/> : <Edit />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Typography sx={{ alignSelf: "flex-start", mb: 1 }} variant="body2">
          hit enter after editing your name to confirm.
        </Typography>

        <Typography sx={{ mb: 1, color: "success.main" }} variant="subtitle1">
          email
        </Typography>
        <Typography sx={{ fontWeight: "bold", mb: 2 }} variant="h6">
          {user?.email}
        </Typography>
      </Stack>
    </Drawer>
    <Menu
          anchorEl={menu.anchorEl}
          open={menu.open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleClose}><Link href={user?.pfp} target="_blank" sx={{textDecoration :'none' , color : 'inherit'}}>View photo</Link></MenuItem>
          <MenuItem >
            <label htmlFor="pic">Change photo</label>
            <Input type="file" name="pic" id="pic" sx={{display :'none'}} onChange={(e) => handleImage(e.target.files[0])}/>
          </MenuItem>
          <MenuItem onClick={e => updateUser({"pfp" : "none"})}>Remove photo</MenuItem>
        </Menu>
    </>
  );
}
