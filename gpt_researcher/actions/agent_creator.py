import json
import re
import logging
from openai import RateLimitError, APIError
from ..utils.llm import create_chat_completion
from ..prompts import auto_agent_instructions

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

async def choose_agent(
    query, cfg, parent_query=None, cost_callback: callable = None, headers=None
):
    """
    Chooses the agent automatically
    Args:
        parent_query: In some cases the research is conducted on a subtopic from the main query.
        The parent query allows the agent to know the main context for better reasoning.
        query: original query
        cfg: Config
        cost_callback: callback for calculating llm costs

    Returns:
        agent: Agent name
        agent_role_prompt: Agent role prompt
    """
    query = f"{parent_query} - {query}" if parent_query else f"{query}"

    try:
        response = await create_chat_completion(
            model=cfg.smart_llm_model,
            messages=[
                {"role": "system", "content": f"{auto_agent_instructions()}"},
                {"role": "user", "content": f"task: {query}"},
            ],
            temperature=0.15,
            llm_provider=cfg.smart_llm_provider,
            llm_kwargs=cfg.llm_kwargs,
            cost_callback=cost_callback,
        )

        # Handle empty response
        if not response:
            logger.warning("Empty response from LLM, using default agent")
            return get_default_agent()

        # Try to parse JSON response
        try:
            agent_dict = json.loads(response)
            return agent_dict["server"], agent_dict["agent_role_prompt"]
        except json.JSONDecodeError:
            logger.warning("Failed to parse JSON response, trying regex extraction")
            return await handle_json_error(response)

    except RateLimitError as e:
        logger.error(f"OpenAI API rate limit exceeded: {str(e)}")
        return get_default_agent()
    except APIError as e:
        logger.error(f"OpenAI API error: {str(e)}")
        return get_default_agent()
    except Exception as e:
        logger.error(f"Error in agent creation: {str(e)}")
        return get_default_agent()

def get_default_agent():
    """Returns the default agent configuration"""
    return "research-agent", (
        "You are an AI critical thinker research assistant. Your sole purpose is to write well written, "
        "critically acclaimed, objective and structured reports on given text."
    )

async def handle_json_error(response):
    """Handle JSON parsing errors"""
    try:
        if not isinstance(response, str):
            logger.warning("Response is not a string, using default agent")
            return get_default_agent()

        # Try to extract JSON using regex
        json_string = extract_json_with_regex(response)
        if json_string:
            try:
                agent_dict = json.loads(json_string)
                return agent_dict["server"], agent_dict["agent_role_prompt"]
            except (json.JSONDecodeError, KeyError) as e:
                logger.error(f"Failed to parse extracted JSON: {str(e)}")
                return get_default_agent()
        else:
            logger.warning("Could not extract JSON from response")
            return get_default_agent()

    except Exception as e:
        logger.error(f"Error handling JSON: {str(e)}")
        return get_default_agent()

def extract_json_with_regex(response):
    """Extract JSON from response using regex"""
    try:
        if not isinstance(response, str):
            return None
        # Look for JSON-like structure with server and agent_role_prompt
        json_match = re.search(r'{\s*"server"\s*:.*?"agent_role_prompt"\s*:.*?}', response, re.DOTALL)
        return json_match.group(0) if json_match else None
    except Exception as e:
        logger.error(f"Error extracting JSON: {str(e)}")
        return None