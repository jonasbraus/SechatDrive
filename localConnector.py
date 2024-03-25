import json
import os
import requests
import datetime

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

class Change:
    def __init__(self, date, rel_path, change_type, local):
        self.date = date
        self.rel_path = rel_path
        self.change_type = change_type
        self.local = local

class change_types:
    created = 0
    updated = 1
    deleted = 3

def set_last_change_check():
    config["last_change_check"] = datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S-%f")
    with open("./config.json", "w") as file:
        file.write(json.dumps(config, indent="\t"))
        
def get_last_change_check():
    if "last_change_check" in config:
        return datetime.datetime.strptime(config["last_change_check"], "%Y-%m-%d-%H-%M-%S-%f")
    return datetime.datetime(2000, 1, 1)

def create_single_file(rel_path):
    abs_path = f"{config['localpath']}/{rel_path}"
    if "." in rel_path.split("/")[len(rel_path.split("/"))-1]:
        with open(abs_path, "wb") as file:
            file.write(get_file(rel_path))
            print(rel_path, "downloaded")
    else:
        os.mkdir(abs_path)
        print("folder", rel_path, "created")

def delete_single_file(rel_path):
    abs_path = f"{config['localpath']}/{rel_path}"
    os.remove(abs_path)
    print(rel_path, "deleted")

def apply_changes(changes):
    if changes is None:
        return
    
    all_changes = []
    for key in changes:
        change = changes[key]
        all_changes.append(Change(datetime.datetime.strptime(key, "%Y-%m-%d-%H-%M-%S-%f"), change["file"], change["change_type"], False))
    all_changes = sorted(all_changes, key=lambda x: x.date)
    
    change_type_function_mapping = {
        change_types.created: lambda x: create_single_file(x),
        change_types.deleted: lambda x: delete_single_file(x)
    }
    
    for change in all_changes:
        if change.date > get_last_change_check():
            change_type_function_mapping[change.change_type](change.rel_path)
            
    set_last_change_check()

if not check_login():
    login()

    

structure = get_structure()
if len(os.listdir(config["localpath"])) <= 0:
    download_drive_content("remote/", structure)
else:
    apply_changes(requests.request(
        method="GET",
        url=f"{config['weburl']}/connector/changes",
        cookies=config["cookies"]
    ).json()["changes"])
