function on_click_edit_share(element) {
    let edit_menu = document.querySelector(".editMenu")
    edit_menu.style.display = "flex"
    let inner = `
    <div style="width: 90%; display: flex; justify-content: flex-start; align-items: center; gap: 40px; margin-left: 40px;">
    `

    if (element.split(".").length > 1)
    {
        inner += `
        <svg xmlns="http://www.w3.org/2000/svg" fill="#18a8ff"
                 class="bi bi-file-earmark-fill folderIconSVG" viewBox="0 0 16 16">
                <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2z"/>
            </svg>
        `
    } else
    {
        inner += `
        <svg xmlns="http://www.w3.org/2000/svg" fill="#18a8ff" class="bi bi-folder-fill folderIconSVG"
                 viewBox="0 0 16 16">
                <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3m-8.322.12q.322-.119.684-.12h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981z"/>
            </svg>
        `
    }

    inner += `
    <span style="color: white;" class="folderPathFont">${element}</span>
    </div>
        
    <div onclick="stop_share('${element}')" style="width: 90%; display: flex; justify-content: flex-start; align-items: center; gap: 40px; margin-left: 40px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" class="bi bi-link-45deg editMenuSVG" viewBox="0 0 16 16">
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
            </svg>
            <span style="color: white;" class="folderPathFont">Stop Share</span>
       </div>
    `

    edit_menu.innerHTML = inner
}

async function stop_share(element) {
    await fetch(window.location.origin + "/drive/stopshare", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "element": element
        })
    })

    window.location.reload()
}