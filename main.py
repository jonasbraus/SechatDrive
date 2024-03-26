import io
import json
import os
import shutil
import re
import subprocess
import threading
import versionhandler

from PIL import Image, ImageOps
from flask import Flask, render_template, send_file, request, redirect, Response

import database
import login_handler

app = Flask(__name__)


@app.route('/')
def home():
    return redirect('/drive')


@app.route("/login", methods=["GET"])
def page_login():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is not None:
        return redirect("/drive")

    return render_template("login.html")


@app.route("/login/credentials", methods=["POST"])
def page_login_credentials():
    js = request.json
    mail = js["mail"].lower()
    password = js["password"]

    user = database.get_user_by_mail_and_password(mail, password)

    token = login_handler.login_user(user)

    resp = Response()
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.set_cookie("token", token, max_age=365 * 24 * 60 * 60)
    return resp


@app.route("/logout", methods=["POST"])
def logout():
    login_handler.logout_user(request.cookies.get("token"))
    return "success"


@app.route("/drive", methods=["GET"])
def page_drive():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is None:
        return redirect("/login")
    user_id = user.user_id

    if not os.path.isdir(f"./drive/{user_id}"):
        os.mkdir(f"./drive/{user_id}")

    request_folder = request.args.get(
        "folder") if request.args.get("folder") is not None else ""
    path = f"./drive/{user_id}/{request_folder}"

    directory = os.listdir(path)
    directory = sorted(directory)

    process = subprocess.run(["du", "-h", f"./drive/{user_id}"], capture_output=True, text=True)
    size = process.stdout.split()[len(process.stdout.split()) - 2]

    return render_template("drive.html", directory=directory, request_folder=request_folder, size=size)


@app.route("/sharefolder", methods=["GET"])
def page_sharefolder():
    try:
        token = request.args.get("token")
        base = database.get_element_by_token(token)
        request_folder = request.args.get(
            "folder") if request.args.get("folder") is not None else ""

        path = f"{base}/{request_folder}".replace("//", "/")

        directory = os.listdir(path)
        directory = sorted(directory)
        return render_template("share_folder.html", directory=directory, request_folder=request_folder, token=token)
    except:
        return "not valid"


@app.route("/share", methods=["GET"])
def page_shares():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is None:
        return redirect("/login")
    user_id = user.user_id

    rows = database.get_shares_for_user(user_id)

    result = []
    tokens = []
    for row in rows:
        result.append(row[2].replace(f"./drive/{user_id}/", ""))
        tokens.append(database.get_token_by_element(row[2]))

    process = subprocess.run(["du", "-h", f"./drive/{user_id}"], capture_output=True, text=True)
    size = process.stdout.split()[len(process.stdout.split()) - 2]
    return render_template("share.html", directory=result, tokens=tokens, size=size)


@app.route("/drive/getfile", methods=["GET"])
def drive_get_file():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is None:
        return redirect("/login")
    user_id = user.user_id

    request_file = request.args.get("file")
    path = f"./drive/{user_id}/{request_file}"

    return send_file(path)


@app.route("/drive/newfolder", methods=["POST"])
def drive_newfolder():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is None:
        return redirect("/login")
    user_id = user.user_id

    js = request.json
    new_folder = js["new_folder"]

    path = f"./drive/{user_id}/{new_folder}"
    os.mkdir(path)
    versionhandler.add_local_change(user_id, f"/{new_folder}".replace("//", "/"), versionhandler.change_types.created)

    return "success"


@app.route("/drive/newfile", methods=["POST"])
def drive_newfile():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is None:
        return redirect("/login")
    user_id = user.user_id

    files = request.files
    path_folder = request.form.get("path_folder")

    for name in files:
        file = files[name]
        file_name = file.filename
        file.save(f"./drive/{user_id}/{path_folder}/{file_name}".replace("//", "/"))
        versionhandler.add_local_change(user_id, f"/{path_folder}/{file_name}".replace("//", "/"), versionhandler.change_types.created)


    return "success"


