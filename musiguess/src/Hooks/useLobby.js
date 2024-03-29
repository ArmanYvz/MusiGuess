import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { db } from '../firebase';

export default function useLobby({lobbyId}) {

    const [isFetchingLobby,setIsFetchingLobby] = useState(true);
    const [lobby,setLobby] = useState();
    const navigate = useNavigate();


    useEffect( async()=>{
        const lobbyDocRef = doc(db, "lobbies", `${lobbyId}`);
        console.log("Update de çalıştı");
        console.log(lobby);
        await updateDoc(lobbyDocRef, {
            ...lobby
        });
    });

    useEffect(()=>{
        const lobbyDocRef = doc(db, "lobbies", `${lobbyId}`);

        const unsubscribe = onSnapshot(lobbyDocRef, (doc) => {
            if(doc.data()){
                setLobby(doc.data());
                setIsFetchingLobby(false);
            }
            else{
                console.log("There is no lobby with this id");
                alert("There is no lobby with this id");
                navigate("/lobbies", { replace: true });
            }

        })

        return () => {
            unsubscribe();
        }
    },[]);

  return {isFetchingLobby, lobby, setLobby}
}
