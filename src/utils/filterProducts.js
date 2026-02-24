export const filterProducts = (products, filters) => {
    let result = [...products];

    if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.tags.some((t) => t.toLowerCase().includes(q))
        );
    }

    if (filters.categories && filters.categories.length > 0) {
        result = result.filter((p) => filters.categories.includes(p.category));
    }

    if (filters.minPrice !== undefined) {
        result = result.filter((p) => p.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
        result = result.filter((p) => p.price <= filters.maxPrice);
    }

    if (filters.minRating) {
        result = result.filter((p) => p.rating >= filters.minRating);
    }

    if (filters.inStock) {
        result = result.filter((p) => p.stock > 0);
    }

    return result;
};

export const sortProducts = (products, sortBy) => {
    const sorted = [...products];
    switch (sortBy) {
        case "price-asc":
            return sorted.sort((a, b) => a.price - b.price);
        case "price-desc":
            return sorted.sort((a, b) => b.price - a.price);
        case "rating":
            return sorted.sort((a, b) => b.rating - a.rating);
        case "newest":
            return sorted.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
        case "popular":
            return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        default:
            return sorted;
    }
};
