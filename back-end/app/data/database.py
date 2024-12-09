import sqlite3
import os

def get_db_connection():
    """
    get_db_connection() establishes a connection to the SQLite database.

    Returns:
        sqlite3.connection: Database connection object with rows returned as dictionaries.
    Raises:
        RuntimeError: If there's an error connecting to the database.
    """

    try:
        db_path = os.path.join(os.path.dirname(__file__), 'database.db')
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    except sqlite3.Error as e:
        raise RuntimeError(f"Database connection error: {e}")
