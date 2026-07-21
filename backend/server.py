from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
try:
    from motor.motor_asyncio import AsyncIOMotorClient
except ImportError:
    AsyncIOMotorClient = None
from bson import ObjectId
import os
import logging
import re
from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import secrets

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
use_mock = False

if AsyncIOMotorClient is None:
    use_mock = True
elif "cluster0.fun0itq.mongodb.net" in mongo_url:
    use_mock = True
else:
    # If using local default mongo, check if port is open
    if mongo_url.startswith("mongodb://localhost") or mongo_url.startswith("mongodb://127.0.0.1"):
        import socket
        try:
            port = 27017
            # Parse port from URL if specified
            match = re.search(r':(\d+)', mongo_url.replace("mongodb://", ""))
            if match:
                port = int(match.group(1))
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(0.5)
            s.connect(('127.0.0.1', port))
            s.close()
        except Exception:
            use_mock = True

if use_mock:
    from backend.mock_mongo import MockAsyncIOMotorClient
    client = MockAsyncIOMotorClient(mongo_url)
    logging.info("Using mock MongoDB driver because local/remote MongoDB is unavailable.")
else:
    try:
        client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=1000)
    except Exception as e:
        from mock_mongo import MockAsyncIOMotorClient
        client = MockAsyncIOMotorClient(mongo_url)
        logging.info(f"Failed to initialize motor client ({e}), falling back to mock.")

db = client[os.environ.get('DB_NAME', 'engitech')]


# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"

# Password Hashing
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

# JWT Token Management
def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

def create_access_token(user_id: str, email: str, remember_me: bool = False) -> str:
    expiry = timedelta(days=30) if remember_me else timedelta(minutes=15)
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + expiry, "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str, remember_me: bool = False) -> str:
    expiry = timedelta(days=90) if remember_me else timedelta(days=7)
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + expiry, "type": "refresh"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

# Auth Helper
async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False

class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    email: str
    name: str
    role: str
    bookmarks: List[str] = []

class EquipmentCreate(BaseModel):
    name: str
    branch: str
    year: int
    semester: int
    definition: str
    working_principle: str
    main_parts: List[str]
    applications: List[str]
    exam_notes: str
    image_url: Optional[str] = None

    @field_validator('branch')
    def validate_branch(cls, v):
        allowed_branches = ['mechanical', 'electrical', 'civil', 'electronics']
        if v.lower() not in allowed_branches:
            raise ValueError(f'Branch must be one of {allowed_branches}')
        return v.lower()
    
    @field_validator('year')
    def validate_year(cls, v):
        if v < 1 or v > 4:
            raise ValueError('Year must be between 1 and 4')
        return v
    
    @field_validator('semester')
    def validate_semester(cls, v):
        if v < 1 or v > 8:
            raise ValueError('Semester must be between 1 and 8')
        return v

class EquipmentUpdate(BaseModel):
    name: Optional[str] = None
    branch: Optional[str] = None
    year: Optional[int] = None
    semester: Optional[int] = None
    definition: Optional[str] = None
    working_principle: Optional[str] = None
    main_parts: Optional[List[str]] = None
    applications: Optional[List[str]] = None
    exam_notes: Optional[str] = None
    image_url: Optional[str] = None

class EquipmentResponse(BaseModel):
    id: str
    name: str
    branch: str
    year: int
    semester: int
    definition: str
    working_principle: str
    main_parts: List[str]
    applications: List[str]
    exam_notes: str
    image_url: Optional[str] = None
    created_at: str
    updated_at: str

# Auth Routes
@api_router.post("/auth/register")
async def register(user_data: UserRegister, response: Response):
    email = user_data.email.lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(user_data.password)
    new_user = {
        "_id": ObjectId(),
        "email": email,
        "password_hash": hashed,
        "name": user_data.name,
        "role": "user",
        "bookmarks": [],
        "created_at": datetime.now(timezone.utc)
    }
    await db.users.insert_one(new_user)
    
    user_id = str(new_user["_id"])
    # Auto remember for 30 days on registration
    access_token = create_access_token(user_id, email, remember_me=True)
    refresh_token = create_refresh_token(user_id, remember_me=True)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=30*24*3600, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=90*24*3600, path="/")
    
    return {"_id": user_id, "email": email, "name": user_data.name, "role": "user", "bookmarks": []}

