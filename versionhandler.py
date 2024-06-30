base_path = "./version"
import os
import json
import datetime

class change_types:
    created = 0
    updated = 1
    deleted = 3
    moved = 4
    rename = 5
    
def register_device_if_not_exist(user_id, device_name):
    path = f"{base_path}/{user_id}/registereddevices.json"
    js = {}
    if os.path.exists(path):
        js = json.loads(open(path, "r").read())
    
    if not os.path.exists(f"./version/{user_id}"):
        os.mkdir(f"./version/{user_id}")
    
    if not device_name in js:
        js[device_name] = device_name
        with open(path, "w") as file:
            file.write(json.dumps(js, indent="\t"))
        
def add_local_change_except(user_id, device_name, file, change_type):
    path = f"{base_path}/{user_id}/registereddevices.json"
    if not os.path.exists(path):
        return
    
    js = json.loads(open(path, "r").read())
    for key in js:
        if key.lower() != device_name.lower():
            add_local_change(user_id, key, file, change_type)
    
def add_local_change_all(user_id, file, change_type):
    path = f"{base_path}/{user_id}/registereddevices.json"
    if not os.path.exists(path):
        return
    
    js = json.loads(open(path, "r").read())
    for key in js:
        add_local_change(user_id, key, file, change_type)
    
def add_local_change(user_id, device_name, file, change_type):
    path = f"{base_path}/{user_id}/{device_name}.json"
    js = {}
    if os.path.exists(path):
        js = json.loads(open(path, "r").read())
        
    current_time = datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S-%f")
    js[current_time] = {
        "file": file,
        "change_type": change_type
    }
    
    with open(path, "w") as file:
        file.write(json.dumps(js, indent="\t"))
        
        
def get_change_log(user_id, device_name):
    path = f"{base_path}/{user_id}/{device_name}.json"
    if os.path.exists(path):
        js = json.loads(open(path, "r").read())
        return js
    return None