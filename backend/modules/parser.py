import pdfplumber
import io


def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        text_parts = []
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                try:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
                except Exception as e:
                    print(f"Error on page extraction: {e}")
                    continue
        return "\n".join(text_parts)
    except Exception as e:
        print(f"pdfplumber Error: {e}")
        return "Extraction failed. Manual review needed."
