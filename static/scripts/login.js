async function on_click_login() {
    let mail = document.querySelector("#input_mail").value
    let password = document.querySelector("#input_password").value

    await fetch(window.location.origin + "/login/credentials", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "mail": mail,
            "password": password
        })
    })

    window.location.reload()
}