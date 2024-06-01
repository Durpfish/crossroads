let email = '';
let password = '';

export const setEmail = (newEmail: string) => {
    email = newEmail;
};

export const getEmail = () => {
    return email;
};

export const setPassword = (newPassword: string) => {
    password = newPassword;
};

export const getPassword = () => {
    return password;
};