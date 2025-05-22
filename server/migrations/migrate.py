import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from data.db import engine, Base, ChatMessage
from sqlalchemy import text

def migrate():
    # Drop the chat_messages table if it exists
    with engine.connect() as conn:
        conn.execute(text("DROP TABLE IF EXISTS chat_messages CASCADE"))
        conn.commit()

    # Recreate tables
    Base.metadata.create_all(bind=engine, tables=[ChatMessage.__table__])
    print("Migration completed successfully")

if __name__ == "__main__":
    migrate()
