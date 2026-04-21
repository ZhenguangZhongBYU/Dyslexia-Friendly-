// Dyslexia-Friendly 文段生成器 JavaScript
class DyslexiaTextGenerator {
    constructor() {
        this.apiKey = 'sk-6d9a1fb1ce734c8a8a84ac6bd964ad00';
        this.apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        // Jimeng AI API configuration
        this.jimengApiUrl = 'https://visual.volcengineapi.com';
        this.jimengReqKey = 'jimeng_tti_v31';
        this.currentImageTaskId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSavedSettings();
        this.initBionicReading();
    }

    bindEvents() {
        const simplifyBtn = document.getElementById('simplifyBtn');
        const bionicBtn = document.getElementById('bionicBtn');
        const originalText = document.getElementById('originalText');
        const directBionicArrow = document.getElementById('directBionicArrow');
        const simplifyBionicArrow = document.getElementById('simplifyBionicArrow');
        const generateImageBtn = document.getElementById('generateImageBtn');
        
        simplifyBtn.addEventListener('click', () => this.simplifyText());
        bionicBtn.addEventListener('click', () => this.generateBionicText());
        originalText.addEventListener('input', () => this.autoSave());
        
        // 流程控制箭头
        directBionicArrow.addEventListener('click', () => this.directBionic());
        simplifyBionicArrow.addEventListener('click', () => this.simplifyThenBionic());
        
        // 图片生成按钮
        if (generateImageBtn) {
            generateImageBtn.addEventListener('click', () => this.generateImage());
        }
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.simplifyText();
            }
            if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
                this.generateBionicText();
            }
        });
    }

    async simplifyText() {
        const originalText = document.getElementById('originalText').value.trim();
        if (!originalText) {
            this.showError('请输入需要简化的文本内容');
            return;
        }

        this.setLoading(true);
        
        try {
            const simplificationLevel = document.getElementById('simplificationLevel').value;
            const readingLevel = document.getElementById('readingLevel').value;
            
            // 构建心理学驱动的提示词
            const prompt = this.buildPsychologyPrompt(originalText, simplificationLevel, readingLevel);
            
            // 调用DeepSeek API
            const simplifiedText = await this.callDeepSeekAPI(prompt);
            
            // 显示结果
            this.displayResult(simplifiedText);
            
            // 分析文本复杂度
            this.analyzeText(originalText, simplifiedText);
            
            // 保存设置
            this.saveSettings();
            
        } catch (error) {
            console.error('简化文本时出错:', error);
            this.showError('文本简化失败，请重试');
        } finally {
            this.setLoading(false);
        }
    }

    buildPsychologyPrompt(originalText, level, readingLevel) {
        // 检测输入文本的语言
        const isChinese = /[\u4e00-\u9fff]/.test(originalText);
        const isEnglish = /[a-zA-Z]/.test(originalText);
        
        // 根据输入语言选择相应的指令
        const levelInstructions = isChinese ? {
            light: "轻度简化：保持原意，仅优化词汇和句式",
            medium: "中度简化：简化复杂句式，替换难词，保持逻辑清晰",
            heavy: "重度简化：大幅简化，使用简单词汇和短句，确保易理解"
        } : {
            light: "Light simplification: Maintain original meaning, only optimize vocabulary and sentence structure",
            medium: "Medium simplification: Simplify complex sentences, replace difficult words, maintain clear logic",
            heavy: "Heavy simplification: Significantly simplify, use simple vocabulary and short sentences, ensure easy understanding"
        };

        const psychologyRules = isChinese ? `
基于以下心理学原理进行文本简化：

1. 认知负荷理论：
   - 控制内在认知负荷：简化概念和词汇
   - 减少外在认知负荷：优化文本结构和格式
   - 增强相关认知负荷：提供清晰的逻辑连接

2. 工作记忆限制：
   - 句子长度控制在15个词以内
   - 避免复杂的从句结构
   - 使用简单的语法结构

3. 注意力管理：
   - 使用短段落（2-3句话）
   - 添加过渡词和连接词
   - 突出关键信息

4. 多感官学习支持：
   - 使用具体的、可感知的词汇
   - 避免抽象概念，多用比喻和例子
   - 保持词汇的一致性

5. 阅读障碍友好设计：
   - 使用高频词汇
   - 避免同音异义词
   - 保持句子结构一致
   - 使用主动语态
        ` : `
Based on the following psychological principles for text simplification:

1. Cognitive Load Theory:
   - Control intrinsic cognitive load: simplify concepts and vocabulary
   - Reduce extraneous cognitive load: optimize text structure and format
   - Enhance germane cognitive load: provide clear logical connections

2. Working Memory Limitations:
   - Keep sentence length under 15 words
   - Avoid complex clause structures
   - Use simple grammatical structures

3. Attention Management:
   - Use short paragraphs (2-3 sentences)
   - Add transition words and connectors
   - Highlight key information

4. Multi-sensory Learning Support:
   - Use concrete, perceivable vocabulary
   - Avoid abstract concepts, use metaphors and examples
   - Maintain vocabulary consistency

5. Dyslexia-friendly Design:
   - Use high-frequency vocabulary
   - Avoid homophones
   - Maintain consistent sentence structure
   - Use active voice
        `;

        const prompt = isChinese ? `
你是一个专业的文本简化专家，专门为阅读障碍者优化文本内容。

${psychologyRules}

简化要求：
- 目标阅读水平：小学${readingLevel}年级
- 简化程度：${levelInstructions[level]}
- 保持原文的核心信息和逻辑
- 使用简单、清晰的表达方式
- 确保文本易于理解和记忆
- **重要：请使用与原文相同的语言进行回复**

原始文本：
${originalText}

请提供简化后的文本，并确保：
1. 句子简短明了（不超过15个词）
2. 使用简单词汇替换复杂词汇
3. 保持逻辑清晰，添加必要的连接词
4. 分段合理，每段2-3句话
5. 使用主动语态和现在时
6. 避免同音异义词和容易混淆的词汇
7. **必须使用与原文相同的语言**

简化后的文本：
        ` : `
You are a professional text simplification expert, specializing in optimizing text content for people with reading difficulties.

${psychologyRules}

Simplification requirements:
- Target reading level: Grade ${readingLevel}
- Simplification level: ${levelInstructions[level]}
- Maintain the core information and logic of the original text
- Use simple, clear expressions
- Ensure the text is easy to understand and remember
- **Important: Please respond in the same language as the original text**

Original text:
${originalText}

Please provide the simplified text and ensure:
1. Sentences are short and clear (no more than 15 words)
2. Use simple vocabulary to replace complex words
3. Maintain clear logic, add necessary connecting words
4. Reasonable paragraphing, 2-3 sentences per paragraph
5. Use active voice and present tense
6. Avoid homophones and easily confused words
7. **Must use the same language as the original text**

Simplified text:
        `;

        return prompt;
    }

    async callDeepSeekAPI(prompt) {
        // 检测输入文本的语言来设置系统消息
        const originalText = document.getElementById('originalText').value.trim();
        const isChinese = /[\u4e00-\u9fff]/.test(originalText);
        const systemMessage = isChinese ? 
            '你是一个专业的文本简化专家，专门为阅读障碍者优化文本内容。请根据心理学原理进行文本简化，并使用与输入文本相同的语言回复。' :
            'You are a professional text simplification expert, specializing in optimizing text content for people with reading difficulties. Please perform text simplification based on psychological principles and respond in the same language as the input text.';

        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: systemMessage
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    displayResult(simplifiedText) {
        const outputDiv = document.getElementById('simplifiedText');
        // 简化文本内容不会被翻译，但复制按钮可以被翻译
        outputDiv.innerHTML = `<p class="ignore">${simplifiedText.replace(/\n\n/g, '</p><p class="ignore">').replace(/\n/g, '<br>')}</p>`;
        outputDiv.classList.remove('placeholder');
        
        // 添加复制功能
        this.addCopyButton(outputDiv, simplifiedText);
    }

    addCopyButton(container, text) {
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '📋 复制文本';
        copyBtn.className = 'copy-btn'; // 复制按钮可以被翻译
        copyBtn.style.cssText = `
            margin-top: 15px;
            padding: 10px 20px;
            background: var(--success-color);
            color: white;
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-family: 'OpenDyslexic', Arial, sans-serif;
            font-size: 16px;
            transition: var(--transition);
        `;
        
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(text);
                copyBtn.textContent = '✅ 已复制';
                setTimeout(() => {
                    copyBtn.textContent = '📋 复制文本';
                }, 2000);
            } catch (err) {
                console.error('复制失败:', err);
                copyBtn.textContent = '❌ 复制失败';
                setTimeout(() => {
                    copyBtn.textContent = '📋 复制文本';
                }, 2000);
            }
        });
        
        container.appendChild(copyBtn);
    }

    // Bionic Reading 初始化
    initBionicReading() {
        // 初始化Bionic Reading相关设置
        this.bionicSettings = {
            light: { boldLength: 2, contrast: 0.3 },
            medium: { boldLength: 3, contrast: 0.5 },
            heavy: { boldLength: 4, contrast: 0.7 }
        };
    }

    // 直接Bionic处理
    async directBionic() {
        const originalText = document.getElementById('originalText').value.trim();
        if (!originalText) {
            this.showBionicError('请输入需要处理的文本内容');
            return;
        }
        
        this.setBionicLoading(true);
        try {
            const bionicText = this.convertToBionic(originalText);
            this.displayBionicResult(bionicText);
        } catch (error) {
            console.error('Bionic处理失败:', error);
            this.showBionicError('Bionic处理失败，请重试');
        } finally {
            this.setBionicLoading(false);
        }
    }

    // 简化后Bionic处理
    async simplifyThenBionic() {
        const simplifiedText = document.getElementById('simplifiedText').textContent.trim();
        if (!simplifiedText || simplifiedText.includes('简化后的文本将显示在这里')) {
            this.showBionicError('请先进行文本简化');
            return;
        }
        
        this.setBionicLoading(true);
        try {
            const bionicText = this.convertToBionic(simplifiedText);
            this.displayBionicResult(bionicText);
        } catch (error) {
            console.error('Bionic处理失败:', error);
            this.showBionicError('Bionic处理失败，请重试');
        } finally {
            this.setBionicLoading(false);
        }
    }

    // 生成Bionic文本
    async generateBionicText() {
        const originalText = document.getElementById('originalText').value.trim();
        const simplifiedText = document.getElementById('simplifiedText').textContent.trim();
        
        let sourceText = '';
        if (simplifiedText && !simplifiedText.includes('简化后的文本将显示在这里')) {
            sourceText = simplifiedText;
        } else if (originalText) {
            sourceText = originalText;
        } else {
            this.showBionicError('请输入需要处理的文本内容');
            return;
        }
        
        this.setBionicLoading(true);
        try {
            const bionicText = this.convertToBionic(sourceText);
            this.displayBionicResult(bionicText);
        } catch (error) {
            console.error('Bionic处理失败:', error);
            this.showBionicError('Bionic处理失败，请重试');
        } finally {
            this.setBionicLoading(false);
        }
    }

    // 转换为Bionic格式
    convertToBionic(text) {
        const intensity = document.getElementById('bionicIntensity').value;
        const settings = this.bionicSettings[intensity];
        
        // 分割文本为段落
        const paragraphs = text.split('\n\n');
        const bionicParagraphs = paragraphs.map(paragraph => {
            if (paragraph.trim() === '') return '';
            
            // 分割为句子
            const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 0);
            const bionicSentences = sentences.map(sentence => {
                // 分割为单词
                const words = sentence.trim().split(/\s+/);
                const bionicWords = words.map(word => {
                    // 清理单词（移除标点符号）
                    const cleanWord = word.replace(/[^\w\u4e00-\u9fff]/g, '');
                    if (cleanWord.length === 0) return word;
                    
                    // 计算加粗长度
                    const boldLength = Math.min(settings.boldLength, Math.floor(cleanWord.length * 0.6));
                    if (boldLength === 0) return word;
                    
                    // 创建Bionic格式
                    const boldPart = cleanWord.substring(0, boldLength);
                    const normalPart = cleanWord.substring(boldLength);
                    const punctuation = word.replace(/[\w\u4e00-\u9fff]/g, '');
                    
                    return `<strong style="font-weight: ${700 + settings.contrast * 300};">${boldPart}</strong>${normalPart}${punctuation}`;
                });
                
                return bionicWords.join(' ');
            });
            
            return bionicSentences.join('. ') + (sentences.length > 0 ? '.' : '');
        });
        
        return bionicParagraphs.join('\n\n');
    }

    // 显示Bionic结果
    displayBionicResult(bionicText) {
        const outputDiv = document.getElementById('bionicText');
        // Bionic文本内容不会被翻译，但复制按钮可以被翻译
        outputDiv.innerHTML = `<p class="ignore">${bionicText.replace(/\n\n/g, '</p><p class="ignore">').replace(/\n/g, '<br>')}</p>`;
        outputDiv.classList.remove('placeholder');
        
        // 添加复制功能
        this.addBionicCopyButton(outputDiv, bionicText);
        
        // 显示图片生成区域并设置提示词
        this.showImageGenerationSection(bionicText);
    }

    // 显示图片生成区域
    showImageGenerationSection(bionicText) {
        const imageSection = document.getElementById('imageGenerationSection');
        const promptText = document.getElementById('imagePromptText');
        
        if (imageSection && promptText) {
            // 提取纯文本（去除HTML标签）
            const plainText = bionicText.replace(/<[^>]*>/g, '');
            // 生成图片提示词（取前200字符作为提示词）
            const imagePrompt = this.generateImagePrompt(plainText);
            
            promptText.textContent = imagePrompt;
            imageSection.style.display = 'block';
            
            // 重置图片容器
            const imageContainer = document.getElementById('generatedImageContainer');
            if (imageContainer) {
                imageContainer.innerHTML = '<p class="placeholder">生成的图片将显示在这里...</p>';
            }
        }
    }

    // 生成图片提示词
    generateImagePrompt(text) {
        // 提取文本的核心内容，生成适合图片生成的提示词
        const sentences = text.split(/[.!?。！？]+/).filter(s => s.trim().length > 0);
        let prompt = '';
        
        if (sentences.length > 0) {
            // 使用前两句作为基础提示词
            prompt = sentences.slice(0, 2).join('，');
        } else {
            prompt = text.substring(0, 200);
        }
        
        // 添加风格修饰词
        const styleModifiers = '，插画风格，色彩丰富，适合阅读障碍者理解，简洁明了，教育插图风格';
        
        // 限制长度并添加风格
        const maxLength = 300;
        let finalPrompt = prompt.substring(0, maxLength - styleModifiers.length) + styleModifiers;
        
        return finalPrompt;
    }

    // 生成图片
    async generateImage() {
        const promptText = document.getElementById('imagePromptText');
        if (!promptText || !promptText.textContent.trim()) {
            this.showImageError('请先生成Bionic Reading文本');
            return;
        }

        this.setImageLoading(true);
        
        try {
            const prompt = promptText.textContent.trim();
            
            // 提交图片生成任务
            const taskId = await this.submitImageTask(prompt);
            this.currentImageTaskId = taskId;
            
            // 显示处理中状态
            this.showImageStatus('processing', '图片生成中，请稍候...');
            
            // 轮询查询任务结果
            await this.pollImageTaskResult(taskId);
            
        } catch (error) {
            console.error('图片生成失败:', error);
            this.showImageError('图片生成失败: ' + error.message);
        } finally {
            this.setImageLoading(false);
        }
    }

    // 提交图片生成任务
    async submitImageTask(prompt) {
        // 调用后端API代理
        const apiUrl = 'http://211.154.21.78:20015/api/image/submit';
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                width: 1024,
                height: 1024,
                seed: -1
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || '提交任务失败');
        }

        const result = await response.json();
        return result.task_id;
    }

    // 轮询查询图片任务结果
    async pollImageTaskResult(taskId) {
        const maxAttempts = 60; // 最多轮询60次（约2分钟）
        const interval = 2000; // 每2秒查询一次
        
        for (let i = 0; i < maxAttempts; i++) {
            await this.sleep(interval);
            
            try {
                const result = await this.queryImageTask(taskId);
                
                if (result.status === 'done') {
                    // Prefer base64 image_data over image_url
                    const imageSrc = result.image_data || result.image_url;
                    this.displayGeneratedImage(imageSrc);
                    return;
                } else if (result.status === 'failed') {
                    throw new Error('图片生成失败');
                }
                // 继续轮询...
                this.showImageStatus('processing', `图片生成中...(${i + 1}/${maxAttempts})`);
                
            } catch (error) {
                console.error('查询任务状态失败:', error);
            }
        }
        
        throw new Error('图片生成超时，请稍后重试');
    }

    // 查询图片任务状态
    async queryImageTask(taskId) {
        const apiUrl = 'http://211.154.21.78:20015/api/image/query';
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task_id: taskId
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || '查询任务失败');
        }

        const result = await response.json();
        return result.data;
    }

    // 显示生成的图片
    displayGeneratedImage(imageUrl) {
        const container = document.getElementById('generatedImageContainer');
        if (container) {
            container.innerHTML = `<img src="${imageUrl}" alt="生成的配图" class="generated-image">`;
            
            // 添加下载按钮
            this.addImageDownloadButton(container, imageUrl);
        }
        this.showImageStatus('done', '图片生成成功！');
    }

    // 添加图片下载按钮
    addImageDownloadButton(container, imageUrl) {
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = '📥 下载图片';
        downloadBtn.className = 'copy-btn';
        downloadBtn.style.cssText = `
            margin-top: 15px;
            padding: 10px 20px;
            background: var(--success-color);
            color: white;
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-family: 'OpenDyslexic', Arial, sans-serif;
            font-size: 16px;
            transition: var(--transition);
        `;
        
        downloadBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'bionic-reading-illustration.png';
            link.target = '_blank';
            link.click();
        });
        
        container.appendChild(downloadBtn);
    }

    // 设置图片生成加载状态
    setImageLoading(loading) {
        const btn = document.getElementById('generateImageBtn');
        if (!btn) return;
        
        const btnText = btn.querySelector('.btn-text');
        const spinner = btn.querySelector('.loading-spinner');
        
        if (loading) {
            btn.disabled = true;
            btnText.style.display = 'none';
            spinner.style.display = 'inline';
        } else {
            btn.disabled = false;
            btnText.style.display = 'inline';
            spinner.style.display = 'none';
        }
    }

    // 显示图片生成状态
    showImageStatus(status, message) {
        const container = document.getElementById('generatedImageContainer');
        if (!container) return;
        
        // 移除现有状态提示
        const existingStatus = container.querySelector('.task-status');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        const statusDiv = document.createElement('div');
        statusDiv.className = `task-status ${status}`;
        statusDiv.textContent = message;
        
        container.insertBefore(statusDiv, container.firstChild);
    }

    // 显示图片生成错误
    showImageError(message) {
        const container = document.getElementById('generatedImageContainer');
        if (container) {
            container.innerHTML = `<p style="color: var(--accent-color); font-weight: bold;">❌ ${message}</p>`;
        }
    }

    // 工具函数：延时
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 添加Bionic复制按钮
    addBionicCopyButton(container, text) {
        // 移除现有的复制按钮
        const existingBtn = container.querySelector('.copy-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '📋 复制Bionic文本';
        copyBtn.className = 'copy-btn'; // Bionic复制按钮可以被翻译
        copyBtn.style.cssText = `
            margin-top: 15px;
            padding: 10px 20px;
            background: var(--accent-color);
            color: white;
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-family: 'OpenDyslexic', Arial, sans-serif;
            font-size: 16px;
            transition: var(--transition);
        `;
        
        copyBtn.addEventListener('click', async () => {
            try {
                // 复制纯文本版本（去除HTML标签）
                const plainText = text.replace(/<[^>]*>/g, '');
                await navigator.clipboard.writeText(plainText);
                copyBtn.textContent = '✅ 已复制';
                setTimeout(() => {
                    copyBtn.textContent = '📋 复制Bionic文本';
                }, 2000);
            } catch (err) {
                console.error('复制失败:', err);
                copyBtn.textContent = '❌ 复制失败';
                setTimeout(() => {
                    copyBtn.textContent = '📋 复制Bionic文本';
                }, 2000);
            }
        });
        
        container.appendChild(copyBtn);
    }

    // 设置Bionic加载状态
    setBionicLoading(loading) {
        const btn = document.getElementById('bionicBtn');
        const btnText = btn.querySelector('.btn-text');
        const spinner = btn.querySelector('.loading-spinner');
        
        if (loading) {
            btn.disabled = true;
            btnText.style.display = 'none';
            spinner.style.display = 'inline';
        } else {
            btn.disabled = false;
            btnText.style.display = 'inline';
            spinner.style.display = 'none';
        }
    }

    // 显示Bionic错误
    showBionicError(message) {
        const outputDiv = document.getElementById('bionicText');
        outputDiv.innerHTML = `<p style="color: var(--accent-color); font-weight: bold;">❌ ${message}</p>`;
        outputDiv.classList.remove('placeholder');
    }

    analyzeText(originalText, simplifiedText) {
        const analysisPanel = document.getElementById('analysisPanel');
        analysisPanel.style.display = 'block';
        
        // 计算文本复杂度指标
        const originalComplexity = this.calculateComplexity(originalText);
        const simplifiedComplexity = this.calculateComplexity(simplifiedText);
        const cognitiveLoad = this.calculateCognitiveLoad(simplifiedText);
        const improvement = ((originalComplexity - simplifiedComplexity) / originalComplexity * 100).toFixed(1);
        
        // 更新指标显示
        document.getElementById('originalComplexity').textContent = originalComplexity.toFixed(2);
        document.getElementById('simplifiedComplexity').textContent = simplifiedComplexity.toFixed(2);
        document.getElementById('cognitiveLoad').textContent = cognitiveLoad.toFixed(2);
        document.getElementById('readabilityImprovement').textContent = `+${improvement}%`;
        
        // 根据指标设置颜色
        this.updateMetricColors(originalComplexity, simplifiedComplexity, cognitiveLoad);
    }

    calculateComplexity(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const avgWordsPerSentence = words.length / sentences.length;
        const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
        
        // 基于心理学研究的复杂度计算公式
        return (avgWordsPerSentence * 0.4) + (avgWordLength * 0.3) + (this.countComplexWords(words) * 0.3);
    }

    calculateCognitiveLoad(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.split(/\s+/).filter(w => w.length > 0);
        
        // 工作记忆负荷：句子长度影响
        const workingMemoryLoad = Math.min(sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length / 15, 1);
        
        // 词汇负荷：复杂词汇比例
        const vocabLoad = this.countComplexWords(words) / words.length;
        
        // 结构负荷：从句和复杂语法
        const structureLoad = this.countComplexStructures(text) / sentences.length;
        
        return (workingMemoryLoad * 0.4) + (vocabLoad * 0.4) + (structureLoad * 0.2);
    }

    countComplexWords(words) {
        const complexWords = words.filter(word => {
            const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
            return cleanWord.length > 8 || this.isComplexWord(cleanWord);
        });
        return complexWords.length;
    }

    isComplexWord(word) {
        // 基于心理学研究的复杂词汇判断
        const complexPatterns = [
            /tion$/, /sion$/, /ment$/, /ness$/, /ity$/,
            /able$/, /ible$/, /ful$/, /less$/, /ous$/
        ];
        return complexPatterns.some(pattern => pattern.test(word));
    }

    countComplexStructures(text) {
        // 计算复杂语法结构
        const complexPatterns = [
            /因为.*所以/, /虽然.*但是/, /不仅.*而且/,
            /当.*时/, /如果.*那么/, /由于.*因此/
        ];
        return complexPatterns.reduce((count, pattern) => {
            return count + (text.match(new RegExp(pattern, 'g')) || []).length;
        }, 0);
    }

    updateMetricColors(original, simplified, cognitive) {
        const metrics = document.querySelectorAll('.metric-value');
        
        // 复杂度颜色：绿色表示好，红色表示需要改进
        const complexityColor = simplified < 3 ? '#27ae60' : simplified < 5 ? '#f39c12' : '#e74c3c';
        metrics[1].style.color = complexityColor;
        
        // 认知负荷颜色：绿色表示低负荷，红色表示高负荷
        const loadColor = cognitive < 0.5 ? '#27ae60' : cognitive < 0.7 ? '#f39c12' : '#e74c3c';
        metrics[2].style.color = loadColor;
        
        // 改进程度颜色：绿色表示改进好
        const improvement = ((original - simplified) / original * 100);
        const improvementColor = improvement > 20 ? '#27ae60' : improvement > 10 ? '#f39c12' : '#e74c3c';
        metrics[3].style.color = improvementColor;
    }

    setLoading(loading) {
        const btn = document.getElementById('simplifyBtn');
        const btnText = btn.querySelector('.btn-text');
        const spinner = btn.querySelector('.loading-spinner');
        
        if (loading) {
            btn.disabled = true;
            btnText.style.display = 'none';
            spinner.style.display = 'inline';
        } else {
            btn.disabled = false;
            btnText.style.display = 'inline';
            spinner.style.display = 'none';
        }
    }

    showError(message) {
        const outputDiv = document.getElementById('simplifiedText');
        outputDiv.innerHTML = `<p style="color: var(--accent-color); font-weight: bold;">❌ ${message}</p>`;
        outputDiv.classList.remove('placeholder');
    }

    autoSave() {
        const text = document.getElementById('originalText').value;
        localStorage.setItem('dyslexia_original_text', text);
    }

    saveSettings() {
        const settings = {
            simplificationLevel: document.getElementById('simplificationLevel').value,
            readingLevel: document.getElementById('readingLevel').value
        };
        localStorage.setItem('dyslexia_settings', JSON.stringify(settings));
    }

    loadSavedSettings() {
        // 加载保存的文本
        const savedText = localStorage.getItem('dyslexia_original_text');
        if (savedText) {
            document.getElementById('originalText').value = savedText;
        }
        
        // 加载保存的设置
        const savedSettings = localStorage.getItem('dyslexia_settings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            document.getElementById('simplificationLevel').value = settings.simplificationLevel || 'medium';
            document.getElementById('readingLevel').value = settings.readingLevel || '6';
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new DyslexiaTextGenerator();
    
    // 添加键盘快捷键提示
    const shortcutHint = document.createElement('div');
    shortcutHint.innerHTML = '💡 提示：Ctrl+Enter 简化文本 | Ctrl+Shift+Enter 生成Bionic文本';
    // 快捷键提示可以被翻译
    shortcutHint.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 10px 15px;
        border-radius: var(--border-radius);
        font-size: 14px;
        z-index: 1000;
        box-shadow: var(--shadow);
    `;
    document.body.appendChild(shortcutHint);
    
    // 3秒后隐藏提示
    setTimeout(() => {
        shortcutHint.style.opacity = '0';
        setTimeout(() => shortcutHint.remove(), 300);
    }, 3000);
});


