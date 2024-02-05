import os
import shutil

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
    print(user)
    token = login_handler.login_user(user)

    resp = Response()
    resp.set_cookie("token", token, max_age=365*24*60*60)
    return resp


@app.route("/drive", methods=["GET"])
def page_drive():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is None:
        return redirect("/login")
    user_id = user.user_id

    if not os.path.isdir(f"./drive/{user_id}"):
        os.mkdir(f"./drive/{user_id}")

    request_folder = request.args.get("folder") if request.args.get("folder") is not None else ""
    path = f"./drive/{user_id}/{request_folder}"

    directory = os.listdir(path)
    directory = sorted(directory)

    return render_template("drive.html", directory=directory, request_folder=request_folder)


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

    return "success"


@app.route("/drive/newfile", methods=["POST"])
def drive_newfile():
    token = request.cookies.get("token")
    user = login_handler.get_user_by_token(token)
    if user is None:
        return redirect("/login")
    user_id = user.user_id

    path_folder = request.form["path_folder"]
    print(path_folder)

    files = request.files

    for name in files:
        file = files[name]
        file_name = file.filename

        while os.path.exists(f"./drive/{user_id}{path_folder}/{file_name}"):
            file_name = file_name.split(".")[0] + "1." + file_name.split(".")[1]

        file.save(f"./drive/{user_id}{path_folder}/{file_name}")

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

    if "." in path_element.split("/")[len(path_element.split("/")) - 1]:
        os.remove(path)
    else:
        shutil.rmtree(path)

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

    while os.path.exists(f"{base_path}/{request_folder}/{new_name}"):
        if "." in new_name:
            new_name = new_name.split(".")[0] + "1." + new_name.split(".")[1]
        else:
            new_name += "1"

    os.rename(f"{base_path}/{request_folder}/{old_name}", f"{base_path}/{request_folder}/{new_name}")
    return "success"


@app.route("/manifest.webmanifest", methods=["GET"])
def get_manifest():
    return send_file("manifest.webmanifest", mimetype="application/manifest+json")


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
    # app.run()
