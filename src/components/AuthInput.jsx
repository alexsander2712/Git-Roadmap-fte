
import "./AuthInput.css";

export default function AuthInput({
  id,
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  minLength,
  required = true,
}) {
  return (
    <div className="auth-field">
      <label
        className="auth-field__label"
        htmlFor={id}
      >
        {label}
      </label>

      <input
        className="auth-field__input"
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        required={required}
      />
    </div>
  );
}
