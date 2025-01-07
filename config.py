from langchain_community.embeddings import OpenAIEmbeddings, HuggingFaceEmbeddings
import os
from dotenv import load_dotenv

class Config:
    def __init__(self, config_path: str | None = None):
        load_dotenv(config_path)
        
        # Use if-elif instead of match statement
        embedding_provider = os.environ.get("EMBEDDING_PROVIDER", "openai")
        if embedding_provider == "openai":
            self.embedding = OpenAIEmbeddings()
        elif embedding_provider == "huggingface":
            self.embedding = HuggingFaceEmbeddings()
        else:
            raise ValueError(f"Unsupported embedding provider: {embedding_provider}")