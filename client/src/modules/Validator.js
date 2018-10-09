const usernameConfig = {
  min: 4,
  max: 12
};

const passwordConfig = {
  min: 4,
  max: 12
};

class Validator {
  static validateLogin(username, password) {
    let valid = true,
      error = null;

    username = username.trim();
    password = password.trim();
    if (username === '' || password === '') {
      valid = false;
      error = 'All fields must be filled out';
    }

    return { valid, error };
  }

  static validateUsername(username) {
    let valid = true,
      errors = [];

    username = username.trim();
    if (username === '') {
      valid = false;
      errors.push('All fields must be filled out');
    }
    if (!username.match(/^[0-9a-zA-Z.]+$/)) {
      valid = false;
      errors.push('Username must be alphanumeric with periods allowed');
    }
    if (
      username.length < usernameConfig.min ||
      username.length > usernameConfig.max
    ) {
      valid = false;
      errors.push(
        `Username must be ${usernameConfig.min}-${
          usernameConfig.max
        } characters long.`
      );
    }

    return { valid, errors };
  }

  static validatePassword(password) {
    let valid = true,
      errors = [];

    password = password.trim();
    if (password === '') {
      valid = false;
      errors.push('All fields must be filled out');
    }
    if (!password.match(/^[0-9a-zA-Z]+$/)) {
      valid = false;
      errors.push('Password must be alphanumeric');
    }
    if (
      password.length < passwordConfig.min ||
      password.length > passwordConfig.max
    ) {
      valid = false;
      errors.push(
        `Password must be ${passwordConfig.min}-${
          passwordConfig.max
        } characters long.`
      );
    }

    return { valid, errors };
  }
}

export default Validator;
