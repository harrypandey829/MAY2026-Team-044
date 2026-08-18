"""
Seed script -- creates all tables and populates the database with:
  - Default Sports (Badminton, Football, Cricket, Tennis, Swimming, Basketball)
  - Equipment Utilities per sport
  - 1 Admin user
  - Coach users per sport (<sport>coach@sportsclub.com / coach)
  - Member users per sport (<sport>user@sportsclub.com / user)
  - Approved Venue Bookings for Coaches
  - Sport-bound Events, Attendance & Ratings, Certificates, Payments

Run from the backend directory:
    python -m app.db.seed
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from datetime import date, time, timedelta, datetime, timezone

from app.db.database import engine
from app.db.base import Base
from app.db.session import SessionLocal
import app.models  # noqa -- registers all models

from app.common.enums import UserRole, EventType, EventStatus, AttendanceStatus
from app.core.security import hash_password
from app.models.user import User
from app.models.announcement import Announcement
from app.models.event import Event
from app.models.resource import Resource
from app.models.resource_booking import ResourceBooking
from app.models.sport import Sport
from app.models.equipment import Equipment
from app.models.attendance import Attendance
from app.models.certificate import Certificate
from app.models.payment import Payment


def seed():
    print("[*] Re-creating all database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("[OK] Tables created.")

    db = SessionLocal()

    try:
        # -----------------------------------------------------------------------
        # 1. SPORTS
        # -----------------------------------------------------------------------
        sports_data = [
            {"name": "Badminton", "monthly_fee": 1500.0, "annual_fee": 15000.0, "description": "Indoor court badminton training & leagues."},
            {"name": "Football", "monthly_fee": 2000.0, "annual_fee": 20000.0, "description": "Outdoor grass pitch football coaching & tournaments."},
            {"name": "Cricket", "monthly_fee": 2200.0, "annual_fee": 22000.0, "description": "Net practice, pitch fixtures, and physical conditioning."},
            {"name": "Tennis", "monthly_fee": 1800.0, "annual_fee": 18000.0, "description": "Synthetic & clay court tennis training for all skill levels."},
            {"name": "Swimming", "monthly_fee": 2500.0, "annual_fee": 25000.0, "description": "Olympic size heated pool training and stroke refine."},
            {"name": "Basketball", "monthly_fee": 1600.0, "annual_fee": 16000.0, "description": "Indoor hardwood court basketball drills & tournaments."},
        ]

        for s in sports_data:
            sport = Sport(
                name=s["name"],
                monthly_fee=s["monthly_fee"],
                annual_fee=s["annual_fee"],
                description=s["description"]
            )
            db.add(sport)
            print(f"  [OK] Created Sport: {s['name']}")

        db.commit()

        # -----------------------------------------------------------------------
        # 2. EQUIPMENT UTILITIES (SPORTS-WISE)
        # -----------------------------------------------------------------------
        equipments_data = [
            # Badminton
            {"sport_name": "Badminton", "name": "Badminton Rackets", "total_quantity": 25, "available_quantity": 25},
            {"sport_name": "Badminton", "name": "Yonex Shuttlecock Tube (12 Pcs)", "total_quantity": 40, "available_quantity": 40},
            {"sport_name": "Badminton", "name": "Badminton Net Set", "total_quantity": 6, "available_quantity": 6},

            # Football
            {"sport_name": "Football", "name": "Training Footballs (Size 5)", "total_quantity": 30, "available_quantity": 30},
            {"sport_name": "Football", "name": "Football Boots (Size 8-11)", "total_quantity": 15, "available_quantity": 15},
            {"sport_name": "Football", "name": "Agility Cones & Markers", "total_quantity": 50, "available_quantity": 50},

            # Cricket
            {"sport_name": "Cricket", "name": "English Willow Cricket Bats", "total_quantity": 12, "available_quantity": 12},
            {"sport_name": "Cricket", "name": "Leather Balls Box", "total_quantity": 30, "available_quantity": 30},
            {"sport_name": "Cricket", "name": "Batting Pads & Helmets", "total_quantity": 10, "available_quantity": 10},

            # Tennis
            {"sport_name": "Tennis", "name": "Pro Tennis Rackets", "total_quantity": 18, "available_quantity": 18},
            {"sport_name": "Tennis", "name": "Wilson Tennis Balls Can", "total_quantity": 35, "available_quantity": 35},

            # Swimming
            {"sport_name": "Swimming", "name": "Swimming Goggles", "total_quantity": 30, "available_quantity": 30},
            {"sport_name": "Swimming", "name": "Kickboards & Pull Buoys", "total_quantity": 20, "available_quantity": 20},
            {"sport_name": "Swimming", "name": "Silicone Swim Caps", "total_quantity": 40, "available_quantity": 40},

            # Basketball
            {"sport_name": "Basketball", "name": "Spalding Official Basketballs", "total_quantity": 20, "available_quantity": 20},
            {"sport_name": "Basketball", "name": "Training Bibs (Set of 12)", "total_quantity": 10, "available_quantity": 10},
        ]

        for eq in equipments_data:
            equipment = Equipment(
                sport_name=eq["sport_name"],
                name=eq["name"],
                total_quantity=eq["total_quantity"],
                available_quantity=eq["available_quantity"]
            )
            db.add(equipment)
            print(f"  [OK] Created Equipment Utility: [{eq['sport_name']}] {eq['name']}")

        db.commit()

        # -----------------------------------------------------------------------
        # 3. USERS
        # -----------------------------------------------------------------------
        users_data = [
            # Admin
            {
                "first_name": "Club",
                "last_name": "Admin",
                "email": "admin@sportsclub.com",
                "phone": "+91-9000000001",
                "address": "Main Sports Complex, Sector 4, New Delhi",
                "password": "Admin@123",
                "role": UserRole.ADMIN,
                "sport": None,
            },

            # 1 Coach per sport (<sport>coach@sportsclub.com / coach)
            {
                "first_name": "Badminton",
                "last_name": "Coach",
                "email": "badmintoncoach@sportsclub.com",
                "phone": "+91-9000000101",
                "address": "Indoor Badminton Hub",
                "password": "coach",
                "role": UserRole.COACH,
                "sport": "Badminton",
            },
            {
                "first_name": "Football",
                "last_name": "Coach",
                "email": "footballcoach@sportsclub.com",
                "phone": "+91-9000000102",
                "address": "Main Football Pitch",
                "password": "coach",
                "role": UserRole.COACH,
                "sport": "Football",
            },
            {
                "first_name": "Cricket",
                "last_name": "Coach",
                "email": "cricketcoach@sportsclub.com",
                "phone": "+91-9000000103",
                "address": "Cricket Nets Pavilion",
                "password": "coach",
                "role": UserRole.COACH,
                "sport": "Cricket",
            },
            {
                "first_name": "Tennis",
                "last_name": "Coach",
                "email": "tenniscoach@sportsclub.com",
                "phone": "+91-9000000104",
                "address": "Synthetic Tennis Courts",
                "password": "coach",
                "role": UserRole.COACH,
                "sport": "Tennis",
            },
            {
                "first_name": "Swimming",
                "last_name": "Coach",
                "email": "swimmingcoach@sportsclub.com",
                "phone": "+91-9000000105",
                "address": "Olympic Aquatic Pool",
                "password": "coach",
                "role": UserRole.COACH,
                "sport": "Swimming",
            },
            {
                "first_name": "Basketball",
                "last_name": "Coach",
                "email": "basketballcoach@sportsclub.com",
                "phone": "+91-9000000106",
                "address": "Indoor Basketball Stadium",
                "password": "coach",
                "role": UserRole.COACH,
                "sport": "Basketball",
            },

            # Additional Named Coaches
            {
                "first_name": "Maya",
                "last_name": "Singh",
                "email": "maya.singh@sportsclub.com",
                "phone": "+91-9000000002",
                "address": "Flat 202, Green Valley Apartments",
                "password": "Coach@123",
                "role": UserRole.COACH,
                "sport": "Badminton",
            },

            # 1 Member per sport (<sport>user@sportsclub.com / user)
            {
                "first_name": "Badminton",
                "last_name": "User",
                "email": "badmintonuser@sportsclub.com",
                "phone": "+91-9000000201",
                "address": "Badminton Member Residence",
                "password": "user",
                "role": UserRole.MEMBER,
                "sport": "Badminton",
            },
            {
                "first_name": "Football",
                "last_name": "User",
                "email": "footballuser@sportsclub.com",
                "phone": "+91-9000000202",
                "address": "Football Member Residence",
                "password": "user",
                "role": UserRole.MEMBER,
                "sport": "Football",
            },
            {
                "first_name": "Cricket",
                "last_name": "User",
                "email": "cricketuser@sportsclub.com",
                "phone": "+91-9000000203",
                "address": "Cricket Member Residence",
                "password": "user",
                "role": UserRole.MEMBER,
                "sport": "Cricket",
            },
            {
                "first_name": "Tennis",
                "last_name": "User",
                "email": "tennisuser@sportsclub.com",
                "phone": "+91-9000000204",
                "address": "Tennis Member Residence",
                "password": "user",
                "role": UserRole.MEMBER,
                "sport": "Tennis",
            },
            {
                "first_name": "Swimming",
                "last_name": "User",
                "email": "swimminguser@sportsclub.com",
                "phone": "+91-9000000205",
                "address": "Swimming Member Residence",
                "password": "user",
                "role": UserRole.MEMBER,
                "sport": "Swimming",
            },
            {
                "first_name": "Basketball",
                "last_name": "User",
                "email": "basketballuser@sportsclub.com",
                "phone": "+91-9000000206",
                "address": "Basketball Member Residence",
                "password": "user",
                "role": UserRole.MEMBER,
                "sport": "Basketball",
            },

            # Additional Named Members
            {
                "first_name": "Alex",
                "last_name": "Carter",
                "email": "alex.carter@sportsclub.com",
                "phone": "+91-9000000006",
                "address": "12 Baker Street, Central City",
                "password": "Member@123",
                "role": UserRole.MEMBER,
                "sport": "Badminton",
            },
            {
                "first_name": "Jamie",
                "last_name": "Lee",
                "email": "jamie.lee@sportsclub.com",
                "phone": "+91-9000000007",
                "address": "78 Park Avenue, Sector 15",
                "password": "Member@123",
                "role": UserRole.MEMBER,
                "sport": "Cricket",
            },
            {
                "first_name": "Sam",
                "last_name": "Rivera",
                "email": "sam.rivera@sportsclub.com",
                "phone": "+91-9000000008",
                "address": "304 Blue Ridge Towers",
                "password": "Member@123",
                "role": UserRole.MEMBER,
                "sport": "Football",
            },
            {
                "first_name": "Priya",
                "last_name": "Sharma",
                "email": "priya.sharma@sportsclub.com",
                "phone": "+91-9000000009",
                "address": "Plot 89, Cyber City",
                "password": "Member@123",
                "role": UserRole.MEMBER,
                "sport": "Swimming",
            },
            {
                "first_name": "Jordan",
                "last_name": "Walsh",
                "email": "jordan.walsh@sportsclub.com",
                "phone": "+91-9000000010",
                "address": "55 Lake View Lane",
                "password": "Member@123",
                "role": UserRole.MEMBER,
                "sport": "Tennis",
            },
        ]

        created_users = {}
        for u in users_data:
            user = User(
                first_name=u["first_name"],
                last_name=u["last_name"],
                email=u["email"],
                phone=u["phone"],
                address=u["address"],
                password_hash=hash_password(u["password"]),
                role=u["role"],
                sport=u.get("sport"),
                is_approved=True,
                status="Active",
            )
            db.add(user)
            db.flush()
            created_users[u["email"]] = user
            print(f"  [OK] Created {u['role'].value}: {u['email']} [{u.get('sport') or 'System'}]")

        db.commit()

        admin_user = created_users.get("admin@sportsclub.com")
        maya_coach = created_users.get("maya.singh@sportsclub.com")
        badminton_coach = created_users.get("badmintoncoach@sportsclub.com")
        football_coach = created_users.get("footballcoach@sportsclub.com")
        alex_member = created_users.get("alex.carter@sportsclub.com")

        # -----------------------------------------------------------------------
        # 4. VENUE BOOKINGS (APPROVED FOR COACHES)
        # -----------------------------------------------------------------------
        today = date.today()
        venue_bookings_data = [
            {
                "coach_id": badminton_coach.id if badminton_coach else maya_coach.id,
                "sport_name": "Badminton",
                "venue_name": "Indoor Court B",
                "booking_date": today,
                "start_time": time(9, 0),
                "end_time": time(11, 0),
                "status": "APPROVED",
                "remarks": "Regular morning session booking"
            },
            {
                "coach_id": badminton_coach.id if badminton_coach else maya_coach.id,
                "sport_name": "Badminton",
                "venue_name": "Indoor Court B",
                "booking_date": today + timedelta(days=2),
                "start_time": time(10, 0),
                "end_time": time(12, 0),
                "status": "APPROVED",
                "remarks": "Weekend tournament booking"
            },
            {
                "coach_id": football_coach.id if football_coach else maya_coach.id,
                "sport_name": "Football",
                "venue_name": "North Pitch",
                "booking_date": today,
                "start_time": time(16, 0),
                "end_time": time(18, 0),
                "status": "APPROVED",
                "remarks": "Tactical match rehearsal"
            },
        ]

        for vb in venue_bookings_data:
            res_booking = ResourceBooking(
                coach_id=vb["coach_id"],
                sport_name=vb["sport_name"],
                venue_name=vb["venue_name"],
                booking_date=vb["booking_date"],
                start_time=vb["start_time"],
                end_time=vb["end_time"],
                status=vb["status"],
                remarks=vb["remarks"]
            )
            db.add(res_booking)
            print(f"  [OK] Created Approved Venue Booking: {vb['venue_name']} on {vb['booking_date']} for {vb['sport_name']}")

        db.commit()

        # -----------------------------------------------------------------------
        # 5. EVENTS (TRAINING SESSIONS & MATCHES)
        # -----------------------------------------------------------------------
        events_data = [
            {
                "title": "Badminton Smash & Footwork Drill",
                "event_type": EventType.PRACTICE,
                "date": today,
                "start_time": time(9, 0),
                "end_time": time(11, 0),
                "venue": "Indoor Court B",
                "sport": "Badminton",
                "description": "High intensity footwork and smash drill session.",
                "created_by": badminton_coach.id if badminton_coach else maya_coach.id,
            },
            {
                "title": "Badminton Summer Championship - Quarter Finals",
                "event_type": EventType.TOURNAMENT,
                "date": today + timedelta(days=2),
                "start_time": time(10, 0),
                "end_time": time(12, 0),
                "venue": "Indoor Court B",
                "sport": "Badminton",
                "description": "Quarter final knockout matches for Badminton squad.",
                "created_by": badminton_coach.id if badminton_coach else maya_coach.id,
            },
            {
                "title": "Football Team Defense Practice",
                "event_type": EventType.PRACTICE,
                "date": today,
                "start_time": time(16, 0),
                "end_time": time(18, 0),
                "venue": "North Pitch",
                "sport": "Football",
                "description": "Tactical positioning and set piece defense drills.",
                "created_by": football_coach.id if football_coach else maya_coach.id,
            },
        ]

        created_events = {}
        for e in events_data:
            event = Event(
                title=e["title"],
                event_type=e["event_type"],
                date=e["date"],
                start_time=e["start_time"],
                end_time=e.get("end_time"),
                venue=e["venue"],
                opponent=e.get("opponent"),
                sport=e["sport"],
                description=e.get("description"),
                max_participants=30,
                registration_deadline=e["date"] - timedelta(days=1),
                event_status=EventStatus.SCHEDULED,
                is_registration_open=True,
                created_by=e["created_by"],
            )
            db.add(event)
            db.flush()
            created_events[e["title"]] = event
            print(f"  [OK] Created Event: [{e['sport']}] {e['title']}")

        db.commit()

        # -----------------------------------------------------------------------
        # 6. ATTENDANCE & RATINGS
        # -----------------------------------------------------------------------
        badminton_today_event = created_events.get("Badminton Smash & Footwork Drill")
        if badminton_today_event and alex_member:
            att = Attendance(
                event_id=badminton_today_event.id,
                user_id=alex_member.id,
                status=AttendanceStatus.PRESENT,
                remarks="Excellent stamina and precise net play during drills.",
                rating=9,
                marked_by=maya_coach.id,
            )
            db.add(att)
            print(f"  [OK] Marked Attendance & Rating (9/10) for Alex Carter in Badminton")

        db.commit()

        # -----------------------------------------------------------------------
        # 7. CERTIFICATES
        # -----------------------------------------------------------------------
        if alex_member:
            cert = Certificate(
                member_id=alex_member.id,
                sport_name="Badminton",
                title="Badminton Intermediate Mastery Certification",
                issued_by="Coach Maya Singh",
                issued_date=datetime.now(timezone.utc) - timedelta(days=15)
            )
            db.add(cert)
            print(f"  [OK] Created Certificate for Alex Carter: Badminton Intermediate Mastery")

        db.commit()

        # -----------------------------------------------------------------------
        # 8. ANNOUNCEMENTS
        # -----------------------------------------------------------------------
        announcements_data = [
            {
                "title": "Welcome to the Sports Isolation Portal!",
                "message": "All sports activities, equipment utilities, and venue bookings are now strictly segregated per sport.",
            },
            {
                "title": "Equipment Borrowing Guidelines",
                "message": "Members can issue sport-specific equipment for 1-12 hours directly from the Sport Equipment & Utility House section.",
            },
        ]

        if admin_user:
            for a in announcements_data:
                announcement = Announcement(
                    title=a["title"],
                    message=a["message"],
                    created_by=admin_user.id,
                )
                db.add(announcement)
                print(f"  [OK] Created Announcement: {a['title'][:40]}")

        db.commit()

        # -----------------------------------------------------------------------
        # 9. PAYMENTS (INITIAL 1-MONTH PAYMENT)
        # -----------------------------------------------------------------------
        from app.common.enums import PaymentModel, InvoiceStatus

        for member_email in ["badmintonuser@sportsclub.com", "footballuser@sportsclub.com", "cricketuser@sportsclub.com", "alex.carter@sportsclub.com"]:
            u = created_users.get(member_email)
            if u:
                pmt = Payment(
                    member_id=u.id,
                    amount=1500.0,
                    payment_model=PaymentModel.MONTHLY,
                    invoice_status=InvoiceStatus.PAID,
                    due_date=today,
                    paid_date=today,
                )
                db.add(pmt)
                print(f"  [OK] Created Initial Payment record for {u.first_name} {u.last_name}")

        db.commit()

        print("\n[DONE] Seed complete!")
        print("\nLogin credentials:")
        print("-" * 65)
        print("  Admin:  admin@sportsclub.com         | Admin@123  (All Sports)")
        print("  Coaches (1 per sport): <sport>coach@sportsclub.com / coach")
        print("  Members (1 per sport): <sport>user@sportsclub.com  / user")
        print("-" * 65)

    except Exception as e:
        db.rollback()
        print(f"\n[ERROR] Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
