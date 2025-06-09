using PropertyListingsAPI.Models;

namespace PropertyListingsAPI.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly List<PropertyListing> _properties;

        public PropertyService()
        {
            _properties = GenerateMockData();
        }

        public async Task<PaginatedResult<PropertyListing>> GetListingsAsync(FilterCriteria criteria)
        {
            await Task.Delay(10); // Simulate async operation

            var query = _properties.AsQueryable();

            // Apply filters
            query = ApplyFilters(query, criteria);

            // Apply sorting
            query = ApplySorting(query, criteria);

            var totalCount = query.Count();
            var totalPages = (int)Math.Ceiling((double)totalCount / criteria.PageSize);

            var items = query
                .Skip((criteria.Page - 1) * criteria.PageSize)
                .Take(criteria.PageSize)
                .ToList();

            return new PaginatedResult<PropertyListing>
            {
                Items = items,
                TotalCount = totalCount,
                Page = criteria.Page,
                PageSize = criteria.PageSize,
                TotalPages = totalPages,
                HasNextPage = criteria.Page < totalPages,
                HasPreviousPage = criteria.Page > 1
            };
        }

        public async Task<PropertyListing?> GetListingByIdAsync(int id)
        {
            await Task.Delay(10); // Simulate async operation
            return _properties.FirstOrDefault(p => p.Id == id);
        }

        public async Task<List<PropertyListing>> SearchListingsAsync(FilterCriteria criteria)
        {
            await Task.Delay(10); // Simulate async operation

            var query = _properties.AsQueryable();
            query = ApplyFilters(query, criteria);
            query = ApplySorting(query, criteria);

            return query.ToList();
        }

        public async Task<PropertyListing> CreateListingAsync(PropertyListing listing)
        {
            await Task.Delay(10); // Simulate async operation

            listing.Id = _properties.Max(p => p.Id) + 1;
            listing.CreatedAt = DateTime.UtcNow;
            listing.UpdatedAt = DateTime.UtcNow;

            _properties.Add(listing);
            return listing;
        }

        public async Task<PropertyListing?> UpdateListingAsync(int id, PropertyListing listing)
        {
            await Task.Delay(10); // Simulate async operation

            var existingListing = _properties.FirstOrDefault(p => p.Id == id);
            if (existingListing == null) return null;

            existingListing.Title = listing.Title;
            existingListing.Price = listing.Price;
            existingListing.Bedrooms = listing.Bedrooms;
            existingListing.Bathrooms = listing.Bathrooms;
            existingListing.Sqft = listing.Sqft;
            existingListing.Description = listing.Description;
            existingListing.Address = listing.Address;
            existingListing.ImageUrl = listing.ImageUrl;
            existingListing.IsFeatured = listing.IsFeatured;
            existingListing.Features = listing.Features;
            existingListing.PropertyType = listing.PropertyType;
            existingListing.Status = listing.Status;
            existingListing.UpdatedAt = DateTime.UtcNow;

            return existingListing;
        }

        public async Task<bool> DeleteListingAsync(int id)
        {
            await Task.Delay(10); // Simulate async operation

            var listing = _properties.FirstOrDefault(p => p.Id == id);
            if (listing == null) return false;

            _properties.Remove(listing);
            return true;
        }

        private IQueryable<PropertyListing> ApplyFilters(IQueryable<PropertyListing> query, FilterCriteria criteria)
        {
            if (criteria.MinPrice.HasValue)
                query = query.Where(p => p.Price >= criteria.MinPrice.Value);

            if (criteria.MaxPrice.HasValue)
                query = query.Where(p => p.Price <= criteria.MaxPrice.Value);

            if (criteria.MinBedrooms.HasValue)
                query = query.Where(p => p.Bedrooms >= criteria.MinBedrooms.Value);

            if (criteria.MaxBedrooms.HasValue)
                query = query.Where(p => p.Bedrooms <= criteria.MaxBedrooms.Value);

            if (criteria.MinBathrooms.HasValue)
                query = query.Where(p => p.Bathrooms >= criteria.MinBathrooms.Value);

            if (criteria.MaxBathrooms.HasValue)
                query = query.Where(p => p.Bathrooms <= criteria.MaxBathrooms.Value);

            if (criteria.MinSqft.HasValue)
                query = query.Where(p => p.Sqft >= criteria.MinSqft.Value);

            if (criteria.MaxSqft.HasValue)
                query = query.Where(p => p.Sqft <= criteria.MaxSqft.Value);

            if (!string.IsNullOrEmpty(criteria.PropertyType))
                query = query.Where(p => p.PropertyType.ToLower() == criteria.PropertyType.ToLower());

            if (!string.IsNullOrEmpty(criteria.Status))
                query = query.Where(p => p.Status.ToLower() == criteria.Status.ToLower());

            if (criteria.IsFeatured.HasValue)
                query = query.Where(p => p.IsFeatured == criteria.IsFeatured.Value);

            if (!string.IsNullOrEmpty(criteria.SearchTerm))
            {
                var searchTerm = criteria.SearchTerm.ToLower();
                query = query.Where(p => 
                    p.Title.ToLower().Contains(searchTerm) ||
                    p.Description.ToLower().Contains(searchTerm) ||
                    p.Address.ToLower().Contains(searchTerm));
            }

            return query;
        }

        private IQueryable<PropertyListing> ApplySorting(IQueryable<PropertyListing> query, FilterCriteria criteria)
        {
            var sortBy = criteria.SortBy?.ToLower() ?? "createdat";
            var sortOrder = criteria.SortOrder?.ToLower() ?? "desc";

            query = sortBy switch
            {
                "price" => sortOrder == "asc" ? query.OrderBy(p => p.Price) : query.OrderByDescending(p => p.Price),
                "bedrooms" => sortOrder == "asc" ? query.OrderBy(p => p.Bedrooms) : query.OrderByDescending(p => p.Bedrooms),
                "bathrooms" => sortOrder == "asc" ? query.OrderBy(p => p.Bathrooms) : query.OrderByDescending(p => p.Bathrooms),
                "sqft" => sortOrder == "asc" ? query.OrderBy(p => p.Sqft) : query.OrderByDescending(p => p.Sqft),
                "title" => sortOrder == "asc" ? query.OrderBy(p => p.Title) : query.OrderByDescending(p => p.Title),
                _ => sortOrder == "asc" ? query.OrderBy(p => p.CreatedAt) : query.OrderByDescending(p => p.CreatedAt)
            };

            return query;
        }

        private List<PropertyListing> GenerateMockData()
        {
            return new List<PropertyListing>
            {
                new PropertyListing
                {
                    Id = 1,
                    Title = "Modern Downtown Apartment",
                    Price = 450000,
                    Bedrooms = 2,
                    Bathrooms = 2,
                    Sqft = 1200,
                    Description = "This beautiful modern apartment is located in the heart of downtown. It features an open floor plan, high ceilings, and large windows that provide plenty of natural light. The kitchen has been recently renovated with high-end stainless steel appliances and quartz countertops. The master bedroom includes a walk-in closet and an en-suite bathroom with a rainfall shower. The second bedroom is perfect for a home office or guest room. Building amenities include a fitness center, rooftop terrace, and 24-hour concierge service.",
                    Address = "123 Main St, Downtown, City",
                    ImageUrl = "/house-sample.jpg",
                    IsFeatured = true,
                    Features = new List<string> { "Hardwood Floors", "Stainless Steel Appliances", "In-unit Laundry", "Central Air", "Fitness Center", "Rooftop Terrace" },
                    PropertyType = "Apartment",
                    Status = "Available",
                    CreatedAt = DateTime.UtcNow.AddDays(-30),
                    UpdatedAt = DateTime.UtcNow.AddDays(-30),
                    ImageUrls = new List<string>
                    {
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg"
                    },
                },
                new PropertyListing
                {
                    Id = 2,
                    Title = "Spacious Family Home",
                    Price = 750000,
                    Bedrooms = 4,
                    Bathrooms = 3,
                    Sqft = 2800,
                    Description = "Perfect for a growing family, this spacious home offers 4 bedrooms and 3 bathrooms across two levels. The main floor features an open concept living area with a gourmet kitchen, dining room, and family room with a fireplace. The kitchen includes a large island, granite countertops, and high-end appliances. The master suite includes a walk-in closet and a luxurious bathroom with a soaking tub and separate shower. The backyard is fully fenced with a covered patio, perfect for entertaining. Located in a highly rated school district with easy access to parks and shopping.",
                    Address = "456 Oak Ave, Suburbia, City",
                    ImageUrl = "/house-sample.jpg",
                    IsFeatured = true,
                    Features = new List<string> { "Fireplace", "Granite Countertops", "Walk-in Closet", "Fenced Yard", "Attached Garage", "Central Heating" },
                    PropertyType = "House",
                    Status = "Available",
                    CreatedAt = DateTime.UtcNow.AddDays(-25),
                    UpdatedAt = DateTime.UtcNow.AddDays(-25),
                    ImageUrls = new List<string>
                    {
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg"
                    },
                },
                new PropertyListing
                {
                    Id = 3,
                    Title = "Luxury Waterfront Condo",
                    Price = 1200000,
                    Bedrooms = 3,
                    Bathrooms = 2,
                    Sqft = 1800,
                    Description = "Experience luxury living in this stunning waterfront condo with breathtaking views. This 3-bedroom, 2-bathroom unit features floor-to-ceiling windows, a gourmet kitchen with top-of-the-line appliances, and an open floor plan perfect for entertaining. The master suite includes a spa-like bathroom and a private balcony. Building amenities include a pool, hot tub, fitness center, and 24-hour security. Located within walking distance to restaurants, shops, and entertainment venues.",
                    Address = "789 Harbor Blvd, Waterfront, City",
                    ImageUrl = "/house-sample.jpg",
                    IsFeatured = true,
                    Features = new List<string> { "Waterfront View", "Floor-to-ceiling Windows", "Private Balcony", "Pool", "Hot Tub", "24-hour Security" },
                    PropertyType = "Condo",
                    Status = "Available",
                    CreatedAt = DateTime.UtcNow.AddDays(-20),
                    UpdatedAt = DateTime.UtcNow.AddDays(-20),
                    ImageUrls = new List<string>
                    {
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg"
                    },
                },
                new PropertyListing
                {
                    Id = 4,
                    Title = "Charming Craftsman Bungalow",
                    Price = 525000,
                    Bedrooms = 3,
                    Bathrooms = 2,
                    Sqft = 1600,
                    Description = "A beautifully restored craftsman bungalow with original hardwood floors and vintage charm throughout. This home features a cozy living room with built-in bookshelves, a dining room with original wainscoting, and a updated kitchen with modern appliances. The master bedroom has a walk-in closet and updated bathroom. Two additional bedrooms provide flexibility for guests or a home office.",
                    Address = "101 Maple St, Historic District, City",
                    ImageUrl = "/house-sample.jpg",
                    IsFeatured = false,
                    Features = new List<string> { "Original Hardwood", "Vintage Fixtures", "Updated Kitchen", "Front Porch", "Garden", "Built-in Storage" },
                    PropertyType = "House",
                    Status = "Available",
                    CreatedAt = DateTime.UtcNow.AddDays(-15),
                    UpdatedAt = DateTime.UtcNow.AddDays(-15),
                    ImageUrls = new List<string>
                    {
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg"
                    },
                },
                new PropertyListing
                {
                    Id = 5,
                    Title = "Contemporary Townhouse",
                    Price = 625000,
                    Bedrooms = 3,
                    Bathrooms = 2,
                    Sqft = 1900,
                    Description = "Modern townhouse in a gated community with contemporary finishes and an open floor plan. Features include a spacious living area, gourmet kitchen with quartz countertops, and a private patio. The master suite is located on the top floor for privacy and includes a walk-in closet and en-suite bathroom.",
                    Address = "202 Pine Lane, Gated Community, City",
                    ImageUrl = "/house-sample.jpg",
                    IsFeatured = false,
                    Features = new List<string> { "Gated Community", "Modern Finishes", "Open Floor Plan", "Patio", "Two-Car Garage", "Quartz Countertops" },
                    PropertyType = "Townhouse",
                    Status = "Available",
                    CreatedAt = DateTime.UtcNow.AddDays(-10),
                    UpdatedAt = DateTime.UtcNow.AddDays(-10),
                    ImageUrls = new List<string>
                    {
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg"
                    },
                },
                new PropertyListing
                {
                    Id = 6,
                    Title = "Mountain View Retreat",
                    Price = 875000,
                    Bedrooms = 4,
                    Bathrooms = 3,
                    Sqft = 3200,
                    Description = "Stunning mountain views from this spacious retreat featuring vaulted ceilings and a stone fireplace. The open concept design includes a gourmet kitchen with granite countertops and stainless steel appliances. The master suite features a sitting area and luxurious bathroom with a soaking tub. Large deck perfect for entertaining and enjoying the mountain views.",
                    Address = "303 Summit Drive, Mountain View, City",
                    ImageUrl = "/house-sample.jpg",
                    IsFeatured = false,
                    Features = new List<string> { "Mountain Views", "Vaulted Ceilings", "Stone Fireplace", "Deck", "Three-Car Garage", "Granite Countertops" },
                    PropertyType = "House",
                    Status = "Available",
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    UpdatedAt = DateTime.UtcNow.AddDays(-5),
                    ImageUrls = new List<string>
                    {
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg"
                    },
                },
                new PropertyListing
                {
                    Id = 7,
                    Title = "Urban Loft Apartment",
                    Price = 399000,
                    Bedrooms = 1,
                    Bathrooms = 1,
                    Sqft = 950,
                    Description = "Stylish urban loft in the heart of the arts district. Features exposed brick walls, high ceilings, and large windows. The open floor plan includes a modern kitchen with stainless steel appliances and a spacious living area. Perfect for young professionals or artists.",
                    Address = "404 Artist Way, Arts District, City",
                    ImageUrl = "/house-sample.jpg",
                    IsFeatured = false,
                    Features = new List<string> { "Exposed Brick", "High Ceilings", "Modern Kitchen", "Arts District", "Hardwood Floors", "Large Windows" },
                    PropertyType = "Apartment",
                    Status = "Available",
                    CreatedAt = DateTime.UtcNow.AddDays(-8),
                    UpdatedAt = DateTime.UtcNow.AddDays(-8),
                    ImageUrls = new List<string>
                    {
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg"
                    },
                },
                new PropertyListing
                {
                    Id = 8,
                    Title = "Suburban Ranch Home",
                    Price = 550000,
                    Bedrooms = 3,
                    Bathrooms = 2,
                    Sqft = 1750,
                    Description = "Well-maintained ranch home in a quiet suburban neighborhood. Features include a spacious living room with fireplace, updated kitchen with granite countertops, and a large backyard perfect for families. The master bedroom includes an en-suite bathroom and walk-in closet.",
                    Address = "505 Meadow Lane, Pleasant Valley, City",
                    ImageUrl = "/house-sample.jpg",
                    IsFeatured = false,
                    Features = new List<string> { "Ranch Style", "Fireplace", "Updated Kitchen", "Large Backyard", "Quiet Neighborhood", "Two-Car Garage" },
                    PropertyType = "House",
                    Status = "Available",
                    CreatedAt = DateTime.UtcNow.AddDays(-12),
                    UpdatedAt = DateTime.UtcNow.AddDays(-12),
                    ImageUrls = new List<string>
                    {
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg"
                    },
                },
                new PropertyListing
                {
                    Id = 9,
                    Title = "Lakefront Cottage",
                    Price = 675000,
                    Bedrooms = 2,
                    Bathrooms = 1,
                    Sqft = 1100,
                    Description = "Charming lakefront cottage with stunning water views. Features include a cozy living room with stone fireplace, updated kitchen, and a large deck overlooking the lake. Perfect for weekend getaways or year-round living. Private dock included.",
                    Address = "606 Lakeshore Drive, Lake Community, City",
                    ImageUrl = "/house-sample.jpg",
                    IsFeatured = false,
                    Features = new List<string> { "Lakefront", "Water Views", "Stone Fireplace", "Deck", "Private Dock", "Cottage Style" },
                    PropertyType = "House",
                    Status = "Available",
                    CreatedAt = DateTime.UtcNow.AddDays(-18),
                    UpdatedAt = DateTime.UtcNow.AddDays(-18),
                    ImageUrls = new List<string>
                    {
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg"
                    },
                },
                new PropertyListing
                {
                    Id = 10,
                    Title = "Modern Minimalist Home",
                    Price = 825000,
                    Bedrooms = 3,
                    Bathrooms = 2,
                    Sqft = 2200,
                    Description = "Sleek modern home with clean lines and minimalist design. Features include floor-to-ceiling windows, an open concept living area, and a gourmet kitchen with high-end appliances. The master suite includes a spa-like bathroom and walk-in closet.",
                    Address = "707 Design Avenue, Modern District, City",
                    ImageUrl = "/house-sample.jpg",
                    IsFeatured = false,
                    Features = new List<string> { "Modern Design", "Floor-to-ceiling Windows", "Open Concept", "Gourmet Kitchen", "Spa Bathroom", "Minimalist" },
                    PropertyType = "House",
                    Status = "Available",
                    CreatedAt = DateTime.UtcNow.AddDays(-6),
                    UpdatedAt = DateTime.UtcNow.AddDays(-6),
                    ImageUrls = new List<string>
                    {
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg"
                    },
                },
                new PropertyListing
                {
                    Id = 11,
                    Title = "Historic Victorian Home",
                    Price = 950000,
                    Bedrooms = 5,
                    Bathrooms = 3,
                    Sqft = 3500,
                    Description = "Beautifully preserved Victorian home with original architectural details. Features include ornate moldings, hardwood floors, and a grand staircase. The home has been updated with modern amenities while maintaining its historic charm. Large wraparound porch and mature landscaping.",
                    Address = "808 Heritage Blvd, Historic District, City",
                    ImageUrl = "/house-sample.jpg",
                    IsFeatured = false,
                    Features = new List<string> { "Victorian Architecture", "Original Details", "Hardwood Floors", "Wraparound Porch", "Historic District", "Mature Landscaping" },
                    PropertyType = "House",
                    Status = "Available",
                    CreatedAt = DateTime.UtcNow.AddDays(-22),
                    UpdatedAt = DateTime.UtcNow.AddDays(-22),
                    ImageUrls = new List<string>
                    {
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg"
                    },
                },
                new PropertyListing
                {
                    Id = 12,
                    Title = "Golf Course Property",
                    Price = 1100000,
                    Bedrooms = 4,
                    Bathrooms = 3,
                    Sqft = 3800,
                    Description = "Luxury home overlooking the 18th hole of the championship golf course. Features include a grand foyer, formal dining room, gourmet kitchen with butler's pantry, and a master suite with sitting area. Large patio and outdoor kitchen perfect for entertaining.",
                    Address = "909 Fairway Drive, Golf Community, City",
                    ImageUrl = "/house-sample.jpg",
                    IsFeatured = false,
                    Features = new List<string> { "Golf Course Views", "Grand Foyer", "Gourmet Kitchen", "Butler's Pantry", "Outdoor Kitchen", "Luxury Finishes" },
                    PropertyType = "House",
                    Status = "Available",
                    CreatedAt = DateTime.UtcNow.AddDays(-14),
                    UpdatedAt = DateTime.UtcNow.AddDays(-14),
                    ImageUrls = new List<string>
                    {
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg",
                        "/house-sample.jpg"
                    },
                }
            };
        }
    }
}
