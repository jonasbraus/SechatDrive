window.addEventListener("load", function (ev) {

    setTimeout(function () {
        if (this.window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }

        document.querySelector("body").style.display = "flex"
        console.log(localStorage["last_scroll"])

        document.querySelector(".center").scrollTo({top: localStorage["last_scroll"], behavior: "instant"})
        localStorage["last_scroll"] = 0
    }, 1)

    if (localStorage["move_origin"] !== "undefined" && localStorage["move_origin"] !== undefined) {
        let bottom_nav = document.querySelector(".bottomNav")
        let split = localStorage["move_origin"].split("/")
        let element_name = split[split.length - 1]
        bottom_nav.innerHTML = `
        <button onclick="on_click_move_here('${element_name}')" style="background-color: transparent; display: flex; justify-content: center; align-items: center; border: 0; gap: 40px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" class="bi bi-arrows-move editMenuSVG" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10M.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8"/>
            </svg>
            <span style="color: white;" class="folderPathFont">Move Here</span>
        </button>
        `
    }


    document.querySelector(".addMenu").style.display = "none"
    document.querySelector(".editMenu").style.display = "none"
    document.querySelector(".sideBar").style.display = "none"


})

function on_click_folder(request_folder, folder_name) {
    if (document.querySelector(".addMenu").style.display === "none" && document.querySelector(".editMenu").style.display === "none" &&
        document.querySelector(".sideBar").style.display === "none") {
        history.pushState({path: window.location.pathname}, "", window.location.pathname)
        window.location.replace(window.location.origin + "/drive?folder=" + request_folder + "/" + folder_name)
        localStorage["last_scroll"] = document.querySelector(".center").scrollTop
    }
}

function on_click_file(request_folder, file_name) {
    if (document.querySelector(".addMenu").style.display === "none" && document.querySelector(".editMenu").style.display === "none" &&
        document.querySelector(".sideBar").style.display === "none") {
        // history.pushState({ path: window.location.pathname }, "", window.location.pathname)

        localStorage["last_scroll"] = document.querySelector(".center").scrollTop
        let url = window.location.origin + "/drive/getfile?file=" + request_folder + "/" + file_name
        if (file_name.toLowerCase().includes(".png") || file_name.toLowerCase().includes(".jpg") || file_name.toLowerCase().includes(".jpeg")) {
            document.querySelector(".modal").style.display = "flex"
            document.querySelector(".modalContent").innerHTML = `
            <img src='${url}' style="display:block; margin:auto; max-width: 100%; max-height: 80vh; border-radius: 30px;">
            `
        } else if (file_name.toLowerCase().includes(".mp4") || file_name.toLowerCase().includes(".mpeg-4") || file_name.toLowerCase().includes(".avi") || file_name.toLowerCase().includes(".mov")) {
            document.querySelector(".modal").style.display = "flex"
            document.querySelector(".modalContent").innerHTML = `
            <iframe src='${url}' style="display:block; margin:auto; max-width: 100%; max-height: 80vh; width: 100%; height: 80vh;">
            `
        } else {
            window.open(url, "_blank")
        }

    }
}

async function on_click_move_here(element_name) {
    let target_location = (window.location.href.split("folder=")[1] + "/" + element_name).replace("undefined", "")
    let original_location = localStorage["move_origin"].replace("undefined", "")
    localStorage["move_origin"] = undefined

    await fetch(window.location.origin + "/drive/move", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "original_location": original_location,
            "target_location": target_location
        })
    })

    window.location.reload()
}

function on_click_move_element_in_edit_menu(request_folder, element_name) {
    localStorage["move_origin"] = request_folder + "/" + element_name
    let bottom_nav = document.querySelector(".bottomNav")
    document.querySelector(".editMenu").style.display = "none"
    bottom_nav.innerHTML = `
    <button onclick="on_click_move_here('${element_name}')" style="background-color: transparent; display: flex; justify-content: center; align-items: center; border: 0; gap: 40px;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" class="bi bi-arrows-move editMenuSVG" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10M.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8"/>
        </svg>
        <span style="color: white;" class="folderPathFont">Move Here</span>
    </button>
    `
}

