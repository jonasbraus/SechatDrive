function on_click_edit_share(element, token) {
    let edit_menu = document.querySelector(".editMenu")
    edit_menu.style.display = "flex"
    let inner = `
    <div style="width: 90%; display: flex; justify-content: flex-start; align-items: center; gap: 40px; margin-left: 40px;">
    `

    if (element.split(".").length > 1) {
        inner += `
        <svg xmlns="http://www.w3.org/2000/svg" fill="#18a8ff"
                 class="bi bi-file-earmark-fill folderIconSVG" viewBox="0 0 384 512">
                <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM112 256H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/>
            </svg>
        `
    } else {
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
            <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L489.3 358.2l90.5-90.5c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114l-96 96-31.9-25C430.9 239.6 420.1 175.1 377 132c-52.2-52.3-134.5-56.2-191.3-11.7L38.8 5.1zM239 162c30.1-14.9 67.7-9.9 92.8 15.3c20 20 27.5 48.3 21.7 74.5L239 162zM116.6 187.9L60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5l61.8-61.8-50.6-39.9zM220.9 270c-2.1 39.8 12.2 80.1 42.2 110c38.9 38.9 94.4 51 143.6 36.3L220.9 270z"/>    
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

function on_click_folder(request_folder, folder_name, token) {

    history.pushState({path: window.location.pathname}, "", window.location.pathname)
    window.location.replace(window.location.origin + "/sharefolder?folder=" + request_folder + "/" + folder_name + "&token=" + token)
    localStorage["last_scroll"] = document.querySelector(".center").scrollTop

}

function on_click_file(request_folder, file_name, token) {
    let dpi = 96; // Standard-Bildschirmdichte
    let devicePixelRatio = window.devicePixelRatio || 1; // Gerätepixelverhältnis
    let widthInPixels = screen.width; // Bildschirmbreite in Pixel
    let widthInInches = widthInPixels / (dpi * devicePixelRatio); // Umrechnung in Zoll
    let widthInCm = widthInInches * 2.54;

    if (widthInCm >= 12) {
        history.pushState({path: window.location.path}, "", window.location.path)
        window.location.replace(window.location.origin + "/drive/sharefolder/file?file=" + request_folder + "/" + file_name + "&token=" + token)
        localStorage["last_scroll"] = document.querySelector(".center").scrollTop
    }
    else {
        let url = window.location.origin + "/drive/sharefolder/file?file=" + request_folder + "/" + file_name + "&token=" + token

        window.open(url, "_blank")
    }


}

async function on_click_download(token) {
    document.querySelector("body").innerHTML = "<h1 style='font-size: 40px; color: white;'>Creating Zip...</h1>"
    await fetch(window.location.origin + "/drive/sharefolder/download?token=" + token)
    window.location.replace(window.location.origin + "/drive/sharefolder/download?token=" + token)
    document.querySelector("body").innerHTML = "<h1 style='font-size: 40px; color: white;'>Redirecting to shared folder...</h1>"
    setTimeout(function () {
        window.location.reload()
    }, 10000)
}