import sqlite3
import os

db_path = os.path.join('backend', 'instance', 'jsharpix.db')
print('BD en: ' + os.path.abspath(db_path))

columns = [
    "ALTER TABLE users ADD COLUMN share_token VARCHAR(20)",
    "ALTER TABLE users ADD COLUMN share_token_expires DATETIME",
]

conn = sqlite3.connect(db_path)
cursor = conn.cursor()
for sql in columns:
    try:
        cursor.execute(sql)
        print('OK: ' + sql[:60])
    except Exception as e:
        print('SKIP: ' + str(e))
conn.commit()
conn.close()
print('Listo!')