function on_click_edit(request_folder, element_name) {
    let inner = `<div style="width: 90%; display: flex; justify-content: flex-start; align-items: center; gap: 40px; margin-left: 40px;">`
    if (element_name.toLowerCase().includes(".zip")) {
        inner += `
        <svg xmlns="http://www.w3.org/2000/svg" fill="#18a8ff"
                 class="bi bi-file-earmark-fill folderIconSVG" viewBox="0 0 384 512">
                 <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM96 48c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16zm-6.3 71.8c3.7-14 16.4-23.8 30.9-23.8h14.8c14.5 0 27.2 9.7 30.9 23.8l23.5 88.2c1.4 5.4 2.1 10.9 2.1 16.4c0 35.2-28.8 63.7-64 63.7s-64-28.5-64-63.7c0-5.5 .7-11.1 2.1-16.4l23.5-88.2zM112 336c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H112z"/>
            </svg>
        `
    } else if (element_name.toLowerCase().includes(".png") || element_name.toLowerCase().includes(".jpg") || element_name.toLowerCase().includes(".jpeg")) {
        inner += `
        <svg xmlns="http://www.w3.org/2000/svg" fill="#18a8ff"
                 class="bi bi-file-earmark-fill folderIconSVG" viewBox="0 0 384 512">
                 <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5s-8.2 8.6-14.2 8.6H216 176 128 80c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2 .2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z"/>
            </svg>
        `
    } else if (element_name.toLowerCase().includes(".txt") || element_name.toLowerCase().includes(".py") || element_name.toLowerCase().includes(".java") || element_name.toLowerCase().includes(".class") || element_name.toLowerCase().includes(".c") || element_name.toLowerCase().includes(".cpp") || element_name.toLowerCase().includes(".json")) {
        inner += `
        <svg xmlns="http://www.w3.org/2000/svg" fill="#18a8ff"
                 class="bi bi-file-earmark-fill folderIconSVG" viewBox="0 0 384 512">
                 <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM153 289l-31 31 31 31c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L71 337c-9.4-9.4-9.4-24.6 0-33.9l48-48c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM265 255l48 48c9.4 9.4 9.4 24.6 0 33.9l-48 48c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l31-31-31-31c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/>
            </svg>
        `
    } else if (element_name.toLowerCase().includes(".mp3") || element_name.toLowerCase().includes(".flac") || element_name.toLowerCase().includes(".wav")) {
        inner += `
        <svg xmlns="http://www.w3.org/2000/svg" fill="#18a8ff"
                 class="bi bi-file-earmark-fill folderIconSVG" viewBox="0 0 384 512">
                 <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zm2 226.3c37.1 22.4 62 63.1 62 109.7s-24.9 87.3-62 109.7c-7.6 4.6-17.4 2.1-22-5.4s-2.1-17.4 5.4-22C269.4 401.5 288 370.9 288 336s-18.6-65.5-46.5-82.3c-7.6-4.6-10-14.4-5.4-22s14.4-10 22-5.4zm-91.9 30.9c6 2.5 9.9 8.3 9.9 14.8V400c0 6.5-3.9 12.3-9.9 14.8s-12.9 1.1-17.4-3.5L113.4 376H80c-8.8 0-16-7.2-16-16V312c0-8.8 7.2-16 16-16h33.4l35.3-35.3c4.6-4.6 11.5-5.9 17.4-3.5zm51 34.9c6.6-5.9 16.7-5.3 22.6 1.3C249.8 304.6 256 319.6 256 336s-6.2 31.4-16.3 42.7c-5.9 6.6-16 7.1-22.6 1.3s-7.1-16-1.3-22.6c5.1-5.7 8.1-13.1 8.1-21.3s-3.1-15.7-8.1-21.3c-5.9-6.6-5.3-16.7 1.3-22.6z"/>
        </svg>
        `
    } else if (element_name.toLowerCase().includes(".mp4") || element_name.toLowerCase().includes(".mov") || element_name.toLowerCase().includes(".mpeg4")) {
        inner += `
        <svg xmlns="http://www.w3.org/2000/svg" fill="#18a8ff"
                 class="bi bi-file-earmark-fill folderIconSVG" viewBox="0 0 384 512">
                 <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 288c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V288zM300.9 397.9L256 368V304l44.9-29.9c2-1.3 4.4-2.1 6.8-2.1c6.8 0 12.3 5.5 12.3 12.3V387.7c0 6.8-5.5 12.3-12.3 12.3c-2.4 0-4.8-.7-6.8-2.1z"/>
        </svg>
        `
    } else if (element_name.split(".").length > 1) {
        inner += `
        <svg xmlns="http://www.w3.org/2000/svg" fill="#18a8ff"
                 class="bi bi-file-earmark-fill folderIconSVG" viewBox="0 0 384 512">
                 <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z"/>
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
    <span style="color: white;" class="folderPathFont">${element_name}</span>
    </div>
    
    <div onclick="on_click_move_element_in_edit_menu('${request_folder}', '${element_name}')" style="width: 90%; display: flex; justify-content: flex-start; align-items: center; gap: 40px; margin-left: 40px;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" class="bi bi-arrows-move editMenuSVG" viewBox="0 0 448 512">
        <path d="M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V64zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32H96v64c0 17.7 14.3 32 32 32s32-14.3 32-32V352c0-17.7-14.3-32-32-32H32zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H352V64zM320 320c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32s32-14.3 32-32V384h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320z"/>    
        </svg>
        <span style="color: white;" class="folderPathFont">Move</span>
    </div>
    
    <div onclick="on_click_rename_element_in_edit_menu('${request_folder}', '${element_name}')" style="width: 90%; display: flex; justify-content: flex-start; align-items: center; gap: 40px; margin-left: 40px;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" class="bi bi-pencil-square editMenuSVG" viewBox="0 0 512 512">
        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>    
        </svg>
        <span style="color: white;" class="folderPathFont">Rename</span>
    </div>
    
    <div onclick="on_click_share_element_in_edit_menu('${request_folder}', '${element_name}')" style="width: 90%; display: flex; justify-content: flex-start; align-items: center; gap: 40px; margin-left: 40px;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" class="bi bi-link-45deg editMenuSVG" viewBox="0 0 640 512">
            <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"/>
        </svg>
        <span style="color: white;" class="folderPathFont">Share</span>
    </div>
    
    <div onclick="delete_element('${request_folder}', '${element_name}')" style="width: 90%; display: flex; justify-content: flex-start; align-items: center; gap: 40px; margin-left: 40px;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" class="bi bi-trash editMenuSVG" viewBox="0 0 448 512">
            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>    
        </svg>
        <span style="color: white;" class="folderPathFont">Trash</span>
    </div>
    
    `

    if (!element_name.includes("trash") && !request_folder.includes("trash")) {
        let edit_menu = document.querySelector(".editMenu")
        edit_menu.style.display = "flex"
        edit_menu.innerHTML = inner
    } else if (request_folder.includes("trash")) {
        let inner = `<div style="width: 90%; display: flex; justify-content: flex-start; align-items: center; gap: 40px; margin-left: 40px;">
        <span style="color: white;" class="folderPathFont">${element_name}</span>
        </div>

            <div onclick="" style="width: 90%; display: flex; justify-content: flex-start; align-items: center; gap: 40px; margin-left: 40px;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" class="bi bi-trash editMenuSVG" viewBox="0 0 512 512">
                    <path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"/>    
                </svg>
                <span style="color: white;" class="folderPathFont">Restore</span>
            </div>
            <div onclick="" style="width: 90%; display: flex; justify-content: flex-start; align-items: center; gap: 40px; margin-left: 40px;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" class="bi bi-arrows-move editMenuSVG" viewBox="0 0 512 512">
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>    
                </svg>
                <span style="color: white;" class="folderPathFont">Delete</span>
            </div>

        `
        let edit_menu = document.querySelector(".editMenu")
        edit_menu.style.display = "flex"
        edit_menu.innerHTML = inner

    }
}

async function delete_element(request_folder, element_name) {
    await fetch(window.location.origin + "/drive/delete", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "path_element": request_folder + "/" + element_name
        })
    })

    window.location.reload()
}

