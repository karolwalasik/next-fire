import { Button, ButtonProps, CssBaselineProps } from "@material-ui/core";
import { purple } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/styles";
import React, { CSSProperties } from "react"
import theme from "../../../lib/theme";

interface CustomButtonProps extends ButtonProps {  
    label: string;
    isSmall?: boolean;
  }

const useStyles = makeStyles({
    root: (props:CSSProperties)=> ({
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      borderRadius: 5,
      border: 0,
      color: 'white',
      height: props.height,
      padding: '0 30px',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
      '&:hover': {
        boxShadow: '0 3px 7px 5px rgba(255, 105, 135, .5)'
      },
    }),
    label: {
      textTransform: 'uppercase',
    },
    sizeSmall: {
        width: 20
    },
  });

export const CustomButton = ({label,isSmall,...props}:CustomButtonProps) =>{
    const classes = useStyles({height: isSmall ? 30: 48});
 
    return <Button 
        classes={classes}
        size={isSmall ? "small" : undefined}
        {...props}
    >{label}</Button>
}