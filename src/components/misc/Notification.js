import { Alert, Snackbar } from '@mui/material'
import React, { useContext } from 'react'
import AppContext from '../../AppContext'

export default function Notification( {setAlert}) {
    const {alert} = useContext(AppContext)
  return (
    <Snackbar open={alert === null ? false : true} autoHideDuration={3000} onClose={()=>{setAlert(null)}}>
          <Alert
            onClose={()=>{setAlert(null)}}
            severity={alert.type}
            sx={{ width: "100%" }}
          >
           {alert.msg}
          </Alert>
        </Snackbar>
  )
}
