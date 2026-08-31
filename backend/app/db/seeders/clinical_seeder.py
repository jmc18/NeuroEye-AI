from datetime import UTC, date, datetime, timedelta
from uuid import uuid4

import structlog

from app.core.config import settings
from app.core.security import hash_password
from app.db.seeders.constants import (
    CLINICIAN_PROFILE_ID,
    CLINICIAN_ROLE_DESCRIPTION,
    CLINICIAN_ROLE_ID,
    CLINICIAN_ROLE_NAME,
    CLINICIAN_USER_ID,
    DEMO_CLINIC_PROFILE_ID,
    DEMO_CLINIC_ROLE_ID,
    DEMO_CLINIC_TENANT_ID,
    DEMO_CLINIC_TENANT_NAME,
    DEMO_CLINIC_USER_ID,
    FIXATION_PRESET_ID,
    SACCADES_PRESET_ID,
    SYSTEM_TENANT_ID,
)
from app.models.gaze_sample import GazeSample
from app.models.patient import Patient
from app.models.role import Role
from app.models.screening_session import ScreeningSession
from app.models.session_metrics import SessionMetrics
from app.models.tenant import Tenant
from app.models.test_preset import TestPreset
from app.models.user import User
from app.models.user_profile import UserProfile
from app.models.user_role import UserRole
from app.repositories.unit_of_work import UnitOfWork

logger = structlog.get_logger(__name__)

_DEMO_PATIENTS: list[dict[str, str | date | None]] = [
    {"first_name": "Evelyn", "last_name": "Jenkins", "sex": "F", "birth_date": date(1978, 4, 12)},
    {"first_name": "Elena", "last_name": "Rodriguez", "sex": "F", "birth_date": date(1966, 9, 3)},
    {"first_name": "Marcus", "last_name": "Chen", "sex": "M", "birth_date": date(1984, 1, 22)},
    {"first_name": "Sofia", "last_name": "Patel", "sex": "F", "birth_date": date(1991, 7, 8)},
    {"first_name": "James", "last_name": "Okoye", "sex": "M", "birth_date": date(1959, 11, 30)},
    {"first_name": "Hana", "last_name": "Nakamura", "sex": "F", "birth_date": date(1972, 2, 14)},
    {"first_name": "Luis", "last_name": "Herrera", "sex": "M", "birth_date": date(1988, 6, 19)},
    {"first_name": "Amelia", "last_name": "Brooks", "sex": "F", "birth_date": date(2001, 12, 5)},
    {"first_name": "Noah", "last_name": "Ibrahim", "sex": "M", "birth_date": date(1975, 8, 27)},
    {"first_name": "Clara", "last_name": "Moreau", "sex": "F", "birth_date": date(1969, 3, 16)},
]


async def seed_clinical_domain(uow: UnitOfWork, *, development: bool = False) -> None:
    tenant_id = SYSTEM_TENANT_ID
    role = await _get_or_create_clinician_role(uow, tenant_id)
    user = await _get_or_create_clinician_user(uow, tenant_id)
    await _get_or_create_clinician_profile(uow, user.id)
    await _get_or_create_user_role(uow, user.id, role.id)
    saccades, fixation = await _get_or_create_presets(uow, tenant_id)
    patients = await _get_or_create_patients(uow, tenant_id)
    await _get_or_create_demo_sessions(
        uow,
        tenant_id=tenant_id,
        clinician_id=user.id,
        patients=patients,
        saccades=saccades,
        fixation=fixation,
    )
    logger.info("clinical_seed_completed", development=development, patients=len(patients))


async def _get_or_create_clinician_role(uow: UnitOfWork, tenant_id: str) -> Role:
    role = await uow.roles.get_by_id(CLINICIAN_ROLE_ID)
    if role is not None:
        return role
    role = await uow.roles.get_by_name_and_tenant(CLINICIAN_ROLE_NAME, tenant_id)
    if role is not None:
        return role
    role = Role(
        id=CLINICIAN_ROLE_ID,
        tenant_id=tenant_id,
        name=CLINICIAN_ROLE_NAME,
        description=CLINICIAN_ROLE_DESCRIPTION,
    )
    await uow.roles.add(role)
    return role


