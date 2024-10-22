import React, { ChangeEvent } from 'react';

interface IInputProps {
    text: string;
    type: string;
    inputHandler: (e: ChangeEvent<HTMLInputElement>) => void;
    value: string | number;
}

const Input: React.FC<IInputProps> = ({ text, type, inputHandler, value }) => {
    return (
        <div className="relative">
            <input
                value={value}
                onChange={inputHandler}
                required
                type={type}
                name={text}
                autoComplete="off"
                className="border border-gray-400 bg-transparent p-4 text-gray-400 font-semibold text-lg w-[400px] transition-colors duration-150 ease-in-out focus:outline-none focus:border-blue-600 peer"
            />
            <label
                className={`absolute left-4 text-gray-500 pointer-events-none transition-all duration-200 ease-in-out transform ${
                    value ? 'translate-y-[-.2rem] scale-75 px-1 text-blue-500' : 'translate-y-4 text-gray-700'
                } peer-focus:translate-y-[-.2rem] peer-focus:scale-75 peer-focus:px-1 peer-focus:text-blue-500`}
            >
                {text === 'FlatNumberOrBuildingName' ? text.split('Or').join('/') : text}
            </label>
        </div>
    );
};

export default Input;
