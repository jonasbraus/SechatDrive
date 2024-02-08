function on_click_edit_share(element) {
    let edit_menu = document.querySelector(".editMenu")
    edit_menu.style.display = "flex"
    edit_menu.innerHTML = `
    <div onclick="stop_share('${element}')" style="width: 90%; display: flex; justify-content: flex-start; align-items: center; gap: 40px; margin-left: 40px; height: 10%">
        <div style="width: 90%; display: flex; justify-content: flex-start; align-items: center; gap: 40px; margin-left: 40px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" class="bi bi-link-45deg editMenuSVG" viewBox="0 0 16 16">
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
            </svg>
            <span style="color: white;" class="folderPathFont">Stop Share</span>
        </div>
    </div>  
    `
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