async def _get_or_create_clinician_user(uow: UnitOfWork, tenant_id: str) -> User:
    user = await uow.users.get_by_id(CLINICIAN_USER_ID)
    if user is not None:
        return user
    user = await uow.users.get_by_email(settings.seed_clinician_email)
    if user is not None:
        return user
    user = User(
        id=CLINICIAN_USER_ID,
        tenant_id=tenant_id,
        email=settings.seed_clinician_email,
        hashed_password=hash_password(settings.seed_clinician_password),
        is_active=True,
    )
    await uow.users.add(user)
    logger.info("clinician_user_created", email=user.email)
    return user


async def _get_or_create_clinician_profile(uow: UnitOfWork, user_id: str) -> UserProfile:
    profile = await uow.user_profiles.get_by_id(CLINICIAN_PROFILE_ID)
    if profile is not None:
        return profile
    profile = await uow.user_profiles.get_by_user_id(user_id)
    if profile is not None:
        return profile
    profile = UserProfile(
        id=CLINICIAN_PROFILE_ID,
        user_id=user_id,
        first_name=settings.seed_clinician_first_name,
        last_name=settings.seed_clinician_last_name,
        job_title="Attending Neurologist",
    )
    await uow.user_profiles.add(profile)
    return profile


async def _get_or_create_user_role(uow: UnitOfWork, user_id: str, role_id: str) -> UserRole:
    existing = await uow.user_roles.get_by_user_and_role(user_id, role_id)
    if existing is not None:
        return existing
    user_role = UserRole(user_id=user_id, role_id=role_id)
    await uow.user_roles.add(user_role)
    return user_role


async def _get_or_create_presets(
    uow: UnitOfWork,
    tenant_id: str,
) -> tuple[TestPreset, TestPreset]:
    saccades = await uow.test_presets.get_by_id(SACCADES_PRESET_ID)
    if saccades is None:
        saccades = await uow.test_presets.get_by_code(tenant_id, "saccades")
    if saccades is None:
        saccades = TestPreset(
            id=SACCADES_PRESET_ID,
            tenant_id=tenant_id,
            code="saccades",
            name="Saccades",
            description="Horizontal saccade protocol with alternating targets.",
            config={"duration_ms": 20000, "targets": 8, "axis": "horizontal"},
        )
        await uow.test_presets.add(saccades)

    fixation = await uow.test_presets.get_by_id(FIXATION_PRESET_ID)
    if fixation is None:
        fixation = await uow.test_presets.get_by_code(tenant_id, "fixation")
    if fixation is None:
        fixation = TestPreset(
            id=FIXATION_PRESET_ID,
            tenant_id=tenant_id,
            code="fixation",
            name="Fixation",
            description="Central fixation stability protocol.",
            config={"duration_ms": 15000, "target": [0.5, 0.5]},
        )
        await uow.test_presets.add(fixation)

    return saccades, fixation


async def _get_or_create_patients(uow: UnitOfWork, tenant_id: str) -> list[Patient]:
    existing, _ = await uow.patients.list_for_tenant(tenant_id, page=1, page_size=50)
    if existing:
        return existing

    created: list[Patient] = []
    for index, row in enumerate(_DEMO_PATIENTS, start=1):
        patient = Patient(
            id=f"00000000-0000-4000-9000-{index:012d}",
            tenant_id=tenant_id,
            first_name=str(row["first_name"]),
            last_name=str(row["last_name"]),
            sex=str(row["sex"]) if row["sex"] else None,
            birth_date=row["birth_date"] if isinstance(row["birth_date"], date) else None,
            email=f"{str(row['first_name']).lower()}.{str(row['last_name']).lower()}@clinic.demo",
            notes="Seeded demo patient for the NeuroEyeAI clinical workspace.",
        )
        await uow.patients.add(patient)
        created.append(patient)
    return created


