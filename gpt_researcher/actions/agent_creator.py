import json
import re
import json_repair
from ..utils.llm import create_chat_completion
from ..prompts import auto_agent_instructions

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

        if not response:
            raise ValueError("Empty response from LLM")

        agent_dict = json.loads(response)
        return agent_dict["server"], agent_dict["agent_role_prompt"]

    except Exception as e:
        print(f"⚠️ Error in agent creation: {str(e)}")
        print("Falling back to Default Agent.")
        return "Default Agent", (
            "You are an AI critical thinker research assistant. Your sole purpose is to write well written, "
            "critically acclaimed, objective and structured reports on given text."
        )


async def handle_json_error(response):
    if not response:
        print("No response received. Falling back to Default Agent.")
        return "Default Agent", (
            "You are an AI critical thinker research assistant. Your sole purpose is to write well written, "
            "critically acclaimed, objective and structured reports on given text."
        )

    try:
        agent_dict = json_repair.loads(response)
        if agent_dict.get("server") and agent_dict.get("agent_role_prompt"):
            return agent_dict["server"], agent_dict["agent_role_prompt"]
    except Exception as e:
        print(f"Error using json_repair: {e}")

    try:
        json_string = extract_json_with_regex(response)
        if json_string:
            json_data = json.loads(json_string)
            return json_data["server"], json_data["agent_role_prompt"]
    except (TypeError, json.JSONDecodeError) as e:
        print(f"Error processing JSON: {e}")

    print("Falling back to Default Agent.")
    return "Default Agent", (
        "You are an AI critical thinker research assistant. Your sole purpose is to write well written, "
        "critically acclaimed, objective and structured reports on given text."
    )


def extract_json_with_regex(response):
    if not isinstance(response, (str, bytes)):
        return None
    json_match = re.search(r"{.*?}", response, re.DOTALL)
    if json_match:
        return json_match.group(0)
    return None