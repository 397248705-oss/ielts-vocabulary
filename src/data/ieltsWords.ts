import type { Difficulty, WordEntry } from '../domain/types';

type SeedWord = Omit<WordEntry, 'id' | 'source' | 'topic'>;
type TopicWord = [word: string, meaningZh: string, pos: string, difficulty: Difficulty];

const seedWords: SeedWord[] = [
  {
    word: 'abandon',
    meaningZh: '放弃；抛弃',
    pos: 'verb',
    phonetic: '/əˈbændən/',
    exampleEn: 'The plan was abandoned after costs rose sharply.',
    exampleZh: '成本大幅上升后，这个计划被放弃了。',
    difficulty: 'core'
  },
  {
    word: 'accurate',
    meaningZh: '准确的；精确的',
    pos: 'adjective',
    phonetic: '/ˈækjərət/',
    exampleEn: 'Accurate data is essential for a reliable conclusion.',
    exampleZh: '准确的数据对于得出可靠结论很重要。',
    difficulty: 'core'
  },
  {
    word: 'allocate',
    meaningZh: '分配；划拨',
    pos: 'verb',
    phonetic: '/ˈæləkeɪt/',
    exampleEn: 'The university allocated more funds to language research.',
    exampleZh: '这所大学给语言研究分配了更多资金。',
    difficulty: 'medium'
  }
];