async def _get_or_create_demo_sessions(
    uow: UnitOfWork,
    *,
    tenant_id: str,
    clinician_id: str,
    patients: list[Patient],
    saccades: TestPreset,
    fixation: TestPreset,
) -> None:
    existing, total = await uow.screening_sessions.list_for_tenant(tenant_id, page=1, page_size=1)
    if total > 0:
        return

    now = datetime.now(UTC)
    specs = [
        (patients[0], saccades, 0.06, 0.22, "low"),
        (patients[1], fixation, 0.14, 0.41, "high"),
        (patients[2], saccades, 0.09, 0.33, "moderate"),
    ]

    for patient, preset, stability, amplitude, risk in specs:
        started = now - timedelta(days=2, hours=3)
        ended = started + timedelta(seconds=18)
        session = ScreeningSession(
            id=str(uuid4()),
            tenant_id=tenant_id,
            patient_id=patient.id,
            clinician_id=clinician_id,
            preset_id=preset.id,
            status="completed",
            started_at=started,
            ended_at=ended,
        )
        await uow.screening_sessions.add(session)
        await uow.session.flush()

        samples = [
            GazeSample(
                session_id=session.id,
                t_ms=index * 33,
                x_norm=0.5 + (0.02 if index % 12 == 0 else 0.0),
                y_norm=0.5,
                eye_detected=True,
                fps=30.0,
                quality=0.9,
            )
            for index in range(90)
        ]
        await uow.gaze_samples.add_many(samples)

        metrics = SessionMetrics(
            session_id=session.id,
            sample_count=90,
            mean_fps=30.0,
            detection_rate=0.96,
            mean_latency_ms=18.0,
            fixation_stability=stability,
            saccade_amplitude=amplitude,
            extras={"risk_level": risk, "seeded": True},
        )
        await uow.session_metrics.add(metrics)


async def seed_demo_clinic(uow: UnitOfWork, *, development: bool = False) -> None:
    tenant = await uow.tenants.get_by_id(DEMO_CLINIC_TENANT_ID)
    if tenant is None:
        tenant = await uow.tenants.get_by_name(DEMO_CLINIC_TENANT_NAME)
    if tenant is None:
        tenant = Tenant(
            id=DEMO_CLINIC_TENANT_ID,
            name=DEMO_CLINIC_TENANT_NAME,
            is_system=False,
        )
        await uow.tenants.add(tenant)

    role = await uow.roles.get_by_id(DEMO_CLINIC_ROLE_ID)
    if role is None:
        role = await uow.roles.get_by_name_and_tenant(CLINICIAN_ROLE_NAME, tenant.id)
    if role is None:
        role = Role(
            id=DEMO_CLINIC_ROLE_ID,
            tenant_id=tenant.id,
            name=CLINICIAN_ROLE_NAME,
            description=CLINICIAN_ROLE_DESCRIPTION,
        )
        await uow.roles.add(role)

    email = "clinician@horizon.neuroeye.ai"
    user = await uow.users.get_by_id(DEMO_CLINIC_USER_ID)
    if user is None:
        user = await uow.users.get_by_email(email)
    if user is None:
        user = User(
            id=DEMO_CLINIC_USER_ID,
            tenant_id=tenant.id,
            email=email,
            hashed_password=hash_password(settings.seed_clinician_password),
            is_active=True,
        )
        await uow.users.add(user)

    profile = await uow.user_profiles.get_by_id(DEMO_CLINIC_PROFILE_ID)
    if profile is None:
        profile = await uow.user_profiles.get_by_user_id(user.id)
    if profile is None:
        profile = UserProfile(
            id=DEMO_CLINIC_PROFILE_ID,
            user_id=user.id,
            first_name="Maya",
            last_name="Solis",
            job_title="Clinic Director",
        )
        await uow.user_profiles.add(profile)

    await _get_or_create_user_role(uow, user.id, role.id)
    logger.info("demo_clinic_seed_completed", tenant_id=tenant.id, development=development)
