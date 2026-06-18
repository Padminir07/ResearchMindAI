import chromadb
import uuid

# Persistent Chroma client
client = chromadb.PersistentClient(path="chroma_db")

# Create collection
collection = client.get_or_create_collection(
    name="researchmind_collection"
)


def store_embeddings(chunks, embeddings, filename):

    # Delete all old documents
    try:
        all_data = collection.get()

        if all_data["ids"]:
            collection.delete(ids=all_data["ids"])

    except Exception as e:
        print("Delete error:", e)

    ids = [str(uuid.uuid4()) for _ in range(len(chunks))]

    metadatas = [
        {
            "filename": filename,
            "page_number": chunks[i]["page_number"],
            "chunk_number": i + 1
        }
        for i in range(len(chunks))
    ]

    documents = [chunk["text"] for chunk in chunks]

    collection.add(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas
    )


def get_uploaded_pdfs():

    data = collection.get()

    pdf_names = set()

    for metadata in data["metadatas"]:
        pdf_names.add(metadata["filename"])

    return list(pdf_names)