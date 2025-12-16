export const RegexHelper = {
  nameRegEx: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
  textRegEx: /^[\w\s!@#$%^&*()\-+=.,?'":;/]+$/,
  emailRegEx: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
  numberRegEx: /^-?[0-9]+$/,
};
