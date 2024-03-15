import json
import os
import requests

os.chdir(os.path.dirname(__file__))
config = json.loads(open("./config.json").read())


def check_login():
    global config
    url = f"{config['weburl']}/connector/checklogin"
    response = requests.request(method="GET", url=url, cookies=config["cookies"] if "cookies" in config else {})
    return response.json()["success"]


def login():
    global config
    url = f"{config['weburl']}/login/credentials"
    response = requests.request(
        method="POST",
        url=url,
        headers={
            "content-type": "application/json"
        },
        data=json.dumps({
            "mail": config["username"],
            "password": config["password"]
        })
    )
    if response.status_code == 200:
        with open("./config.json", "w") as config_file:
            config["cookies"] = {"token": response.cookies.get("token")}
            config_file.write(json.dumps(config, indent="\t"))


def get_structure():
    global config
    url = f"{config['weburl']}/connector/structure"
    response = requests.request(
        method="GET",
        url=url,
        cookies=config["cookies"]
    )

    return response.json()


def get_file(rel_path):
    global config
    url = f"{config['weburl']}/connector/getfile"
    response = requests.request(
        method="POST",
        url=url,
        headers={
            "content-type": "application/json"
        },
        data=json.dumps({
            "rel_path": rel_path
        }),
        cookies=config["cookies"]
    )
    return response.content


def download_drive_content(base, struct):
    global config
    if type(struct) is dict:
        for key in struct:
            rel_path = f"{base}/{key}".replace("//", "/").replace("remote/", "")
            abs_path = f"{config['localpath']}/{rel_path}"
            is_file = "." in abs_path.split("/")[len(abs_path.split("/")) - 1]
            if not is_file and not os.path.exists(abs_path) and "~" not in abs_path:
                os.mkdir(abs_path)
                print("created folder:", abs_path)

            if is_file and not os.path.exists(abs_path) and "~" not in abs_path:
                with open(abs_path, "wb") as file:
                    file.write(get_file(rel_path))
                    print(rel_path, "downloaded")

            download_drive_content(f"{base}/{key}".replace("//", "/"), struct[key])


if not check_login():
    login()


structure = get_structure()
download_drive_content("remote/", structure)
