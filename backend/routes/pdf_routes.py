from fastapi import APIRouter, UploadFile, File
import os
from services.pdf_service import extract_text_from_pdf
from utils.text_chunker import split_text_into_chunks
from services.embedding_service import generate_embeddings
from services.vector_db_service import (
    store_embeddings,
    get_uploaded_pdfs,
    collection
)
from services.search_service import search_documents
from services.chat_service import (
    generate_answer,
    generate_summary
)

router = APIRouter()
latest_uploaded_pdf = None

# -------------------- Upload PDF --------------------
@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    global latest_uploaded_pdf
    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    pages = extract_text_from_pdf(file_path)

    chunks = split_text_into_chunks(pages)

    embeddings = generate_embeddings(chunks)

    store_embeddings(
        chunks,
        embeddings,
        file.filename
    )
    latest_uploaded_pdf = file.filename
    return {
        "message": "PDF uploaded successfully",
        "filename": file.filename,
        "number_of_chunks": len(chunks),
        "embedding_dimension": len(embeddings[0])
    }


# -------------------- List Uploaded PDFs --------------------
@router.get("/pdfs")
def get_pdfs():

    pdfs = get_uploaded_pdfs()

    return {
        "uploaded_pdfs": pdfs
    }


# -------------------- Search Documents --------------------
@router.get("/search")
def search(query: str):

    results = search_documents(query)

    return {
        "query": query,
        "documents": results["documents"],
        "sources": results["metadatas"]
    }


# -------------------- Ask Questions --------------------
@router.get("/ask")
def ask(question: str):

    results = search_documents(question)

    documents = results["documents"]
    sources = results["metadatas"]

    if len(documents) == 0:
        return {
            "question": question,
            "answer": "No relevant information found.",
            "sources": []
        }

    context = "\n\n".join(documents)

    answer = generate_answer(question, context)

    return {
        "question": question,
        "answer": answer,
        "sources": sources[:5]
    }


# -------------------- Generate Summary --------------------
# -------------------- Generate Summary --------------------
@router.get("/summary")
def summary():

    global latest_uploaded_pdf

    if latest_uploaded_pdf is None:
        return {
            "summary": "No PDF uploaded."
        }

    data = collection.get(
    where={"filename": latest_uploaded_pdf}
)
    full_text = "\n\n".join(data["documents"][:5])

    summary_result = generate_summary(full_text)

    return {
        "summary": summary_result
    }