@api_router.post("/auth/login")
async def login(credentials: UserLogin, response: Response, request: Request):
    email = credentials.email.lower()
    ip = request.client.host
    identifier = f"{ip}:{email}"
    
    # Check brute force
    attempt_doc = await db.login_attempts.find_one({"identifier": identifier})
    if attempt_doc and attempt_doc.get("locked_until"):
        if attempt_doc["locked_until"] > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again later.")
    
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        # Increment failed attempts
        failed_count = attempt_doc["failed_count"] + 1 if attempt_doc else 1
        locked_until = datetime.now(timezone.utc) + timedelta(minutes=15) if failed_count >= 5 else None
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$set": {"failed_count": failed_count, "locked_until": locked_until, "last_attempt": datetime.now(timezone.utc)}},
            upsert=True
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Clear failed attempts
    await db.login_attempts.delete_one({"identifier": identifier})
    
    user_id = str(user["_id"])
    remember_me = credentials.remember_me
    access_token = create_access_token(user_id, email, remember_me)
    refresh_token = create_refresh_token(user_id, remember_me)
    
    # Set cookie expiry based on remember_me
    max_age_access = 30 * 24 * 3600 if remember_me else 900  # 30 days or 15 minutes
    max_age_refresh = 90 * 24 * 3600 if remember_me else 604800  # 90 days or 7 days
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=max_age_access, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=max_age_refresh, path="/")
    
    return {"_id": user_id, "email": user["email"], "name": user["name"], "role": user["role"], "bookmarks": user.get("bookmarks", [])}

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

# Equipment Routes
@api_router.get("/equipment")
async def get_equipment(
    branch: Optional[str] = None, 
    search: Optional[str] = None,
    year: Optional[int] = None,
    semester: Optional[int] = None
):
    query = {}
    if branch:
        query["branch"] = branch.lower()
    if year:
        query["year"] = year
    if semester:
        query["semester"] = semester
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"definition": {"$regex": search, "$options": "i"}},
            {"working_principle": {"$regex": search, "$options": "i"}},
            {"applications": {"$regex": search, "$options": "i"}}
        ]
    
    equipment_list = await db.equipment.find(query, {"_id": 0}).to_list(1000)
    for item in equipment_list:
        if isinstance(item.get('created_at'), datetime):
            item['created_at'] = item['created_at'].isoformat()
        if isinstance(item.get('updated_at'), datetime):
            item['updated_at'] = item['updated_at'].isoformat()
    return equipment_list

@api_router.get("/equipment/{equipment_id}")
async def get_equipment_by_id(equipment_id: str):
    equipment = await db.equipment.find_one({"id": equipment_id}, {"_id": 0})
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    if isinstance(equipment.get('created_at'), datetime):
        equipment['created_at'] = equipment['created_at'].isoformat()
    if isinstance(equipment.get('updated_at'), datetime):
        equipment['updated_at'] = equipment['updated_at'].isoformat()
    return equipment

@api_router.post("/equipment")
async def create_equipment(equipment_data: EquipmentCreate, admin: dict = Depends(require_admin)):
    equipment_dict = equipment_data.model_dump()
    equipment_dict["id"] = str(uuid.uuid4())
    equipment_dict["created_at"] = datetime.now(timezone.utc)
    equipment_dict["updated_at"] = datetime.now(timezone.utc)
    
    await db.equipment.insert_one(equipment_dict)
    
    equipment_dict["created_at"] = equipment_dict["created_at"].isoformat()
    equipment_dict["updated_at"] = equipment_dict["updated_at"].isoformat()
    equipment_dict.pop("_id", None)
    return equipment_dict