function click_in_center(e) {
    document.querySelector(".addMenu").style.display = "none"
    if (e.target.id !== "edit_x" && e.currentTarget.id !== "edit_x") {
        document.querySelector(".editMenu").style.display = "none"
    }
    if (e.target.id !== "sideBar") {
        document.querySelector(".sideBar").style.display = "none"
    }
}

function on_modal_click(e) {
    if (e.target == e.currentTarget) {
        document.querySelector(".modal").style.display = "none"
    }
}

function on_click_add_button() {
    let add_menu = document.querySelector(".addMenu")
    if (add_menu.style.display === "none") {
        add_menu.style.display = "flex"
    } else {
        add_menu.style.display = "none"
    }
}

function on_click_new_folder_in_add_menu(request_folder) {
    let modal = document.querySelector(".modal")
    modal.style.display = "flex"
    let modal_content = document.querySelector(".modalContent")
    modal_content.innerHTML = `
    <h1 style="color: white; margin-bottom: 40px" class="folderPathFont">New Folder</h1>
    <input id="input_folder_name" type="text" placeholder="folder name" class="folderPathFont modalContentInput"/>
    <div style="width: 100%; margin-right: 0; display: flex; justify-content: flex-end; align-items: center; gap: 40px; margin-top: 40px;">
        <button onclick="on_click_cancel_in_folder_naming_menu()" class="folderPathFont" style="background-color: transparent; border: 0; color: #6752d1;">Cancel</button>
        <button onclick="on_click_save_in_folder_naming_menu('${request_folder}')" class="folderPathFont" style="background-color: transparent; border: 0; color: #6752d1;">Save</button>
    </div>
    `
}

