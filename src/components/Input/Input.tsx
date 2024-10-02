import React, { ChangeEvent } from 'react'
import './input.css'
interface IInputProps{
    text:string;
    type:string;
    inputHandler:(e:ChangeEvent<HTMLInputElement>)=>void;
    value:string|number;
}
const Input:React.FC<IInputProps> = ({text,type,inputHandler,value}) => {
  return (
    <div className="input-group">
    <input  value={value} onChange={inputHandler} required type={type} name={text} autoComplete="off" className="input  marker:"/>
    <label className="user-label">{text==='FlatNumberOrBuildingName'?text.split('Or').join('/'):text}</label>
  </div>
  )
}

export default Input