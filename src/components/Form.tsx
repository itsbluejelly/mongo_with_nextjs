// IMPORT NECESSARY FILES
    // IMPORTING PROPS
import { FormProps } from "@/types/Props"
    // IMPORTING TYPES
import { ChangeEvent } from "react";

// EXPORTING A FUNCTION THAT RETURNS A FORM
export default function Form({
  firstInput: {
    name: firstName,
    placeholder: firstPlaceholder,
    onChange: firstOnChange,
    value: firstValue,
  },

  secondInput: {
    name: secondName,
    placeholder: secondPlaceholder,
    onChange: secondOnChange,
    value: secondValue,
  },

  submitFunction,
  loading,
  buttonName
}: FormProps) {
  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        name={firstName}
        placeholder={firstPlaceholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) => firstOnChange(e)}
        value={firstValue}
        className="border border-slate-500 px-8 py-2"
      />

      <input
        type="text"
        name={secondName}
        placeholder={secondPlaceholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) => secondOnChange(e)}
        value={secondValue}
      />

      <button 
        disabled={loading} 
        onClick={() => submitFunction()}
        className="bg-green-600 font-bold text-white py-3 px-6 w-fit"
    >
        {buttonName}
      </button>
    </div>
  );
}