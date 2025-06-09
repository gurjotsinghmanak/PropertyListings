# Property Listing Application

A modern, responsive property listing application built with Next.js 15, featuring a comprehensive property search and browsing experience with both frontend and backend components.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **.NET 8.0 SDK** (for backend API)

### Backend Setup

1. **Navigate to backend directory:**
   \`\`\`bash
   cd backend
   \`\`\`

2. **Restore dependencies:**
   \`\`\`bash
   dotnet restore
   \`\`\`

3. **Run the API:**
   \`\`\`bash
   dotnet run
   \`\`\`

   The API will be available at [http://localhost:5000](http://localhost:5000)

### Frontend Setup

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables:**
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`
   
   Update `.env.local`:
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   \`\`\`

3. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

   The frontend will be available at [http://localhost:3000](http://localhost:3000)

## 🏗️ Implementation Choices

### Frontend Architecture

- **Next.js 15 with App Router**: Leveraged the latest Next.js features for optimal performance and developer experience
- **TypeScript**: Ensured type safety and better development experience
- **Tailwind CSS**: Rapid styling with utility-first approach and consistent design system
- **shadcn/ui**: High-quality, accessible components with consistent theming

### Component Design

- **Unified Image Carousel**: Single flexible component serving both property cards and detail views with variant-based configuration
- **Responsive Grid System**: Container queries and responsive design for optimal viewing across devices
- **Client-Side State Management**: React hooks for favorites, filters, and UI state without external dependencies

### Data Management

- **API-First Design**: Clean separation between frontend and backend with comprehensive error handling
- **Graceful Fallbacks**: Application handles API errors gracefully with user-friendly error messages
- **Client-Side Filtering**: Enhanced UX for favorites and complex filter combinations
- **Optimistic Updates**: Immediate UI feedback for user interactions

### Performance Optimizations

- **Image Optimization**: Next.js Image component with lazy loading and blur placeholders
- **Code Splitting**: Automatic route-based code splitting
- **Efficient Re-renders**: Optimized React patterns to minimize unnecessary updates

## 🔧 Key Features

### Property Browsing
- **Grid and Map Views**: Multiple ways to explore properties
- **Advanced Filtering**: Price range, bedrooms, bathrooms, property type
- **Real-time Search**: Instant filtering and sorting
- **Pagination**: Efficient data loading for large datasets

### User Experience
- **Favorites System**: Persistent local storage for saved properties
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Dark/Light Mode**: System preference detection with manual toggle
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### Property Details
- **Image Galleries**: Smooth carousel with thumbnail navigation
- **Interactive Maps**: Property location visualization
- **Contact Forms**: Agent communication interface
- **Comprehensive Information**: Detailed property specifications and features

## 📋 Assumptions & Simplifications

### Data & Authentication
- **Mock Data**: Used generated property data instead of real estate APIs
- **No Authentication**: Simplified user experience without login requirements
- **Local Storage**: Favorites persist locally rather than user accounts
- **Static Agent Info**: Simplified contact information for demo purposes

### Geographic Data
- **Simulated Coordinates**: Generated location data based on property IDs
- **Basic Mapping**: OpenStreetMap integration without advanced GIS features
- **No Address Validation**: Simplified address handling

### Business Logic
- **Simplified Pricing**: No complex pricing calculations or market analysis
- **Basic Property Types**: Limited to common residential categories
- **No Booking System**: Contact forms instead of integrated scheduling

## 🚀 Future Improvements

### Enhanced Functionality
- **User Authentication**: Complete user management with profiles and saved searches
- **Advanced Search**: Natural language search, saved filters, and search history
- **Real Estate APIs**: Integration with MLS or other property data sources
- **Virtual Tours**: 360° property views and video walkthroughs
- **Mortgage Calculator**: Integrated financing tools and payment estimates

### Performance & Scalability
- **Database Integration**: PostgreSQL or MongoDB for production data storage
- **Caching Strategy**: Redis for API responses and search results
- **CDN Integration**: Global image and asset delivery
- **Search Engine**: Elasticsearch for complex property queries
- **Real-time Updates**: WebSocket connections for live property status

### User Experience
- **Mobile App**: React Native or PWA for native mobile experience
- **Advanced Filtering**: School districts, commute times, neighborhood data
- **Comparison Tool**: Side-by-side property comparisons
- **Notification System**: Price alerts and new listing notifications
- **Social Features**: Property sharing and reviews

### Developer Experience
- **Testing Suite**: Comprehensive unit, integration, and E2E tests
- **CI/CD Pipeline**: Automated testing and deployment
- **Monitoring**: Application performance and error tracking
- **Documentation**: API documentation and component storybook

### Business Features
- **Agent Dashboard**: Property management interface for real estate agents
- **Analytics**: User behavior tracking and property performance metrics
- **Multi-language**: Internationalization for global markets
- **Payment Integration**: Stripe for premium features or agent subscriptions

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Maps**: Leaflet with OpenStreetMap

### Backend
- **Framework**: .NET 8.0 Web API
- **Language**: C\#
- **Architecture**: Clean Architecture with dependency injection
- **Documentation**: Swagger/OpenAPI

### Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **Version Control**: Git
- **IDE Support**: VS Code configurations included

## 📁 Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── listings/         # Property listing pages
├── components/            # Reusable React components
├── lib/                  # Utility functions and API client
├── backend/              # .NET Core API
│   ├── Controllers/      # API endpoints
│   ├── Models/          # Data models
│   └── Services/        # Business logic
└── public/              # Static assets
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