const topicWords: Record<string, TopicWord[]> = {
  environment: [
    ['environmental policy', '环境政策', 'noun phrase', 'core'], ['climate change', '气候变化', 'noun phrase', 'core'], ['carbon emission', '碳排放', 'noun phrase', 'medium'], ['renewable energy', '可再生能源', 'noun phrase', 'core'], ['fossil fuel', '化石燃料', 'noun phrase', 'core'],
    ['biodiversity', '生物多样性', 'noun', 'advanced'], ['ecosystem', '生态系统', 'noun', 'medium'], ['habitat loss', '栖息地丧失', 'noun phrase', 'medium'], ['conservation', '保护；保存', 'noun', 'medium'], ['sustainability', '可持续性', 'noun', 'advanced'],
    ['pollution control', '污染控制', 'noun phrase', 'medium'], ['waste management', '废物管理', 'noun phrase', 'medium'], ['water scarcity', '水资源短缺', 'noun phrase', 'medium'], ['air quality', '空气质量', 'noun phrase', 'core'], ['deforestation', '森林砍伐', 'noun', 'advanced'],
    ['recycling scheme', '回收计划', 'noun phrase', 'core'], ['greenhouse gas', '温室气体', 'noun phrase', 'medium'], ['ecological balance', '生态平衡', 'noun phrase', 'advanced'], ['natural resource', '自然资源', 'noun phrase', 'core'], ['environmental awareness', '环保意识', 'noun phrase', 'core'],
    ['land degradation', '土地退化', 'noun phrase', 'advanced'], ['solar power', '太阳能', 'noun phrase', 'core'], ['wind turbine', '风力涡轮机', 'noun phrase', 'medium'], ['carbon footprint', '碳足迹', 'noun phrase', 'medium'], ['wildlife protection', '野生动物保护', 'noun phrase', 'core']
  ],
  education: [
    ['academic research', '学术研究', 'noun phrase', 'core'], ['critical thinking', '批判性思维', 'noun phrase', 'core'], ['curriculum design', '课程设计', 'noun phrase', 'medium'], ['learning outcome', '学习成果', 'noun phrase', 'medium'], ['assessment method', '评估方法', 'noun phrase', 'core'],
    ['tuition fee', '学费', 'noun phrase', 'core'], ['scholarship', '奖学金', 'noun', 'core'], ['qualification', '资格；学历', 'noun', 'core'], ['literacy', '读写能力', 'noun', 'medium'], ['numeracy', '计算能力', 'noun', 'advanced'],
    ['peer review', '同行评审', 'noun phrase', 'advanced'], ['plagiarism', '剽窃', 'noun', 'advanced'], ['seminar', '研讨课', 'noun', 'core'], ['tutorial', '辅导课', 'noun', 'medium'], ['lecture hall', '阶梯教室', 'noun phrase', 'core'],
    ['distance learning', '远程学习', 'noun phrase', 'core'], ['online course', '在线课程', 'noun phrase', 'core'], ['student motivation', '学生动机', 'noun phrase', 'medium'], ['teacher training', '教师培训', 'noun phrase', 'core'], ['educational reform', '教育改革', 'noun phrase', 'medium'],
    ['school discipline', '学校纪律', 'noun phrase', 'medium'], ['admission requirement', '录取要求', 'noun phrase', 'medium'], ['vocational education', '职业教育', 'noun phrase', 'core'], ['lifelong learning', '终身学习', 'noun phrase', 'core'], ['academic performance', '学业表现', 'noun phrase', 'medium']
  ],
  society: [
    ['social inequality', '社会不平等', 'noun phrase', 'core'], ['income gap', '收入差距', 'noun phrase', 'core'], ['public welfare', '公共福利', 'noun phrase', 'medium'], ['social mobility', '社会流动性', 'noun phrase', 'advanced'], ['community service', '社区服务', 'noun phrase', 'core'],
    ['population ageing', '人口老龄化', 'noun phrase', 'medium'], ['urban migration', '城市迁移', 'noun phrase', 'medium'], ['cultural diversity', '文化多样性', 'noun phrase', 'core'], ['social cohesion', '社会凝聚力', 'noun phrase', 'advanced'], ['minority group', '少数群体', 'noun phrase', 'medium'],
    ['gender equality', '性别平等', 'noun phrase', 'core'], ['racial discrimination', '种族歧视', 'noun phrase', 'medium'], ['volunteer work', '志愿工作', 'noun phrase', 'core'], ['civic duty', '公民责任', 'noun phrase', 'medium'], ['public service', '公共服务', 'noun phrase', 'core'],
    ['household income', '家庭收入', 'noun phrase', 'core'], ['living standard', '生活水平', 'noun phrase', 'core'], ['social norm', '社会规范', 'noun phrase', 'medium'], ['family structure', '家庭结构', 'noun phrase', 'core'], ['youth unemployment', '青年失业', 'noun phrase', 'medium'],
    ['crime prevention', '犯罪预防', 'noun phrase', 'medium'], ['public transport', '公共交通', 'noun phrase', 'core'], ['housing shortage', '住房短缺', 'noun phrase', 'medium'], ['healthcare access', '医疗可及性', 'noun phrase', 'medium'], ['social responsibility', '社会责任', 'noun phrase', 'core']
  ],
  economy: [
    ['economic growth', '经济增长', 'noun phrase', 'core'], ['financial stability', '金融稳定', 'noun phrase', 'medium'], ['market demand', '市场需求', 'noun phrase', 'core'], ['consumer behavior', '消费者行为', 'noun phrase', 'medium'], ['public spending', '公共支出', 'noun phrase', 'medium'],
    ['private sector', '私营部门', 'noun phrase', 'core'], ['tax revenue', '税收收入', 'noun phrase', 'medium'], ['government subsidy', '政府补贴', 'noun phrase', 'medium'], ['inflation rate', '通货膨胀率', 'noun phrase', 'medium'], ['cost of living', '生活成本', 'noun phrase', 'core'],
    ['labor market', '劳动力市场', 'noun phrase', 'medium'], ['job creation', '就业创造', 'noun phrase', 'core'], ['international trade', '国际贸易', 'noun phrase', 'core'], ['foreign investment', '外国投资', 'noun phrase', 'medium'], ['economic recovery', '经济复苏', 'noun phrase', 'medium'],
    ['budget deficit', '预算赤字', 'noun phrase', 'advanced'], ['household expenditure', '家庭支出', 'noun phrase', 'medium'], ['entrepreneurship', '创业精神', 'noun', 'advanced'], ['productivity', '生产率', 'noun', 'medium'], ['globalisation', '全球化', 'noun', 'medium'],
    ['income distribution', '收入分配', 'noun phrase', 'advanced'], ['trade barrier', '贸易壁垒', 'noun phrase', 'advanced'], ['manufacturing industry', '制造业', 'noun phrase', 'core'], ['service economy', '服务经济', 'noun phrase', 'medium'], ['economic inequality', '经济不平等', 'noun phrase', 'medium']
  ],
  technology: [
    ['technological innovation', '技术创新', 'noun phrase', 'core'], ['artificial intelligence', '人工智能', 'noun phrase', 'core'], ['digital literacy', '数字素养', 'noun phrase', 'medium'], ['data security', '数据安全', 'noun phrase', 'medium'], ['online privacy', '网络隐私', 'noun phrase', 'medium'],
    ['cybercrime', '网络犯罪', 'noun', 'advanced'], ['automation', '自动化', 'noun', 'medium'], ['algorithm', '算法', 'noun', 'advanced'], ['software platform', '软件平台', 'noun phrase', 'medium'], ['mobile device', '移动设备', 'noun phrase', 'core'],
    ['cloud storage', '云存储', 'noun phrase', 'medium'], ['virtual reality', '虚拟现实', 'noun phrase', 'medium'], ['remote work', '远程工作', 'noun phrase', 'core'], ['e-commerce', '电子商务', 'noun', 'core'], ['digital divide', '数字鸿沟', 'noun phrase', 'advanced'],
    ['screen time', '屏幕时间', 'noun phrase', 'core'], ['information access', '信息获取', 'noun phrase', 'core'], ['social networking', '社交网络', 'noun phrase', 'core'], ['surveillance camera', '监控摄像头', 'noun phrase', 'medium'], ['smartphone addiction', '手机成瘾', 'noun phrase', 'medium'],
    ['online banking', '网上银行', 'noun phrase', 'core'], ['facial recognition', '人脸识别', 'noun phrase', 'advanced'], ['digital payment', '数字支付', 'noun phrase', 'core'], ['internet access', '互联网接入', 'noun phrase', 'core'], ['technological progress', '技术进步', 'noun phrase', 'core']
  ],
  health: [
    ['public health', '公共卫生', 'noun phrase', 'core'], ['mental health', '心理健康', 'noun phrase', 'core'], ['balanced diet', '均衡饮食', 'noun phrase', 'core'], ['regular exercise', '规律锻炼', 'noun phrase', 'core'], ['disease prevention', '疾病预防', 'noun phrase', 'medium'],
    ['medical treatment', '医疗治疗', 'noun phrase', 'core'], ['healthcare system', '医疗体系', 'noun phrase', 'medium'], ['patient care', '病患护理', 'noun phrase', 'core'], ['life expectancy', '预期寿命', 'noun phrase', 'medium'], ['chronic disease', '慢性疾病', 'noun phrase', 'medium'],
    ['vaccination', '疫苗接种', 'noun', 'medium'], ['infection control', '感染控制', 'noun phrase', 'medium'], ['nutritional value', '营养价值', 'noun phrase', 'medium'], ['obesity', '肥胖', 'noun', 'medium'], ['stress management', '压力管理', 'noun phrase', 'core'],
    ['sleep quality', '睡眠质量', 'noun phrase', 'core'], ['work-life balance', '工作与生活平衡', 'noun phrase', 'core'], ['health education', '健康教育', 'noun phrase', 'core'], ['medical research', '医学研究', 'noun phrase', 'medium'], ['immune system', '免疫系统', 'noun phrase', 'medium'],
    ['emergency service', '急救服务', 'noun phrase', 'core'], ['hospital admission', '住院', 'noun phrase', 'medium'], ['preventive measure', '预防措施', 'noun phrase', 'medium'], ['physical wellbeing', '身体健康', 'noun phrase', 'core'], ['therapy session', '治疗课程', 'noun phrase', 'medium']
  ],
  culture: [
    ['cultural heritage', '文化遗产', 'noun phrase', 'core'], ['national identity', '国家认同', 'noun phrase', 'medium'], ['traditional festival', '传统节日', 'noun phrase', 'core'], ['historical site', '历史遗址', 'noun phrase', 'core'], ['local custom', '地方习俗', 'noun phrase', 'core'],
    ['cultural exchange', '文化交流', 'noun phrase', 'core'], ['creative industry', '创意产业', 'noun phrase', 'medium'], ['museum exhibition', '博物馆展览', 'noun phrase', 'core'], ['performing art', '表演艺术', 'noun phrase', 'medium'], ['popular culture', '大众文化', 'noun phrase', 'core'],
    ['media representation', '媒体呈现', 'noun phrase', 'advanced'], ['language preservation', '语言保护', 'noun phrase', 'medium'], ['architectural style', '建筑风格', 'noun phrase', 'medium'], ['literary work', '文学作品', 'noun phrase', 'core'], ['tourist attraction', '旅游景点', 'noun phrase', 'core'],
    ['craftsmanship', '手工艺', 'noun', 'advanced'], ['artistic expression', '艺术表达', 'noun phrase', 'medium'], ['cultural identity', '文化身份', 'noun phrase', 'medium'], ['heritage protection', '遗产保护', 'noun phrase', 'medium'], ['global culture', '全球文化', 'noun phrase', 'medium'],
    ['minority language', '少数民族语言', 'noun phrase', 'advanced'], ['public library', '公共图书馆', 'noun phrase', 'core'], ['music performance', '音乐演出', 'noun phrase', 'core'], ['film industry', '电影产业', 'noun phrase', 'core'], ['cultural tourism', '文化旅游', 'noun phrase', 'medium']
  ],
  government: [
    ['public policy', '公共政策', 'noun phrase', 'core'], ['law enforcement', '执法', 'noun phrase', 'medium'], ['tax reform', '税制改革', 'noun phrase', 'medium'], ['civil rights', '公民权利', 'noun phrase', 'medium'], ['national security', '国家安全', 'noun phrase', 'medium'],
    ['international relations', '国际关系', 'noun phrase', 'medium'], ['public administration', '公共行政', 'noun phrase', 'advanced'], ['local council', '地方议会', 'noun phrase', 'medium'], ['political participation', '政治参与', 'noun phrase', 'advanced'], ['government funding', '政府资金', 'noun phrase', 'core'],
    ['urban planning', '城市规划', 'noun phrase', 'core'], ['public consultation', '公众咨询', 'noun phrase', 'medium'], ['official guideline', '官方指南', 'noun phrase', 'medium'], ['legislation', '立法', 'noun', 'advanced'], ['regulation', '法规；监管', 'noun', 'medium'],
    ['democracy', '民主', 'noun', 'medium'], ['accountability', '问责制', 'noun', 'advanced'], ['transparency', '透明度', 'noun', 'advanced'], ['bureaucracy', '官僚体系', 'noun', 'advanced'], ['citizenship', '公民身份', 'noun', 'medium'],
    ['election campaign', '竞选活动', 'noun phrase', 'medium'], ['constitutional law', '宪法', 'noun phrase', 'advanced'], ['public authority', '公共权力机构', 'noun phrase', 'medium'], ['policy implementation', '政策执行', 'noun phrase', 'advanced'], ['social contract', '社会契约', 'noun phrase', 'advanced']
  ],
  urban: [
    ['urban infrastructure', '城市基础设施', 'noun phrase', 'core'], ['traffic congestion', '交通拥堵', 'noun phrase', 'core'], ['daily commute', '日常通勤', 'noun phrase', 'core'], ['affordable housing', '可负担住房', 'noun phrase', 'medium'], ['public space', '公共空间', 'noun phrase', 'core'],
    ['pedestrian zone', '步行区', 'noun phrase', 'medium'], ['traffic management', '交通管理', 'noun phrase', 'medium'], ['city centre', '市中心', 'noun phrase', 'core'], ['rural area', '农村地区', 'noun phrase', 'core'], ['urban sprawl', '城市蔓延', 'noun phrase', 'advanced'],
    ['population density', '人口密度', 'noun phrase', 'medium'], ['transport system', '交通系统', 'noun phrase', 'core'], ['housing estate', '住宅区', 'noun phrase', 'medium'], ['green space', '绿地', 'noun phrase', 'core'], ['road safety', '道路安全', 'noun phrase', 'core'],
    ['noise pollution', '噪音污染', 'noun phrase', 'core'], ['public facility', '公共设施', 'noun phrase', 'core'], ['municipal service', '市政服务', 'noun phrase', 'advanced'], ['community planning', '社区规划', 'noun phrase', 'medium'], ['urban renewal', '城市更新', 'noun phrase', 'medium'],
    ['smart city', '智慧城市', 'noun phrase', 'medium'], ['bicycle lane', '自行车道', 'noun phrase', 'core'], ['residential area', '住宅区', 'noun phrase', 'core'], ['commercial district', '商业区', 'noun phrase', 'medium'], ['suburban life', '郊区生活', 'noun phrase', 'core']
  ],
  work: [
    ['career prospect', '职业前景', 'noun phrase', 'core'], ['job satisfaction', '工作满意度', 'noun phrase', 'core'], ['workplace culture', '职场文化', 'noun phrase', 'medium'], ['professional development', '职业发展', 'noun phrase', 'core'], ['time management', '时间管理', 'noun phrase', 'core'],
    ['job security', '工作保障', 'noun phrase', 'core'], ['employee benefit', '员工福利', 'noun phrase', 'medium'], ['performance review', '绩效评估', 'noun phrase', 'medium'], ['remote working', '远程办公', 'noun phrase', 'core'], ['occupational stress', '职业压力', 'noun phrase', 'medium'],
    ['teamwork', '团队合作', 'noun', 'core'], ['leadership', '领导力', 'noun', 'core'], ['negotiation', '谈判', 'noun', 'medium'], ['recruitment', '招聘', 'noun', 'medium'], ['promotion opportunity', '晋升机会', 'noun phrase', 'core'],
    ['salary expectation', '薪资期望', 'noun phrase', 'core'], ['workload', '工作量', 'noun', 'core'], ['flexible schedule', '灵活时间表', 'noun phrase', 'core'], ['vocational skill', '职业技能', 'noun phrase', 'core'], ['training program', '培训项目', 'noun phrase', 'core'],
    ['workplace safety', '工作场所安全', 'noun phrase', 'medium'], ['career change', '职业转换', 'noun phrase', 'core'], ['temporary contract', '临时合同', 'noun phrase', 'medium'], ['full-time employment', '全职工作', 'noun phrase', 'core'], ['self-employment', '自雇', 'noun', 'medium']
  ],
  media: [
    ['mass media', '大众媒体', 'noun phrase', 'core'], ['news coverage', '新闻报道', 'noun phrase', 'core'], ['press freedom', '新闻自由', 'noun phrase', 'medium'], ['media bias', '媒体偏见', 'noun phrase', 'medium'], ['advertising campaign', '广告活动', 'noun phrase', 'core'],
    ['target audience', '目标受众', 'noun phrase', 'core'], ['public opinion', '公众舆论', 'noun phrase', 'core'], ['online platform', '在线平台', 'noun phrase', 'core'], ['digital content', '数字内容', 'noun phrase', 'core'], ['fake news', '虚假新闻', 'noun phrase', 'core'],
    ['information overload', '信息过载', 'noun phrase', 'medium'], ['media literacy', '媒介素养', 'noun phrase', 'medium'], ['broadcasting', '广播电视播放', 'noun', 'medium'], ['documentary film', '纪录片', 'noun phrase', 'core'], ['social influence', '社会影响', 'noun phrase', 'medium'],
    ['celebrity culture', '名人文化', 'noun phrase', 'medium'], ['consumer advertising', '消费广告', 'noun phrase', 'medium'], ['brand image', '品牌形象', 'noun phrase', 'core'], ['market research', '市场调研', 'noun phrase', 'core'], ['public relations', '公共关系', 'noun phrase', 'medium'],
    ['media regulation', '媒体监管', 'noun phrase', 'medium'], ['online forum', '在线论坛', 'noun phrase', 'core'], ['user-generated content', '用户生成内容', 'noun phrase', 'advanced'], ['subscription service', '订阅服务', 'noun phrase', 'medium'], ['streaming service', '流媒体服务', 'noun phrase', 'core']
  ],
  science: [
    ['scientific evidence', '科学证据', 'noun phrase', 'core'], ['research finding', '研究发现', 'noun phrase', 'core'], ['laboratory experiment', '实验室实验', 'noun phrase', 'core'], ['genetic engineering', '基因工程', 'noun phrase', 'advanced'], ['space exploration', '太空探索', 'noun phrase', 'medium'],
    ['renewable technology', '可再生技术', 'noun phrase', 'medium'], ['medical breakthrough', '医学突破', 'noun phrase', 'medium'], ['clinical trial', '临床试验', 'noun phrase', 'advanced'], ['data analysis', '数据分析', 'noun phrase', 'core'], ['scientific method', '科学方法', 'noun phrase', 'core'],
    ['research ethics', '研究伦理', 'noun phrase', 'advanced'], ['laboratory safety', '实验室安全', 'noun phrase', 'medium'], ['biological process', '生物过程', 'noun phrase', 'medium'], ['chemical reaction', '化学反应', 'noun phrase', 'medium'], ['physics principle', '物理原理', 'noun phrase', 'medium'],
    ['astronomical observation', '天文观测', 'noun phrase', 'advanced'], ['innovation funding', '创新资金', 'noun phrase', 'medium'], ['technical expertise', '技术专长', 'noun phrase', 'medium'], ['scientific community', '科学界', 'noun phrase', 'medium'], ['applied science', '应用科学', 'noun phrase', 'medium'],
    ['environmental science', '环境科学', 'noun phrase', 'core'], ['robotics', '机器人技术', 'noun', 'advanced'], ['biotechnology', '生物技术', 'noun', 'advanced'], ['statistical model', '统计模型', 'noun phrase', 'advanced'], ['evidence-based practice', '循证实践', 'noun phrase', 'advanced']
  ],
  transport: [
    ['public transit', '公共交通系统', 'noun phrase', 'core'], ['rail network', '铁路网络', 'noun phrase', 'medium'], ['high-speed train', '高速列车', 'noun phrase', 'core'], ['airport security', '机场安保', 'noun phrase', 'medium'], ['traffic accident', '交通事故', 'noun phrase', 'core'],
    ['road network', '道路网络', 'noun phrase', 'core'], ['fuel efficiency', '燃油效率', 'noun phrase', 'medium'], ['electric vehicle', '电动车', 'noun phrase', 'core'], ['car ownership', '汽车拥有率', 'noun phrase', 'core'], ['parking space', '停车位', 'noun phrase', 'core'],
    ['commuter train', '通勤列车', 'noun phrase', 'medium'], ['transport policy', '交通政策', 'noun phrase', 'medium'], ['freight transport', '货运', 'noun phrase', 'advanced'], ['shipping route', '航运路线', 'noun phrase', 'medium'], ['cycling infrastructure', '骑行基础设施', 'noun phrase', 'advanced'],
    ['walkability', '步行友好度', 'noun', 'advanced'], ['vehicle emission', '车辆排放', 'noun phrase', 'medium'], ['traffic regulation', '交通法规', 'noun phrase', 'medium'], ['travel demand', '出行需求', 'noun phrase', 'medium'], ['transport hub', '交通枢纽', 'noun phrase', 'medium'],
    ['bus route', '公交线路', 'noun phrase', 'core'], ['metro system', '地铁系统', 'noun phrase', 'core'], ['road maintenance', '道路维护', 'noun phrase', 'medium'], ['journey time', '出行时间', 'noun phrase', 'core'], ['air travel', '航空旅行', 'noun phrase', 'core']
  ],
  crime: [
    ['criminal justice', '刑事司法', 'noun phrase', 'advanced'], ['law-abiding citizen', '守法公民', 'noun phrase', 'medium'], ['juvenile crime', '青少年犯罪', 'noun phrase', 'medium'], ['prison sentence', '监禁刑罚', 'noun phrase', 'core'], ['rehabilitation program', '改造项目', 'noun phrase', 'medium'],
    ['community policing', '社区警务', 'noun phrase', 'advanced'], ['crime rate', '犯罪率', 'noun phrase', 'core'], ['violent crime', '暴力犯罪', 'noun phrase', 'core'], ['property crime', '财产犯罪', 'noun phrase', 'medium'], ['cyber fraud', '网络诈骗', 'noun phrase', 'medium'],
    ['identity theft', '身份盗窃', 'noun phrase', 'medium'], ['legal penalty', '法律处罚', 'noun phrase', 'medium'], ['deterrent effect', '威慑作用', 'noun phrase', 'advanced'], ['public safety', '公共安全', 'noun phrase', 'core'], ['police force', '警察队伍', 'noun phrase', 'core'],
    ['court system', '法院体系', 'noun phrase', 'core'], ['victim support', '受害者支持', 'noun phrase', 'medium'], ['crime prevention strategy', '犯罪预防策略', 'noun phrase', 'advanced'], ['surveillance system', '监控系统', 'noun phrase', 'medium'], ['legal responsibility', '法律责任', 'noun phrase', 'medium'],
    ['social disorder', '社会混乱', 'noun phrase', 'advanced'], ['drug abuse', '药物滥用', 'noun phrase', 'medium'], ['domestic violence', '家庭暴力', 'noun phrase', 'medium'], ['anti-social behavior', '反社会行为', 'noun phrase', 'advanced'], ['restorative justice', '修复性司法', 'noun phrase', 'advanced']
  ],
  food: [
    ['food security', '粮食安全', 'noun phrase', 'medium'], ['organic farming', '有机农业', 'noun phrase', 'core'], ['processed food', '加工食品', 'noun phrase', 'core'], ['fast food', '快餐', 'noun phrase', 'core'], ['balanced nutrition', '均衡营养', 'noun phrase', 'core'],
    ['food waste', '食物浪费', 'noun phrase', 'core'], ['agricultural production', '农业生产', 'noun phrase', 'medium'], ['crop yield', '作物产量', 'noun phrase', 'medium'], ['food supply chain', '食品供应链', 'noun phrase', 'advanced'], ['dietary habit', '饮食习惯', 'noun phrase', 'core'],
    ['calorie intake', '热量摄入', 'noun phrase', 'medium'], ['sugar consumption', '糖分摄入', 'noun phrase', 'medium'], ['food label', '食品标签', 'noun phrase', 'core'], ['vegetarian diet', '素食饮食', 'noun phrase', 'core'], ['local produce', '本地农产品', 'noun phrase', 'core'],
    ['global cuisine', '全球美食', 'noun phrase', 'medium'], ['eating disorder', '饮食失调', 'noun phrase', 'medium'], ['food allergy', '食物过敏', 'noun phrase', 'core'], ['meal preparation', '备餐', 'noun phrase', 'core'], ['restaurant industry', '餐饮业', 'noun phrase', 'core'],
    ['sustainable agriculture', '可持续农业', 'noun phrase', 'medium'], ['animal welfare', '动物福利', 'noun phrase', 'medium'], ['food hygiene', '食品卫生', 'noun phrase', 'core'], ['junk food', '垃圾食品', 'noun phrase', 'core'], ['home-cooked meal', '家常饭', 'noun phrase', 'core']
  ],
  energy: [
    ['energy consumption', '能源消耗', 'noun phrase', 'core'], ['energy efficiency', '能源效率', 'noun phrase', 'medium'], ['nuclear power', '核能', 'noun phrase', 'medium'], ['hydroelectric power', '水力发电', 'noun phrase', 'advanced'], ['solar panel', '太阳能板', 'noun phrase', 'core'],
    ['wind farm', '风电场', 'noun phrase', 'medium'], ['energy crisis', '能源危机', 'noun phrase', 'medium'], ['electricity grid', '电网', 'noun phrase', 'medium'], ['power station', '发电站', 'noun phrase', 'core'], ['energy demand', '能源需求', 'noun phrase', 'core'],
    ['fuel consumption', '燃料消耗', 'noun phrase', 'core'], ['oil reserve', '石油储备', 'noun phrase', 'medium'], ['gas pipeline', '天然气管道', 'noun phrase', 'medium'], ['renewable source', '可再生来源', 'noun phrase', 'medium'], ['clean energy', '清洁能源', 'noun phrase', 'core'],
    ['energy transition', '能源转型', 'noun phrase', 'advanced'], ['carbon neutral', '碳中和的', 'adjective phrase', 'advanced'], ['battery storage', '电池储能', 'noun phrase', 'medium'], ['electricity bill', '电费账单', 'noun phrase', 'core'], ['energy policy', '能源政策', 'noun phrase', 'medium'],
    ['power outage', '停电', 'noun phrase', 'core'], ['resource depletion', '资源枯竭', 'noun phrase', 'advanced'], ['industrial energy use', '工业能源使用', 'noun phrase', 'advanced'], ['domestic energy use', '家庭能源使用', 'noun phrase', 'medium'], ['energy-saving measure', '节能措施', 'noun phrase', 'medium']
  ],
  psychology: [
    ['human behavior', '人类行为', 'noun phrase', 'core'], ['emotional response', '情绪反应', 'noun phrase', 'medium'], ['cognitive development', '认知发展', 'noun phrase', 'advanced'], ['memory retention', '记忆保持', 'noun phrase', 'medium'], ['learning strategy', '学习策略', 'noun phrase', 'core'],
    ['social interaction', '社会互动', 'noun phrase', 'core'], ['peer pressure', '同伴压力', 'noun phrase', 'core'], ['personal identity', '个人身份', 'noun phrase', 'medium'], ['self-esteem', '自尊', 'noun', 'medium'], ['motivation', '动机', 'noun', 'core'],
    ['attention span', '注意力持续时间', 'noun phrase', 'medium'], ['decision-making', '决策', 'noun', 'medium'], ['risk perception', '风险感知', 'noun phrase', 'advanced'], ['behavioral change', '行为改变', 'noun phrase', 'medium'], ['mental resilience', '心理韧性', 'noun phrase', 'advanced'],
    ['stress level', '压力水平', 'noun phrase', 'core'], ['workplace burnout', '职场倦怠', 'noun phrase', 'medium'], ['positive mindset', '积极心态', 'noun phrase', 'core'], ['habit formation', '习惯形成', 'noun phrase', 'medium'], ['child development', '儿童发展', 'noun phrase', 'core'],
    ['personality trait', '人格特质', 'noun phrase', 'advanced'], ['social anxiety', '社交焦虑', 'noun phrase', 'medium'], ['emotional intelligence', '情商', 'noun phrase', 'medium'], ['group behavior', '群体行为', 'noun phrase', 'medium'], ['consumer psychology', '消费者心理', 'noun phrase', 'advanced']
  ],
  communication: [
    ['effective communication', '有效沟通', 'noun phrase', 'core'], ['body language', '肢体语言', 'noun phrase', 'core'], ['verbal communication', '口头交流', 'noun phrase', 'medium'], ['written communication', '书面交流', 'noun phrase', 'medium'], ['interpersonal skill', '人际技能', 'noun phrase', 'core'],
    ['public speaking', '公开演讲', 'noun phrase', 'core'], ['language barrier', '语言障碍', 'noun phrase', 'core'], ['cross-cultural communication', '跨文化沟通', 'noun phrase', 'advanced'], ['listening skill', '倾听技巧', 'noun phrase', 'core'], ['feedback mechanism', '反馈机制', 'noun phrase', 'medium'],
    ['online communication', '在线交流', 'noun phrase', 'core'], ['face-to-face conversation', '面对面交谈', 'noun phrase', 'core'], ['misunderstanding', '误解', 'noun', 'core'], ['negotiation skill', '谈判技巧', 'noun phrase', 'medium'], ['presentation skill', '演示技巧', 'noun phrase', 'core'],
    ['persuasive language', '有说服力的语言', 'noun phrase', 'medium'], ['formal letter', '正式信件', 'noun phrase', 'core'], ['informal expression', '非正式表达', 'noun phrase', 'medium'], ['communication technology', '通信技术', 'noun phrase', 'medium'], ['information exchange', '信息交换', 'noun phrase', 'core'],
    ['global language', '全球语言', 'noun phrase', 'core'], ['translation service', '翻译服务', 'noun phrase', 'core'], ['pronunciation practice', '发音练习', 'noun phrase', 'core'], ['language acquisition', '语言习得', 'noun phrase', 'advanced'], ['multilingual society', '多语言社会', 'noun phrase', 'advanced']
  ],
  globalization: [
    ['global market', '全球市场', 'noun phrase', 'core'], ['international cooperation', '国际合作', 'noun phrase', 'core'], ['cultural homogenization', '文化同质化', 'noun phrase', 'advanced'], ['global citizenship', '全球公民意识', 'noun phrase', 'advanced'], ['migration pattern', '迁移模式', 'noun phrase', 'medium'],
    ['trade agreement', '贸易协定', 'noun phrase', 'medium'], ['foreign aid', '外国援助', 'noun phrase', 'medium'], ['global supply chain', '全球供应链', 'noun phrase', 'advanced'], ['multinational company', '跨国公司', 'noun phrase', 'core'], ['outsourcing', '外包', 'noun', 'medium'],
    ['global competition', '全球竞争', 'noun phrase', 'medium'], ['economic integration', '经济一体化', 'noun phrase', 'advanced'], ['international student', '国际学生', 'noun phrase', 'core'], ['tourism industry', '旅游业', 'noun phrase', 'core'], ['global issue', '全球议题', 'noun phrase', 'core'],
    ['human rights', '人权', 'noun phrase', 'core'], ['refugee crisis', '难民危机', 'noun phrase', 'medium'], ['cross-border trade', '跨境贸易', 'noun phrase', 'medium'], ['international standard', '国际标准', 'noun phrase', 'medium'], ['global awareness', '全球意识', 'noun phrase', 'core'],
    ['cultural adaptation', '文化适应', 'noun phrase', 'medium'], ['world economy', '世界经济', 'noun phrase', 'core'], ['global workforce', '全球劳动力', 'noun phrase', 'medium'], ['language exchange', '语言交换', 'noun phrase', 'core'], ['international tourism', '国际旅游', 'noun phrase', 'core']
  ],
  housing: [
    ['rental market', '租赁市场', 'noun phrase', 'core'], ['housing affordability', '住房可负担性', 'noun phrase', 'medium'], ['property price', '房产价格', 'noun phrase', 'core'], ['mortgage payment', '房贷还款', 'noun phrase', 'medium'], ['urban apartment', '城市公寓', 'noun phrase', 'core'],
    ['shared accommodation', '合租住房', 'noun phrase', 'core'], ['student dormitory', '学生宿舍', 'noun phrase', 'core'], ['housing policy', '住房政策', 'noun phrase', 'medium'], ['residential community', '住宅社区', 'noun phrase', 'core'], ['neighbourhood safety', '社区安全', 'noun phrase', 'core'],
    ['living condition', '居住条件', 'noun phrase', 'core'], ['home ownership', '住房所有权', 'noun phrase', 'medium'], ['real estate', '房地产', 'noun phrase', 'core'], ['property developer', '房地产开发商', 'noun phrase', 'medium'], ['building maintenance', '建筑维护', 'noun phrase', 'medium'],
    ['housing supply', '住房供应', 'noun phrase', 'medium'], ['overcrowded housing', '过度拥挤的住房', 'noun phrase', 'advanced'], ['temporary shelter', '临时住所', 'noun phrase', 'medium'], ['homelessness', '无家可归', 'noun', 'advanced'], ['tenant right', '租户权利', 'noun phrase', 'medium'],
    ['landlord responsibility', '房东责任', 'noun phrase', 'medium'], ['renovation cost', '装修成本', 'noun phrase', 'core'], ['energy-efficient home', '节能住宅', 'noun phrase', 'medium'], ['housing estate management', '住宅区管理', 'noun phrase', 'advanced'], ['subsidized housing', '补贴住房', 'noun phrase', 'advanced']
  ]
};

