export const isValidEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const validateEmail = (email: string, setEmailError: any) => {
  if (email === "") {
      setEmailError("");
  }
  else if (isValidEmail(email)) {
      setEmailError("");
  }
  else {
      setEmailError("Vui lòng nhập đúng định dạng Email!");
  }
}

export const validatePassword = (password: string, setPasswordError: any) => {
  if (password.trim().length < 6) {
      setPasswordError("Độ dài mật khẩu ít nhất bằng 6 kí tự!");
  } else {
      setPasswordError("");
  }
}

export const formatCurrencyVN = (number: any) => {
  // Check if the number is negative
  const isNegative = number < 0;

  // Convert number to absolute value
  number = Math.abs(number);

  // Format the number with separators
  const parts = number.toFixed(0).toString().split('.');
  let formattedNumber = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Add decimal places if available
  if (parts.length > 1) {
    formattedNumber += `,${parts[1]}`;
  }

  // Attach the currency symbol
  formattedNumber += ' ₫';

  // Add negative sign if applicable
  if (isNegative) {
    formattedNumber = `-${formattedNumber}`;
  }

  return formattedNumber;
}