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
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" class="bi bi-link-45deg editMenuSVG" viewBox="0 0 640 512">
                <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"/>
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