@app.route("/drive/delete", methods=["POST"])
def drive_delete():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is None:
        return redirect("/login")
    user_id = user.user_id

    js = request.json
    path_element = js["path_element"]

    path = f"./drive/{user_id}/{path_element}"

    test = path_element.replace("/", "|")

    if not os.path.isdir(f"./drive/{user_id}/~trash".replace("//", "/")):
        os.mkdir(f"./drive/{user_id}/~trash".replace("//", "/"))

    shutil.move(path, f"./drive/{user_id}/~trash/{test}".replace("//", "/"))

    versionhandler.add_local_change(user_id, f"/{path_element}".replace("//", "/"), versionhandler.change_types.deleted)

    return "success"


@app.route("/drive/deleteperm", methods=["POST"])
def drive_deleteperm():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is None:
        return redirect("/login")
    user_id = user.user_id

    js = request.json

    element = js["element"]

    base_path = f"./drive/{user_id}/~trash/"

    if "." in element:
        os.remove(f"{base_path}/{element}".replace("//", "/"))
    else:
        shutil.rmtree(f"{base_path}/{element}".replace("//", "/"))

    return "success"


@app.route("/drive/restore", methods=["POST"])
def drive_restore():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is None:
        return redirect("/login")
    user_id = user.user_id

    js = request.json
    element = js["element"]
    base = f"./drive/{user_id}/~trash"
    path = f"{base}/{element}"

    restore_path = f"./drive/{user_id}/{element.replace('|', '/')}".replace("//", "/")

    shutil.move(path, restore_path)
    versionhandler.add_local_change(user_id, f"/{element.replace('|', '/')}".replace("//", "/"), versionhandler.change_types.created)

    return "success"


@app.route("/drive/rename", methods=["POST"])
def drive_rename():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is None:
        return redirect("/login")
    user_id = user.user_id

    js = request.json

    request_folder = js["request_folder"]
    old_name = js["old_name"]
    new_name = js["new_name"]

    base_path = f"./drive/{user_id}"

    database.update_share_element(
        f"{base_path}/{request_folder}/{old_name}", f"{base_path}/{request_folder}/{new_name}")

    while os.path.exists(f"{base_path}/{request_folder}/{new_name}"):
        if "." in new_name:
            new_name = new_name.split(".")[0] + "1." + new_name.split(".")[1]
        else:
            new_name += "1"

    os.rename(f"{base_path}/{request_folder}/{old_name}",
              f"{base_path}/{request_folder}/{new_name}")
    versionhandler.add_local_change(user_id, f"/{request_folder}/{old_name}".replace("//", "/"), versionhandler.change_types.deleted)
    versionhandler.add_local_change(user_id, f"/{request_folder}/{new_name}".replace("//", "/"), versionhandler.change_types.created)
    return "success"


@app.route("/drive/move", methods=["POST"])
def drive_move():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is None:
        return redirect("/login")
    user_id = user.user_id

    js = request.json

    original_location = js["original_location"]
    target_location = js["target_location"]

    base = f"./drive/{user_id}"

    database.update_share_element(
        f"{base}/{original_location}", f"{base}/{target_location}")

    shutil.move(f"{base}/{original_location}", f"{base}/{target_location}")
    
    versionhandler.add_local_change(user_id, original_location, versionhandler.change_types.deleted)
    versionhandler.add_local_change(user_id, target_location, versionhandler.change_types.created)
    return "success"


@app.route("/drive/share", methods=["POST"])
def drive_share():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is None:
        return redirect("/login")
    user_id = user.user_id

    js = request.json
    element = js["element"]
    base = f"./drive/{user_id}"

    token = database.get_token_by_element(base + "/" + element)
    if token is None:
        token = login_handler.generate_token()
        database.add_share_element(token, f"{base}/{element}", user_id)

    # if "." not in element.split("/")[len(element.split("/")) - 2]:
    #     zip_file = f"./drive/{token}"
    #     shutil.make_archive(zip_file, "zip", base + "/" + element)

    return Response(response=json.dumps({
        "token": token
    }))


