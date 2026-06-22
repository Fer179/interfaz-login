const mensajeError = document.getElementsByClassName('errorMessage')[0];

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = event.target.children.username.value;
    const password = event.target.children.password.value;
    const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });
    if(!response.ok) return mensajeError.classList.toggle('escondido', false);
    const resJson = await response.json();
    if(resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});