"""
Seed script -- creates all tables and populates the database with:
  - 1 Admin user
  - 4 Coach users
  - 5 Member users
  - Sample announcements
  - Sample events
  - Sample resources

Run from the backend directory:
    python -m app.db.seed
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from datetime import date, time, timedelta

from app.db.database import engine
from app.db.base import Base
from app.db.session import SessionLocal
import app.models  # noqa -- registers all models

from app.common.enums import UserRole, EventType, EventStatus
from app.core.security import hash_password
from app.models.user import User
from app.models.announcement import Announcement
from app.models.event import Event
from app.models.resource import Resource


def seed():
    print("[*] Re-creating all database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("[OK] Tables created.")


    db = SessionLocal()

    try:
        # -----------------------------------------------------------------------
        # USERS
        # -----------------------------------------------------------------------
        users_data = [
            {
                "first_name": "Club",
                "last_name": "Admin",
                "email": "admin@sportsclub.com",
                "phone": "+91-9000000001",
                "password": "Admin@123",
                "role": UserRole.ADMIN,
            },
            {
                "first_name": "Maya",
                "last_name": "Singh",
                "email": "maya.singh@sportsclub.com",
                "phone": "+91-9000000002",
                "password": "Coach@123",
                "role": UserRole.COACH,
                "sport": "Football",
            },
            {
                "first_name": "Rafi",
                "last_name": "Hassan",
                "email": "rafi.hassan@sportsclub.com",
                "phone": "+91-9000000003",
                "password": "Coach@123",
                "role": UserRole.COACH,
                "sport": "Cricket",
            },
            {
                "first_name": "Lina",
                "last_name": "Torres",
                "email": "lina.torres@sportsclub.com",
                "phone": "+91-9000000004",
                "password": "Coach@123",
                "role": UserRole.COACH,
                "sport": "Badminton",
            },
            {
                "first_name": "Aarav",
                "last_name": "Desai",
                "email": "aarav.desai@sportsclub.com",
                "phone": "+91-9000000005",
                "password": "Coach@123",
                "role": UserRole.COACH,
                "sport": "Tennis",
            },
            {
                "first_name": "Alex",
                "last_name": "Carter",
                "email": "alex.carter@sportsclub.com",
                "phone": "+91-9000000006",
                "password": "Member@123",
                "role": UserRole.MEMBER,
                "sport": "Badminton",
            },
            {
                "first_name": "Jamie",
                "last_name": "Lee",
                "email": "jamie.lee@sportsclub.com",
                "phone": "+91-9000000007",
                "password": "Member@123",
                "role": UserRole.MEMBER,
                "sport": "Cricket",
            },
            {
                "first_name": "Sam",
                "last_name": "Rivera",
                "email": "sam.rivera@sportsclub.com",
                "phone": "+91-9000000008",
                "password": "Member@123",
                "role": UserRole.MEMBER,
                "sport": "Football",
            },
            {
                "first_name": "Priya",
                "last_name": "Sharma",
                "email": "priya.sharma@sportsclub.com",
                "phone": "+91-9000000009",
                "password": "Member@123",
                "role": UserRole.MEMBER,
                "sport": "Swimming",
            },
            {
                "first_name": "Jordan",
                "last_name": "Walsh",
                "email": "jordan.walsh@sportsclub.com",
                "phone": "+91-9000000010",
                "password": "Member@123",
                "role": UserRole.MEMBER,
                "sport": "Tennis",
            },
        ]

        created_users = {}
        for u in users_data:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if existing:
                print(f"  [SKIP] User already exists: {u['email']}")
                created_users[u["email"]] = existing
                continue
            user = User(
                first_name=u["first_name"],
                last_name=u["last_name"],
                email=u["email"],
                phone=u["phone"],
                password_hash=hash_password(u["password"]),
                role=u["role"],
                sport=u.get("sport"),
                is_approved=True,
                status="Active",
            )
            db.add(user)
            db.flush()
            created_users[u["email"]] = user
            print(f"  [OK] Created {u['role'].value}: {u['email']}")

        db.commit()

        # Always reset passwords and ensure assigned sports are populated for existing users
        for u in users_data:
            user = db.query(User).filter(User.email == u["email"]).first()
            if user:
                user.password_hash = hash_password(u["password"])
                user.is_approved = True
                user.status = "Active"
                if u.get("sport") and not user.sport:
                    user.sport = u["sport"]
        db.commit()
        print("[OK] Passwords and status confirmed for all users.")

        admin_user = created_users.get("admin@sportsclub.com")


        # -----------------------------------------------------------------------
        # ANNOUNCEMENTS
        # -----------------------------------------------------------------------
        announcements_data = [
            {
                "title": "Welcome to the new Sports Club portal!",
                "message": "We have launched our new online portal. You can now book facilities, view events, track attendance, and more -- all from this dashboard.",
            },
            {
                "title": "Summer Tournament Registration Open",
                "message": "Registration for the Summer Invitational 2026 is now open. Deadline is August 20th. Register under the Events section.",
            },
            {
                "title": "Facility Maintenance Notice",
                "message": "The main training hall will be closed for maintenance on August 10th from 6 AM to 12 PM. Please plan accordingly.",
            },
            {
                "title": "New Equipment Arrived",
                "message": "We have received a new batch of badminton rackets and football boots. These are available for booking through the Equipment Booking section.",
            },
            {
                "title": "Monthly Performance Reviews Starting",
                "message": "Coaches will conduct monthly performance reviews for all members starting from August 15th. Check the Performance section for your latest scores.",
            },
        ]

        if admin_user:
            for a in announcements_data:
                existing = db.query(Announcement).filter(Announcement.title == a["title"]).first()
                if existing:
                    print(f"  [SKIP] Announcement exists: {a['title'][:40]}")
                    continue
                announcement = Announcement(
                    title=a["title"],
                    message=a["message"],
                    created_by=admin_user.id,
                )
                db.add(announcement)
                print(f"  [OK] Created announcement: {a['title'][:40]}")

        db.commit()

        # -----------------------------------------------------------------------
        # EVENTS
        # -----------------------------------------------------------------------
        today = date.today()

        events_data = [
            {
                "title": "Morning Strength & Conditioning",
                "event_type": EventType.PRACTICE,
                "date": today + timedelta(days=1),
                "start_time": time(6, 30),
                "end_time": time(8, 0),
                "venue": "Arena Hall A",
                "description": "Full body strength and conditioning session. Bring your training kit.",
                "max_participants": 30,
            },
            {
                "title": "Badminton Tournament - Round 1",
                "event_type": EventType.TOURNAMENT,
                "date": today + timedelta(days=3),
                "start_time": time(10, 0),
                "end_time": time(14, 0),
                "venue": "Indoor Court B",
                "description": "First round of the Summer Invitational Badminton Tournament.",
                "max_participants": 64,
            },
            {
                "title": "Football Match - North vs South",
                "event_type": EventType.MATCH,
                "date": today + timedelta(days=5),
                "start_time": time(19, 0),
                "end_time": time(21, 0),
                "venue": "North Pitch",
                "opponent": "South Team FC",
                "description": "Inter-division football match. All members welcome to watch.",
                "max_participants": 22,
            },
            {
                "title": "Swimming Practice",
                "event_type": EventType.PRACTICE,
                "date": today + timedelta(days=2),
                "start_time": time(7, 0),
                "end_time": time(9, 0),
                "venue": "Aquatic Centre",
                "description": "Endurance swimming session for all levels.",
                "max_participants": 20,
            },
            {
                "title": "Club Annual Day",
                "event_type": EventType.CLUB_EVENT,
                "date": today + timedelta(days=14),
                "start_time": time(17, 0),
                "end_time": time(21, 0),
                "venue": "Main Hall",
                "description": "Annual celebration with awards, dinner, and entertainment for all members.",
                "max_participants": 200,
            },
            {
                "title": "Tennis Coaching Session",
                "event_type": EventType.PRACTICE,
                "date": today + timedelta(days=4),
                "start_time": time(8, 0),
                "end_time": time(10, 0),
                "venue": "Tennis Court 1",
                "description": "Beginner and intermediate coaching session with Coach Aarav.",
                "max_participants": 12,
            },
        ]

        if admin_user:
            for e in events_data:
                existing = db.query(Event).filter(Event.title == e["title"]).first()
                if existing:
                    print(f"  [SKIP] Event exists: {e['title'][:40]}")
                    continue
                event = Event(
                    title=e["title"],
                    event_type=e["event_type"],
                    date=e["date"],
                    start_time=e["start_time"],
                    end_time=e.get("end_time"),
                    venue=e["venue"],
                    opponent=e.get("opponent"),
                    description=e.get("description"),
                    max_participants=e.get("max_participants"),
                    registration_deadline=e["date"] - timedelta(days=1),
                    event_status=EventStatus.SCHEDULED,
                    is_registration_open=True,
                    created_by=admin_user.id,
                )
                db.add(event)
                print(f"  [OK] Created event: {e['title'][:40]}")

        db.commit()

        # -----------------------------------------------------------------------
        # RESOURCES
        # -----------------------------------------------------------------------
        resources_data = [
            {"name": "Training Hall A", "resource_type": "Facility", "quantity": 1},
            {"name": "Indoor Court B", "resource_type": "Facility", "quantity": 1},
            {"name": "Football Pitch", "resource_type": "Facility", "quantity": 2},
            {"name": "Aquatic Centre", "resource_type": "Facility", "quantity": 1},
            {"name": "Tennis Court", "resource_type": "Facility", "quantity": 3},
            {"name": "Badminton Rackets", "resource_type": "Equipment", "quantity": 20},
            {"name": "Football Boots (Size 8-11)", "resource_type": "Equipment", "quantity": 15},
            {"name": "Recovery Pod", "resource_type": "Facility", "quantity": 4},
            {"name": "Video Analysis Room", "resource_type": "Facility", "quantity": 1},
            {"name": "Swimming Goggles", "resource_type": "Equipment", "quantity": 30},
        ]

        for r in resources_data:
            existing = db.query(Resource).filter(Resource.name == r["name"]).first()
            if existing:
                print(f"  [SKIP] Resource exists: {r['name']}")
                continue
            resource = Resource(
                name=r["name"],
                resource_type=r["resource_type"],
                quantity=r["quantity"],
                is_available=True,
            )
            db.add(resource)
            print(f"  [OK] Created resource: {r['name']}")

        db.commit()

        # -----------------------------------------------------------------------
        # PAYMENTS
        # -----------------------------------------------------------------------
        from app.common.enums import PaymentModel, InvoiceStatus
        from app.models.payment import Payment

        alex = created_users.get("alex.carter@sportsclub.com")
        jamie = created_users.get("jamie.lee@sportsclub.com")
        sam = created_users.get("sam.rivera@sportsclub.com")
        priya = created_users.get("priya.sharma@sportsclub.com")
        jordan = created_users.get("jordan.walsh@sportsclub.com")

        payments_data = [
            {"member": alex, "amount": 2500.00, "model": PaymentModel.MONTHLY, "status": InvoiceStatus.PAID, "due_offset": 30, "paid_offset": 0},
            {"member": jamie, "amount": 12000.00, "model": PaymentModel.ANNUAL, "status": InvoiceStatus.PAID, "due_offset": 180, "paid_offset": 0},
            {"member": sam, "amount": 3000.00, "model": PaymentModel.MONTHLY, "status": InvoiceStatus.PENDING, "due_offset": 15, "paid_offset": None},
            {"member": priya, "amount": 1500.00, "model": PaymentModel.PAY_PER_USE, "status": InvoiceStatus.PAID, "due_offset": 7, "paid_offset": 0},
            {"member": jordan, "amount": 2500.00, "model": PaymentModel.MONTHLY, "status": InvoiceStatus.OVERDUE, "due_offset": -5, "paid_offset": None},
        ]

        for p_info in payments_data:
            m_user = p_info["member"]
            if not m_user:
                continue
            existing_p = db.query(Payment).filter(Payment.member_id == m_user.id).first()
            if existing_p:
                print(f"  [SKIP] Payment exists for: {m_user.email}")
                continue
            due_d = date.today() + timedelta(days=p_info["due_offset"])
            paid_d = (date.today() + timedelta(days=p_info["paid_offset"])) if p_info["paid_offset"] is not None else None
            payment = Payment(
                member_id=m_user.id,
                amount=p_info["amount"],
                payment_model=p_info["model"],
                invoice_status=p_info["status"],
                due_date=due_d,
                paid_date=paid_d,
            )
            db.add(payment)
            print(f"  [OK] Created payment invoice INR {p_info['amount']} for: {m_user.email}")

        db.commit()

        print("\n[DONE] Seed complete!")
        print("\nLogin credentials:")
        print("-" * 56)
        print("  Admin:  admin@sportsclub.com       | Admin@123")
        print("  Coach:  maya.singh@sportsclub.com  | Coach@123")
        print("  Coach:  rafi.hassan@sportsclub.com | Coach@123")
        print("  Coach:  lina.torres@sportsclub.com | Coach@123")
        print("  Coach:  aarav.desai@sportsclub.com | Coach@123")
        print("  Member: alex.carter@sportsclub.com | Member@123")
        print("  Member: jamie.lee@sportsclub.com   | Member@123")
        print("  Member: sam.rivera@sportsclub.com  | Member@123")
        print("-" * 56)

    except Exception as e:
        db.rollback()
        print(f"\n[ERROR] Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
