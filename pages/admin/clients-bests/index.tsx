import React, { useEffect } from "react"
import AssignSelect from "../../../components/AssignSelect"
import PersonalBestsListItem from "../../../components/PersonalBestsListItem";
import { firestore, getUserWithUsername } from "../../../lib/firebase";


function ClientBests(){
    const [activeUser, setActiveUser] = React.useState(null);
    const [activeUserId, setActiveUserId] = React.useState(null);
    const [personalBestsList, setPersonalBestsList] = React.useState([]);

    const handleChange = (event) => {
      setActiveUser(event.target.value);
    };

    const retrieveData = async (id) => {
       
      if (!id) {
        return;
      }
      let ref = await firestore
        .collection(`users/${id}/personalBests`)
        .onSnapshot((snpashot) => {
          const personalBests = snpashot.docs.map((doc) => doc.id);
          //@ts-ignore
          setPersonalBestsList(personalBests);
          // setLoading(false)
        });
    };

    useEffect(() => {
        const getActive = async () => {
          const activeUserObject = await getUserWithUsername(activeUser);
          if (activeUserObject?.id) {
            setActiveUserId(activeUserObject.id);
            retrieveData(activeUserObject.id)
          }
        };
         getActive();
        
      }, [activeUser]);

     

    return <main>
        <AssignSelect
            activeUser={activeUser}
            handleUserChange={handleChange}
          />

    {!!personalBestsList?.length && (
        <div>
          {personalBestsList.map((pb) => (
            <PersonalBestsListItem key={pb} name={pb} clientId={activeUserId}/>
          ))}
        </div>
      )}
    </main>
}

export default ClientBests