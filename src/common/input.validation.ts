const isAllowedChar = (code: number, additionalCodes: number[] = []) => {
  return (
    (code > 47 && code < 58) || // numeric (0-9)
    (code > 64 && code < 91) || // upper alpha (A-Z)
    (code > 96 && code < 123) || // lower alpha (a-z)
    additionalCodes.includes(code) // additional allowed codes
  );
};

export const validateInput = (
  input: string,
  additionalCodes: number[] = [],
) => {
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if (!isAllowedChar(code, additionalCodes)) {
      return false;
    }
  }
  return true;
};

export const validateAlphanumeric = (input: string) => {
  return validateInput(input);
};

export const validateGithubUsername = (input: string) => {
  return validateInput(input, [45]);
};

// Validates for alphanumeric characters, hyphen, space, cardinal, period and plus
export const validateProgrammingLanguage = (input: string) => {
  return validateInput(input, [32, 35, 43, 45, 46]);
};

export const validateLocation = (input: string) => {
  return validateInput(input, [32]);
};
