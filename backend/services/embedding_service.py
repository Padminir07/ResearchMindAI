from sentence_transformers import SentenceTransformer

# Load model once
model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embeddings(chunks):

    texts = [chunk["text"] for chunk in chunks]

    embeddings = model.encode(texts)

    return embeddings