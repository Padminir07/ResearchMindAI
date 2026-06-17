from sentence_transformers import SentenceTransformer

def generate_embeddings(chunks):

    model = SentenceTransformer("all-MiniLM-L6-v2")

    texts = [chunk["text"] for chunk in chunks]

    embeddings = model.encode(texts)

    return embeddings