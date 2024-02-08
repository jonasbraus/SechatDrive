window.addEventListener("load", function (ev)
{
    setTimeout(function ()
    {
        document.querySelector("body").style.display = "flex"
    }, 200)

    if (localStorage["move_origin"] !== "undefined" && localStorage["move_origin"] !== undefined)
    {
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

    try
    {
        document.querySelector(".center").scrollTop = localStorage["last_scroll"]
    } catch (error)
    {
        document.querySelector(".center").scrollTop = 0
    }

    document.querySelector(".addMenu").style.display = "none"
    document.querySelector(".editMenu").style.display = "none"
    document.querySelector(".sideBar").style.display = "none"
})

function on_click_folder(request_folder, folder_name)
{
    if (document.querySelector(".addMenu").style.display === "none" && document.querySelector(".editMenu").style.display === "none" &&
        document.querySelector(".sideBar").style.display === "none")
    {
        history.pushState({ path: window.location.href }, "", window.location.href)
        window.location.replace(window.location.origin + "/drive?folder=" + request_folder + "/" + folder_name)
        localStorage["last_scroll"] = 0

    }
}

function on_click_file(request_folder, file_name)
{
    if (document.querySelector(".addMenu").style.display === "none" && document.querySelector(".editMenu").style.display === "none" &&
        document.querySelector(".sideBar").style.display === "none")
    {
        history.pushState({ path: window.location.href }, "", window.location.href)
        window.location.replace(window.location.origin + "/drive/getfile?file=" + request_folder + "/" + file_name)
        localStorage["last_scroll"] = document.querySelector(".center").scrollTop
    }
}

async function on_click_move_here(element_name)
{
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

function on_click_move_element_in_edit_menu(request_folder, element_name)
{
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

function on_click_edit(request_folder, element_name)
{

    let edit_menu = document.querySelector(".editMenu")
    edit_menu.style.display = "flex"
    let inner = `<div style="width: 90%; display: flex; justify-content: flex-start; align-items: center; gap: 40px; margin-left: 40px;">`
    if (element_name.split(".").length > 1)
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
    <span style="color: white;" class="folderPathFont">${element_name}</span>
    </div>
    
    <div onclick="on_click_move_element_in_edit_menu('${request_folder}', '${element_name}')" style="width: 90%; display: flex; justify-content: flex-start; align-items: center; gap: 40px; margin-left: 40px;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" class="bi bi-arrows-move editMenuSVG" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10M.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8"/>
        </svg>
        <span style="color: white;" class="folderPathFont">Move</span>
    </div>
    
    <div onclick="on_click_rename_element_in_edit_menu('${request_folder}', '${element_name}')" style="width: 90%; display: flex; justify-content: flex-start; align-items: center; gap: 40px; margin-left: 40px;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" class="bi bi-pencil-square editMenuSVG" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
        </svg>
        <span style="color: white;" class="folderPathFont">Rename</span>
    </div>
    
    <div style="width: 90%; display: flex; justify-content: flex-start; align-items: center; gap: 40px; margin-left: 40px;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" class="bi bi-link-45deg editMenuSVG" viewBox="0 0 16 16">
            <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
            <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
        </svg>
        <span style="color: white;" class="folderPathFont">Share</span>
    </div>
    
    <div onclick="delete_element('${request_folder}', '${element_name}')" style="width: 90%; display: flex; justify-content: flex-start; align-items: center; gap: 40px; margin-left: 40px;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" class="bi bi-trash editMenuSVG" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
        </svg>
        <span style="color: white;" class="folderPathFont">Trash</span>
    </div>
    
    `

    edit_menu.innerHTML = inner
}

async function delete_element(request_folder, element_name)
{
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

function click_in_center(e)
{
    document.querySelector(".addMenu").style.display = "none"
    if (e.target.id !== "edit_x")
    {
        document.querySelector(".editMenu").style.display = "none"
    }
    if (e.target.id !== "sideBar")
    {
        document.querySelector(".sideBar").style.display = "none"
    }
}

function on_click_add_button()
{
    let add_menu = document.querySelector(".addMenu")
    if (add_menu.style.display === "none")
    {
        add_menu.style.display = "flex"
    } else
    {
        add_menu.style.display = "none"
    }
}

function on_click_new_folder_in_add_menu(request_folder)
{
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

async function rename_element(request_folder, old_name)
{
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

function on_click_rename_element_in_edit_menu(request_folder, element_name)
{
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

function on_click_cancel_in_folder_naming_menu()
{
    document.querySelector(".modal").style.display = "none"
    document.querySelector(".addMenu").style.display = "none"
    document.querySelector(".editMenu").style.display = "none"
}

async function on_click_save_in_folder_naming_menu(request_folder)
{
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

async function on_change_upload_file(request_folder)
{
    let input_files = document.querySelector("#input_file").files
    document.querySelector(".addMenu").style.display = "none"

    let form_data = new FormData()
    for (let i = 0; i < input_files.length; i++)
    {
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

async function logout()
{
    await fetch(window.location.origin + "/logout", {
        method: "POST"
    })

    window.location.reload()
}

function on_click_open_sidebar()
{
    document.querySelector(".sideBar").style.display = "flex"
}

window.addEventListener("dragenter", e => e.preventDefault())
window.addEventListener("dragstart", e => e.preventDefault())
window.addEventListener("dragend", e => e.preventDefault())
window.addEventListener("dragleave", e => e.preventDefault())
window.addEventListener("dragover", e => e.preventDefault())
window.addEventListener("drag", e => e.preventDefault())
window.addEventListener("drop", e => e.preventDefault())

async function on_drop(e, request_folder)
{
    e.preventDefault()

    let form_data = new FormData()

    if (e.dataTransfer.items)
    {
        [...e.dataTransfer.items].forEach((item, i) =>
        {
            if (item.kind === "file")
            {
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