using Microsoft.AspNetCore.Mvc;
using PropertyListingsAPI.Models;
using PropertyListingsAPI.Services;

namespace PropertyListingsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ListingsController : ControllerBase
    {
        private readonly IPropertyService _propertyService;
        private readonly ILogger<ListingsController> _logger;

        public ListingsController(IPropertyService propertyService, ILogger<ListingsController> logger)
        {
            _propertyService = propertyService;
            _logger = logger;
        }

        /// <summary>
        /// Get paginated list of property listings
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<PaginatedResult<PropertyListing>>>> GetListings(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] int? minBedrooms = null,
            [FromQuery] int? maxBedrooms = null,
            [FromQuery] int? minBathrooms = null,
            [FromQuery] int? maxBathrooms = null,
            [FromQuery] int? minSqft = null,
            [FromQuery] int? maxSqft = null,
            [FromQuery] string? propertyType = null,
            [FromQuery] string? status = null,
            [FromQuery] bool? isFeatured = null,
            [FromQuery] string? sortBy = "CreatedAt",
            [FromQuery] string? sortOrder = "desc")
        {
            try
            {
                if (page < 1) page = 1;
                if (pageSize < 1 || pageSize > 100) pageSize = 10;

                var criteria = new FilterCriteria
                {
                    Page = page,
                    PageSize = pageSize,
                    MinPrice = minPrice,
                    MaxPrice = maxPrice,
                    MinBedrooms = minBedrooms,
                    MaxBedrooms = maxBedrooms,
                    MinBathrooms = minBathrooms,
                    MaxBathrooms = maxBathrooms,
                    MinSqft = minSqft,
                    MaxSqft = maxSqft,
                    PropertyType = propertyType,
                    Status = status,
                    IsFeatured = isFeatured,
                    SortBy = sortBy,
                    SortOrder = sortOrder
                };

                var result = await _propertyService.GetListingsAsync(criteria);

                return Ok(new ApiResponse<PaginatedResult<PropertyListing>>
                {
                    Success = true,
                    Data = result,
                    Message = "Listings retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving listings");
                return StatusCode(500, new ApiResponse<PaginatedResult<PropertyListing>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving listings",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Get details for a specific listing
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<PropertyListing>>> GetListing(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new ApiResponse<PropertyListing>
                    {
                        Success = false,
                        Message = "Invalid listing ID",
                        Errors = new List<string> { "Listing ID must be greater than 0" }
                    });
                }

                var listing = await _propertyService.GetListingByIdAsync(id);

                if (listing == null)
                {
                    return NotFound(new ApiResponse<PropertyListing>
                    {
                        Success = false,
                        Message = "Listing not found",
                        Errors = new List<string> { $"No listing found with ID {id}" }
                    });
                }

                return Ok(new ApiResponse<PropertyListing>
                {
                    Success = true,
                    Data = listing,
                    Message = "Listing retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving listing with ID {ListingId}", id);
                return StatusCode(500, new ApiResponse<PropertyListing>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the listing",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Search listings with filtering
        /// </summary>
        [HttpGet("search")]
        public async Task<ActionResult<ApiResponse<List<PropertyListing>>>> SearchListings(
            [FromQuery] string? searchTerm = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] int? minBedrooms = null,
            [FromQuery] int? maxBedrooms = null,
            [FromQuery] int? minBathrooms = null,
            [FromQuery] int? maxBathrooms = null,
            [FromQuery] int? minSqft = null,
            [FromQuery] int? maxSqft = null,
            [FromQuery] string? propertyType = null,
            [FromQuery] string? status = null,
            [FromQuery] bool? isFeatured = null,
            [FromQuery] string? sortBy = "CreatedAt",
            [FromQuery] string? sortOrder = "desc")
        {
            try
            {
                var criteria = new FilterCriteria
                {
                    SearchTerm = searchTerm,
                    MinPrice = minPrice,
                    MaxPrice = maxPrice,
                    MinBedrooms = minBedrooms,
                    MaxBedrooms = maxBedrooms,
                    MinBathrooms = minBathrooms,
                    MaxBathrooms = maxBathrooms,
                    MinSqft = minSqft,
                    MaxSqft = maxSqft,
                    PropertyType = propertyType,
                    Status = status,
                    IsFeatured = isFeatured,
                    SortBy = sortBy,
                    SortOrder = sortOrder
                };

                var listings = await _propertyService.SearchListingsAsync(criteria);

                return Ok(new ApiResponse<List<PropertyListing>>
                {
                    Success = true,
                    Data = listings,
                    Message = $"Found {listings.Count} listings matching your criteria"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching listings");
                return StatusCode(500, new ApiResponse<List<PropertyListing>>
                {
                    Success = false,
                    Message = "An error occurred while searching listings",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Create a new listing
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<PropertyListing>>> CreateListing([FromBody] PropertyListing listing)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return BadRequest(new ApiResponse<PropertyListing>
                    {
                        Success = false,
                        Message = "Invalid listing data",
                        Errors = errors
                    });
                }

                var createdListing = await _propertyService.CreateListingAsync(listing);

                return CreatedAtAction(
                    nameof(GetListing),
                    new { id = createdListing.Id },
                    new ApiResponse<PropertyListing>
                    {
                        Success = true,
                        Data = createdListing,
                        Message = "Listing created successfully"
                    });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating listing");
                return StatusCode(500, new ApiResponse<PropertyListing>
                {
                    Success = false,
                    Message = "An error occurred while creating the listing",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Update an existing listing
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<PropertyListing>>> UpdateListing(int id, [FromBody] PropertyListing listing)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new ApiResponse<PropertyListing>
                    {
                        Success = false,
                        Message = "Invalid listing ID",
                        Errors = new List<string> { "Listing ID must be greater than 0" }
                    });
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return BadRequest(new ApiResponse<PropertyListing>
                    {
                        Success = false,
                        Message = "Invalid listing data",
                        Errors = errors
                    });
                }

                var updatedListing = await _propertyService.UpdateListingAsync(id, listing);

                if (updatedListing == null)
                {
                    return NotFound(new ApiResponse<PropertyListing>
                    {
                        Success = false,
                        Message = "Listing not found",
                        Errors = new List<string> { $"No listing found with ID {id}" }
                    });
                }

                return Ok(new ApiResponse<PropertyListing>
                {
                    Success = true,
                    Data = updatedListing,
                    Message = "Listing updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating listing with ID {ListingId}", id);
                return StatusCode(500, new ApiResponse<PropertyListing>
                {
                    Success = false,
                    Message = "An error occurred while updating the listing",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Delete a listing
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> DeleteListing(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "Invalid listing ID",
                        Errors = new List<string> { "Listing ID must be greater than 0" }
                    });
                }

                var deleted = await _propertyService.DeleteListingAsync(id);

                if (!deleted)
                {
                    return NotFound(new ApiResponse
                    {
                        Success = false,
                        Message = "Listing not found",
                        Errors = new List<string> { $"No listing found with ID {id}" }
                    });
                }

                return Ok(new ApiResponse
                {
                    Success = true,
                    Message = "Listing deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting listing with ID {ListingId}", id);
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "An error occurred while deleting the listing",
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}
