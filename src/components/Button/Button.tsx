// Button.tsx
import React from 'react';
import style from './Button.module.css';

interface ButtonProp {
  text: string | React.ReactNode;
  ButtonHandler?:(event:React.MouseEvent<HTMLButtonElement>)=>void
  paddingVal?:number
}

const Button: React.FC<ButtonProp> = ({ text,ButtonHandler,paddingVal }) => {


  return (
    <button type='submit' style={{padding:`0 ${paddingVal}rem`}} onClick={ButtonHandler} className={style.button}>
      <span className={style['button-content']}>{text}</span>
    </button>
  );
};

export default Button;
