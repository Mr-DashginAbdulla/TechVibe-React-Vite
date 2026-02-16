const FieldErrors = ({ errors }) => {
  if (!errors) return null;
  const list = Array.isArray(errors) ? errors : [errors];
  return (
    <div className="mt-[6px] space-y-[2px]">
      {list.map((msg, i) => (
        <p key={i} className="text-[12px] text-red-500">
          {msg}
        </p>
      ))}
    </div>
  );
};

const baseClass =
  "w-full px-[16px] py-[12px] border bg-background rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:border-transparent transition-all text-foreground";

const errorClass =
  "border-red-500 focus:ring-red-400 bg-red-50 dark:bg-red-950/20";

const normalClass = "border-input focus:ring-primary";

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}) => (
  <div>
    <label className="block text-[14px] font-medium text-foreground mb-[8px]">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${baseClass} ${error ? errorClass : normalClass}`}
    />
    <FieldErrors errors={error} />
  </div>
);

export default FormInput;
export { FieldErrors, baseClass, errorClass, normalClass };
