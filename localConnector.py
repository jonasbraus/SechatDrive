import json
import os
import time
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
    try:
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
    except:
        return None


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
                    try:
                        file.write(get_file(rel_path))
                    except:
                        pass
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
            try:
                file.write(get_file(rel_path))
            except:
                pass
            print(rel_path, "downloaded")
    else:
        os.mkdir(abs_path)
        print("folder", rel_path, "created")

def delete_single_file(rel_path):
    try:
        abs_path = f"{config['localpath']}/{rel_path}"
        if "." in rel_path.split("/")[len(rel_path.split("/"))-1]:
            os.remove(abs_path)
        else:
            os.rmdir(abs_path)
        print(rel_path, "deleted")
    except:
        pass

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

def list_dir(directory):
    result = {
    }
    for folder in os.listdir(directory):
        if os.path.isdir(f"{directory}/{folder}"):
            result[f"{folder}"] = list_dir(f"{directory}/{folder}")
        else:
            result[f"{folder}"] = os.path.getmtime(f"{directory}/{folder}")
    return result

all_changes = []
def get_changes_in_dir(old_changes, new_changes, rel_path, system_path):
    global all_changes
    
    # check for updated files
    for key in new_changes:
        if not os.path.isdir(f"{system_path}/{key}") and key in old_changes:
            if new_changes[key] > old_changes[key]:
                # all_changes.append(Change(None, f"{rel_path}/{key}", change_types.deleted, True))
                all_changes.append(Change(None, f"{rel_path}/{key}", change_types.created, True))
    
    # check for deleted local folders
    for key in old_changes:
        if key not in new_changes:
            all_changes.append(Change(None, f"{rel_path}/{key}", change_types.deleted, True))
    
    for key in new_changes:
        # check for new local folders
        if key not in old_changes:
            all_changes.append(Change(None, f"{rel_path}/{key}", change_types.created, True))
        elif os.path.isdir(f"{system_path}/{key}".replace("//", "/")):
            get_changes_in_dir(old_changes[key], new_changes[key], f"{rel_path}/{key}".replace("//","/"), f"{system_path}/{key}".replace("//", "/"))
    
def process_changes(changes):
    global all_changes
    for change in changes:
        sys_path = f"{config['localpath']}/{change.rel_path}".replace("//", "/")
        if change.change_type == change_types.created:
            
            try:
                requests.request(
                    method="POST",
                    url=f"{config['weburl']}/connector/create",
                    headers={
                        "content-type": "application/json"
                    },
                    json={
                        "rel_path": change.rel_path,
                        "data": open(sys_path, "rb").read() if not os.path.isdir(sys_path) else None
                    },
                    cookies=config["cookies"]
                )
                print("create", change.rel_path, "online")
            except:
                pass
        if change.change_type == change_types.deleted:
            
            requests.request(
                method="POST",
                url=f"{config['weburl']}/connector/delete",
                headers={
                    "content-type": "application/json"
                },
                json={
                    "rel_path": change.rel_path
                },
                cookies=config["cookies"]
            )
            print("deleted", change.rel_path, "online")
            
    with open("./changelog.json", "w") as file:
            file.write(json.dumps(list_dir(config["localpath"]), indent="\t"))
    all_changes = []

while True:
    if not check_login():
        login()

    old_changes = None
    with open("./changelog.json", "r") as file:
        old_changes = json.loads(file.read())
        
    new_changes = list_dir(config["localpath"])

    if os.path.exists("./changelog.json"):
        get_changes_in_dir(old_changes, new_changes, "/", config["localpath"])
    else:
        with open("./changelog.json", "w") as file:
            file.write(json.dumps(list_dir(config["localpath"]), indent="\t"))
            
    process_changes(all_changes)
            
    structure = get_structure()
    if len(os.listdir(config["localpath"])) <= 0:
        download_drive_content("remote/", structure)
    else:
        apply_changes(requests.request(
            method="GET",
            url=f"{config['weburl']}/connector/changes",
            cookies=config["cookies"]
        ).json()["changes"])
        
    time.sleep(10)
    
# dir_list = list_dir(config["localpath"])
# with open("./test.json", "w") as file:
#     file.write(json.dumps(dir_list, indent="\t"))
