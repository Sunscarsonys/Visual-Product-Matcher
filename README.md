# Visual Product Matcher

A sophisticated web application that uses advanced computer vision techniques to find visually similar products based on uploaded images or URLs.

## 🚀 Features

- **Dual Input Methods**: Upload images via drag-and-drop or provide image URLs
- **Advanced Visual Analysis**: Color extraction, brightness analysis, and aspect ratio matching
- **Smart Filtering**: Filter by similarity threshold and product categories
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Preview**: Instant image validation and preview
- **Professional UI**: Modern glass-morphism design with smooth animations

## 🛠 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Image Processing**: Canvas API for client-side analysis

## 📊 Visual Similarity Algorithm

Our proprietary algorithm analyzes multiple visual features:

1. **Color Analysis** (40% weight)
   - Extracts dominant colors using pixel sampling
   - Calculates RGB distance for color similarity
   - Identifies color temperature and saturation

2. **Brightness Analysis** (20% weight)
   - Measures overall image luminosity
   - Compares lighting conditions

3. **Aspect Ratio Matching** (20% weight)
   - Analyzes image dimensions and proportions
   - Identifies portrait, landscape, or square orientations

4. **Tag-based Similarity** (20% weight)
   - Generates semantic tags from visual features
   - Matches against product metadata

## 🏗 Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd visual-product-matcher

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📱 Usage

1. **Upload Image**: Drag and drop an image or click "Choose File"
2. **Or Enter URL**: Paste a direct link to an image
3. **Preview**: Review your uploaded image
4. **Search**: Click "Find Similar Products" to start analysis
5. **Filter Results**: Use similarity threshold and category filters
6. **Sort**: Order results by similarity score or price

## 🗄 Product Database

The application includes a curated database of 50+ products across categories:
- Electronics (phones, headphones, laptops)
- Fashion (clothing, accessories, shoes)
- Home & Garden (furniture, decor, plants)
- Sports & Fitness (equipment, apparel)
- Books & Media (literature, magazines)
- Food & Beverage (gourmet items, beverages)
- Beauty & Personal Care (skincare, cosmetics)

All product images are sourced from Pexels for high quality and consistency.

## 🔧 Configuration

### Environment Variables
No additional environment variables required - the app runs entirely client-side.

### Customization
- Modify `src/data/products.ts` to update the product database
- Adjust similarity weights in `src/utils/imageAnalysis.ts`
- Customize styling in Tailwind configuration

## 🚀 Deployment

The application is deployed on Vercel with automatic deployments from the main branch.

**Live Demo**: [Visual Product Matcher](https://visual-product-matcher.vercel.app)

### Deploy Your Own
1. Fork the repository
2. Connect to Vercel/Netlify
3. Deploy with default settings

## 🎯 Performance Considerations

- **Client-side Processing**: All image analysis runs in the browser
- **Image Optimization**: Automatically handles CORS and loading states
- **Memory Management**: Efficient canvas operations with cleanup
- **Responsive Images**: Optimized for different screen sizes

## 🔒 Privacy & Security

- **No Data Storage**: Images are processed locally and not stored
- **CORS Handling**: Secure cross-origin image loading
- **Input Validation**: Comprehensive file type and size validation

## 🐛 Known Limitations

- **CORS Restrictions**: Some external images may not load due to CORS policies
- **Mobile Performance**: Image processing may be slower on lower-end devices
- **Similarity Accuracy**: Results depend on image quality and lighting conditions

## 🔮 Future Improvements

- [ ] Machine learning integration with TensorFlow.js
- [ ] Advanced feature extraction (edges, textures, objects)
- [ ] User feedback system for similarity accuracy
- [ ] Product recommendation engine
- [ ] Integration with e-commerce APIs
- [ ] Batch image processing
- [ ] Advanced filtering options

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👥 Credits

- **Images**: Pexels.com for high-quality product photography
- **Icons**: Lucide React icon library
- **Design**: Inspired by modern e-commerce and AI applications

---

Built with ❤️ using React and advanced computer vision techniques.