import fitz


def extract_text_from_pdf(pdf_path):

    doc = fitz.open(pdf_path)

    pages = []

    for page_number, page in enumerate(doc):

        page_data = {
            "page_number": page_number + 1,
            "text": page.get_text()
        }

        pages.append(page_data)

    return pages