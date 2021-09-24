import React from 'react';
import './button.css';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';

interface ButtonProps {

  /**
   * What background color to use
   */
  backgroundColor?: string;

  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  primary?:boolean;
  size?:string
}


const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  label: {
    textTransform: 'capitalize',
  },
});
/**
 * Primary UI component for user interaction
 */
export const KButton = ({
  
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {

  const classes = useStyles();

  // const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  return (
    <Button 

      classes={{root: classes.root}}
      style={{background:backgroundColor}}
    >
      {label}
    </Button>
  );
};
