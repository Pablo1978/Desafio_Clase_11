const registerForm = document.getElementById('registerForm')

registerForm.addEventListener('submit', async e => {
    e.preventDefault()
    const data = new FormData(registerForm)
    const obj = {}
    data.forEach((value, key) => obj[key] = value);

    const response = await fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": 'application/json'
        }
    })

    const result = await response.json()
    console.log(result);
})