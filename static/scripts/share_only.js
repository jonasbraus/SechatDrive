function on_click_edit_share(element, token)
{
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
                 viewBox="0 0 512 512">
                <path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z"/>
            </svg>
        `
    }

    inner += `
    <span style="color: white;" class="folderPathFont">${element}</span>
    </div>
    <input id="input_rename" type="text" value="${window.location.origin}/drive/share?token=${token}" readonly="readonly" class="folderPathFont modalContentInput" style="margin-left: 40px; width: 60%;"/>
        
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

async function stop_share(element)
{
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

function on_click_folder(request_folder, folder_name, token)
{

    history.pushState({ path: window.location.pathname }, "", window.location.pathname)
    window.location.replace(window.location.origin + "/sharefolder?folder=" + request_folder + "/" + folder_name + "&token=" + token)
    localStorage["last_scroll"] = document.querySelector(".center").scrollTop

}

function on_click_file(request_folder, file_name, token)
{

    history.pushState({ path: window.location.pathname }, "", window.location.pathname)
    // window.location.replace(window.location.origin + "/drive/sharefolder/file?file=" + request_folder + "/" + file_name + "&token=" + token)
    localStorage["last_scroll"] = document.querySelector(".center").scrollTop

    let url = window.location.origin + "/drive/sharefolder/file?file=" + request_folder + "/" + file_name + "&token=" + token

    window.open(url, "_blank")


}

async function on_click_download(token)
{
    document.querySelector("body").innerHTML = "<h1 style='font-size: 40px; color: white;'>Creating Zip...</h1>"
    await fetch(window.location.origin + "/drive/sharefolder/download?token=" + token)
    window.location.replace(window.location.origin + "/drive/sharefolder/download?token=" + token)
    document.querySelector("body").innerHTML = "<h1 style='font-size: 40px; color: white;'>Redirecting to shared folder...</h1>"
    setTimeout(function ()
    {
        window.location.reload()
    }, 10000)
}