
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { hr, p } from '../markdown';

const introduce_cn = `
  欢迎来到 QnA3 ! 🎉 \n\n

  QnA3 是一个集成了 web3 数据的人工智能聊天机器人。在这里，你能以交谈的形式探索以下信息🔍：

  📘 **Web3 知识**：我们汇总了大量的研报、技术文档、博客内容，用于帮助你更深入地理解 Web3 的世界。

  📰 **最新新闻**：我们实时更新各类关于 web3 的新闻，包括媒体文章、Twitter 内容等，帮你紧跟最新的行业动态。

  📈 **实时数据**：我们提供链上数据、项目数据、融资数据等最新信息，让你随时掌握最准确的数据资讯。 \n\n
  
  --- 
  
  如何开启你的 QnA3 之旅呢？ \n\n

  1️⃣ 只需将你想要了解的问题通过自然语言描述出来，QnA3 就能帮你找到答案。 \n\n

  2️⃣ 如果你清楚想要查询的数据具体来自哪个数据源，可以在数据源中点击多选项进行选择。 \n\n

  3️⃣ 如果选择了 "自动" 选项，QnA3 将根据你的语言和上下文内容，智能地帮你选择最匹配的数据源。 \n\n

  ---

  **请注意**
  
  💡 目前的 QnA3 仍处于最初的 Demo 阶段，我们热切欢迎你随时提出反馈和建议，这对我们完善产品非常有帮助。📝

  💡 另外，QnA3 的知识库还在建设中，目前主要提供**Layer2**相关公司的数据。在你测试使用时，如果能尽可能地提问关于 Layer2 的问题，我们将非常感激。这将对我们优化知识库和提升服务质量有极大的帮助。

  ---
  开始使用 QnA3，尽享 web3 世界的无限魅力吧！🚀 \n\n
`
const introduce_en = `
  Welcome to QnA3 ! 🎉

  QnA3 is an AI chatbot integrated with web3 data. Here, you can explore the following information through conversation🔍:

  📘 **Web3 Knowledge**: We have collected a wealth of reports, technical documents, and blog content to help you delve deeper into the world of Web3.

  📰 **Latest News**: We update various web3-related news in real-time, including media articles, Twitter content, etc., to help you keep up with the latest industry trends.

  📈 **Real-Time Data**: We provide the latest information such as on-chain data, project data, financing data, etc., allowing you to grasp the most accurate data information at any time.

  --- 


  So, how do you start your journey with QnA3?

  1️⃣ Simply describe the problem you want to understand in natural language, and QnA3 can help you find the answer.

  2️⃣ If you know exactly from which data source you want to query, you can select from the multi-options in the data source.

  3️⃣ If you choose the "automatic" option, QnA3 will intelligently help you choose the most matching data source based on your language and context.

  ---

  💡 Please note that the current QnA3 is still in the early Demo stage, and we warmly welcome you to provide feedback and suggestions at any time, which is of great help to us to improve the product.📝

  💡 In addition, the QnA3 knowledge base is still under construction, currently mainly providing data from **Layer2 related companies**. When you test it, if you can ask as many questions about Layer2 as possible, we would greatly appreciate it. This will be of great help to us to optimize the knowledge base and improve service quality.

  ---
  
  Start using QnA3 and enjoy the endless charm of the web3 world!🚀

`

const questions_cn = ['EIP 4844 将对以太坊带来什么样的改变？', 'Optimism 上有多少活跃用户？', 'zkML 具体的工作原理是什么？']
const questions_en = ['what may change after EIP 4844?', 'How many active users were there on Optimism?', 'What is the working principle of zkML?']
export default ({ onClickDefaultQuestion }: any) => {
  const { t, i18n } = useTranslation();
  const questions = i18n.language === 'en' ? questions_en : questions_cn

  return (
    <div className="text-base border border-gray-100 rounded-md mt-4  md:gap-4 m-auto p-4 md:py-6 transition-all ease-in-out md:max-w-3xl lg:max-w-3xl xl:max-w-4xl">
      <ReactMarkdown
        linkTarget='_new'
        components={{
          p,
          hr
        }}
      >
        {i18n.language === 'zh-CN' ? introduce_cn : introduce_en}
      </ReactMarkdown>
      <div>
        {questions.map((item: string) => {
          return (
            <div key={item} >
              <div onClick={() => onClickDefaultQuestion(item)} className='text-xs max-w-max min-w-0 px-2 rounded-full border border-violet-600 text-violet-600 hover:text-violet-800 mb-2 cursor-pointer'>{item}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
