"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[836],{3905:(e,r,t)=>{t.d(r,{Zo:()=>l,kt:()=>h});var o=t(7294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function n(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function s(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?n(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):n(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,o,a=function(e,r){if(null==e)return{};var t,o,a={},n=Object.keys(e);for(o=0;o<n.length;o++)t=n[o],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(o=0;o<n.length;o++)t=n[o],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var c=o.createContext({}),u=function(e){var r=o.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):s(s({},r),e)),t},l=function(e){var r=u(e.components);return o.createElement(c.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return o.createElement(o.Fragment,{},r)}},d=o.forwardRef((function(e,r){var t=e.components,a=e.mdxType,n=e.originalType,c=e.parentName,l=i(e,["components","mdxType","originalType","parentName"]),d=u(t),h=a,f=d["".concat(c,".").concat(h)]||d[h]||p[h]||n;return t?o.createElement(f,s(s({ref:r},l),{},{components:t})):o.createElement(f,s({ref:r},l))}));function h(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var n=t.length,s=new Array(n);s[0]=d;var i={};for(var c in r)hasOwnProperty.call(r,c)&&(i[c]=r[c]);i.originalType=e,i.mdxType="string"==typeof e?e:a,s[1]=i;for(var u=2;u<n;u++)s[u]=t[u];return o.createElement.apply(null,s)}return o.createElement.apply(null,t)}d.displayName="MDXCreateElement"},3584:(e,r,t)=>{t.r(r),t.d(r,{contentTitle:()=>s,default:()=>l,frontMatter:()=>n,metadata:()=>i,toc:()=>c});var o=t(7462),a=(t(7294),t(3905));const n={},s="Frequently Asked Questions",i={unversionedId:"faq",id:"faq",isDocsHomePage:!1,title:"Frequently Asked Questions",description:"How do I get started?",source:"@site/docs/faq.md",sourceDirName:".",slug:"/faq",permalink:"/docs/faq",editUrl:"https://github.com/assafelovic/gpt-researcher/tree/master/docs/docs/faq.md",tags:[],version:"current",frontMatter:{}},c=[{value:"How do I get started?",id:"how-do-i-get-started",children:[],level:3},{value:"What is GPT Researcher?",id:"what-is-gpt-researcher",children:[],level:3},{value:"How much does each research run cost?",id:"how-much-does-each-research-run-cost",children:[],level:3},{value:"How do you ensure the report is factual and accurate?",id:"how-do-you-ensure-the-report-is-factual-and-accurate",children:[],level:3},{value:"What are your plans for the future?",id:"what-are-your-plans-for-the-future",children:[],level:3}],u={toc:c};function l(e){let{components:r,...t}=e;return(0,a.kt)("wrapper",(0,o.Z)({},u,t,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"frequently-asked-questions"},"Frequently Asked Questions"),(0,a.kt)("h3",{id:"how-do-i-get-started"},"How do I get started?"),(0,a.kt)("p",null,"It really depends on what you're aiming for. "),(0,a.kt)("p",null,"If you're looking to connect your AI application to the internet with Tavily tailored API, check out the ",(0,a.kt)("a",{parentName:"p",href:"https://docs.tavily.com/docs/tavily-api/introductionn"},"Tavily API")," documentation.\nIf you're looking to build and deploy our open source autonomous research agent GPT Researcher, please see ",(0,a.kt)("a",{parentName:"p",href:"/docs/gpt-researcher/introduction"},"GPT Researcher")," documentation.\nYou can also check out demos and examples for inspiration ",(0,a.kt)("a",{parentName:"p",href:"/docs/examples/examples"},"here"),"."),(0,a.kt)("h3",{id:"what-is-gpt-researcher"},"What is GPT Researcher?"),(0,a.kt)("p",null,"GPT Researcher is a popular open source autonomous research agent that takes care of the tedious task of research for you, by scraping, filtering and aggregating over 20+ web sources per a single research task."),(0,a.kt)("p",null,"GPT Researcher is built with best practices for leveraging LLMs (prompt engineering, RAG, chains, embeddings, etc), and is optimized for quick and efficient research. It is also fully customizable and can be tailored to your specific needs."),(0,a.kt)("p",null,"To learn more about GPT Researcher, check out the ",(0,a.kt)("a",{parentName:"p",href:"/docs/gpt-researcher/introduction"},"documentation page"),"."),(0,a.kt)("h3",{id:"how-much-does-each-research-run-cost"},"How much does each research run cost?"),(0,a.kt)("p",null,"A research task using GPT Researcher costs around $0.01 per a single run (for GPT-4 usage). We're constantly optimizing LLM calls to reduce costs and improve performance. "),(0,a.kt)("h3",{id:"how-do-you-ensure-the-report-is-factual-and-accurate"},"How do you ensure the report is factual and accurate?"),(0,a.kt)("p",null,"we do our best to ensure that the information we provide is factual and accurate. We do this by using multiple sources, and by using proprietary AI to score and rank the most relevant and accurate information. We also use proprietary AI to filter out irrelevant information and sources."),(0,a.kt)("p",null,"Lastly, by using RAG and other techniques, we ensure that the information is relevant to the context of the research task, leading to more accurate generative AI content and reduced hallucinations."),(0,a.kt)("h3",{id:"what-are-your-plans-for-the-future"},"What are your plans for the future?"),(0,a.kt)("p",null,"We're constantly working on improving our products and services. We're currently working on improving our search API together with design partners, and adding more data sources to our search engine. We're also working on improving our research agent GPT Researcher, and adding more features to it while growing our amazing open source community."),(0,a.kt)("p",null,"If you're interested in our roadmap or looking to collaborate, check out our ",(0,a.kt)("a",{parentName:"p",href:"https://trello.com/b/3O7KBePw/gpt-researcher-roadmap"},"roadmap page"),". "),(0,a.kt)("p",null,"Feel free to ",(0,a.kt)("a",{parentName:"p",href:"mailto:assafelovic@gmail.com"},"contact us")," if you have any further questions or suggestions!"))}l.isMDXComponent=!0}}]);