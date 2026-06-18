from sentence_transformers import SentenceTransformer

model = None


def get_model():
    global model

    if model is None:
        model = SentenceTransformer("all-MiniLM-L6-v2")

    return model


def generate_embeddings(chunks):

    texts = [chunk["text"] for chunk in chunks]

    embeddings = get_model().encode(texts)

    return embeddings