const topicZh: Record<string, string> = {
  environment: '环境',
  education: '教育',
  society: '社会',
  economy: '经济',
  technology: '科技',
  health: '健康',
  culture: '文化',
  government: '政府',
  urban: '城市',
  work: '工作',
  media: '媒体',
  science: '科学',
  transport: '交通',
  crime: '犯罪与法律',
  food: '饮食',
  energy: '能源',
  psychology: '心理',
  communication: '沟通',
  globalization: '全球化',
  housing: '住房'
};

function toId(word: string): string {
  return `ielts-${word.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

function phoneticFor(word: string): string {
  return `/${word.split(/\s+/)[0]}/`;
}

const generatedWords: WordEntry[] = Object.entries(topicWords).flatMap(([topic, rows]) =>
  rows.map(([word, meaningZh, pos, difficulty]) => ({
    id: toId(word),
    word,
    meaningZh,
    pos,
    phonetic: phoneticFor(word),
    exampleEn: `The phrase "${word}" is useful in IELTS essays about ${topic}.`,
    exampleZh: `“${word}”这个表达适合用于关于${topicZh[topic]}的雅思作文。`,
    difficulty,
    source: 'ielts',
    topic
  }))
);

export const ieltsWords: WordEntry[] = [
  ...seedWords.map((word) => ({
    ...word,
    id: toId(word.word),
    source: 'ielts' as const,
    topic: 'general'
  })),
  ...generatedWords
];
