"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1842],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>f});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),p=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=p(e.components);return n.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=p(r),f=a,d=u["".concat(l,".").concat(f)]||u[f]||m[f]||o;return r?n.createElement(d,i(i({ref:t},c),{},{components:r})):n.createElement(d,i({ref:t},c))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var p=2;p<o;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},7690:(e,t,r)=>{r.r(t),r.d(t,{contentTitle:()=>i,default:()=>c,frontMatter:()=>o,metadata:()=>s,toc:()=>l});var n=r(7462),a=(r(7294),r(3905));const o={},i="Customization",s={unversionedId:"gpt-researcher/config",id:"gpt-researcher/config",isDocsHomePage:!1,title:"Customization",description:"The config.py enables you to customize GPT Researcher to your specific needs and preferences.",source:"@site/docs/gpt-researcher/config.md",sourceDirName:"gpt-researcher",slug:"/gpt-researcher/config",permalink:"/docs/gpt-researcher/config",editUrl:"https://github.com/assafelovic/gpt-researcher/tree/master/docs/docs/gpt-researcher/config.md",tags:[],version:"current",frontMatter:{},sidebar:"docsSidebar",previous:{title:"Getting Started",permalink:"/docs/gpt-researcher/getting-started"},next:{title:"Agent Example",permalink:"/docs/gpt-researcher/example"}},l=[],p={toc:l};function c(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"customization"},"Customization"),(0,a.kt)("p",null,"The config.py enables you to customize GPT Researcher to your specific needs and preferences."),(0,a.kt)("p",null,"Thanks to our amazing community and contributions, GPT Researcher supports multiple LLMs and Retrievers.\nIn addition, GPT Researcher can be tailored to various report formats (such as APA), word count, research iterations depth, etc."),(0,a.kt)("p",null,"GPT Researcher defaults to our recommended suite of integrations: ",(0,a.kt)("a",{parentName:"p",href:"https://platform.openai.com/docs/overview"},"OpenAI")," for LLM calls and ",(0,a.kt)("a",{parentName:"p",href:"https://app.tavily.com"},"Tavily API")," for retrieving realtime online information."),(0,a.kt)("p",null,"As seen below, OpenAI still stands as the superior LLM. We assume it will stay this way for some time, and that prices will only continue to decrease, while performance and speed increase over time."),(0,a.kt)("div",{style:{marginBottom:"10px"}},(0,a.kt)("img",{align:"center",height:"350",src:"/img/leaderboard.png"})),(0,a.kt)("p",null,"It may not come as a surprise that our default search engine is ",(0,a.kt)("a",{parentName:"p",href:"https://app.tavily.com"},"Tavily"),". We're aimed at building our search engine to tailor the exact needs of searching and aggregating for the most factual and unbiased information for research tasks.\nWe highly recommend using it with GPT Researcher, and more generally with LLM applications that are built with RAG. To learn more about our search API ",(0,a.kt)("a",{parentName:"p",href:"/docs/tavily-api/introduction"},"see here")),(0,a.kt)("p",null,"Here is an example of the default config.py file found in ",(0,a.kt)("inlineCode",{parentName:"p"},"/gpt_researcher/config/"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},'def __init__(self, config_file: str = None):\n    self.config_file = config_file\n    self.retriever = "tavily"\n    self.llm_provider = "ChatOpenAI"\n    self.fast_llm_model = "gpt-3.5-turbo-16k"\n    self.smart_llm_model = "gpt-4-1106-preview"\n    self.fast_token_limit = 2000\n    self.smart_token_limit = 4000\n    self.browse_chunk_max_length = 8192\n    self.summary_token_limit = 700\n    self.temperature = 0.6\n    self.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)" \\\n                      " Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0"\n    self.memory_backend = "local"\n    self.total_words = 1000\n    self.report_format = "apa"\n    self.max_iterations = 1\n\n    self.load_config_file()\n')),(0,a.kt)("p",null,"Please note that you can also include your own external JSON file by adding the path in the ",(0,a.kt)("inlineCode",{parentName:"p"},"config_file")," param."),(0,a.kt)("p",null,"To learn more about additional LLM support you can check out the ",(0,a.kt)("a",{parentName:"p",href:"https://python.langchain.com/docs/guides/adapters/openai"},"Langchain Adapter")," and ",(0,a.kt)("a",{parentName:"p",href:"https://python.langchain.com/docs/integrations/llms/"},"Langchain supported LLMs")," documentation. Simply pass different model names in the ",(0,a.kt)("inlineCode",{parentName:"p"},"llm_provider")," config param."),(0,a.kt)("p",null,"You can also change the search engine by modifying the ",(0,a.kt)("inlineCode",{parentName:"p"},"retriever")," param to others such as ",(0,a.kt)("inlineCode",{parentName:"p"},"duckduckgo"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"googleAPI"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"googleSerp"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"searx")," and more. "),(0,a.kt)("p",null,"Please note that you might need to sign up and obtain an API key for any of the other supported retrievers and LLM providers."))}c.isMDXComponent=!0}}]);