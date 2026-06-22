const mensajeError = document.getElementsByClassName('error')[0];

document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'        },
        body: JSON.stringify({
            username: event.target.children.username.value,
            email: event.target.children.email.value,
            password: event.target.children.password.value
        })
    });
    if(!response.ok) return mensajeError.classList.toggle('escondido', false);
    const resJson = await response.json();
    if(resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});