import React from 'react';
import {auth, firestore} from '../../lib/firebase';
import { useUserData } from '../../lib/hooks';
import PersonalBestsListItem from '../PersonalBestsListItem';



function PersonalBestsList(){
    const [personalBestsList,setPersonalBestsList] = React.useState([])
    const {user} = useUserData()

   
    console.log('render')
    
    const retrieveData = async () => {
        if(!user?.uid){
            return
        }
        let ref = await firestore.collection(`users/${user.uid}/personalBests`).onSnapshot(snpashot=>{
            
            const personalBests = snpashot.docs.map(doc=>doc.id)
            //@ts-ignore
            setPersonalBestsList(personalBests)
            // setLoading(false)
            
        })
    };

    React.useEffect(()=>{
        retrieveData()
    },[user])

    return <>
        {!!personalBestsList?.length && 
        <div className="personal-bests-list">
            {personalBestsList.map(pb => <PersonalBestsListItem key={pb} name={pb}/>)}
        </div>}
    </>
}

export default PersonalBestsList;