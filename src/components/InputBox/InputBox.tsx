import React from "react";
interface InputProps {
  Type: string;
  placeholder: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}
const InputBox: React.FC<InputProps> = ({
  Type,
  placeholder,
  value,
  setValue,
}) => {
  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);
  return (
    <input
      className=" bg-transparent outline-none placeholder:text-white border-b-2 pb-1 font-gilroy  border-b-zinc-300 w-[500px] "
      type={Type}
      value={value}
      placeholder={placeholder}
      onChange={inputHandler}
    />
  );
};

export default InputBox;
