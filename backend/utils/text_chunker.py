def split_text_into_chunks(pages, chunk_size=500):

    chunks = []

    for page in pages:

        page_number = page["page_number"]
        text = page["text"]

        for i in range(0, len(text), chunk_size):

            chunk_data = {
                "page_number": page_number,
                "text": text[i:i + chunk_size]
            }

            chunks.append(chunk_data)

    return chunks