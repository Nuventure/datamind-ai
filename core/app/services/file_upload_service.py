from app.config import db

def save_uploaded_file(filename: str):
    """
    store the file like data-sheet-<uuid>
    """
    document = {
        "file_path": filename  
    }
    db.uploaded_files.insert_one(document)
    return document
