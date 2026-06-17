from services.embedding_service import model
from services.vector_db_service import collection


def search_documents(query):

    query_embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=10
    )

    documents = []
    metadatas = []
    seen = set()

    for doc, meta in zip(
        results["documents"][0],
        results["metadatas"][0]
    ):

        key = (
            meta["filename"],
            meta["page_number"],
            meta["chunk_number"]
        )

        if key not in seen:
            seen.add(key)
            documents.append(doc)
            metadatas.append(meta)

    return {
        "documents": documents,
        "metadatas": metadatas
    }