import { MenuItem, Select } from "@material-ui/core";
import React, { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../../lib/firebase";


function ExercisePicker({setCurrentExercise,currentExercise}){
    const query = firestore.collection(`users/${auth.currentUser.uid}/exercises`);
    const [exercises, exericsesLoading, error] = useCollectionData(query);
    const exercisesList = exercises?.map(exercise=>{return {slug:exercise.slug,title:exercise.title}})
    
   

    const handleChange = (e) =>{
        setCurrentExercise(e.target.value)
    }

    return <>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currentExercise}
            style={{ minWidth: "100%" }}
            name="type"
            onChange={handleChange}
          >
              <MenuItem value={''}>-</MenuItem>
              {!!exercisesList?.length && exercisesList.map((exercise,index)=><MenuItem key={exercise.slug} value={exercise.title}>{exercise.title}</MenuItem>)}
          </Select>
    </>
}

export default ExercisePicker