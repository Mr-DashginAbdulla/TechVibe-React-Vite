import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FieldErrors, baseClass, errorClass, normalClass } from "./FormInput";

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="block text-[14px] font-medium text-foreground mb-[8px]">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${baseClass} pr-[48px] ${error ? errorClass : normalClass}`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-[14px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {show ? (
            <EyeOff className="w-[20px] h-[20px]" />
          ) : (
            <Eye className="w-[20px] h-[20px]" />
          )}
        </button>
      </div>
      <FieldErrors errors={error} />
    </div>
  );
};

export default PasswordInput;
