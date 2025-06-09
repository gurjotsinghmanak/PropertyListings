using PropertyListingsAPI.Models;

namespace PropertyListingsAPI.Services
{
    public interface IPropertyService
    {
        Task<PaginatedResult<PropertyListing>> GetListingsAsync(FilterCriteria criteria);
        Task<PropertyListing?> GetListingByIdAsync(int id);
        Task<List<PropertyListing>> SearchListingsAsync(FilterCriteria criteria);
        Task<PropertyListing> CreateListingAsync(PropertyListing listing);
        Task<PropertyListing?> UpdateListingAsync(int id, PropertyListing listing);
        Task<bool> DeleteListingAsync(int id);
    }
}