@app.route("/drive/stopshare", methods=["POST"])
def drive_stopshare():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is None:
        return redirect("/login")
    user_id = user.user_id

    js = request.json
    element = js["element"]
    base = f"./drive/{user_id}"

    database.stop_share(f"{base}/{element}")

    return "success"


@app.route("/drive/share", methods=["GET"])
def drive_get_share():
    try:
        token = request.args.get("token")

        element = database.get_element_by_token(token)

        if "." in element[2:]:
            return send_file(element)

        return redirect(f"/sharefolder?token={token}")
    except:
        return "not valid"


@app.route("/drive/sharefolder/file", methods=["GET"])
def drive_get_share_file():
    try:
        token = request.args.get("token")
        file = request.args.get("file")
        base = database.get_element_by_token(token)

        path = f"{base}/{file}".replace("//", "/")

        return send_file(path)
    except:
        return "not valid"


def delete_temp_zip(arg1, *kwa):
    os.remove(arg1)


@app.route("/drive/sharefolder/download", methods=["GET"])
def drive_get_share_folder_download():
    try:
        token = request.args.get("token")
        element = database.get_element_by_token(token)

        zip_file = f"./drive/{token}"
        if not os.path.exists(zip_file + ".zip"):
            shutil.make_archive(zip_file, "zip", f"{element}")
            threading.Timer(1600, delete_temp_zip, args=(zip_file + ".zip",)).start()
        return send_file(f"./drive/{token}.zip", as_attachment=True)
    except:
        return "not valid"


# local connector
@app.route("/connector/checklogin", methods=["GET"])
def checklogin():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)

    resp = Response()
    resp.response = json.dumps({
        "success": user is not None
    })
    return resp


def list_dir(directory):
    result = {
    }
    for folder in os.listdir(directory):
        if os.path.isdir(f"{directory}/{folder}"):
            result[f"{folder}"] = list_dir(f"{directory}/{folder}")
        else:
            result[f"{folder}"] = folder
    return result


@app.route("/connector/structure", methods=["GET"])
def connector_get_structure():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)

    if user is None:
        return Response(response=json.dumps({"message": "user login not valid!"}))

    base_dir = f"./drive/{user.user_id}".replace("//", "/").replace("..", "")
    result = list_dir(base_dir)
    return Response(response=json.dumps(result))


@app.route("/connector/getfile", methods=["POST"])
def connector_get_file():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is None:
        return Response(response=json.dumps({"message": "user login not valid!"}))

    base_dir = f"./drive/{user.user_id}".replace("//", "/").replace("..", "")
    js = request.json
    rel_path = js["rel_path"]
    return send_file(f"{base_dir}/{rel_path}".replace("//", "/").replace("..", ""))

@app.route("/connector/changes", methods=["GET"])
def connector_get_changes():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is None:
        return {"message": "user login not valid!"}
    
    return {"changes": versionhandler.get_change_log(user.user_id)}

@app.route("/connector/create/file", methods=["POST"])
def connector_create():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is None:
        return {"message": "user login not valid!"}
    
    files = request.files
    for key in files:
        print(key)
        
    return {"message": "created"}

@app.route("/connector/delete", methods=["POST"])
def connector_delete():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is None:
        return {"message": "user login not valid!"}
    user_id = user.user_id
    
    js = request.json
    rel_path = js["rel_path"]
    path = f"./drive/{user.user_id}/{rel_path}".replace("//", "/").replace("..", "")
    
    test = rel_path.replace("/", "|")
    if not os.path.isdir(f"./drive/{user_id}/~trash".replace("//", "/")):
        os.mkdir(f"./drive/{user_id}/~trash".replace("//", "/"))

    shutil.move(path, f"./drive/{user_id}/~trash/{test}".replace("//", "/"))
    return {"message": "deleted"}

@app.route("/manifest.webmanifest", methods=["GET"])
def get_manifest():
    return send_file("manifest.webmanifest", mimetype="application/manifest+json")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
    # app.run()
