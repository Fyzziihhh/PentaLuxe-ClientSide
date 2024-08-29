import React from "react";
interface InputProps {
  Type: string;
  placeholder: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  textColor:string;
  borderColor:string;
}
const InputBox: React.FC<InputProps> = ({
  Type,
  placeholder,
  value,
  setValue,
  textColor,
  borderColor
}) => {
  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);
  return (
    <input
      className={`bg-transparent outline-none placeholder:text-${textColor} border-b-2 pb-1 font-gilroy  border-b-${borderColor}-300 w-[500px] text-${textColor}`}
      type={Type}
      value={value}
      placeholder={placeholder}
      onChange={inputHandler}
      required
    />
  );
};

export default InputBox;
