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
    
def add_local_change(user_id, file, change_type):
    path = f"{base_path}/{user_id}.json"
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
        
        
def get_change_log(user_id):
    path = f"{base_path}/{user_id}.json"
    if os.path.exists(path):
        js = json.loads(open(path, "r").read())
        return js
    return None