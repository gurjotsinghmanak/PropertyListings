namespace PropertyListingsAPI.Models
{
    public class FilterCriteria
    {
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? MinBedrooms { get; set; }
        public int? MaxBedrooms { get; set; }
        public int? MinBathrooms { get; set; }
        public int? MaxBathrooms { get; set; }
        public int? MinSqft { get; set; }
        public int? MaxSqft { get; set; }
        public string? PropertyType { get; set; }
        public string? Status { get; set; }
        public string? SearchTerm { get; set; }
        public bool? IsFeatured { get; set; }
        public string? SortBy { get; set; } = "CreatedAt";
        public string? SortOrder { get; set; } = "desc";
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
