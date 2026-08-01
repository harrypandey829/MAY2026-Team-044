from enum import Enum


class UserRole(str, Enum):
    ADMIN = "Admin"
    COACH = "Coach"
    MEMBER = "Member"


class MembershipStatus(str, Enum):
    ACTIVE = "Active"
    GRACE_PERIOD = "Grace Period"
    EXPIRED = "Expired"


class PaymentModel(str, Enum):
    ANNUAL = "Annual"
    MONTHLY = "Monthly"
    PAY_PER_USE = "Pay-per-use"


class InvoiceStatus(str, Enum):
    PENDING = "Pending"
    PAID = "Paid"
    OVERDUE = "Overdue"




class EventType(str, Enum):
    PRACTICE = "Practice"
    MATCH = "Match"
    TOURNAMENT = "Tournament"
    CLUB_EVENT = "Club Event"
    HOLIDAY = "Holiday"


class EventStatus(str, Enum):
    SCHEDULED = "Scheduled"
    CANCELLED = "Cancelled"
    COMPLETED = "Completed"


class RegistrationStatus(str, Enum):
    REGISTERED = "Registered"
    NOT_ATTENDING = "Not Attending"
    WAITLIST = "Waitlist"


class AttendanceStatus(str, Enum):
    PRESENT = "Present"
    ABSENT = "Absent"
    LATE = "Late"
    EXCUSED = "Excused"