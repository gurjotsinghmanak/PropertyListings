# Property Listings API

A .NET Core 8.0 Web API for managing property listings with in-memory storage.

## Prerequisites

- .NET 8.0 SDK or later
- Visual Studio Code (optional)
- Docker (optional)

## Getting Started

### 1. Check .NET Version

Ensure you have .NET 8.0 SDK installed:

\`\`\`bash
dotnet --version
\`\`\`

If you don't have .NET 8.0, download it from: https://dotnet.microsoft.com/download/dotnet/8.0

### 2. Restore Dependencies

\`\`\`bash
dotnet restore
\`\`\`

### 3. Build the Project

\`\`\`bash
dotnet build
\`\`\`

### 4. Run the Application

\`\`\`bash
dotnet run
\`\`\`

The API will be available at:
- HTTP: http://localhost:5000
- HTTPS: https://localhost:5001
- Swagger UI: https://localhost:5001/swagger

### 5. Development with Hot Reload

For development with automatic reloading:

\`\`\`bash
dotnet watch run
\`\`\`

## API Endpoints

### Listings

- `GET /api/listings` - Get paginated listings with optional filters
- `GET /api/listings/{id}` - Get specific listing by ID
- `GET /api/listings/search` - Search listings with filters
- `POST /api/listings` - Create new listing
- `PUT /api/listings/{id}` - Update existing listing
- `DELETE /api/listings/{id}` - Delete listing

### Query Parameters for Filtering

- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10, max: 100)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `minBedrooms` - Minimum bedrooms filter
- `maxBedrooms` - Maximum bedrooms filter
- `minBathrooms` - Minimum bathrooms filter
- `maxBathrooms` - Maximum bathrooms filter
- `minSqft` - Minimum square feet filter
- `maxSqft` - Maximum square feet filter
- `propertyType` - Property type filter (House, Apartment, Condo, Townhouse)
- `status` - Status filter (Available, Sold, Pending)
- `isFeatured` - Featured properties filter (true/false)
- `searchTerm` - Text search across title, description, and address
- `sortBy` - Sort field (price, bedrooms, bathrooms, sqft, title, createdAt)
- `sortOrder` - Sort direction (asc, desc)

## Example Requests

### Get All Listings
\`\`\`bash
curl -X GET "https://localhost:5001/api/listings"
\`\`\`

### Get Filtered Listings
\`\`\`bash
curl -X GET "https://localhost:5001/api/listings?minPrice=400000&maxPrice=800000&minBedrooms=2&propertyType=apartment"
\`\`\`

### Search Listings
\`\`\`bash
curl -X GET "https://localhost:5001/api/listings/search?searchTerm=downtown&sortBy=price&sortOrder=asc"
\`\`\`

### Get Specific Listing
\`\`\`bash
curl -X GET "https://localhost:5001/api/listings/1"
\`\`\`

## Docker Support

### Build and Run with Docker

\`\`\`bash
# Build the image
docker build -t property-listings-api .

# Run the container
docker run -p 5000:80 -p 5001:443 property-listings-api
\`\`\`

### Using Docker Compose

\`\`\`bash
docker-compose up --build
\`\`\`

## Development

### VS Code Configuration

The project includes VS Code configuration files:
- `.vscode/launch.json` - Debug configuration
- `.vscode/tasks.json` - Build tasks

### Project Structure

\`\`\`
backend/
├── Controllers/
│   └── ListingsController.cs
├── Models/
│   ├── PropertyListing.cs
│   ├── FilterCriteria.cs
│   ├── PaginatedResult.cs
│   └── ApiResponse.cs
├── Services/
│   ├── IPropertyService.cs
│   └── PropertyService.cs
├── Program.cs
├── PropertyListingsAPI.csproj
├── global.json
└── README.md
\`\`\`

## Features

- ✅ RESTful API design
- ✅ Comprehensive filtering and search
- ✅ Pagination support
- ✅ Sorting capabilities
- ✅ In-memory data storage
- ✅ Swagger documentation
- ✅ CORS support for frontend integration
- ✅ Proper error handling
- ✅ Input validation
- ✅ Async/await patterns
- ✅ Docker support

## Frontend Integration

The API is designed to work with the Next.js frontend. Make sure to:

1. Set the correct API URL in the frontend's `.env.local`:
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   \`\`\`

2. Start the API before running the frontend for full functionality.

## Troubleshooting

### Port Already in Use
If ports 5000 or 5001 are already in use, you can specify different ports:

\`\`\`bash
dotnet run --urls "http://localhost:5002;https://localhost:5003"
\`\`\`

### HTTPS Certificate Issues
For development, you may need to trust the development certificate:

\`\`\`bash
dotnet dev-certs https --trust
\`\`\`

### CORS Issues
The API is configured to allow requests from `http://localhost:3000` and `https://localhost:3000`. If your frontend runs on a different port, update the CORS policy in `Program.cs`.