async function rename_element(request_folder, old_name) {
    let input_rename = document.querySelector("#input_rename").value
    await fetch(window.location.origin + "/drive/rename", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "request_folder": request_folder,
            "old_name": old_name,
            "new_name": input_rename
        })
    })

    window.location.reload()
}

function on_click_rename_element_in_edit_menu(request_folder, element_name) {
    let modal = document.querySelector(".modal")
    modal.style.display = "flex"
    let modal_content = document.querySelector(".modalContent")
    modal_content.innerHTML = `
    <h1 style="color: white; margin-bottom: 40px" class="folderPathFont">Rename</h1>
    <input id="input_rename" type="text" value="${element_name}" class="folderPathFont modalContentInput"/>
    <div style="width: 100%; margin-right: 0; display: flex; justify-content: flex-end; align-items: center; gap: 40px; margin-top: 40px;">
        <button onclick="on_click_cancel_in_folder_naming_menu()" class="folderPathFont" style="background-color: transparent; border: 0; color: #6752d1;">Cancel</button>
        <button onclick="rename_element('${request_folder}', '${element_name}')" class="folderPathFont" style="background-color: transparent; border: 0; color: #6752d1;">Save</button>
    </div>
    `
}

function on_click_cancel_in_folder_naming_menu() {
    document.querySelector(".modal").style.display = "none"
    document.querySelector(".addMenu").style.display = "none"
    document.querySelector(".editMenu").style.display = "none"
}

function on_click_share_element_in_edit_menu(request_folder, element_name) {
    on_click_cancel_in_folder_naming_menu()

    fetch(window.location.origin + "/drive/share", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "element": request_folder + "/" + element_name
        })
    }).then(r => r.json()).then(js => {
        let modal = document.querySelector(".modal")
        modal.style.display = "flex"
        let modal_content = document.querySelector(".modalContent")
        modal_content.innerHTML = `
    <h1 style="color: white; margin-bottom: 40px" class="folderPathFont">Link</h1>
    <input id="input_rename" type="text" readonly="readonly" value="${window.location.origin}/drive/share?token=${js['token']}" class="folderPathFont modalContentInput"/>
    <div style="width: 100%; margin-right: 0; display: flex; justify-content: flex-end; align-items: center; gap: 40px; margin-top: 40px;">
        <button onclick="on_click_cancel_in_folder_naming_menu()" class="folderPathFont" style="background-color: transparent; border: 0; color: #6752d1;">Ok</button>
    </div>
    `
    })


}

async function on_click_save_in_folder_naming_menu(request_folder) {
    await fetch(window.location.origin + "/drive/newfolder", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "new_folder": request_folder + "/" + document.querySelector("#input_folder_name").value
        })
    })

    window.location.reload()
}

async function on_change_upload_file(request_folder) {
    let input_files = document.querySelector("#input_file").files
    document.querySelector(".addMenu").style.display = "none"

    let form_data = new FormData()
    for (let i = 0; i < input_files.length; i++) {
        form_data.append("file" + i, input_files[i])
    }
    form_data.append("path_folder", request_folder)

    document.querySelector("body").innerHTML = "<h1 style='font-size: 40px; color: white;'>Uploading...</h1>"

    await fetch(window.location.origin + "/drive/newfile", {
        method: "POST",
        body: form_data
    })

    window.location.reload()
}

async function logout() {
    await fetch(window.location.origin + "/logout", {
        method: "POST"
    })

    window.location.reload()
}

function on_click_open_sidebar() {
    document.querySelector(".sideBar").style.display = "flex"
}

window.addEventListener("dragenter", e => e.preventDefault())
window.addEventListener("dragstart", e => e.preventDefault())
window.addEventListener("dragend", e => e.preventDefault())
window.addEventListener("dragleave", e => e.preventDefault())
window.addEventListener("dragover", e => e.preventDefault())
window.addEventListener("drag", e => e.preventDefault())
window.addEventListener("drop", e => e.preventDefault())

async function on_drop(e, request_folder) {
    e.preventDefault()

    let form_data = new FormData()

    if (e.dataTransfer.items) {
        [...e.dataTransfer.items].forEach((item, i) => {
            if (item.kind === "file") {
                let file = item.getAsFile()
                form_data.append("file" + i, file)
            }
        })
        form_data.append("path_folder", request_folder)

        document.querySelector("body").innerHTML = "<h1 style='font-size: 40px; color: white;'>Uploading...</h1>"

        await fetch(window.location.origin + "/drive/newfile", {
            method: "POST",
            body: form_data
        })
        window.location.reload()
    }
}

function on_click_drive_in_bottom_nav() {
    window.location.replace(window.location.origin + "/drive")
}

function on_click_share_in_bottom_nav() {
    window.location.replace(window.location.origin + "/share")
}