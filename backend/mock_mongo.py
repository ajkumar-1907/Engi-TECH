import os
import json
import re
import uuid
from bson import ObjectId
from datetime import datetime, timezone

class MockCursor:
    def __init__(self, data):
        self.data = data
        
    async def to_list(self, length):
        return self.data[:length]

class MockCollection:
    def __init__(self, db, name):
        self.db = db
        self.name = name
        
    def _get_data(self):
        return self.db._load_collection(self.name)
        
    def _save_data(self, data):
        self.db._save_collection(self.name, data)
        
    async def create_index(self, keys, unique=False):
        pass
        
    async def count_documents(self, query):
        data = self._get_data()
        count = 0
        for doc in data:
            if self._matches(doc, query):
                count += 1
        return count
        
    async def find_one(self, query, projection=None):
        data = self._get_data()
        for doc in data:
            if self._matches(doc, query):
                return self._apply_projection(doc, projection)
        return None
        
    def find(self, query=None, projection=None):
        query = query or {}
        data = self._get_data()
        results = []
        for doc in data:
            if self._matches(doc, query):
                results.append(self._apply_projection(doc, projection))
        return MockCursor(results)
        
    async def insert_one(self, doc):
        data = self._get_data()
        if "_id" not in doc:
            doc["_id"] = str(ObjectId())
        else:
            doc["_id"] = str(doc["_id"])
        data.append(doc)
        self._save_data(data)
        return doc
        
    async def insert_many(self, docs):
        data = self._get_data()
        for doc in docs:
            if "_id" not in doc:
                doc["_id"] = str(ObjectId())
            else:
                doc["_id"] = str(doc["_id"])
            data.append(doc)
        self._save_data(data)
        return docs
        
    async def update_one(self, query, update, upsert=False):
        data = self._get_data()
        matched = False
        set_fields = update.get("$set", {})
        
        for i, doc in enumerate(data):
            if self._matches(doc, query):
                matched = True
                new_doc = dict(doc)
                for k, v in set_fields.items():
                    new_doc[k] = v
                data[i] = new_doc
                self._save_data(data)
                class UpdateResult:
                    matched_count = 1
                    modified_count = 1
                return UpdateResult()
                
        if upsert:
            new_doc = {}
            for k, v in query.items():
                if not k.startswith("$"):
                    new_doc[k] = v
            for k, v in set_fields.items():
                new_doc[k] = v
            await self.insert_one(new_doc)
            class UpdateResult:
                matched_count = 0
                modified_count = 1
            return UpdateResult()
            
        class UpdateResult:
            matched_count = 0
            modified_count = 0
        return UpdateResult()
        
    async def delete_many(self, query):
        data = self._get_data()
        original_len = len(data)
        data = [doc for doc in data if not self._matches(doc, query)]
        self._save_data(data)
        class DeleteResult:
            deleted_count = original_len - len(data)
        return DeleteResult()

    async def delete_one(self, query):
        data = self._get_data()
        for i, doc in enumerate(data):
            if self._matches(doc, query):
                data.pop(i)
                self._save_data(data)
                class DeleteResult:
                    deleted_count = 1
                return DeleteResult()
        class DeleteResult:
            deleted_count = 0
        return DeleteResult()
        
    def _matches(self, doc, query):
        for k, v in query.items():
            if k == "$or":
                or_matched = False
                for sub_query in v:
                    if self._matches(doc, sub_query):
                        or_matched = True
                        break
                if not or_matched:
                    return False
                continue
                
            if k not in doc:
                return False
                
            val = doc[k]
            if isinstance(v, dict):
                if "$regex" in v:
                    pattern = v["$regex"]
                    options = v.get("$options", "")
                    flags = 0
                    if "i" in options:
                        flags |= re.IGNORECASE
                    if not re.search(pattern, str(val), flags):
                        return False
                elif "$in" in v:
                    if val not in v["$in"]:
                        return False
            elif isinstance(v, ObjectId):
                if str(val) != str(v):
                    return False
            else:
                if str(val) != str(v):
                    return False
        return True
        
    def _apply_projection(self, doc, projection):
        if not projection:
            return doc
        new_doc = dict(doc)
        for k, v in projection.items():
            if v == 0:
                new_doc.pop(k, None)
        return new_doc

class MockDatabase:
    def __init__(self, file_path):
        self.file_path = file_path
        if not os.path.exists(file_path):
            with open(file_path, "w") as f:
                json.dump({}, f)
                
    def _load_all(self):
        try:
            with open(self.file_path, "r") as f:
                return json.load(f)
        except Exception:
            return {}
            
    def _save_all(self, data):
        with open(self.file_path, "w") as f:
            def default_serializer(obj):
                if isinstance(obj, datetime):
                    return obj.isoformat()
                if isinstance(obj, ObjectId):
                    return str(obj)
                raise TypeError(f"Type {type(obj)} not serializable")
            json.dump(data, f, default=default_serializer, indent=2)
            
    def _load_collection(self, name):
        all_data = self._load_all()
        docs = all_data.get(name, [])
        for doc in docs:
            for k in ["created_at", "updated_at", "last_attempt", "locked_until"]:
                if k in doc and isinstance(doc[k], str):
                    try:
                        doc[k] = datetime.fromisoformat(doc[k])
                    except ValueError:
                        pass
        return docs
        
    def _save_collection(self, name, docs):
        all_data = self._load_all()
        all_data[name] = docs
        self._save_all(all_data)
        
    def __getitem__(self, name):
        return MockCollection(self, name)
        
    def __getattr__(self, name):
        return MockCollection(self, name)

class MockAdmin:
    async def command(self, cmd):
        if cmd == "ping":
            return {"ok": 1.0}
        raise NotImplementedError()

class MockAsyncIOMotorClient:
    def __init__(self, uri=None, **kwargs):
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        self.db_file = os.path.join(backend_dir, "mock_db.json")
        self.admin = MockAdmin()
        
    def __getitem__(self, name):
        return MockDatabase(self.db_file)
        
    def close(self):
        pass
