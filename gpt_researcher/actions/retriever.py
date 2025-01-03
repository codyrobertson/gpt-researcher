from typing import List, Type
from ..config.config import Config

def get_retriever(retriever):
    """
    Gets the retriever
    Args:
        retriever: retriever name

    Returns:
        retriever: Retriever class
    """
    if retriever == "google":
        from gpt_researcher.retrievers import GoogleSearch
        retriever = GoogleSearch
    elif retriever == "searx":
        from gpt_researcher.retrievers import SearxSearch
        retriever = SearxSearch
    elif retriever == "searchapi":
        from gpt_researcher.retrievers import SearchApiSearch
        retriever = SearchApiSearch
    elif retriever == "serpapi":
        from gpt_researcher.retrievers import SerpApiSearch
        retriever = SerpApiSearch
    elif retriever == "serper":
        from gpt_researcher.retrievers import SerperSearch
        retriever = SerperSearch
    elif retriever == "duckduckgo":
        from gpt_researcher.retrievers import Duckduckgo
        retriever = Duckduckgo
    elif retriever == "bing":
        from gpt_researcher.retrievers import BingSearch
        retriever = BingSearch
    elif retriever == "arxiv":
        from gpt_researcher.retrievers import ArxivSearch
        retriever = ArxivSearch
    elif retriever == "tavily":
        from gpt_researcher.retrievers import TavilySearch
        retriever = TavilySearch
    elif retriever == "exa":
        from gpt_researcher.retrievers import ExaSearch
        retriever = ExaSearch
    elif retriever == "semantic_scholar":
        from gpt_researcher.retrievers import SemanticScholarSearch
        retriever = SemanticScholarSearch
    elif retriever == "pubmed_central":
        from gpt_researcher.retrievers import PubMedCentralSearch
        retriever = PubMedCentralSearch
    elif retriever == "custom":
        from gpt_researcher.retrievers import CustomRetriever
        retriever = CustomRetriever
    else:
        retriever = None

    return retriever


def get_retrievers(headers, cfg):
    """
    Determine which retriever(s) to use based on headers, config, or default.

    Args:
        headers (dict): The headers dictionary
        cfg (Config): The configuration object

    Returns:
        list: A list of retriever classes to be used for searching.
    """
    # Check headers first for multiple retrievers
    if headers.get("retrievers"):
        retrievers = headers.get("retrievers").split(",")
    # If not found, check headers for a single retriever
    elif headers.get("retriever"):
        retrievers = [headers.get("retriever")]
    # If not in headers, check config for multiple retrievers
    elif cfg.retrievers:
        retrievers = cfg.retrievers
    # If not found, check config for a single retriever
    elif cfg.retriever:
        retrievers = [cfg.retriever]
    # If still not set, use default retriever
    else:
        retrievers = [get_default_retriever().__name__]

    # Convert retriever names to actual retriever classes
    # Use get_default_retriever() as a fallback for any invalid retriever names
    return [get_retriever(r) or get_default_retriever() for r in retrievers]


def get_default_retriever():
    from gpt_researcher.retrievers import TavilySearch
    return TavilySearch