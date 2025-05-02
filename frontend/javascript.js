async function request(url, meth, objBody) {
    const response = await fetch(url, {
        method: meth,
        headers: {
            'Content-Type': 'application/json', // It's important to set this header when sending JSON
        },
        body: JSON.stringify(objBody)
    });

    // Handle the response here if needed
    if (!response.ok) {
        console.error('Request failed:', response.statusText);
        return;
    }

    return await response.json();
}

async function Login(route) {
    const InUserName = document.querySelector("#UsernameInput").value;
    const InPassword = document.querySelector("#PasswordInput").value;
    let url = window.location.hostname;
    const Port = 3000;
    let Url = new URL(route, "http://" + url + ":" + Port)
    console.log(Url)
    console.log("hello")
    
    try {
        const data = await request(Url, "POST", {
            userName: InUserName,
            Password: InPassword
        });
        
        console.log(data); 
    } catch (error) {
        console.error('Login failed:', error);
    }
}
