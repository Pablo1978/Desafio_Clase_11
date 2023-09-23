const token = localStorage.getItem('token')
if (!token) {
    window.location.replace('/loginJWT')
}

fetch('/api/sessions/profileInfo', {
    method: 'GET',
    headers: {
        authorization: `Bearer ${token}`
    }
}).then(response => response.json())
    .then(result => {
        console.log(result);
        const user = result.payload
        const welcome = document.getElementById('Bienvenido')
        const email = document.getElementById('email')
        welcome.innerHTML = `Hola, ${user.name}, tu rol es: ${user.role}`;
        email.innerHTML = `Correo: ${user.email}`
    })