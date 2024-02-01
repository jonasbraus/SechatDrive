import os
import shutil

from flask import Flask, render_template, send_file, request

app = Flask(__name__)

@app.route("/login", methods=["GET"])
def page_login():
    return render_template("login.html")

@app.route("/drive", methods=["GET"])
def page_drive():
    user_id = 1

    request_folder = request.args.get("folder") if request.args.get("folder") is not None else ""
    path = f"./drive/{user_id}/{request_folder}"

    directory = os.listdir(path)
    directory = sorted(directory)

    return render_template("drive.html", directory=directory, request_folder=request_folder)


@app.route("/drive/getfile", methods=["GET"])
def drive_get_file():
    user_id = 1

    request_file = request.args.get("file")
    path = f"./drive/{user_id}/{request_file}"

    return send_file(path)


@app.route("/drive/newfolder", methods=["POST"])
def drive_newfolder():
    user_id = 1

    js = request.json
    new_folder = js["new_folder"]

    path = f"./drive/{user_id}/{new_folder}"
    os.mkdir(path)

    return "success"


@app.route("/drive/newfile", methods=["POST"])
def drive_newfile():
    user_id = 1

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
    user_id = 1

    js = request.json
    path_element = js["path_element"]

    path = f"./drive/{user_id}/{path_element}"

    if "." in path_element.split("/")[len(path_element.split("/"))-1]:
        os.remove(path)
    else:
        shutil.rmtree(path)

    return "success"


@app.route("/manifest.webmanifest", methods=["GET"])
def get_manifest():
    return send_file("manifest.webmanifest", mimetype="application/manifest+json")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
