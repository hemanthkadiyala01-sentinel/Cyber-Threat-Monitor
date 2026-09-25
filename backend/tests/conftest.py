import os
import tempfile
from pathlib import Path

_TEST_ROOT = Path(tempfile.mkdtemp(prefix="ctm-tests-"))
os.environ["CTM_DB_PATH"] = str(_TEST_ROOT / "test.db")

import pytest


@pytest.fixture(autouse=True)
def clean_database():
    import app.db as db

    with db.get_connection() as connection:
        connection.executescript("""
        DELETE FROM analyst_actions;
        DELETE FROM incident_alerts;
        DELETE FROM incidents;
        DELETE FROM alerts;
        DELETE FROM events;
        """)
    yield
