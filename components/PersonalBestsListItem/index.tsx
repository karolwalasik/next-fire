import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PersonalBestsDetails from "../PersonalBestsDetails";
import { auth, firestore } from "../../lib/firebase";
import DeleteIcon from "@material-ui/icons/Delete";

function PersonalBestsListItem({ name }) {
  const [isExpanded, setExpanded] = React.useState(false);

  const removePersonalBest = async (name) => {
    const uid = auth.currentUser.uid;
    const ref = firestore
      .collection("users")
      .doc(uid)
      .collection(`personalBests`)
      .doc(name);
    await ref.delete();
  };

  const handleExpanded = (e, expanded) => {
    setExpanded(expanded);
  };
  return (
    <>
      <Accordion onChange={handleExpanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          style={{ justifyContent: "space-between" }}
        >
          <Typography>{name}</Typography>
          <DeleteIcon onClick={() => removePersonalBest(name)} />
        </AccordionSummary>
        <AccordionDetails>
          <PersonalBestsDetails exerciseName={name} expanded={isExpanded} />
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default PersonalBestsListItem;
