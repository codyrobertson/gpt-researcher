import os
from typing import Any

OPENAI_EMBEDDING_MODEL = os.environ.get(
    "OPENAI_EMBEDDING_MODEL", "text-embedding-3-small"
)

_SUPPORTED_PROVIDERS = {
    "openai",
    "azure_openai", 
    "cohere",
    "google_vertexai",
    "google_genai",
    "fireworks",
    "ollama",
    "together", 
    "mistralai",
    "huggingface",
    "nomic",
    "voyageai",
    "dashscope",
    "custom",
    "bedrock",
}

class Memory:
    def __init__(self, embedding_provider: str, model: str, **embdding_kwargs: Any):
        self._embeddings = self._get_embeddings(embedding_provider, model, embdding_kwargs)

    def _get_embeddings(self, embedding_provider: str, model: str, embdding_kwargs: Any):
        if embedding_provider == "custom":
            from langchain_openai import OpenAIEmbeddings
            return OpenAIEmbeddings(
                model=model,
                openai_api_key=os.getenv("OPENAI_API_KEY", "custom"),
                openai_api_base=os.getenv(
                    "OPENAI_BASE_URL", "http://localhost:1234/v1"
                ),
                check_embedding_ctx_length=False,
                **embdding_kwargs,
            )
        elif embedding_provider == "openai":
            from langchain_openai import OpenAIEmbeddings
            return OpenAIEmbeddings(model=model, **embdding_kwargs)
        elif embedding_provider == "azure_openai":
            from langchain_openai import AzureOpenAIEmbeddings
            return AzureOpenAIEmbeddings(
                model=model,
                azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
                openai_api_key=os.environ["AZURE_OPENAI_API_KEY"],
                openai_api_version=os.environ["AZURE_OPENAI_API_VERSION"],
                **embdding_kwargs,
            )
        elif embedding_provider == "cohere":
            from langchain_cohere import CohereEmbeddings
            return CohereEmbeddings(model=model, **embdding_kwargs)
        elif embedding_provider == "google_vertexai":
            from langchain_google_vertexai import VertexAIEmbeddings
            return VertexAIEmbeddings(model=model, **embdding_kwargs)
        elif embedding_provider == "google_genai":
            from langchain_google_genai import GoogleGenerativeAIEmbeddings
            return GoogleGenerativeAIEmbeddings(model=model, **embdding_kwargs)
        elif embedding_provider == "fireworks":
            from langchain_fireworks import FireworksEmbeddings
            return FireworksEmbeddings(model=model, **embdding_kwargs)
        elif embedding_provider == "ollama":
            from langchain_ollama import OllamaEmbeddings
            return OllamaEmbeddings(
                model=model,
                base_url=os.environ["OLLAMA_BASE_URL"],
                **embdding_kwargs,
            )
        elif embedding_provider == "together":
            from langchain_together import TogetherEmbeddings
            return TogetherEmbeddings(model=model, **embdding_kwargs)
        elif embedding_provider == "mistralai":
            from langchain_mistralai import MistralAIEmbeddings
            return MistralAIEmbeddings(model=model, **embdding_kwargs)
        elif embedding_provider == "huggingface":
            from langchain_huggingface import HuggingFaceEmbeddings
            return HuggingFaceEmbeddings(model_name=model, **embdding_kwargs)
        elif embedding_provider == "nomic":
            from langchain_nomic import NomicEmbeddings
            return NomicEmbeddings(model=model, **embdding_kwargs)
        elif embedding_provider == "voyageai":
            from langchain_voyageai import VoyageAIEmbeddings
            return VoyageAIEmbeddings(
                voyage_api_key=os.environ["VOYAGE_API_KEY"],
                model=model,
                **embdding_kwargs,
            )
        elif embedding_provider == "dashscope":
            from langchain_community.embeddings import DashScopeEmbeddings
            return DashScopeEmbeddings(model=model, **embdding_kwargs)
        elif embedding_provider == "bedrock":
            from langchain_aws.embeddings import BedrockEmbeddings
            return BedrockEmbeddings(model_id=model, **embdding_kwargs)
        else:
            raise Exception("Embedding not found.")

    def get_embeddings(self):
        return self._embeddings