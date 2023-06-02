import { Upload, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../AppContext";

export default function Signup() {
  const {setUserData , uploadImage , giveNotification} = useContext(AppContext)
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    cpassword: "",
    firstName: "",
    lastName: "",
    pfp: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit =(e) => {
    e.preventDefault();
    if(formData.email === "" || formData.firstName === "" || formData.lastName === "" || formData.password === "") {
      return giveNotification('error' , `all fields are required`)
    }
    if(formData.password !== formData.cpassword){
      return giveNotification('error' , `passwords doesn't match`)
    }

    let data = {
      email : formData.email,
      password : formData.password,
      name : `${formData.firstName} ${formData.lastName}`,
      pfp : formData.pfp
    }

    fetch(process.env.REACT_APP_BASE_URL + '/api/user/register' , {
      method : "POST" , 
      headers : {
        "Content-type" : "application/json"
      },
      body : JSON.stringify(data)
    }).then(res => res.json()).then(data => {
      if(data.success){
        giveNotification('success' , 'signed up successfully')
        setUserData(data.user).then(()=>{
          localStorage.setItem('app-token' , data.token)
        navigate('/home')
        })
        
      }else{
        giveNotification('error' , data.message)
      }
    })
    
  };

  
  const [showPass , setShowPass] = useState(false)
  const handleClickShowPassword = () => {
    setShowPass(!showPass)
  };


  const handleImage = (file) => {
    setUploading(true)
    uploadImage(file).then(url => {
      setFormData((prev) => ({ ...prev, pfp: url }));
      setUploading(false);
      giveNotification('success' , `picture uploaded`)
    }).catch((err) => {
      setUploading(false);
      giveNotification('error' , `try again uploading`)
    });
  }


  return (
    <form onSubmit={handleSubmit}>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="space-between"
        sx={{px :4}}
      >
        <Typography gutterBottom variant="h6">
          Getting Started !
        </Typography>
        <Typography gutterBottom
          sx={{
            alignSelf: "flex-start",
            fontWeight: "400",
           
          }}
          variant="subtitle2"
          textAlign="center"
          color="error"
        >
          all fields with *(asterisk) are mandatory
        </Typography>
        <TextField
          sx={{ width: "100%", mb: 2 }}
          onChange={handleChange}
          label="email"
          variant="outlined"
          type="email"
          name="email"
          value={formData.email}

          required
        />
        <Stack direction="row" gap={2} sx={{  mb: 2 }}>
          <TextField
            onChange={handleChange}
            label="first name"
            variant="outlined"
            type="text"
            name="firstName"
            required
            value={formData.firstName}
          />
          <TextField
            onChange={handleChange}
            label="last name"
            variant="outlined"
            type="text"
            name="lastName"
            value={formData.lastName}

          />
        </Stack>
        

        <FormControl  variant="outlined" sx={{ width: "100%", mb: 2 }}>
          <InputLabel htmlFor="password">password</InputLabel>
          <OutlinedInput
            id="password"
            name="password"
            type={showPass ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl><FormControl  variant="outlined" sx={{ width: "100%", mb: 2 }}>
          <InputLabel htmlFor="cpassword">re-enter</InputLabel>
          <OutlinedInput
            id="cpassword"
            name="cpassword"
            type={showPass ? 'text' : 'password'}
            value={formData.cpassword}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPass? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            border: "1px solid #b1b1b1",
            borderRadius: 1,
            alignSelf : 'flex-start',
            mb: 2,
            p: 1,
            "&:hover": { borderColor: "black" },
          }}
        >
          <Input
            type="file"
            sx={{ display: "none"}}
            name="image"
            id="image"
            onChange={(e) => handleImage(e.target.files[0])}
          />
          <label htmlFor="image">
            <Stack direction="row" alignItems="center" sx={{cursor : 'pointer' }}>
              <Upload />
              profile picture
            </Stack>
          </label>
        </Stack>
        <Button variant="contained" type="submit" disabled={uploading}>
          Sign Up
        </Button>
      </Stack>
    </form>
  );
}