@api_router.put("/equipment/{equipment_id}")
async def update_equipment(equipment_id: str, equipment_data: EquipmentUpdate, admin: dict = Depends(require_admin)):
    update_dict = {k: v for k, v in equipment_data.model_dump().items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    update_dict["updated_at"] = datetime.now(timezone.utc)
    
    result = await db.equipment.update_one({"id": equipment_id}, {"$set": update_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Equipment not found")
    
    updated = await db.equipment.find_one({"id": equipment_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), datetime):
        updated['created_at'] = updated['created_at'].isoformat()
    if isinstance(updated.get('updated_at'), datetime):
        updated['updated_at'] = updated['updated_at'].isoformat()
    return updated

@api_router.delete("/equipment/{equipment_id}")
async def delete_equipment(equipment_id: str, admin: dict = Depends(require_admin)):
    result = await db.equipment.delete_one({"id": equipment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return {"message": "Equipment deleted successfully"}

# Bookmark Routes
@api_router.post("/bookmarks/{equipment_id}")
async def toggle_bookmark(equipment_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    bookmarks = user.get("bookmarks", [])
    
    if equipment_id in bookmarks:
        bookmarks.remove(equipment_id)
        message = "Bookmark removed"
    else:
        bookmarks.append(equipment_id)
        message = "Bookmark added"
    
    await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"bookmarks": bookmarks}})
    return {"message": message, "bookmarks": bookmarks}

@api_router.get("/bookmarks")
async def get_bookmarks(current_user: dict = Depends(get_current_user)):
    user = await db.users.find_one({"_id": ObjectId(current_user["_id"])})
    bookmark_ids = user.get("bookmarks", [])
    
    if not bookmark_ids:
        return []
    
    equipment_list = await db.equipment.find({"id": {"$in": bookmark_ids}}, {"_id": 0}).to_list(1000)
    for item in equipment_list:
        if isinstance(item.get('created_at'), datetime):
            item['created_at'] = item['created_at'].isoformat()
        if isinstance(item.get('updated_at'), datetime):
            item['updated_at'] = item['updated_at'].isoformat()
    return equipment_list

# Admin seeding
async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@engitech.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "_id": ObjectId(),
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "bookmarks": [],
            "created_at": datetime.now(timezone.utc)
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})

# Sample equipment data seeding
async def seed_equipment():
    count = await db.equipment.count_documents({})
    if count > 0:
        return
    
    sample_equipment = [
        {
            "id": str(uuid.uuid4()),
            "name": "Lathe Machine",
            "branch": "mechanical",
            "definition": "A lathe is a machine tool that rotates a workpiece about an axis of rotation to perform various operations such as cutting, sanding, drilling, or deformation.",
            "working_principle": "The workpiece is held in a chuck and rotated while a cutting tool is fed into the work causing the cutting action. The tool can move parallel or perpendicular to the axis of rotation.",
            "main_parts": ["Headstock", "Tailstock", "Bed", "Carriage", "Chuck", "Lead Screw", "Feed Rod"],
            "applications": ["Turning cylindrical parts", "Facing operations", "Thread cutting", "Drilling", "Boring"],
            "exam_notes": "Remember the main parts and their functions. Lathe is the mother of all machine tools. Classification: Engine lathe, Turret lathe, Special purpose lathe.",
            "image_url": "https://images.pexels.com/photos/19658259/pexels-photo-19658259.jpeg",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Milling Machine",
            "branch": "mechanical",
            "definition": "A milling machine is a machine tool used for shaping solid materials by removing material from a workpiece using a rotating cutter.",
            "working_principle": "The cutter rotates at high speed and the workpiece is fed against it. Material is removed in the form of small chips. Can perform face milling and peripheral milling.",
            "main_parts": ["Base", "Column", "Knee", "Saddle", "Table", "Spindle", "Arbor", "Overhanging Arm"],
            "applications": ["Flat surface machining", "Slot cutting", "Gear cutting", "Complex contour machining", "Drilling and boring"],
            "exam_notes": "Types: Horizontal, Vertical, Universal milling machines. Remember indexing methods for gear cutting. Up milling vs Down milling differences.",
            "image_url": "https://images.pexels.com/photos/19658259/pexels-photo-19658259.jpeg",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Transformer",
            "branch": "electrical",
            "definition": "A transformer is a static electrical device that transfers electrical energy between two or more circuits through electromagnetic induction.",
            "working_principle": "Based on Faraday's law of electromagnetic induction. When AC flows through primary winding, it creates changing magnetic flux in the core which induces voltage in secondary winding.",
            "main_parts": ["Core (Laminated Silicon Steel)", "Primary Winding", "Secondary Winding", "Tank", "Conservator", "Breather", "Bushings", "Cooling System"],
            "applications": ["Step-up/Step-down voltage", "Power transmission", "Distribution networks", "Isolation", "Impedance matching"],
            "exam_notes": "Transformation ratio: V2/V1 = N2/N1. Losses: Core losses (Hysteresis + Eddy current) and Copper losses (I²R). Efficiency typically 95-99%.",
            "image_url": "https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "name": "DC Motor",
            "branch": "electrical",
            "definition": "A DC motor is an electrical machine that converts direct current electrical energy into mechanical energy through the interaction of magnetic fields.",
            "working_principle": "When current-carrying conductor is placed in a magnetic field, it experiences a force (Fleming's Left Hand Rule). The commutator ensures continuous rotation by reversing current direction.",
            "main_parts": ["Stator (Field System)", "Rotor (Armature)", "Commutator", "Brushes", "Yoke", "Field Windings", "Shaft", "Bearings"],
            "applications": ["Electric vehicles", "Industrial drives", "Cranes and hoists", "Rolling mills", "Elevators"],
            "exam_notes": "Types: Series, Shunt, Compound motors. Back EMF: Eb = V - IaRa. Torque: T ∝ ΦIa. Speed control methods: Flux control, Armature voltage control, Resistance control.",
            "image_url": "https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Theodolite",
            "branch": "civil",
            "definition": "A theodolite is a precision optical instrument used for measuring horizontal and vertical angles in surveying and engineering applications.",
            "working_principle": "Uses a rotating telescope mounted on horizontal and vertical axes. Angles are measured using graduated circles and vernier scales or digital displays.",
            "main_parts": ["Telescope", "Horizontal Circle", "Vertical Circle", "Vernier Scales", "Leveling Screws", "Tribrach", "Plumb Bob", "Compass"],
            "applications": ["Land surveying", "Construction layout", "Triangulation", "Alignment work", "Setting out curves"],
            "exam_notes": "Types: Transit theodolite, Non-transit theodolite, Digital theodolite. Temporary adjustments: Leveling, Centering, Focusing. Least count = Value of 1 div / No. of divisions on vernier.",
            "image_url": "https://images.pexels.com/photos/8470842/pexels-photo-8470842.jpeg",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Total Station",
            "branch": "civil",
            "definition": "A total station is an electronic/optical surveying instrument that measures both angles and distances electronically and processes the data internally.",
            "working_principle": "Combines an electronic theodolite with an Electronic Distance Meter (EDM). Uses electromagnetic waves to measure distances and digital sensors for angles.",
            "main_parts": ["Electronic Theodolite", "EDM", "Microprocessor", "Display Screen", "Keyboard", "Data Storage", "Battery", "Tripod Mount"],
            "applications": ["Topographic surveys", "Construction staking", "As-built surveys", "Volume calculations", "Digital mapping"],
            "exam_notes": "Advantages over theodolite: Faster, more accurate, direct data storage, calculates coordinates automatically. Accuracy: Angle ±2-5 seconds, Distance ±2mm.",
            "image_url": "https://images.pexels.com/photos/8470842/pexels-photo-8470842.jpeg",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Oscilloscope",
            "branch": "electronics",
            "definition": "An oscilloscope is an electronic test instrument that graphically displays varying electrical voltages as a two-dimensional plot of voltage versus time.",
            "working_principle": "The input signal is applied to vertical deflection plates of CRT or processed digitally. Time base generator sweeps the beam horizontally, creating a waveform display.",
            "main_parts": ["Display (CRT/LCD)", "Vertical Amplifier", "Horizontal Amplifier", "Trigger Circuit", "Time Base Generator", "Probes", "Control Knobs"],
            "applications": ["Waveform analysis", "Signal integrity testing", "Frequency measurement", "Phase shift measurement", "Circuit debugging"],
            "exam_notes": "Types: Analog (CRT-based), Digital Storage Oscilloscope (DSO). Key specs: Bandwidth, Sample rate, Rise time. Trigger modes: Auto, Normal, Single.",
            "image_url": "https://images.pexels.com/photos/7286016/pexels-photo-7286016.jpeg",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Function Generator",
            "branch": "electronics",
            "definition": "A function generator is an electronic instrument that produces various types of electrical waveforms over a wide range of frequencies.",
            "working_principle": "Uses oscillator circuits (RC, LC, or crystal) to generate periodic waveforms. Waveform shaping circuits convert basic oscillations to desired shapes.",
            "main_parts": ["Oscillator Circuit", "Waveform Shaping Circuit", "Frequency Control", "Amplitude Control", "DC Offset Control", "Output Attenuator", "Display"],
            "applications": ["Circuit testing", "Audio equipment testing", "Signal injection", "Frequency response testing", "Education and training"],
            "exam_notes": "Common waveforms: Sine, Square, Triangle, Sawtooth, Pulse. Frequency range: mHz to MHz. Important parameters: Frequency, Amplitude, DC offset, Duty cycle.",
            "image_url": "https://images.pexels.com/photos/7286016/pexels-photo-7286016.jpeg",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
    ]
    
    await db.equipment.insert_many(sample_equipment)

@app.on_event("startup")
async def startup_event():
    try:
        await db.users.create_index("email", unique=True)
        await db.login_attempts.create_index("identifier")
        await seed_admin()
        await seed_equipment()
    except Exception as e:
        logging.error(f"Startup seeding error: {e}")

@api_router.get("/health")
async def health_check():
    try:
        await client.admin.command("ping")
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}

# Include the router in the main app
app.include_router(api_router)

# CORS Configuration for Vercel Deployment
cors_origins_env = os.environ.get('CORS_ORIGINS', '*')

# Define allowed origins
if cors_origins_env == '*':
    # Development: Allow all
    allowed_origins = ["*"]
    allow_credentials = True
else:
    # Production: Specific origins
    allowed_origins = cors_origins_env.split(',')
    allow_credentials = True

# Always allow your Vercel frontend URLs
vercel_origins = [
    "https://engi-tech-1auw-one.vercel.app",
    "https://engi-tech-1auw-one.vercel.app/login",
    "http://localhost:3000",
    "http://localhost:3001",
]

# Merge origins
if allowed_origins != ["*"]:
    allowed_origins.extend(vercel_origins)
    allowed_origins = list(set(allowed_origins))  # Remove duplicates
else:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
