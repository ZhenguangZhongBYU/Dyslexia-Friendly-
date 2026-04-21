# 🧠 Dyslexia-Friendly 文段生成器

An intelligent text simplification tool based on psychological principles, designed to make reading more accessible for individuals with dyslexia. The tool combines cognitive load theory, visual optimization, and Bionic Reading technology to improve reading comprehension and speed.

## ✨ Features

### 📝 Intelligent Text Simplification
- **Three simplification levels**: Light, Medium, Heavy
- **Adjustable reading levels**: From Grade 3 to Grade 8
- **Cognitive load management**: Based on established psychological principles
- **Real-time complexity analysis**: Compare original vs simplified text

### 🔬 Bionic Reading Integration
- **Bold-first-letter technique**: Guides eyes through text for faster reading
- **Adjustable intensity**: Light, Medium, or Heavy bionic effects
- **Two workflow options**:
  - Direct Bionic Reading (preserve original text)
  - Simplified → Bionic Reading (maximum accessibility)

### 🎨 AI-Powered Image Generation
- **Smart prompt generation**: Automatically creates image prompts from text content
- **Visual-text integration**: Enhances comprehension through multiple sensory channels
- **Contextual illustrations**: AI-generated images that match the content

### ♿ Accessibility Features
- **OpenDyslexic font**: Specially designed for dyslexic readers
- **High-contrast color scheme**: Reduces visual fatigue
- **Multi-sensory support**: Combines visual, textual, and imagery elements

### 🌐 Multi-Language Support
- **Automatic translation**: Powered by Translate.js
- **5-line implementation**: Simple and efficient localization

## 🎯 Psychological Principles Applied

| Principle | Implementation |
|-----------|----------------|
| **Cognitive Load Theory** | Controls intrinsic, extraneous, and germane cognitive load |
| **Working Memory Optimization** | Limits sentence length and information density |
| **Visual Processing** | Uses dyslexia-friendly fonts and contrast |
| **Multi-Sensory Learning** | Combines text, bionic reading, and imagery |

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for fonts and translation API)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/dyslexia-friendly-text-generator.git
cd dyslexia-friendly-text-generator
File Structure

text
project/
├── index.html          # Main application file
├── styles.css          # Styling and responsive design
├── script.js           # Core functionality and logic
└── README.md           # Documentation
Open the Application

bash
# Simply open index.html in your browser
open index.html
# Or use a local server
python -m http.server 8000
💡 How to Use
Basic Workflow
Enter Text

Paste or type your content in the input textarea

Works with any length of text

Adjust Settings

Simplification Level: Choose how much to simplify

Reading Level: Select target grade level

Bionic Intensity: Set how aggressive the bolding should be

Generate Simplified Text

Click "开始简化" (Simplify)

View complexity metrics and improvements

Apply Bionic Reading

Use Direct Bionic for original text + bionic

Use 简化→Bionic for simplified + bionic

Generate Images (Optional)

Click "生成配图" to create AI illustrations

View prompts and generated images

🎮 Features in Detail
Text Simplification Algorithm
The simplification process includes:

Vocabulary complexity reduction

Sentence structure simplification

Removal of passive voice

Breaking long sentences

Replacing complex idioms

Complexity Metrics
The tool calculates:

Original Complexity: Flesch-Kincaid grade level

Simplified Complexity: New readability score

Cognitive Load: Estimated working memory demand

Readability Improvement: Percentage of improvement

Bionic Reading Patterns
Light: Bold first 30% of each word

Medium: Bold first 40-50% of each word

Heavy: Bold first 60-70% of each word

🛠️ Technical Details
Built With
HTML5: Semantic structure

CSS3: Responsive design, CSS Grid, Flexbox

JavaScript (ES6+): Core algorithms and DOM manipulation

OpenDyslexic Font: Specialized dyslexia-friendly typeface

Translate.js: Multi-language support

Key Functions
javascript
// Core simplification function
simplifyText(text, level, readingLevel)

// Bionic Reading converter
applyBionicReading(text, intensity)

// Complexity analyzer
calculateComplexity(text)

// Image prompt generator
generateImagePrompt(text)
📊 Performance Optimizations
Debounced inputs: Prevents excessive recalculations

Lazy loading: Images load only when needed

Efficient DOM updates: Minimal reflow/repaint

Local storage: Saves user preferences

🎨 Customization
CSS Variables
css
:root {
    --primary-color: #4A90E2;
    --text-color: #2C3E50;
    --background-light: #F9F9F9;
    --border-radius: 12px;
}
Configuration Options
Modify script.js to adjust:

Simplification thresholds

Breading reading patterns

Complexity calculation weights

Image generation prompts

🌍 Browser Support
Browser	Version	Status
Chrome	90+	✅ Full Support
Firefox	88+	✅ Full Support
Safari	14+	✅ Full Support
Edge	90+	✅ Full Support
Opera	76+	✅ Full Support
📈 Future Enhancements
Audio playback integration (text-to-speech)

Customizable color themes

Export simplified texts (PDF, DOCX)

Batch processing for multiple documents

User accounts and saved preferences

Machine learning for better simplification

Real-time collaboration features

🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open a Pull Request

Development Guidelines
Follow existing code style

Add comments for complex logic

Test across multiple browsers

Update documentation as needed

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
OpenDyslexic for the specialized font

Translate.js for multi-language support

Cognitive psychology research informing the simplification algorithms

Dyslexia associations for accessibility guidelines

📞 Support & Contact
Issues: GitHub Issues

Email: support@dyslexia-tool.com

Documentation: Wiki Pages

📊 Project Status
Version: 1.0.0
Status: ✅ Stable Release
Last Updated: December 2024
Next Release: Q1 2025

🎯 Quick Start Demo
html
<!-- Include the application -->
<textarea id="originalText">Your text here...</textarea>
<button onclick="simplifyText()">Simplify</button>

<!-- Or use the complete interface -->
Open index.html for the full experience
⚡ Tips for Best Results
Start with Medium simplification - Adjust based on user needs

Use Bionic Reading after simplification for maximum effect

Enable images for narrative or descriptive content

Test different reading levels to find optimal settings

Combine with text-to-speech for multi-sensory learning

Made with ❤️ for accessibility and inclusive design

text

This README provides comprehensive documentation covering:

1. **Project overview** and key features
2. **Psychological principles** applied
3. **Installation** and setup instructions  
4. **Usage guide** with step-by-step workflow
5. **Technical details** and customization options
6. **Performance metrics** and browser support
7. **Future roadmap** and contribution guidelines
8. **Quick start** examples and pro tips

The document is structured to be accessible to both technical and non-technical users while providing all necessary information for developers who want to contribute or customize the tool.
