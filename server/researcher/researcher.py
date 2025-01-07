import asyncio
import json
import logging
from typing import AsyncGenerator, Dict, Any
from .config import Config
from gpt_researcher import GPTResearcher

logger = logging.getLogger(__name__)

class Researcher:
    def __init__(self, config: Config):
        self.config = config
        self.progress = 0
        self.gpt_researcher = None

    async def research_stream(self, query: str, config: Config) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Conduct research and stream progress updates.
        """
        try:
            # Initial update
            yield {
                'progress': 0,
                'message': 'Initializing research...',
                'summary': 'Starting research process'
            }

            # Initialize GPTResearcher
            self.gpt_researcher = GPTResearcher(
                query=query,
                report_type=config.report_type,
                report_source=config.source,
                tone=config.research_tone,
                verbose=config.verbose
            )

            yield {
                'progress': 10,
                'message': 'Planning research approach...',
                'summary': 'Analyzing query and determining research strategy'
            }

            # Conduct research
            yield {
                'progress': 30,
                'message': 'Gathering information...',
                'summary': 'Collecting and analyzing sources'
            }
            
            await self.gpt_researcher.conduct_research()

            yield {
                'progress': 60,
                'message': 'Analyzing gathered information...',
                'summary': 'Synthesizing information from sources'
            }

            # Generate report
            yield {
                'progress': 80,
                'message': f'Generating {config.report_type} report...',
                'summary': 'Preparing final research report'
            }

            report = await self.gpt_researcher.write_report()

            # Final result
            research_result = {
                'title': query,
                'summary': 'Research completed successfully',
                'content': report,
                'sources': self.gpt_researcher.get_research_sources(),
            }

            yield {
                'progress': 100,
                'message': 'Research completed!',
                'summary': 'Research completed successfully',
                'result': json.dumps(research_result),
                'done': True
            }

        except Exception as e:
            logger.error(f"Research error: {str(e)}")
            yield {
                'progress': 0,
                'message': f'Error: {str(e)}',
                'summary': 'Research failed',
                'error': str(e)
            } 