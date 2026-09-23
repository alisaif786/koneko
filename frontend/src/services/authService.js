export function loginUser(options) {
    return fetch("http://localhost:8080/api/users/login", options);
}
