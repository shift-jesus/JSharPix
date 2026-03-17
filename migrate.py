import sqlite3
import os

db_path = os.path.join('backend', 'instance', 'jsharpix.db')
print(f"Buscando BD en: {os.path.abspath(db_path)}")

columns = [
    "ALTER TABLE users ADD COLUMN alias VARCHAR(100)",
    "ALTER TABLE users ADD COLUMN bio TEXT",
    "ALTER TABLE users ADD COLUMN avatar VARCHAR(256)",
    "ALTER TABLE users ADD COLUMN banner VARCHAR(256)",
    "ALTER TABLE users ADD COLUMN location VARCHAR(100)",
    "ALTER TABLE users ADD COLUMN website VARCHAR(200)",
    "ALTER TABLE users ADD COLUMN gear_camera VARCHAR(100)",
    "ALTER TABLE users ADD COLUMN gear_film VARCHAR(100)",
    "ALTER TABLE users ADD COLUMN gear_lens VARCHAR(100)",
    "ALTER TABLE users ADD COLUMN gear_location VARCHAR(100)",
    "ALTER TABLE users ADD COLUMN layout VARCHAR(20) DEFAULT 'masonry'",
]

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

for sql in columns:
    try:
        cursor.execute(sql)
        print(f"OK: {sql[:60]}")
    except Exception as e:
        print(f"SKIP: {e}")

conn.commit()
conn.close()
print("Migracion completada!")