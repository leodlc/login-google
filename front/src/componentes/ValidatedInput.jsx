import React from 'react';
import { TextField } from '@mui/material';

const ValidatedInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  regexPermitido, // regex para validar CADA carácter (sin flag 'g')
  error,
  setError,
  type = 'text',
  fullWidth = true,
  margin = 'normal',
}) => {
  const handleChange = (e) => {
    const val = e.target.value;

    // Filtrar caracteres válidos usando regex sin estado:
    // Para evitar problemas con .test, creamos un regex nuevo sin flags g.
    const regex = new RegExp(regexPermitido.source);

    const caracteresValidos = val
      .split('')
      .filter((char) => regex.test(char))
      .join('');

    if (val !== caracteresValidos) {
      setError((prev) => ({ ...prev, [name]: 'Caracteres inválidos eliminados' }));
    } else {
      setError((prev) => ({ ...prev, [name]: '' }));
    }

    // Enviar solo el valor filtrado
    onChange({ target: { name, value: caracteresValidos } });
  };

  return (
    <TextField
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      error={!!error}
      helperText={error}
      fullWidth={fullWidth}
      margin={margin}
    />
  );
};

export default ValidatedInput;
