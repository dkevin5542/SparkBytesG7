import sqlite3

def get_db_connection():
    """
    get_db_connection() establishes a connection to the SQLite database.

    Returns:
        sqlite3.connection: Database connection object with rows returned as dictionaries.
    Raises:
        RuntimeError: If there's an error connecting to the database.
    """
    try:
        conn = sqlite3.connect('database.db')
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        raise RuntimeError(f"Database connection error: {e}")
