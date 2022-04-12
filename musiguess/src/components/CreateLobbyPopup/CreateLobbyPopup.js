import React from 'react'
import "./CreateLobbyPopup.css"
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';


const CreateLobbyPopup = ({handlePopupClose,newLobbyName,setNewLobbyName,newLobbyMaxPlayers,setNewLobbyMaxPlayers,
    handlePopupCreateLobbyButton}) => {
  return (
    <div className = "createLobby">
        <div className="createLobbyPopup">
            <div className="createLobbyPopup__header">
                <h2>Enter Lobby Details</h2>
                <IconButton onClick = {handlePopupClose}> <CloseIcon /> </IconButton>

            </div>
            <div className="createLobbyPopup__body">
                <div className="createLobbyPopup__body__top">
                    <h3>Lobby Name:</h3>
                    <input value= {newLobbyName} onChange = {(e)=>setNewLobbyName(e.target.value)} type="text"/>
                </div>
                <div className="createLobbyPopup__body__bottom">
                    <h3>Max # of Players: {newLobbyMaxPlayers}</h3>
                    <input value = {newLobbyMaxPlayers} onChange = {(e)=>setNewLobbyMaxPlayers(e.target.value)} type="range"  min="2" max="10" step="1" />
                </div>

            </div>
            <div className="createLobbyPopup__footer">
                <button onClick = {()=>handlePopupCreateLobbyButton()} className = "createLobbyPopup__footer__createButton">Create New Lobby</button>
            </div>

        </div>

    </div>
  )
}

export default CreateLobbyPopup


